/**
 * Open Code Review V4 — Intermediate Representation Module
 *
 * Exports all IR types and helper functions.
 *
 * @since 0.4.0
 */

export type {
  CodeUnit,
  CodeUnitKind,
  SupportedLanguage as SupportedLanguageV4,
  SourceLocation,
  ImportInfo as ImportInfoV4,
  CallInfo as CallInfoV4,
  ComplexityMetrics as ComplexityMetricsV4,
  SymbolDef,
  SymbolRef,
} from './types.js';

export { createCodeUnit, emptyComplexity } from './types.js';
