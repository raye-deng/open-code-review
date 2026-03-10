/**
 * Open Code Review V4 — TypeScript/JavaScript Extractor
 *
 * Extracts CodeUnits from TypeScript and JavaScript tree-sitter CSTs.
 * Handles: imports, functions, classes, methods, calls, complexity, symbols.
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
  SymbolRef,
  SourceLocation,
} from '../../ir/types.js';
import { createCodeUnit, emptyComplexity } from '../../ir/types.js';

// ─── Tree-sitter node type constants ───────────────────────────────

/** Node types that represent branching (for cyclomatic complexity) */
const BRANCHING_NODES = new Set([
  'if_statement',
  'else_clause',
  'for_statement',
  'for_in_statement',
  'while_statement',
  'do_statement',
  'switch_case',
  'catch_clause',
  'ternary_expression',
  'binary_expression',  // for && and ||
]);

/** Node types that increase cognitive complexity nesting */
const NESTING_NODES = new Set([
  'if_statement',
  'for_statement',
  'for_in_statement',
  'while_statement',
  'do_statement',
  'switch_statement',
  'try_statement',
  'catch_clause',
]);

/** Node types that increase cognitive complexity (structural) */
const COGNITIVE_NODES = new Set([
  'if_statement',
  'else_clause',
  'for_statement',
  'for_in_statement',
  'while_statement',
  'do_statement',
  'switch_case',
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
    if (trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
      count++;
    }
  }
  return count;
}

// ─── Helper: Extract import from an import_statement node ──────────

function extractImport(node: Parser.SyntaxNode): ImportInfo | null {
  if (node.type !== 'import_statement') return null;

  const sourceNode = node.childForFieldName('source') ?? node.children.find(c => c.type === 'string');
  if (!sourceNode) return null;

  const moduleName = sourceNode.text.replace(/['"]/g, '');
  const symbols: string[] = [];

  const importClause = node.children.find(c => c.type === 'import_clause');
  if (importClause) {
    for (const child of importClause.children) {
      if (child.type === 'named_imports') {
        for (const spec of child.children) {
          if (spec.type === 'import_specifier') {
            const nameNode = spec.childForFieldName('name') ?? spec.children.find(c => c.type === 'identifier');
            if (nameNode) symbols.push(nameNode.text);
          }
        }
      } else if (child.type === 'namespace_import') {
        // import * as foo
        const asName = child.children.find(c => c.type === 'identifier');
        if (asName) symbols.push(`* as ${asName.text}`);
      } else if (child.type === 'identifier') {
        // default import
        symbols.push(child.text);
      }
    }
  }

  return {
    module: moduleName,
    symbols,
    line: node.startPosition.row,
    isRelative: moduleName.startsWith('.') || moduleName.startsWith('/'),
    raw: node.text,
  };
}

// ─── Helper: Extract require() call as import ──────────────────────

function extractRequireImport(node: Parser.SyntaxNode): ImportInfo | null {
  // Pattern: const x = require('module')
  if (node.type !== 'lexical_declaration' && node.type !== 'variable_declaration') return null;

  for (const declarator of node.children) {
    if (declarator.type !== 'variable_declarator') continue;
    const init = declarator.childForFieldName('value') ?? declarator.children.find(c => c.type === 'call_expression');
    if (!init || init.type !== 'call_expression') continue;

    const funcNode = init.childForFieldName('function') ?? init.children[0];
    if (!funcNode || funcNode.text !== 'require') continue;

    const argsNode = init.childForFieldName('arguments') ?? init.children.find(c => c.type === 'arguments');
    if (!argsNode) continue;

    const stringArg = argsNode.children.find(c => c.type === 'string');
    if (!stringArg) continue;

    const moduleName = stringArg.text.replace(/['"]/g, '');
    const nameNode = declarator.childForFieldName('name') ?? declarator.children.find(c => c.type === 'identifier');
    const symbols = nameNode ? [nameNode.text] : [];

    return {
      module: moduleName,
      symbols,
      line: node.startPosition.row,
      isRelative: moduleName.startsWith('.') || moduleName.startsWith('/'),
      raw: node.text,
    };
  }
  return null;
}

// ─── Helper: Extract calls from a subtree ──────────────────────────

function extractCalls(node: Parser.SyntaxNode): CallInfo[] {
  const calls: CallInfo[] = [];

  function walk(n: Parser.SyntaxNode): void {
    if (n.type === 'call_expression') {
      const funcNode = n.childForFieldName('function') ?? n.children[0];
      const argsNode = n.childForFieldName('arguments') ?? n.children.find(c => c.type === 'arguments');

      if (funcNode) {
        const callee = funcNode.text;
        let object: string | undefined;
        let method: string;

        if (funcNode.type === 'member_expression') {
          const objectNode = funcNode.childForFieldName('object') ?? funcNode.children[0];
          const propertyNode = funcNode.childForFieldName('property') ?? funcNode.children[funcNode.childCount - 1];
          object = objectNode?.text;
          method = propertyNode?.text ?? callee;
        } else {
          method = callee;
        }

        // Count arguments (exclude commas and parens)
        let argCount = 0;
        if (argsNode) {
          for (const arg of argsNode.children) {
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

// ─── Helper: Compute complexity from a subtree ────────────────────

function computeComplexity(node: Parser.SyntaxNode, source: string): ComplexityMetrics {
  let cyclomatic = 1; // base complexity
  let cognitive = 0;
  let maxDepth = 0;

  function walk(n: Parser.SyntaxNode, nestingDepth: number): void {
    // Cyclomatic complexity
    if (BRANCHING_NODES.has(n.type)) {
      if (n.type === 'binary_expression') {
        const operator = n.children.find(c => c.type === '&&' || c.type === '||' || c.text === '&&' || c.text === '||');
        if (operator) {
          cyclomatic++;
        }
      } else if (n.type !== 'else_clause') {
        cyclomatic++;
      }
    }

    // Cognitive complexity
    if (COGNITIVE_NODES.has(n.type)) {
      if (n.type === 'else_clause') {
        cognitive += 1; // else doesn't get nesting increment
      } else {
        cognitive += 1 + nestingDepth;
      }
    }

    // Nesting depth
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

// ─── Helper: Extract symbol definitions ────────────────────────────

function extractDefinitions(node: Parser.SyntaxNode, isExported: boolean): SymbolDef[] {
  const defs: SymbolDef[] = [];

  function walkTopLevel(n: Parser.SyntaxNode, exported: boolean): void {
    const isExport = n.type === 'export_statement';
    if (isExport) {
      for (let i = 0; i < n.childCount; i++) {
        walkTopLevel(n.child(i)!, true);
      }
      return;
    }

    if (n.type === 'function_declaration') {
      const nameNode = n.childForFieldName('name') ?? n.children.find(c => c.type === 'identifier');
      if (nameNode) {
        defs.push({
          name: nameNode.text,
          kind: 'function',
          line: n.startPosition.row,
          exported,
        });
      }
    } else if (n.type === 'class_declaration') {
      const nameNode = n.childForFieldName('name') ?? n.children.find(c => c.type === 'type_identifier');
      if (nameNode) {
        defs.push({
          name: nameNode.text,
          kind: 'class',
          line: n.startPosition.row,
          exported,
        });
      }
    } else if (n.type === 'lexical_declaration' || n.type === 'variable_declaration') {
      for (const child of n.children) {
        if (child.type === 'variable_declarator') {
          const nameNode = child.childForFieldName('name') ?? child.children.find(c => c.type === 'identifier');
          if (nameNode) {
            defs.push({
              name: nameNode.text,
              kind: 'variable',
              line: n.startPosition.row,
              exported,
            });
          }
        }
      }
    } else if (n.type === 'type_alias_declaration') {
      const nameNode = n.childForFieldName('name') ?? n.children.find(c => c.type === 'type_identifier');
      if (nameNode) {
        defs.push({
          name: nameNode.text,
          kind: 'type',
          line: n.startPosition.row,
          exported,
        });
      }
    } else if (n.type === 'interface_declaration') {
      const nameNode = n.childForFieldName('name') ?? n.children.find(c => c.type === 'type_identifier');
      if (nameNode) {
        defs.push({
          name: nameNode.text,
          kind: 'interface',
          line: n.startPosition.row,
          exported,
        });
      }
    } else if (n.type === 'enum_declaration') {
      const nameNode = n.childForFieldName('name') ?? n.children.find(c => c.type === 'identifier');
      if (nameNode) {
        defs.push({
          name: nameNode.text,
          kind: 'enum',
          line: n.startPosition.row,
          exported,
        });
      }
    }
  }

  walkTopLevel(node, isExported);
  return defs;
}

// ─── Helper: Count parameters ──────────────────────────────────────

function countParameters(paramsNode: Parser.SyntaxNode): number {
  let count = 0;
  for (const child of paramsNode.children) {
    if (child.type === 'required_parameter' ||
        child.type === 'optional_parameter' ||
        child.type === 'rest_parameter' ||
        child.type === 'identifier' ||  // JS style params
        child.type === 'assignment_pattern') {
      count++;
    }
  }
  return count;
}

// ─── TypeScriptExtractor ───────────────────────────────────────────

export class TypeScriptExtractor implements LanguageExtractor {
  readonly language: SupportedLanguage;

  constructor(language: SupportedLanguage = 'typescript') {
    this.language = language;
  }

  extract(tree: Parser.Tree, filePath: string, source: string): CodeUnit[] {
    const units: CodeUnit[] = [];
    const root = tree.rootNode;

    // 1. Create the file-level CodeUnit
    const fileImports = this.extractFileImports(root);
    const fileCalls = extractCalls(root);
    const fileDefs = this.extractFileDefinitions(root);
    const fileComplexity = computeComplexity(root, source);

    const fileUnit = createCodeUnit({
      id: `file:${filePath}`,
      file: filePath,
      language: this.language,
      kind: 'file',
      location: getLocation(root),
      source,
      imports: fileImports,
      calls: fileCalls,
      complexity: fileComplexity,
      definitions: fileDefs,
      references: [], // Will be populated later
      childIds: [],
    });
    units.push(fileUnit);

    // 2. Extract functions and classes
    this.extractFunctions(root, filePath, source, fileUnit, units);
    this.extractClasses(root, filePath, source, fileUnit, units);

    return units;
  }

  // ─── File-level imports ──────────────────────────────────────────

  private extractFileImports(root: Parser.SyntaxNode): ImportInfo[] {
    const imports: ImportInfo[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      if (child.type === 'import_statement') {
        const info = extractImport(child);
        if (info) imports.push(info);
      }

      // Check for require() calls
      if (child.type === 'lexical_declaration' || child.type === 'variable_declaration') {
        const info = extractRequireImport(child);
        if (info) imports.push(info);
      }

      // Handle export { ... } from 'module' (re-exports)
      if (child.type === 'export_statement') {
        const sourceNode = child.children.find(c => c.type === 'string');
        if (sourceNode) {
          const moduleName = sourceNode.text.replace(/['"]/g, '');
          const symbols: string[] = [];
          const exportClause = child.children.find(c => c.type === 'export_clause');
          if (exportClause) {
            for (const spec of exportClause.children) {
              if (spec.type === 'export_specifier') {
                const nameNode = spec.childForFieldName('name') ?? spec.children.find(c => c.type === 'identifier');
                if (nameNode) symbols.push(nameNode.text);
              }
            }
          }
          imports.push({
            module: moduleName,
            symbols,
            line: child.startPosition.row,
            isRelative: moduleName.startsWith('.') || moduleName.startsWith('/'),
            raw: child.text,
          });
        }
      }
    }

    return imports;
  }

  // ─── File-level definitions ──────────────────────────────────────

  private extractFileDefinitions(root: Parser.SyntaxNode): SymbolDef[] {
    const defs: SymbolDef[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;
      defs.push(...extractDefinitions(child, false));
    }

    return defs;
  }

  // ─── Extract top-level and nested functions ──────────────────────

  private extractFunctions(
    root: Parser.SyntaxNode,
    filePath: string,
    _source: string,
    fileUnit: CodeUnit,
    units: CodeUnit[],
    parentId?: string,
  ): void {
    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      // Handle export_statement wrapping
      let funcNode: Parser.SyntaxNode | null = null;
      let isExported = false;

      if (child.type === 'export_statement') {
        isExported = true;
        for (let j = 0; j < child.childCount; j++) {
          const exportChild = child.child(j)!;
          if (exportChild.type === 'function_declaration') {
            funcNode = exportChild;
            break;
          }
        }
      } else if (child.type === 'function_declaration') {
        funcNode = child;
      }

      // Handle arrow functions assigned to variables
      if (child.type === 'lexical_declaration' || child.type === 'variable_declaration') {
        for (const declarator of child.children) {
          if (declarator.type !== 'variable_declarator') continue;
          const value = declarator.childForFieldName('value') ?? declarator.children.find(c => c.type === 'arrow_function');
          if (value && value.type === 'arrow_function') {
            const nameNode = declarator.childForFieldName('name') ?? declarator.children.find(c => c.type === 'identifier');
            if (nameNode) {
              this.createFunctionUnit(
                nameNode.text,
                value,
                filePath,
                fileUnit,
                units,
                false,
                parentId,
              );
            }
          }
        }
      }

      // Handle export_statement wrapping variable declarations (arrow functions)
      if (child.type === 'export_statement') {
        for (let j = 0; j < child.childCount; j++) {
          const exportChild = child.child(j)!;
          if (exportChild.type === 'lexical_declaration' || exportChild.type === 'variable_declaration') {
            for (const declarator of exportChild.children) {
              if (declarator.type !== 'variable_declarator') continue;
              const value = declarator.childForFieldName('value') ?? declarator.children.find(c => c.type === 'arrow_function');
              if (value && value.type === 'arrow_function') {
                const nameNode = declarator.childForFieldName('name') ?? declarator.children.find(c => c.type === 'identifier');
                if (nameNode) {
                  this.createFunctionUnit(
                    nameNode.text,
                    value,
                    filePath,
                    fileUnit,
                    units,
                    true,
                    parentId,
                  );
                }
              }
            }
          }
        }
      }

      if (funcNode) {
        const nameNode = funcNode.childForFieldName('name') ?? funcNode.children.find(c => c.type === 'identifier');
        if (nameNode) {
          this.createFunctionUnit(
            nameNode.text,
            funcNode,
            filePath,
            fileUnit,
            units,
            isExported,
            parentId,
          );
        }
      }
    }
  }

  private createFunctionUnit(
    name: string,
    node: Parser.SyntaxNode,
    filePath: string,
    fileUnit: CodeUnit,
    units: CodeUnit[],
    isExported: boolean,
    parentId?: string,
  ): void {
    const funcId = `func:${filePath}:${name}`;
    const funcSource = node.text;
    const paramsNode = node.children.find(c => c.type === 'formal_parameters');
    const paramCount = paramsNode ? countParameters(paramsNode) : 0;

    const complexity = computeComplexity(node, funcSource);
    complexity.parameterCount = paramCount;

    const calls = extractCalls(node);

    const funcDefs: SymbolDef[] = [{
      name,
      kind: 'function',
      line: node.startPosition.row,
      exported: isExported,
    }];

    // Extract parameter definitions
    if (paramsNode) {
      for (const param of paramsNode.children) {
        if (param.type === 'required_parameter' || param.type === 'optional_parameter' || param.type === 'identifier') {
          const paramName = param.type === 'identifier' ? param.text :
            (param.childForFieldName('pattern') ?? param.children.find(c => c.type === 'identifier'))?.text;
          if (paramName) {
            funcDefs.push({
              name: paramName,
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
      language: this.language,
      kind: 'function',
      location: getLocation(node),
      source: funcSource,
      calls,
      complexity,
      definitions: funcDefs,
      parentId: parentId ?? fileUnit.id,
    });

    units.push(funcUnit);
    if (parentId) {
      const parent = units.find(u => u.id === parentId);
      if (parent) parent.childIds.push(funcId);
    } else {
      fileUnit.childIds.push(funcId);
    }
  }

  // ─── Extract classes and their methods ───────────────────────────

  private extractClasses(
    root: Parser.SyntaxNode,
    filePath: string,
    source: string,
    fileUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      let classNode: Parser.SyntaxNode | null = null;
      let isExported = false;

      if (child.type === 'export_statement') {
        isExported = true;
        for (let j = 0; j < child.childCount; j++) {
          const exportChild = child.child(j)!;
          if (exportChild.type === 'class_declaration') {
            classNode = exportChild;
            break;
          }
        }
      } else if (child.type === 'class_declaration') {
        classNode = child;
      }

      if (!classNode) continue;

      const nameNode = classNode.childForFieldName('name') ?? classNode.children.find(c => c.type === 'type_identifier');
      if (!nameNode) continue;
      const className = nameNode.text;

      const classId = `class:${filePath}:${className}`;
      const classSource = classNode.text;
      const classCalls = extractCalls(classNode);
      const classComplexity = computeComplexity(classNode, classSource);

      const classDefs: SymbolDef[] = [{
        name: className,
        kind: 'class',
        line: classNode.startPosition.row,
        exported: isExported,
      }];

      const classUnit = createCodeUnit({
        id: classId,
        file: filePath,
        language: this.language,
        kind: 'class',
        location: getLocation(classNode),
        source: classSource,
        calls: classCalls,
        complexity: classComplexity,
        definitions: classDefs,
        parentId: fileUnit.id,
      });

      units.push(classUnit);
      fileUnit.childIds.push(classId);

      // Extract methods from class body
      const classBody = classNode.children.find(c => c.type === 'class_body');
      if (classBody) {
        this.extractMethods(classBody, className, filePath, classUnit, units);
      }
    }
  }

  private extractMethods(
    classBody: Parser.SyntaxNode,
    className: string,
    filePath: string,
    classUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < classBody.childCount; i++) {
      const member = classBody.child(i)!;

      if (member.type === 'method_definition') {
        const nameNode = member.childForFieldName('name') ?? member.children.find(c => c.type === 'property_identifier');
        if (!nameNode) continue;

        const methodName = nameNode.text;
        const methodId = `method:${filePath}:${className}.${methodName}`;
        const methodSource = member.text;

        const paramsNode = member.children.find(c => c.type === 'formal_parameters');
        const paramCount = paramsNode ? countParameters(paramsNode) : 0;

        const complexity = computeComplexity(member, methodSource);
        complexity.parameterCount = paramCount;

        const calls = extractCalls(member);

        // Check if public/private/protected
        const isPublic = !member.children.some(c =>
          c.type === 'accessibility_modifier' && (c.text === 'private' || c.text === 'protected')
        );

        const methodDefs: SymbolDef[] = [{
          name: methodName,
          kind: 'method',
          line: member.startPosition.row,
          exported: isPublic,
        }];

        const methodUnit = createCodeUnit({
          id: methodId,
          file: filePath,
          language: this.language,
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
      }

      // Also handle property declarations with arrow function values
      if (member.type === 'public_field_definition') {
        const nameNode = member.childForFieldName('name') ?? member.children.find(c => c.type === 'property_identifier');
        const valueNode = member.childForFieldName('value') ?? member.children.find(c => c.type === 'arrow_function');
        if (nameNode && valueNode && valueNode.type === 'arrow_function') {
          const methodName = nameNode.text;
          const methodId = `method:${filePath}:${className}.${methodName}`;
          const methodSource = member.text;

          const paramsNode = valueNode.children.find(c => c.type === 'formal_parameters');
          const paramCount = paramsNode ? countParameters(paramsNode) : 0;

          const complexity = computeComplexity(valueNode, methodSource);
          complexity.parameterCount = paramCount;

          const calls = extractCalls(valueNode);

          const methodUnit = createCodeUnit({
            id: methodId,
            file: filePath,
            language: this.language,
            kind: 'method',
            location: getLocation(member),
            source: methodSource,
            calls,
            complexity,
            definitions: [{
              name: methodName,
              kind: 'method',
              line: member.startPosition.row,
              exported: true,
            }],
            parentId: classUnit.id,
          });

          units.push(methodUnit);
          classUnit.childIds.push(methodId);
        }
      }
    }
  }
}
