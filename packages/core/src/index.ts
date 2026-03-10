/**
 * @ai-code-validator/core
 *
 * Core detection engine for AI-generated code quality validation.
 *
 * V3: Unified type system, multi-language support, all detectors implement
 * the Detector interface with standardized UnifiedIssue output.
 *
 * @example
 * ```ts
 * import {
 *   HallucinationDetector,
 *   LogicGapDetector,
 *   DuplicationDetector,
 *   ContextBreakDetector,
 *   ScoringEngine,
 *   LanguageRegistry,
 *   TypeScriptAdapter,
 *   type UnifiedIssue,
 *   type Detector,
 *   type FileAnalysis,
 *   AIDefectCategory,
 * } from '@ai-code-validator/core';
 *
 * // Register language adapter
 * const registry = LanguageRegistry.getInstance();
 * registry.register(new TypeScriptAdapter());
 *
 * // Create detectors (all implement Detector interface)
 * const detectors: Detector[] = [
 *   new HallucinationDetector({ projectRoot: '.' }),
 *   new LogicGapDetector(),
 *   new DuplicationDetector(),
 *   new ContextBreakDetector(),
 * ];
 *
 * // Prepare files
 * const files: FileAnalysis[] = [{
 *   path: './src/app.ts',
 *   content: source,
 *   language: 'typescript',
 * }];
 *
 * // Run all detectors
 * const allIssues: UnifiedIssue[] = [];
 * for (const detector of detectors) {
 *   allIssues.push(...await detector.detect(files));
 * }
 *
 * // Score
 * const engine = new ScoringEngine(70);
 * const score = engine.scoreFile('./src/app.ts', null, null, null, null);
 * ```
 */

// ─── V3 Unified Types ───

export {
  AIDefectCategory,
  SEVERITY_DEDUCTIONS,
  SCORING_WEIGHTS,
  CATEGORY_DIMENSION_MAP,
} from './types.js';

export type {
  Severity,
  UnifiedIssue,
  Detector,
  FileAnalysis,
  SupportedLanguage,
  Grade,
  ScoringDimension,
} from './types.js';

// ─── Multi-Language Support ───

export { LanguageRegistry } from './languages/index.js';
export { TypeScriptAdapter } from './languages/index.js';
export type {
  LanguageAdapter,
  ASTNode,
  ImportInfo,
  CallInfo,
  PackageVerifyResult,
  DeprecatedInfo,
  ComplexityMetrics,
} from './languages/index.js';

// ─── Detectors ───

export { HallucinationDetector } from './detectors/hallucination.js';
/** @deprecated Use UnifiedIssue instead */
export type { HallucinationIssue, HallucinationResult, HallucinationDetectorOptions } from './detectors/hallucination.js';

export { LogicGapDetector } from './detectors/logic-gap.js';
/** @deprecated Use UnifiedIssue instead */
export type { LogicGapIssue, LogicGapResult } from './detectors/logic-gap.js';

export { DuplicationDetector } from './detectors/duplication.js';
/** @deprecated Use UnifiedIssue instead */
export type { DuplicationIssue, DuplicationResult } from './detectors/duplication.js';

export { ContextBreakDetector } from './detectors/context-break.js';
/** @deprecated Use UnifiedIssue instead */
export type { ContextBreakIssue, ContextBreakResult } from './detectors/context-break.js';

// ─── Scorer ───

export { ScoringEngine } from './scorer/scoring-engine.js';
export type { FileScore, AggregateScore, DimensionScore } from './scorer/scoring-engine.js';

// ─── Report ───

export { ReportGenerator } from './scorer/report.js';
export type { ReportFormat } from './scorer/report.js';

// ─── AI Healer ───

export { PromptBuilder } from './ai-healer/prompt-builder.js';
export type { FixPrompt } from './ai-healer/prompt-builder.js';
