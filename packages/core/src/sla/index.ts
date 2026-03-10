/**
 * SLA Module — Public API
 */

export {
  SLALevel,
  SLA_TARGET_DURATIONS,
  SLA_AI_ANALYSIS,
  SLA_ACCURACY_TARGETS,
} from './types.js';

export type {
  SLAMetrics,
  SLATimeoutCheck,
} from './types.js';

export { SLATracker, parseSLALevel } from './tracker.js';
