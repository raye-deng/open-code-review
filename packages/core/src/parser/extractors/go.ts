/**
 * Open Code Review V4 — Go Extractor
 *
 * Extracts CodeUnits from Go tree-sitter CSTs.
 * Handles: imports (single, grouped, aliased, dot, blank), functions, methods (with receiver),
 * calls, structs, type declarations, complexity, symbols.
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
  'expression_switch_statement',
  'type_switch_statement',
  'expression_case',
  'type_case',
  'communication_case',
  'select_statement',
  'binary_expression', // for && and ||
]);

/** Node types that increase nesting depth */
const NESTING_NODES = new Set([
  'if_statement',
  'for_statement',
  'expression_switch_statement',
  'type_switch_statement',
  'select_statement',
]);

/** Node types for cognitive complexity */
const COGNITIVE_NODES = new Set([
  'if_statement',
  'for_statement',
  'expression_switch_statement',
  'type_switch_statement',
  'select_statement',
  'expression_case',
  'type_case',
  'communication_case',
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
    if (trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
      count++;
    }
  }
  return count;
}

// ─── Helper: Check if name is exported (capitalized) ───────────────

function isExportedName(name: string): boolean {
  if (name.length === 0) return false;
  const first = name.charAt(0);
  return first === first.toUpperCase() && first !== first.toLowerCase();
}

// ─── Helper: Extract string literal content ────────────────────────

function extractStringContent(node: Parser.SyntaxNode): string {
  // Go string literals: "fmt" or `fmt`
  const text = node.text;
  if (text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1);
  }
  if (text.startsWith('`') && text.endsWith('`')) {
    return text.slice(1, -1);
  }
  return text;
}

// ─── Helper: Extract imports from import_declaration ───────────────

function extractImports(node: Parser.SyntaxNode): ImportInfo[] {
  const imports: ImportInfo[] = [];

  if (node.type !== 'import_declaration') return imports;

  // Can be single: import "fmt"
  // Or grouped: import ( "fmt" ; "os" )
  const specList = node.children.find(c => c.type === 'import_spec_list');

  if (specList) {
    // Grouped imports
    for (const spec of specList.children) {
      if (spec.type === 'import_spec') {
        const info = extractImportSpec(spec);
        if (info) imports.push(info);
      }
    }
  } else {
    // Single import
    const spec = node.children.find(c => c.type === 'import_spec');
    if (spec) {
      const info = extractImportSpec(spec);
      if (info) imports.push(info);
    } else {
      // Fallback: look for a string literal directly
      const strNode = node.children.find(
        c => c.type === 'interpreted_string_literal' || c.type === 'raw_string_literal',
      );
      if (strNode) {
        const modulePath = extractStringContent(strNode);
        imports.push({
          module: modulePath,
          symbols: [],
          line: node.startPosition.row,
          isRelative: modulePath.startsWith('.'),
          raw: node.text,
        });
      }
    }
  }

  return imports;
}

function extractImportSpec(spec: Parser.SyntaxNode): ImportInfo | null {
  const strNode = spec.children.find(
    c => c.type === 'interpreted_string_literal' || c.type === 'raw_string_literal',
  );
  if (!strNode) return null;

  const modulePath = extractStringContent(strNode);
  const symbols: string[] = [];

  // Check for alias, dot import, or blank import
  const aliasNode = spec.children.find(c => c.type === 'package_identifier');
  const dotNode = spec.children.find(c => c.type === 'dot');
  const blankNode = spec.children.find(c => c.type === 'blank_identifier');

  if (dotNode) {
    symbols.push('.');
  } else if (blankNode) {
    symbols.push('_');
  } else if (aliasNode) {
    symbols.push(aliasNode.text);
  }

  return {
    module: modulePath,
    symbols,
    line: spec.startPosition.row,
    isRelative: modulePath.startsWith('.'),
    raw: spec.text,
  };
}

// ─── Helper: Extract calls from a subtree ──────────────────────────

function extractCalls(node: Parser.SyntaxNode): CallInfo[] {
  const calls: CallInfo[] = [];

  function walk(n: Parser.SyntaxNode): void {
    if (n.type === 'call_expression') {
      const funcNode = n.children[0];
      const argListNode = n.children.find(c => c.type === 'argument_list');

      if (funcNode) {
        const callee = funcNode.text;
        let object: string | undefined;
        let method: string;

        if (funcNode.type === 'selector_expression') {
          // e.g., fmt.Println
          const objectNode = funcNode.children[0];
          const fieldNode = funcNode.children.find(c => c.type === 'field_identifier');
          object = objectNode?.text;
          method = fieldNode?.text ?? callee;
        } else if (funcNode.type === 'identifier') {
          method = funcNode.text;
        } else {
          // Could be a func literal call or other complex expression
          method = callee;
        }

        let argCount = 0;
        if (argListNode) {
          for (const arg of argListNode.children) {
            if (arg.type !== ',' && arg.type !== '(' && arg.type !== ')') {
              argCount++;
            }
          }
        }

        calls.push({
          callee,
          object,
          method,
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
        const op = n.children.find(c => c.text === '&&' || c.text === '||');
        if (op) {
          cyclomatic++;
        }
      } else {
        cyclomatic++;
      }
    }

    // Cognitive complexity
    if (COGNITIVE_NODES.has(n.type)) {
      if (
        n.type === 'expression_case' ||
        n.type === 'type_case' ||
        n.type === 'communication_case'
      ) {
        cognitive += 1; // cases don't get nesting increment
      } else {
        cognitive += 1 + nestingDepth;
      }
    }

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

// ─── Helper: Count parameters (Go) ────────────────────────────────

function countParameters(paramsNode: Parser.SyntaxNode): number {
  let count = 0;
  for (const child of paramsNode.children) {
    if (child.type === 'parameter_declaration') {
      // A parameter_declaration can declare multiple params: x, y int
      const identifiers = child.children.filter(c => c.type === 'identifier');
      count += Math.max(identifiers.length, 1);
    } else if (child.type === 'variadic_parameter_declaration') {
      count++;
    }
  }
  return count;
}

// ─── GoExtractor ───────────────────────────────────────────────────

export class GoExtractor implements LanguageExtractor {
  readonly language: SupportedLanguage = 'go';

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
      language: 'go',
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

    // 2. Extract functions and methods
    this.extractFunctions(root, filePath, fileUnit, units);

    // 3. Extract type declarations (structs, interfaces) as class-like units
    this.extractTypeDeclarations(root, filePath, fileUnit, units);

    return units;
  }

  // ─── File-level imports ──────────────────────────────────────────

  private extractFileImports(root: Parser.SyntaxNode): ImportInfo[] {
    const imports: ImportInfo[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;
      if (child.type === 'import_declaration') {
        imports.push(...extractImports(child));
      }
    }

    return imports;
  }

  // ─── File-level definitions ──────────────────────────────────────

  private extractFileDefinitions(root: Parser.SyntaxNode): SymbolDef[] {
    const defs: SymbolDef[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      if (child.type === 'function_declaration') {
        const nameNode = child.children.find(c => c.type === 'identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'function',
            line: child.startPosition.row,
            exported: isExportedName(nameNode.text),
          });
        }
      } else if (child.type === 'method_declaration') {
        const nameNode = child.children.find(c => c.type === 'field_identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'method',
            line: child.startPosition.row,
            exported: isExportedName(nameNode.text),
          });
        }
      } else if (child.type === 'type_declaration') {
        for (const spec of child.children) {
          if (spec.type === 'type_spec') {
            const nameNode = spec.children.find(c => c.type === 'type_identifier');
            if (nameNode) {
              defs.push({
                name: nameNode.text,
                kind: 'type',
                line: spec.startPosition.row,
                exported: isExportedName(nameNode.text),
              });
            }
          }
        }
      } else if (child.type === 'var_declaration') {
        for (const spec of child.children) {
          if (spec.type === 'var_spec') {
            for (const id of spec.children) {
              if (id.type === 'identifier') {
                defs.push({
                  name: id.text,
                  kind: 'variable',
                  line: spec.startPosition.row,
                  exported: isExportedName(id.text),
                });
              }
            }
          }
        }
      } else if (child.type === 'const_declaration') {
        for (const spec of child.children) {
          if (spec.type === 'const_spec') {
            for (const id of spec.children) {
              if (id.type === 'identifier') {
                defs.push({
                  name: id.text,
                  kind: 'variable',
                  line: spec.startPosition.row,
                  exported: isExportedName(id.text),
                });
              }
            }
          }
        }
      }
    }

    return defs;
  }

  // ─── Extract functions and methods ───────────────────────────────

  private extractFunctions(
    root: Parser.SyntaxNode,
    filePath: string,
    fileUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      if (child.type === 'function_declaration') {
        const nameNode = child.children.find(c => c.type === 'identifier');
        if (!nameNode) continue;

        const funcName = nameNode.text;
        const funcId = `func:${filePath}:${funcName}`;
        const funcSource = child.text;

        // Get parameters (first parameter_list is params, second is return types)
        const paramLists = child.children.filter(
          c => c.type === 'parameter_list',
        );
        const paramsNode = paramLists[0];
        const paramCount = paramsNode ? countParameters(paramsNode) : 0;

        const complexity = computeComplexity(child, funcSource);
        complexity.parameterCount = paramCount;

        const calls = extractCalls(child);

        const funcDefs: SymbolDef[] = [
          {
            name: funcName,
            kind: 'function',
            line: child.startPosition.row,
            exported: isExportedName(funcName),
          },
        ];

        // Extract parameter definitions
        if (paramsNode) {
          for (const param of paramsNode.children) {
            if (param.type === 'parameter_declaration') {
              const ids = param.children.filter(c => c.type === 'identifier');
              for (const id of ids) {
                funcDefs.push({
                  name: id.text,
                  kind: 'parameter',
                  line: param.startPosition.row,
                  exported: false,
                });
              }
            }
          }
        }

        const funcUnit = createCodeUnit({
          id: funcId,
          file: filePath,
          language: 'go',
          kind: 'function',
          location: getLocation(child),
          source: funcSource,
          calls,
          complexity,
          definitions: funcDefs,
          parentId: fileUnit.id,
        });

        units.push(funcUnit);
        fileUnit.childIds.push(funcId);
      } else if (child.type === 'method_declaration') {
        // Go methods have a receiver parameter list
        const nameNode = child.children.find(c => c.type === 'field_identifier');
        if (!nameNode) continue;

        const methodName = nameNode.text;

        // Extract receiver type
        const paramLists = child.children.filter(
          c => c.type === 'parameter_list',
        );
        const receiverList = paramLists[0]; // First param list is receiver
        const paramsNode = paramLists[1]; // Second is actual params

        let receiverType = '';
        if (receiverList) {
          const paramDecl = receiverList.children.find(
            c => c.type === 'parameter_declaration',
          );
          if (paramDecl) {
            const typeNode =
              paramDecl.children.find(c => c.type === 'type_identifier') ??
              paramDecl.children.find(c => c.type === 'pointer_type');
            if (typeNode) {
              if (typeNode.type === 'pointer_type') {
                const inner = typeNode.children.find(
                  c => c.type === 'type_identifier',
                );
                receiverType = inner?.text ?? typeNode.text;
              } else {
                receiverType = typeNode.text;
              }
            }
          }
        }

        const paramCount = paramsNode ? countParameters(paramsNode) : 0;
        const methodId = `method:${filePath}:${receiverType}.${methodName}`;
        const methodSource = child.text;

        const complexity = computeComplexity(child, methodSource);
        complexity.parameterCount = paramCount;

        const calls = extractCalls(child);

        const methodDefs: SymbolDef[] = [
          {
            name: methodName,
            kind: 'method',
            line: child.startPosition.row,
            exported: isExportedName(methodName),
          },
        ];

        const methodUnit = createCodeUnit({
          id: methodId,
          file: filePath,
          language: 'go',
          kind: 'method',
          location: getLocation(child),
          source: methodSource,
          calls,
          complexity,
          definitions: methodDefs,
          parentId: fileUnit.id,
        });

        units.push(methodUnit);
        fileUnit.childIds.push(methodId);
      }
    }
  }

  // ─── Extract type declarations (struct, interface) ───────────────

  private extractTypeDeclarations(
    root: Parser.SyntaxNode,
    filePath: string,
    fileUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      if (child.type !== 'type_declaration') continue;

      for (const spec of child.children) {
        if (spec.type !== 'type_spec') continue;

        const nameNode = spec.children.find(c => c.type === 'type_identifier');
        if (!nameNode) continue;

        const typeName = nameNode.text;
        const typeId = `class:${filePath}:${typeName}`;
        const typeSource = child.text;
        const typeCalls = extractCalls(child);
        const typeComplexity = computeComplexity(child, typeSource);

        const typeDefs: SymbolDef[] = [
          {
            name: typeName,
            kind: 'type',
            line: spec.startPosition.row,
            exported: isExportedName(typeName),
          },
        ];

        // Extract struct field definitions
        const structType = spec.children.find(c => c.type === 'struct_type');
        if (structType) {
          const fieldList = structType.children.find(
            c => c.type === 'field_declaration_list',
          );
          if (fieldList) {
            for (const field of fieldList.children) {
              if (field.type === 'field_declaration') {
                const fieldName = field.children.find(
                  c => c.type === 'field_identifier',
                );
                if (fieldName) {
                  typeDefs.push({
                    name: fieldName.text,
                    kind: 'variable',
                    line: field.startPosition.row,
                    exported: isExportedName(fieldName.text),
                  });
                }
              }
            }
          }
        }

        const typeUnit = createCodeUnit({
          id: typeId,
          file: filePath,
          language: 'go',
          kind: 'class',
          location: getLocation(child),
          source: typeSource,
          calls: typeCalls,
          complexity: typeComplexity,
          definitions: typeDefs,
          parentId: fileUnit.id,
        });

        units.push(typeUnit);
        fileUnit.childIds.push(typeId);
      }
    }
  }
}
