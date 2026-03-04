/**
 * AI Code Validator — Detector Registry
 *
 * All detectors are registered here and exposed for the scoring engine.
 */

export { HallucinationDetector } from './hallucination.js';
export type { HallucinationIssue, HallucinationResult, HallucinationDetectorOptions } from './hallucination.js';

export { LogicGapDetector } from './logic-gap.js';
export type { LogicGapIssue, LogicGapResult } from './logic-gap.js';

export { DuplicationDetector } from './duplication.js';
export type { DuplicationIssue, DuplicationResult } from './duplication.js';

export { ContextBreakDetector } from './context-break.js';
export type { ContextBreakIssue, ContextBreakResult } from './context-break.js';
