/**
 * AI Code Validator — Detector Registry
 *
 * All detectors are registered here and exposed for the scoring engine.
 *
 * V3: All detectors implement the unified Detector interface.
 * Legacy types are still exported for backward compatibility.
 *
 * Detectors (9 total):
 * - HallucinationDetector (v0.2.0) — phantom packages & function references
 * - LogicGapDetector (v0.2.0) — empty catch, TODO, unreachable code
 * - DuplicationDetector (v0.2.0) — code duplication patterns
 * - ContextBreakDetector (v0.2.0) — naming/style inconsistencies
 * - StaleAPIDetector (v0.3.0) — deprecated/outdated API usage
 * - SecurityPatternDetector (v0.3.0) — security anti-patterns
 * - OverEngineeringDetector (v0.3.0) — code complexity issues
 * - DeepHallucinationDetector (v0.3.0) — package existence verification
 * - TypeSafetyDetector (v0.3.0) — TypeScript type safety issues
 */

// ─── Original Detectors (v0.2.0, upgraded to V3 interface) ───

export { HallucinationDetector } from './hallucination.js';
export type { HallucinationIssue, HallucinationResult, HallucinationDetectorOptions } from './hallucination.js';

export { LogicGapDetector } from './logic-gap.js';
export type { LogicGapIssue, LogicGapResult } from './logic-gap.js';

export { DuplicationDetector } from './duplication.js';
export type { DuplicationIssue, DuplicationResult } from './duplication.js';

export { ContextBreakDetector } from './context-break.js';
export type { ContextBreakIssue, ContextBreakResult } from './context-break.js';

// ─── New Detectors (v0.3.0) ───

export { StaleAPIDetector } from './stale-api.js';
export type { DeprecatedAPIEntry } from './stale-api.js';

export { SecurityPatternDetector } from './security-pattern.js';

export { OverEngineeringDetector } from './over-engineering.js';

export { DeepHallucinationDetector } from './deep-hallucination.js';

export { TypeSafetyDetector } from './type-safety.js';

// ─── AI Detector (Tier 3, v0.3.0) ───

export { AIDetector } from './ai-detector.js';
