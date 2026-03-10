/**
 * Open Code Review V4 — Python Extractor
 *
 * Extracts CodeUnits from Python tree-sitter CSTs.
 * Handles: imports, functions (def/async def), classes, methods, calls, complexity, symbols.
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
  'elif_clause',
  'for_statement',
  'while_statement',
  'except_clause',
  'with_statement',
  'conditional_expression',  // ternary: x if cond else y
  'boolean_operator',        // and / or
]);

/** Node types that increase nesting depth */
const NESTING_NODES = new Set([
  'if_statement',
  'for_statement',
  'while_statement',
  'try_statement',
  'with_statement',
  'except_clause',
]);

/** Node types for cognitive complexity */
const COGNITIVE_NODES = new Set([
  'if_statement',
  'elif_clause',
  'else_clause',
  'for_statement',
  'while_statement',
  'except_clause',
  'with_statement',
  'conditional_expression',
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
    if (trimmed.length > 0 && !trimmed.startsWith('#')) {
      count++;
    }
  }
  return count;
}

// ─── Helper: Extract imports ───────────────────────────────────────

function extractImportStatement(node: Parser.SyntaxNode): ImportInfo[] {
  const imports: ImportInfo[] = [];

  if (node.type === 'import_statement') {
    // import os / import sys as system
    for (const child of node.children) {
      if (child.type === 'dotted_name') {
        imports.push({
          module: child.text,
          symbols: [],
          line: node.startPosition.row,
          isRelative: false,
          raw: node.text,
        });
      } else if (child.type === 'aliased_import') {
        const dottedName = child.children.find(c => c.type === 'dotted_name');
        if (dottedName) {
          imports.push({
            module: dottedName.text,
            symbols: [],
            line: node.startPosition.row,
            isRelative: false,
            raw: node.text,
          });
        }
      }
    }
  } else if (node.type === 'import_from_statement') {
    // from pathlib import Path, PurePath / from . import utils
    let moduleName = '';
    let isRelative = false;
    const symbols: string[] = [];

    for (const child of node.children) {
      if (child.type === 'dotted_name' && moduleName === '') {
        moduleName = child.text;
      } else if (child.type === 'relative_import') {
        isRelative = true;
        const prefix = child.children.find(c => c.type === 'import_prefix');
        const dotted = child.children.find(c => c.type === 'dotted_name');
        moduleName = (prefix?.text ?? '') + (dotted?.text ?? '');
      } else if (child.type === 'dotted_name' && moduleName !== '') {
        // These are the imported symbols
        symbols.push(child.text);
      } else if (child.type === 'aliased_import') {
        const nameNode = child.children.find(c => c.type === 'dotted_name');
        if (nameNode) symbols.push(nameNode.text);
      } else if (child.type === 'wildcard_import') {
        symbols.push('*');
      }
    }

    imports.push({
      module: moduleName,
      symbols,
      line: node.startPosition.row,
      isRelative,
      raw: node.text,
    });
  }

  return imports;
}

// ─── Helper: Extract calls from a subtree ──────────────────────────

function extractCalls(node: Parser.SyntaxNode): CallInfo[] {
  const calls: CallInfo[] = [];

  function walk(n: Parser.SyntaxNode): void {
    if (n.type === 'call') {
      const funcNode = n.childForFieldName('function') ?? n.children[0];
      const argsNode = n.childForFieldName('arguments') ?? n.children.find(c => c.type === 'argument_list');

      if (funcNode) {
        const callee = funcNode.text;
        let object: string | undefined;
        let method: string;

        if (funcNode.type === 'attribute') {
          const objectNode = funcNode.childForFieldName('object') ?? funcNode.children[0];
          const attrNode = funcNode.childForFieldName('attribute') ?? funcNode.children[funcNode.childCount - 1];
          object = objectNode?.text;
          method = attrNode?.text ?? callee;
        } else {
          method = callee;
        }

        // Count arguments
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

// ─── Helper: Compute complexity ────────────────────────────────────

function computeComplexity(node: Parser.SyntaxNode, source: string): ComplexityMetrics {
  let cyclomatic = 1; // base
  let cognitive = 0;
  let maxDepth = 0;

  function walk(n: Parser.SyntaxNode, nestingDepth: number): void {
    // Cyclomatic complexity
    if (BRANCHING_NODES.has(n.type)) {
      if (n.type === 'boolean_operator') {
        cyclomatic++;
      } else {
        cyclomatic++;
      }
    }

    // Cognitive complexity
    if (COGNITIVE_NODES.has(n.type)) {
      if (n.type === 'else_clause' || n.type === 'elif_clause') {
        cognitive += 1; // no nesting increment for else/elif
      } else {
        cognitive += 1 + nestingDepth;
      }
    }

    if (n.type === 'boolean_operator') {
      cognitive += 1;
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

// ─── Helper: Count parameters (excluding 'self' and 'cls') ────────

function countParameters(paramsNode: Parser.SyntaxNode): number {
  let count = 0;
  for (const child of paramsNode.children) {
    if (child.type === 'identifier' ||
        child.type === 'typed_parameter' ||
        child.type === 'default_parameter' ||
        child.type === 'typed_default_parameter' ||
        child.type === 'list_splat_pattern' ||
        child.type === 'dictionary_splat_pattern') {
      // Skip 'self' and 'cls'
      const name = child.type === 'identifier' ? child.text :
        (child.children.find(c => c.type === 'identifier')?.text ?? '');
      if (name !== 'self' && name !== 'cls') {
        count++;
      }
    }
  }
  return count;
}

// ─── Helper: Check if a function has decorators ────────────────────

function getDecorators(node: Parser.SyntaxNode): string[] {
  // If parent is decorated_definition, extract decorators
  const decorators: string[] = [];
  if (node.parent?.type === 'decorated_definition') {
    for (const child of node.parent.children) {
      if (child.type === 'decorator') {
        const nameNode = child.children.find(c =>
          c.type === 'identifier' || c.type === 'attribute' || c.type === 'call'
        );
        if (nameNode) decorators.push(nameNode.text);
      }
    }
  }
  return decorators;
}

// ─── PythonExtractor ───────────────────────────────────────────────

export class PythonExtractor implements LanguageExtractor {
  readonly language: SupportedLanguage = 'python';

  extract(tree: Parser.Tree, filePath: string, source: string): CodeUnit[] {
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
      language: 'python',
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

    // 2. Extract top-level functions
    this.extractFunctions(root, filePath, fileUnit, units);

    // 3. Extract classes
    this.extractClasses(root, filePath, fileUnit, units);

    return units;
  }

  // ─── File-level imports ──────────────────────────────────────────

  private extractFileImports(root: Parser.SyntaxNode): ImportInfo[] {
    const imports: ImportInfo[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;
      if (child.type === 'import_statement' || child.type === 'import_from_statement') {
        imports.push(...extractImportStatement(child));
      }
    }

    return imports;
  }

  // ─── File-level definitions ──────────────────────────────────────

  private extractFileDefinitions(root: Parser.SyntaxNode): SymbolDef[] {
    const defs: SymbolDef[] = [];

    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      if (child.type === 'function_definition' || (child.type === 'decorated_definition' && child.children.some(c => c.type === 'function_definition'))) {
        const funcNode = child.type === 'function_definition' ? child :
          child.children.find(c => c.type === 'function_definition')!;
        const nameNode = funcNode.childForFieldName('name') ?? funcNode.children.find(c => c.type === 'identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'function',
            line: funcNode.startPosition.row,
            exported: !nameNode.text.startsWith('_'),
          });
        }
      } else if (child.type === 'class_definition' || (child.type === 'decorated_definition' && child.children.some(c => c.type === 'class_definition'))) {
        const classNode = child.type === 'class_definition' ? child :
          child.children.find(c => c.type === 'class_definition')!;
        const nameNode = classNode.childForFieldName('name') ?? classNode.children.find(c => c.type === 'identifier');
        if (nameNode) {
          defs.push({
            name: nameNode.text,
            kind: 'class',
            line: classNode.startPosition.row,
            exported: !nameNode.text.startsWith('_'),
          });
        }
      } else if (child.type === 'expression_statement') {
        // Variable assignments at module level: x = 1
        const assignNode = child.children.find(c => c.type === 'assignment');
        if (assignNode) {
          const left = assignNode.childForFieldName('left') ?? assignNode.children[0];
          if (left && left.type === 'identifier') {
            defs.push({
              name: left.text,
              kind: 'variable',
              line: child.startPosition.row,
              exported: !left.text.startsWith('_'),
            });
          }
        }
      }
    }

    return defs;
  }

  // ─── Extract functions ───────────────────────────────────────────

  private extractFunctions(
    parent: Parser.SyntaxNode,
    filePath: string,
    parentUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < parent.childCount; i++) {
      const child = parent.child(i)!;

      let funcNode: Parser.SyntaxNode | null = null;

      if (child.type === 'function_definition') {
        funcNode = child;
      } else if (child.type === 'decorated_definition') {
        funcNode = child.children.find(c => c.type === 'function_definition') ?? null;
      }

      if (!funcNode) continue;

      const nameNode = funcNode.childForFieldName('name') ?? funcNode.children.find(c => c.type === 'identifier');
      if (!nameNode) continue;

      const funcName = nameNode.text;
      const funcId = `func:${filePath}:${funcName}`;
      const funcSource = (child.type === 'decorated_definition' ? child : funcNode).text;
      const isAsync = funcNode.children.some(c => c.type === 'async');
      const decorators = getDecorators(funcNode);

      const paramsNode = funcNode.childForFieldName('parameters') ?? funcNode.children.find(c => c.type === 'parameters');
      const paramCount = paramsNode ? countParameters(paramsNode) : 0;

      const complexity = computeComplexity(funcNode, funcSource);
      complexity.parameterCount = paramCount;

      const calls = extractCalls(funcNode);

      const funcDefs: SymbolDef[] = [{
        name: funcName,
        kind: 'function',
        line: funcNode.startPosition.row,
        exported: !funcName.startsWith('_'),
      }];

      // Extract parameter definitions
      if (paramsNode) {
        for (const param of paramsNode.children) {
          let paramName: string | undefined;
          if (param.type === 'identifier') {
            paramName = param.text;
          } else if (param.type === 'typed_parameter' || param.type === 'default_parameter' || param.type === 'typed_default_parameter') {
            paramName = param.children.find(c => c.type === 'identifier')?.text;
          }
          if (paramName && paramName !== 'self' && paramName !== 'cls') {
            funcDefs.push({
              name: paramName,
              kind: 'parameter',
              line: param.startPosition.row,
              exported: false,
            });
          }
        }
      }

      const funcUnit = createCodeUnit({
        id: funcId,
        file: filePath,
        language: 'python',
        kind: 'function',
        location: getLocation(child.type === 'decorated_definition' ? child : funcNode),
        source: funcSource,
        calls,
        complexity,
        definitions: funcDefs,
        parentId: parentUnit.id,
      });

      units.push(funcUnit);
      parentUnit.childIds.push(funcId);
    }
  }

  // ─── Extract classes ─────────────────────────────────────────────

  private extractClasses(
    root: Parser.SyntaxNode,
    filePath: string,
    fileUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < root.childCount; i++) {
      const child = root.child(i)!;

      let classNode: Parser.SyntaxNode | null = null;

      if (child.type === 'class_definition') {
        classNode = child;
      } else if (child.type === 'decorated_definition') {
        classNode = child.children.find(c => c.type === 'class_definition') ?? null;
      }

      if (!classNode) continue;

      const nameNode = classNode.childForFieldName('name') ?? classNode.children.find(c => c.type === 'identifier');
      if (!nameNode) continue;

      const className = nameNode.text;
      const classId = `class:${filePath}:${className}`;
      const classSource = (child.type === 'decorated_definition' ? child : classNode).text;

      const classCalls = extractCalls(classNode);
      const classComplexity = computeComplexity(classNode, classSource);

      const classDefs: SymbolDef[] = [{
        name: className,
        kind: 'class',
        line: classNode.startPosition.row,
        exported: !className.startsWith('_'),
      }];

      const classUnit = createCodeUnit({
        id: classId,
        file: filePath,
        language: 'python',
        kind: 'class',
        location: getLocation(child.type === 'decorated_definition' ? child : classNode),
        source: classSource,
        calls: classCalls,
        complexity: classComplexity,
        definitions: classDefs,
        parentId: fileUnit.id,
      });

      units.push(classUnit);
      fileUnit.childIds.push(classId);

      // Extract methods from class body
      const classBody = classNode.childForFieldName('body') ?? classNode.children.find(c => c.type === 'block');
      if (classBody) {
        this.extractMethods(classBody, className, filePath, classUnit, units);
      }
    }
  }

  // ─── Extract methods from a class body ───────────────────────────

  private extractMethods(
    classBody: Parser.SyntaxNode,
    className: string,
    filePath: string,
    classUnit: CodeUnit,
    units: CodeUnit[],
  ): void {
    for (let i = 0; i < classBody.childCount; i++) {
      const member = classBody.child(i)!;

      let funcNode: Parser.SyntaxNode | null = null;
      let decoratedNode: Parser.SyntaxNode | null = null;

      if (member.type === 'function_definition') {
        funcNode = member;
      } else if (member.type === 'decorated_definition') {
        funcNode = member.children.find(c => c.type === 'function_definition') ?? null;
        decoratedNode = member;
      }

      if (!funcNode) continue;

      const nameNode = funcNode.childForFieldName('name') ?? funcNode.children.find(c => c.type === 'identifier');
      if (!nameNode) continue;

      const methodName = nameNode.text;
      const methodId = `method:${filePath}:${className}.${methodName}`;
      const methodSource = (decoratedNode ?? funcNode).text;

      const paramsNode = funcNode.childForFieldName('parameters') ?? funcNode.children.find(c => c.type === 'parameters');
      const paramCount = paramsNode ? countParameters(paramsNode) : 0;

      const complexity = computeComplexity(funcNode, methodSource);
      complexity.parameterCount = paramCount;

      const calls = extractCalls(funcNode);

      const isPublic = !methodName.startsWith('_') || methodName === '__init__';

      const methodDefs: SymbolDef[] = [{
        name: methodName,
        kind: 'method',
        line: funcNode.startPosition.row,
        exported: isPublic,
      }];

      const methodUnit = createCodeUnit({
        id: methodId,
        file: filePath,
        language: 'python',
        kind: 'method',
        location: getLocation(decoratedNode ?? funcNode),
        source: methodSource,
        calls,
        complexity,
        definitions: methodDefs,
        parentId: classUnit.id,
      });

      units.push(methodUnit);
      classUnit.childIds.push(methodId);
    }
  }
}
