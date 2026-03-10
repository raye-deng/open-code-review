/**
 * V4 Detector Module — AI-unique detectors operating on CodeUnit IR.
 *
 * V4 keeps only detectors that target AI-specific code quality issues:
 * - HallucinatedImportDetector: Detects imports of non-existent packages
 * - StaleAPIDetector: Detects deprecated/outdated API usage
 * - ContextCoherenceDetector: Detects AI context window inconsistencies
 * - OverEngineeringDetector: Detects over-engineered code patterns
 * - SecurityPatternDetector: Detects security anti-patterns common in AI code
 *
 * Traditional lint concerns (duplication, type safety) are excluded.
 *
 * @since 0.4.0
 */

// Types
export type {
  V4Detector,
  DetectorResult as V4DetectorResult,
  DetectorCategory,
  DetectorContext,
} from './types.js';

// Detectors
export { HallucinatedImportDetector } from './hallucinated-import.js';
export { StaleAPIDetector } from './stale-api.js';
export { ContextCoherenceDetector } from './context-coherence.js';
export { OverEngineeringDetector } from './over-engineering.js';
export { SecurityPatternDetector } from './security-pattern.js';

// ─── Factory ───────────────────────────────────────────────────────

import type { V4Detector } from './types.js';
import { HallucinatedImportDetector } from './hallucinated-import.js';
import { StaleAPIDetector } from './stale-api.js';
import { ContextCoherenceDetector } from './context-coherence.js';
import { OverEngineeringDetector } from './over-engineering.js';
import { SecurityPatternDetector } from './security-pattern.js';

/**
 * Create all V4 detectors with default configuration.
 *
 * @returns Array of all V4 detector instances
 */
export function createV4Detectors(): V4Detector[] {
  return [
    new HallucinatedImportDetector(),
    new StaleAPIDetector(),
    new ContextCoherenceDetector(),
    new OverEngineeringDetector(),
    new SecurityPatternDetector(),
  ];
}
