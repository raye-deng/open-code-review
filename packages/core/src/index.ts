/**
 * @ai-code-validator/core
 *
 * Core detection engine for AI-generated code quality validation.
 *
 * @example
 * ```ts
 * import { HallucinationDetector, ScoringEngine, ReportGenerator } from '@ai-code-validator/core';
 *
 * const detector = new HallucinationDetector({ projectRoot: '.' });
 * const result = detector.analyze('./src/app.ts');
 *
 * const engine = new ScoringEngine(70);
 * const score = engine.scoreFile('./src/app.ts', result, null, null, null);
 *
 * const reporter = new ReportGenerator();
 * console.log(reporter.generate(engine.aggregate([score]), 'terminal'));
 * ```
 */

// Detectors
export { HallucinationDetector } from './detectors/hallucination.js';
export type { HallucinationIssue, HallucinationResult, HallucinationDetectorOptions } from './detectors/hallucination.js';

export { LogicGapDetector } from './detectors/logic-gap.js';
export type { LogicGapIssue, LogicGapResult } from './detectors/logic-gap.js';

export { DuplicationDetector } from './detectors/duplication.js';
export type { DuplicationIssue, DuplicationResult } from './detectors/duplication.js';

export { ContextBreakDetector } from './detectors/context-break.js';
export type { ContextBreakIssue, ContextBreakResult } from './detectors/context-break.js';

// Scorer
export { ScoringEngine } from './scorer/scoring-engine.js';
export type { FileScore, AggregateScore, DimensionScore } from './scorer/scoring-engine.js';

// Report
export { ReportGenerator } from './scorer/report.js';
export type { ReportFormat } from './scorer/report.js';

// AI Healer
export { PromptBuilder } from './ai-healer/prompt-builder.js';
export type { FixPrompt } from './ai-healer/prompt-builder.js';
