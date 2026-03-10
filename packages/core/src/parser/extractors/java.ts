/**
 * Open Code Review V4 — Java Extractor
 *
 * Extracts CodeUnits from Java tree-sitter CSTs.
 * Handles: imports, classes, interfaces, enums, methods, constructors,
 * calls (method invocation, object creation), complexity, symbols.
 *
 * @since 0.4.0
 */

import type Parser from 'web-tree-sitter';
import type { LanguageExtractor } from '../extractor.js';
import type {
  CodeUnit,
  SupportedLanguage,
  ImportInfo,
  CallInfo,
  ComplexityMetrics,
  SymbolDef,
  SourceLocation,
} from '../../ir/types.js';
import { createCodeUnit, emptyComplexity } from '../../ir/types.js';

// ─── Tree-sitter node type constants ───────────────────────────────

/** Node types that represent branching (for cyclomatic complexity) */
const BRANCHING_NODES = new Set([
  'if_statement',
  'for_statement',
  'enhanced_for_statement',
  'while_statement',
  'do_statement',
  'switch_expression',
  'catch_clause',
  'ternary_expression',
  'binary_expression',  // for && and ||
]);

/** Node types that increase nesting depth */
const NESTING_NODES = new Set([
  'if_statement',
  'for_statement',
  'enhanced_for_statement',
  'while_statement',
  'do_statement',
  'switch_expression',
  'try_statement',
  'catch_clause',
]);

/** Node types for cognitive complexity */
const COGNITIVE_NODES = new Set([
  'if_statement',
  'for_statement',
  'enhanced_for_statement',
  'while_statement',
  'do_statement',
  'switch_expression',
  'catch_clause',
  'ternary_expression',
]);

// ─── Helper: Get node location ─────────────────────────────────────

function getLocation(node: Parser.SyntaxNode): SourceLocation {
  return {
    startLine: node.startPosition.row,
    startColumn: node.startPosition.column,
    endLine: node.endPosition.row,
    endColumn: node.endPosition.column,
  };
}

// ─── Helper: Count lines of code ───────────────────────────────────

function countLinesOfCode(source: string): number {
  const lines = source.split('\n');
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.length > 0 &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*')
    ) {
      count++;
    }
  }
  return count;
}

// ─── Helper: Check if node has a modifier ──────────────────────────

function hasModifier(node: Parser.SyntaxNode, modifier: string): boolean {
  const modifiers = node.children.find(c => c.type === 'modifiers');
  if (!modifiers) return false;
  return modifiers.children.some(c => c.text === modifier);
}

// ─── Helper: Check if public (exported equivalent) ─────────────────

function isPublic(node: Parser.SyntaxNode): boolean {
  return hasModifier(node, 'public');
}

// ─── Helper: Extract import from an import_declaration node ────────

function extractImport(node: Parser.SyntaxNode): ImportInfo | null {
  if (node.type !== 'import_declaration') return null;

  const isStatic = node.children.some(c => c.type === 'static');
  const hasWildcard = node.children.some(c => c.type === 'asterisk');

  // Collect all scoped_identifier parts to reconstruct the full path
  const scopedIdNode =
    node.children.find(c => c.type === 'scoped_identifier') ??
    node.children.find(c => c.type === 'identifier');
  if (!scopedIdNode) return null;

  const fullPath = scopedIdNode.text;

  let moduleName: string;
  let symbols: string[];

  if (hasWildcard) {
    // import java.util.* → module = "java.util", symbols = ["*"]
    moduleName = fullPath;
    symbols = ['*'];
  } else {
    // import java.util.List → module = "java.util", symbol = "List"
    const lastDot = fullPath.lastIndexOf('.');
    if (lastDot >= 0) {
      moduleName = fullPath.substring(0, lastDot);
      symbols = [fullPath.substring(lastDot + 1)];
    } else {
      moduleName = fullPath;
      symbols = [];
    }
  }

  return {
    module: moduleName,
    symbols,
    line: node.startPosition.row,
    isRelative: false,
    raw: node.text,
  };
}

// ─── Helper: Extract calls from a subtree ──────────────────────────

function extractCalls(node: Parser.SyntaxNode): CallInfo[] {
  const calls: CallInfo[] = [];

  function walk(n: Parser.SyntaxNode): void {
    if (n.type === 'method_invocation') {
      // method_invocation children: [object, ".", name, argument_list]
      // or [name, argument_list] for unqualified calls
      const children = n.children.filter(
        c => c.type !== '.' && c.type !== '(' && c.type !== ')' && c.type !== ','
      );

      const argListNode = n.children.find(c => c.type === 'argument_list');
      let argCount = 0;
      if (argListNode) {
        for (const arg of argListNode.children) {
          if (arg.type !== ',' && arg.type !== '(' && arg.type !== ')') {
            argCount++;
          }
        }
      }

      // The last identifier before argument_list is the method name
      // Everything before that (if any) is the object/receiver
      const identifiers = children.filter(
        c => c.type === 'identifier' || c.type === 'field_access' || c.type === 'this' || c.type === 'super'
      );

      let object: string | undefined;
      let method: string;
      let callee: string;

      if (identifiers.length >= 2) {
        // object.method(args)
        object = identifiers.slice(0, -1).map(i => i.text).join('.');
        method = identifiers[identifiers.length - 1].text;
        callee = `${object}.${method}`;
      } else if (identifiers.length === 1) {
        method = identifiers[0].text;
        callee = method;
      } else {
        return; // Cannot parse
      }

      calls.push({
        callee,
        object,
        method,
        line: n.startPosition.row,
        argCount,
      });
    } else if (n.type === 'object_creation_expression') {
      // new ClassName(args) → callee = "ClassName", method = "ClassName"
      const typeNode =
        n.children.find(c => c.type === 'type_identifier') ??
        n.children.find(c => c.type === 'generic_type') ??
        n.children.find(c => c.type === 'scoped_type_identifier');

      if (typeNode) {
        let typeName: string;
        if (typeNode.type === 'generic_type') {
          // e.g., ArrayList<String> → extract ArrayList
          const baseType = typeNode.children.find(c => c.type === 'type_identifier');
          typeName = baseType?.text ?? typeNode.text;
        } else {
          typeName = typeNode.text;
        }

        const argListNode = n.children.find(c => c.type === 'argument_list');
        let argCount = 0;
        if (argListNode) {
          for (const arg of argListNode.children) {
            if (arg.type !== ',' && arg.type !== '(' && arg.type !== ')') {
              argCount++;
            }
          }
        }

        calls.push({
          callee: `new ${typeName}`,
          method: typeName,
          line: n.startPosition.row,
          argCount,
        });
      }
    }

    for (let i = 0; i < n.childCount; i++) {
      walk(n.child(i)!);
    }
  }

  walk(node);
  return calls;
}

// ─── Helper: Compute complexity ────────────────────────────────────

function computeComplexity(
  node: Parser.SyntaxNode,
  source: string,
): ComplexityMetrics {
  let cyclomatic = 1; // base complexity
  let cognitive = 0;
  let maxDepth = 0;

  function walk(n: Parser.SyntaxNode, nestingDepth: number): void {
    // Cyclomatic complexity
    if (BRANCHING_NODES.has(n.type)) {
      if (n.type === 'binary_expression') {
        // Only count && and ||
        const op = n.children.find(
          c => c.text === '&&' || c.text === '||'
        );
        if (op) {
          cyclomatic++;
        }
      } else {
        cyclomatic++;
      }
    }

    // Cognitive complexity
    if (COGNITIVE_NODES.has(n.type)) {
      cognitive += 1 + nestingDepth;
    }

    // Also count && / || for cognitive complexity
    if (n.type === 'binary_expression') {
      const op = n.children.find(c => c.text === '&&' || c.text === '||');
      if (op) {
        cognitive += 1;
      }
    }

    // Nesting
    let newDepth = nestingDepth;
    if (NESTING_NODES.has(n.type)) {
      newDepth = nestingDepth + 1;
      if (newDepth > maxDepth) maxDepth = newDepth;
    }

    for (let i = 0; i < n.childCount; i++) {
      walk(n.child(i)!, newDepth);
    }
  }

  walk(node, 0);

  return {
    cyclomaticComplexity: cyclomatic,
    cognitiveComplexity: cognitive,
    maxNestingDepth: maxDepth,
    linesOfCode: countLinesOfCode(source),
  };
}

// ─── Helper: Count parameters ──────────────────────────────────────

function countParameters(paramsNode: Parser.SyntaxNode): number {
  let count = 0;
  for (const child of paramsNode.children) {
    if (child.type === 'formal_parameter' || child.type === 'spread_parameter') {
      count++;
    }
  }
  return count;
}

// ─── JavaExtractor ─────────────────────────────────────────────────

export class JavaExtractor implements LanguageExtractor {
  readonly language: SupportedLanguage = 'java';

  extract(
    tree: Parser.Tree,
    filePath: string,
    source: string,
  ): CodeUnit[] {
    const units: CodeUnit[] = [];
    const root = tree.rootNode;

    // 1. File-level CodeUnit
    const fileImports = this.extractFileImports(root);
    const fileCalls = extractCalls(root);
    const fileDefs = this.extractFileDefinitions(root);
    const fileComplexity = computeComplexity(root, source);

    const fileUnit = createCodeUnit({
      id: `file:${filePath}`,
      file: filePath,
      language: 'java',
      kind: 'file',
      location: getLocation(root),
      source,
      imports: fileImports,
      calls: fileCalls,
      complexity: fileComplexity,
      definitions: fileDefs,
      references: [],
      childIds: [],
    });
    units.push(fileUnit);

    // 2. Extract classes, interfaces, enums (top-level)
    this.extractClassLikeDeclarations(root, filePath, fileUnit, units);

    return units;
  }

  // ─── File-level imports ──────────────────────────────────────────

  private extractFileImports(root: Parser.SyntaxNode): ImportInfo[] {
    const imports: ImportInfo[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;
      if (child.type === 'import_declaration') {
        const info = extractImport(child);
        if (info) imports.push(info);
      }
    }

    return imports;
  }

  // ─── File-level definitions ──────────────────────────────────────

  private extractFileDefinitions(root: Parser.SyntaxNode): SymbolDef[] {
    const defs: SymbolDef[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      if (child.type === 'class_declaration') {
        const nameNode = child.children.find(c => c.type === 'identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'class',
            line: child.startPosition.row,
            exported: isPublic(child),
          });
        }
      } else if (child.type === 'interface_declaration') {
        const nameNode = child.children.find(c => c.type === 'identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'interface',
            line: child.startPosition.row,
            exported: isPublic(child),
          });
        }
      } else if (child.type === 'enum_declaration') {
        const nameNode = child.children.find(c => c.type === 'identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'enum',
            line: child.startPosition.row,
            exported: isPublic(child),
          });
        }
      }
    }

    return defs;
  }

  // ─── Extract classes, interfaces, enums ──────────────────────────

  private extractClassLikeDeclarations(
    parent: Parser.SyntaxNode,
    filePath: string,
    parentUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < parent.childCount; i++) {
      const child = parent.child(i)!;

      if (child.type === 'class_declaration') {
        this.extractClass(child, filePath, parentUnit, units);
      } else if (child.type === 'interface_declaration') {
        this.extractInterface(child, filePath, parentUnit, units);
      } else if (child.type === 'enum_declaration') {
        this.extractEnum(child, filePath, parentUnit, units);
      }
    }
  }

  // ─── Extract a single class ──────────────────────────────────────

  private extractClass(
    classNode: Parser.SyntaxNode,
    filePath: string,
    parentUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    const nameNode = classNode.children.find(c => c.type === 'identifier');
    if (!nameNode) return;

    const className = nameNode.text;
    const classId = `class:${filePath}:${className}`;
    const classSource = classNode.text;
    const classCalls = extractCalls(classNode);
    const classComplexity = computeComplexity(classNode, classSource);
    const exported = isPublic(classNode);

    const classDefs: SymbolDef[] = [
      {
        name: className,
        kind: 'class',
        line: classNode.startPosition.row,
        exported,
      },
    ];

    // Extract field definitions from class body
    const classBody = classNode.children.find(c => c.type === 'class_body');
    if (classBody) {
      for (const member of classBody.children) {
        if (member.type === 'field_declaration') {
          for (const child of member.children) {
            if (child.type === 'variable_declarator') {
              const varName = child.children.find(c => c.type === 'identifier');
              if (varName) {
                classDefs.push({
                  name: varName.text,
                  kind: 'variable',
                  line: member.startPosition.row,
                  exported: isPublic(member),
                });
              }
            }
          }
        }
      }
    }

    const classUnit = createCodeUnit({
      id: classId,
      file: filePath,
      language: 'java',
      kind: 'class',
      location: getLocation(classNode),
      source: classSource,
      calls: classCalls,
      complexity: classComplexity,
      definitions: classDefs,
      parentId: parentUnit.id,
    });

    units.push(classUnit);
    parentUnit.childIds.push(classId);

    // Extract methods and constructors from class body
    if (classBody) {
      this.extractMethods(classBody, className, filePath, classUnit, units);

      // Extract nested classes/interfaces/enums
      this.extractClassLikeDeclarations(classBody, filePath, classUnit, units);
    }
  }

  // ─── Extract an interface ────────────────────────────────────────

  private extractInterface(
    ifaceNode: Parser.SyntaxNode,
    filePath: string,
    parentUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    const nameNode = ifaceNode.children.find(c => c.type === 'identifier');
    if (!nameNode) return;

    const ifaceName = nameNode.text;
    const ifaceId = `class:${filePath}:${ifaceName}`;
    const ifaceSource = ifaceNode.text;
    const ifaceCalls = extractCalls(ifaceNode);
    const ifaceComplexity = computeComplexity(ifaceNode, ifaceSource);
    const exported = isPublic(ifaceNode);

    const ifaceDefs: SymbolDef[] = [
      {
        name: ifaceName,
        kind: 'interface',
        line: ifaceNode.startPosition.row,
        exported,
      },
    ];

    const ifaceUnit = createCodeUnit({
      id: ifaceId,
      file: filePath,
      language: 'java',
      kind: 'class',
      location: getLocation(ifaceNode),
      source: ifaceSource,
      calls: ifaceCalls,
      complexity: ifaceComplexity,
      definitions: ifaceDefs,
      parentId: parentUnit.id,
    });

    units.push(ifaceUnit);
    parentUnit.childIds.push(ifaceId);

    // Extract methods from interface body
    const ifaceBody = ifaceNode.children.find(c => c.type === 'interface_body');
    if (ifaceBody) {
      this.extractMethods(ifaceBody, ifaceName, filePath, ifaceUnit, units);
    }
  }

  // ─── Extract an enum ─────────────────────────────────────────────

  private extractEnum(
    enumNode: Parser.SyntaxNode,
    filePath: string,
    parentUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    const nameNode = enumNode.children.find(c => c.type === 'identifier');
    if (!nameNode) return;

    const enumName = nameNode.text;
    const enumId = `class:${filePath}:${enumName}`;
    const enumSource = enumNode.text;
    const enumCalls = extractCalls(enumNode);
    const enumComplexity = computeComplexity(enumNode, enumSource);
    const exported = isPublic(enumNode);

    const enumDefs: SymbolDef[] = [
      {
        name: enumName,
        kind: 'enum',
        line: enumNode.startPosition.row,
        exported,
      },
    ];

    // Extract enum constants as definitions
    const enumBody = enumNode.children.find(c => c.type === 'enum_body');
    if (enumBody) {
      for (const child of enumBody.children) {
        if (child.type === 'enum_constant') {
          const constName = child.children.find(c => c.type === 'identifier');
          if (constName) {
            enumDefs.push({
              name: constName.text,
              kind: 'variable',
              line: child.startPosition.row,
              exported: true, // enum constants are always public
            });
          }
        }
      }
    }

    const enumUnit = createCodeUnit({
      id: enumId,
      file: filePath,
      language: 'java',
      kind: 'class',
      location: getLocation(enumNode),
      source: enumSource,
      calls: enumCalls,
      complexity: enumComplexity,
      definitions: enumDefs,
      parentId: parentUnit.id,
    });

    units.push(enumUnit);
    parentUnit.childIds.push(enumId);

    // Extract methods from enum body (enums can have methods)
    if (enumBody) {
      this.extractMethods(enumBody, enumName, filePath, enumUnit, units);
    }
  }

  // ─── Extract methods and constructors from a class/interface body ─

  private extractMethods(
    body: Parser.SyntaxNode,
    className: string,
    filePath: string,
    classUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < body.childCount; i++) {
      const member = body.child(i)!;

      if (member.type === 'method_declaration') {
        const nameNode = member.children.find(c => c.type === 'identifier');
        if (!nameNode) continue;

        const methodName = nameNode.text;
        const methodId = `method:${filePath}:${className}.${methodName}`;
        const methodSource = member.text;

        const paramsNode = member.children.find(
          c => c.type === 'formal_parameters',
        );
        const paramCount = paramsNode ? countParameters(paramsNode) : 0;

        const complexity = computeComplexity(member, methodSource);
        complexity.parameterCount = paramCount;

        const calls = extractCalls(member);
        const exported = isPublic(member);

        const methodDefs: SymbolDef[] = [
          {
            name: methodName,
            kind: 'method',
            line: member.startPosition.row,
            exported,
          },
        ];

        // Extract parameter definitions
        if (paramsNode) {
          for (const param of paramsNode.children) {
            if (param.type === 'formal_parameter' || param.type === 'spread_parameter') {
              const paramNameNode = param.children.find(c => c.type === 'identifier');
              if (paramNameNode) {
                methodDefs.push({
                  name: paramNameNode.text,
                  kind: 'parameter',
                  line: param.startPosition.row,
                  exported: false,
                });
              }
            }
          }
        }

        const methodUnit = createCodeUnit({
          id: methodId,
          file: filePath,
          language: 'java',
          kind: 'method',
          location: getLocation(member),
          source: methodSource,
          calls,
          complexity,
          definitions: methodDefs,
          parentId: classUnit.id,
        });

        units.push(methodUnit);
        classUnit.childIds.push(methodId);
      } else if (member.type === 'constructor_declaration') {
        const nameNode = member.children.find(c => c.type === 'identifier');
        if (!nameNode) continue;

        const ctorName = nameNode.text;
        const ctorId = `method:${filePath}:${className}.${ctorName}`;
        const ctorSource = member.text;

        const paramsNode = member.children.find(
          c => c.type === 'formal_parameters',
        );
        const paramCount = paramsNode ? countParameters(paramsNode) : 0;

        const complexity = computeComplexity(member, ctorSource);
        complexity.parameterCount = paramCount;

        const calls = extractCalls(member);
        const exported = isPublic(member);

        const ctorDefs: SymbolDef[] = [
          {
            name: ctorName,
            kind: 'method',
            line: member.startPosition.row,
            exported,
          },
        ];

        const ctorUnit = createCodeUnit({
          id: ctorId,
          file: filePath,
          language: 'java',
          kind: 'method',
          location: getLocation(member),
          source: ctorSource,
          calls,
          complexity,
          definitions: ctorDefs,
          parentId: classUnit.id,
        });

        units.push(ctorUnit);
        classUnit.childIds.push(ctorId);
      }
    }
  }
}
