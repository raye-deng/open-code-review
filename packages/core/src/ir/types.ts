/**
 * Open Code Review V4 — Unified Intermediate Representation (IR)
 *
 * CodeUnit is the universal intermediate representation that all V4 detectors
 * operate on. Detectors never access raw CST nodes directly — they work
 * exclusively with CodeUnits.
 *
 * @since 0.4.0
 */

// ─── Supported Languages ───────────────────────────────────────────

/**
 * Languages supported by the V4 tree-sitter pipeline.
 * Note: V3 SupportedLanguage is re-exported from types.ts for backward compat.
 * This V4 type is the canonical definition going forward.
 */
export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'go'
  | 'kotlin';

// ─── CodeUnit Kind ─────────────────────────────────────────────────

/** The structural kind of a CodeUnit */
export type CodeUnitKind =
  | 'file'
  | 'class'
  | 'function'
  | 'method'
  | 'block'
  | 'module';

// ─── Source Location ───────────────────────────────────────────────

/** Precise source location within a file (all 0-based) */
export interface SourceLocation {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

// ─── Import Information ────────────────────────────────────────────

/** A single import declaration extracted from source code */
export interface ImportInfo {
  /** The module/package being imported (e.g., "lodash", "os", "java.util.List") */
  module: string;
  /** Specific symbols imported (empty array = whole module import) */
  symbols: string[];
  /** Line number of the import (0-based) */
  line: number;
  /** Whether this is a relative import (e.g., "./utils") */
  isRelative: boolean;
  /** Original import text as it appears in source */
  raw: string;
}

// ─── Call Information ──────────────────────────────────────────────

/** A single function/method call site extracted from source code */
export interface CallInfo {
  /** Full callee expression (e.g., "fs.readFile", "console.log", "print") */
  callee: string;
  /** Object/receiver part if method call (e.g., "fs", "console") */
  object?: string;
  /** Method/function name (e.g., "readFile", "log", "print") */
  method: string;
  /** Line number (0-based) */
  line: number;
  /** Number of arguments passed */
  argCount: number;
}

// ─── Complexity Metrics ────────────────────────────────────────────

/** Complexity metrics computed from the tree-sitter CST */
export interface ComplexityMetrics {
  /** McCabe cyclomatic complexity */
  cyclomaticComplexity: number;
  /** Cognitive complexity (SonarSource-style) */
  cognitiveComplexity: number;
  /** Maximum nesting depth of control structures */
  maxNestingDepth: number;
  /** Lines of code (excluding blank lines and comments) */
  linesOfCode: number;
  /** Number of parameters (for functions/methods) */
  parameterCount?: number;
}

// ─── Symbol Definition ─────────────────────────────────────────────

/** A symbol (variable, function, class, etc.) defined in a CodeUnit */
export interface SymbolDef {
  /** Symbol name */
  name: string;
  /** What kind of symbol */
  kind:
    | 'variable'
    | 'function'
    | 'class'
    | 'method'
    | 'parameter'
    | 'type'
    | 'interface'
    | 'enum';
  /** Line number (0-based) */
  line: number;
  /** Whether the symbol is exported/public */
  exported: boolean;
}

// ─── Symbol Reference ──────────────────────────────────────────────

/** A reference to a symbol that is used but not defined in this CodeUnit */
export interface SymbolRef {
  /** Referenced symbol name */
  name: string;
  /** Line number (0-based) */
  line: number;
  /** Whether the reference has been resolved to a definition */
  resolved: boolean;
}

// ─── CodeUnit ──────────────────────────────────────────────────────

/**
 * CodeUnit — the universal intermediate representation.
 *
 * All V4 detectors operate on CodeUnits, never on raw CST nodes.
 * Each CodeUnit represents a logical unit of code: a file, class,
 * function, method, or block.
 *
 * CodeUnits form a tree: a file-level CodeUnit contains class and
 * function children, classes contain method children, etc.
 */
export interface CodeUnit {
  /** Unique ID within the scan (e.g., "file:src/app.ts", "func:src/app.ts:main") */
  id: string;

  /** Source file path (relative to project root) */
  file: string;

  /** Programming language */
  language: SupportedLanguage;

  /** Structural kind of this unit */
  kind: CodeUnitKind;

  /** Source location within the file */
  location: SourceLocation;

  /** Raw source text of this unit */
  source: string;

  /** Imports in this file (populated for file-level units) */
  imports: ImportInfo[];

  /** Function/method calls made within this unit */
  calls: CallInfo[];

  /** Complexity metrics for this unit */
  complexity: ComplexityMetrics;

  /** Symbols defined in this unit */
  definitions: SymbolDef[];

  /** Symbols referenced but not defined here */
  references: SymbolRef[];

  /** Parent unit ID (e.g., method's parent is a class) */
  parentId?: string;

  /** Child unit IDs */
  childIds: string[];
}

// ─── Helper: Create empty complexity metrics ───────────────────────

/** Create a ComplexityMetrics object with all zeroes */
export function emptyComplexity(): ComplexityMetrics {
  return {
    cyclomaticComplexity: 0,
    cognitiveComplexity: 0,
    maxNestingDepth: 0,
    linesOfCode: 0,
  };
}

// ─── Helper: Create a CodeUnit with defaults ───────────────────────

/** Create a CodeUnit with sensible defaults (caller overrides what's needed) */
export function createCodeUnit(partial: Partial<CodeUnit> & Pick<CodeUnit, 'id' | 'file' | 'language' | 'kind' | 'location' | 'source'>): CodeUnit {
  return {
    imports: [],
    calls: [],
    complexity: emptyComplexity(),
    definitions: [],
    references: [],
    childIds: [],
    ...partial,
  };
}
