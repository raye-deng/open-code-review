/**
 * SLA Type Definitions
 *
 * Defines SLA levels, metrics, and target thresholds for
 * AI Code Validator scanning performance.
 */

// ─── SLA Level ─────────────────────────────────────────────────────

export enum SLALevel {
  /** ≤10s/100files, no AI, ≥80% accuracy */
  L1_FAST = 'L1',
  /** ≤30s/100files, optional local AI, ≥85% accuracy */
  L2_STANDARD = 'L2',
  /** ≤120s/100files, local+remote AI, ≥90% accuracy */
  L3_DEEP = 'L3',
}

// ─── SLA Target Durations ──────────────────────────────────────────

/**
 * Target duration per 100 files for each SLA level (in milliseconds).
 */
export const SLA_TARGET_DURATIONS: Record<SLALevel, number> = {
  [SLALevel.L1_FAST]: 10_000,     // 10s / 100 files
  [SLALevel.L2_STANDARD]: 30_000, // 30s / 100 files
  [SLALevel.L3_DEEP]: 120_000,    // 120s / 100 files
};

/**
 * AI analysis type for each SLA level.
 */
export const SLA_AI_ANALYSIS: Record<SLALevel, 'none' | 'local' | 'local+remote'> = {
  [SLALevel.L1_FAST]: 'none',
  [SLALevel.L2_STANDARD]: 'local',
  [SLALevel.L3_DEEP]: 'local+remote',
};

/**
 * Target accuracy for each SLA level.
 */
export const SLA_ACCURACY_TARGETS: Record<SLALevel, number> = {
  [SLALevel.L1_FAST]: 0.80,
  [SLALevel.L2_STANDARD]: 0.85,
  [SLALevel.L3_DEEP]: 0.90,
};

// ─── SLA Metrics ───────────────────────────────────────────────────

export interface SLAMetrics {
  /** SLA level used for this scan */
  level: SLALevel;

  /** Total scan duration in milliseconds */
  scanDurationMs: number;

  /** Number of files scanned */
  filesScanned: number;

  /** Number of detectors that actually ran */
  detectorsUsed: number;

  /** Total number of available detectors */
  detectorsTotal: number;

  /** Type of AI analysis used */
  aiAnalysis: 'none' | 'local' | 'local+remote';

  /** Total issues found */
  issuesFound: number;

  /** Issue counts by severity */
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;

  /** Target duration for the file count (scaled from per-100-files target) */
  targetDurationMs: number;

  /** Whether scan completed within target duration */
  withinTarget: boolean;

  /** Whether the scan was degraded due to timeout */
  degraded: boolean;

  /** Reason for degradation (if any) */
  degradeReason?: string;
}

// ─── SLA Check Result ──────────────────────────────────────────────

export interface SLATimeoutCheck {
  /** Whether the current scan should degrade to a lower tier */
  shouldDegrade: boolean;
  /** Human-readable reason */
  reason: string;
  /** Elapsed time in ms */
  elapsedMs: number;
  /** Target time in ms */
  targetMs: number;
}
