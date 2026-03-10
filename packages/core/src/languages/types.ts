/**
 * Language Adapter Types
 *
 * Defines the unified LanguageAdapter interface that all language-specific
 * adapters must implement. This enables language-agnostic detection.
 *
 * @since 0.3.0
 */

import type { SupportedLanguage } from '../types.js';

// ─── AST Types ───

/**
 * Abstract AST node — language adapters produce their own AST structures,
 * but they all go through this common interface for traversal.
 */
export interface ASTNode {
  type: string;
  [key: string]: unknown;
}

// ─── Import Info ───

/** Extracted import/require statement */
export interface ImportInfo {
  /** The module specifier (e.g. 'lodash', './utils', 'node:fs') */
  module: string;
  /** Individual imported bindings (e.g. ['readFile', 'writeFile']) */
  bindings: string[];
  /** Line number where the import appears */
  line: number;
  /** Whether this is a relative import (./foo, ../bar) */
  isRelative: boolean;
  /** Whether this is a built-in module */
  isBuiltin: boolean;
}

// ─── Call Info ───

/** Extracted function/method call */
export interface CallInfo {
  /** The fully qualified call name (e.g. 'fs.readFile', 'console.log') */
  name: string;
  /** Line number */
  line: number;
  /** Column number */
  column?: number;
  /** Whether this is a method call (obj.method()) */
  isMethodCall: boolean;
}

// ─── Package Verification ───

/** Result of package existence verification */
export interface PackageVerifyResult {
  /** Package name */
  name: string;
  /** Whether the package exists in the registry */
  exists: boolean;
  /** If deprecated, the deprecation message */
  deprecation?: string;
  /** When the check was performed */
  checkedAt: number;
}

// ─── Deprecated API ───

/** Information about a deprecated API */
export interface DeprecatedInfo {
  /** The deprecated API name/pattern */
  api: string;
  /** Why it was deprecated */
  reason: string;
  /** What to use instead */
  replacement?: string;
  /** Since which version it was deprecated */
  since?: string;
  /** Reference URL */
  reference?: string;
}

// ─── Complexity Metrics ───

/** Complexity metrics for a code unit (function/file) */
export interface ComplexityMetrics {
  /** Cyclomatic complexity */
  cyclomatic: number;
  /** Cognitive complexity */
  cognitive: number;
  /** Lines of code */
  loc: number;
  /** Number of functions */
  functionCount: number;
  /** Maximum nesting depth */
  maxNestingDepth: number;
}

// ─── Language Adapter Interface ───

/**
 * LanguageAdapter — unified interface for multi-language support.
 *
 * Each supported language implements this interface to provide:
 * - AST parsing
 * - Import/call extraction
 * - Package verification
 * - Deprecated API checking
 * - Complexity computation
 *
 * Detectors use LanguageAdapter to remain language-agnostic.
 */
export interface LanguageAdapter {
  /** Language identifier (e.g. 'typescript', 'python') */
  readonly id: SupportedLanguage;

  /** Supported file extensions (e.g. ['.ts', '.tsx', '.js', '.jsx']) */
  readonly extensions: string[];

  /**
   * Parse source code into an AST.
   * @param source File content
   * @param filePath File path (for error reporting)
   * @returns Parsed AST
   */
  parse(source: string, filePath: string): Promise<ASTNode>;

  /**
   * Extract import/require statements from parsed AST or source.
   * @param source File content
   * @param ast Parsed AST (optional, for performance)
   * @returns Array of import information
   */
  extractImports(source: string, ast?: ASTNode): ImportInfo[];

  /**
   * Extract function/method calls from parsed AST or source.
   * @param source File content
   * @param ast Parsed AST (optional, for performance)
   * @returns Array of call information
   */
  extractCalls(source: string, ast?: ASTNode): CallInfo[];

  /**
   * Verify if a package exists in the language's package registry.
   * @param name Package name
   * @returns Verification result
   */
  verifyPackage(name: string): Promise<PackageVerifyResult>;

  /**
   * Check if an API is deprecated.
   * @param api The API name/call
   * @returns Deprecation info, or null if not deprecated
   */
  checkDeprecated(api: string): DeprecatedInfo | null;

  /**
   * Compute complexity metrics for a source file.
   * @param source File content
   * @param ast Parsed AST (optional)
   * @returns Complexity metrics
   */
  computeComplexity(source: string, ast?: ASTNode): ComplexityMetrics;
}
