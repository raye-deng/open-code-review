/**
 * Scanner Module — V4 Scan Orchestrator
 *
 * Provides the V4Scanner which orchestrates parsing, detection, and scoring.
 *
 * @since 0.4.0
 */

export {
  V4Scanner,
  createV4Scanner,
  DEFAULT_INCLUDE_PATTERNS,
  DEFAULT_EXCLUDE_PATTERNS,
  type V4ScanConfig,
  type V4ScanResult,
  type SLALevel,
} from './v4-scanner.js';
