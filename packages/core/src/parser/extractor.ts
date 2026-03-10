/**
 * Open Code Review V4 — Language Extractor Interface
 *
 * Each supported language implements a LanguageExtractor that converts
 * a tree-sitter CST into the unified CodeUnit IR.
 *
 * @since 0.4.0
 */

import type Parser from 'web-tree-sitter';
import type { CodeUnit, SupportedLanguage } from '../ir/types.js';

/**
 * Interface for language-specific CST → IR extractors.
 *
 * Each language implements this interface to extract CodeUnits from
 * a tree-sitter parse tree. This is the ONLY place where language-specific
 * CST node types should appear.
 */
export interface LanguageExtractor {
  /** The language this extractor handles */
  readonly language: SupportedLanguage;

  /**
   * Extract CodeUnits from a tree-sitter parse tree.
   *
   * @param tree - The tree-sitter parse tree (CST)
   * @param filePath - Relative file path (used as part of CodeUnit IDs)
   * @param source - Original source code string
   * @returns Array of CodeUnits extracted from the tree
   */
  extract(tree: Parser.Tree, filePath: string, source: string): CodeUnit[];
}
