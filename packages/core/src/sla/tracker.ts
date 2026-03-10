/**
 * SLA Tracker
 *
 * Tracks scan performance against SLA targets.
 * Provides timeout checking and metric collection.
 *
 * Usage:
 * ```ts
 * const tracker = new SLATracker(SLALevel.L2_STANDARD, 47);
 * tracker.start();
 *
 * // During scan — check if we should degrade
 * const check = tracker.checkTimeout();
 * if (check.shouldDegrade) {
 *   // Skip remaining Tier 2/3 detectors
 * }
 *
 * // After scan — collect final metrics
 * const metrics = tracker.finalize(issues, detectorsUsed, detectorsTotal);
 * ```
 */

import type { UnifiedIssue, Severity } from '../types.js';
import {
  SLALevel,
  SLA_TARGET_DURATIONS,
  SLA_AI_ANALYSIS,
  type SLAMetrics,
  type SLATimeoutCheck,
} from './types.js';

export class SLATracker {
  private startTime: number = 0;
  private level: SLALevel;
  private fileCount: number;
  private _degraded: boolean = false;
  private _degradeReason?: string;

  /**
   * @param level - SLA level for this scan
   * @param fileCount - Number of files to scan (used for scaling target duration)
   */
  constructor(level: SLALevel, fileCount: number = 100) {
    this.level = level;
    this.fileCount = Math.max(1, fileCount);
  }

  /**
   * Start the SLA timer.
   */
  start(): void {
    this.startTime = Date.now();
    this._degraded = false;
    this._degradeReason = undefined;
  }

  /**
   * Get elapsed time since start (ms).
   */
  get elapsedMs(): number {
    if (this.startTime === 0) return 0;
    return Date.now() - this.startTime;
  }

  /**
   * Calculate the target duration for the actual file count.
   * Scales linearly from the per-100-files target.
   * Minimum target is 1 second regardless of file count.
   */
  get targetDurationMs(): number {
    const baseDuration = SLA_TARGET_DURATIONS[this.level];
    return Math.max(1000, Math.ceil((this.fileCount / 100) * baseDuration));
  }

  /**
   * Check if the scan is exceeding the SLA target.
   * Returns whether degradation should occur.
   *
   * Degradation threshold: 80% of target time consumed → recommend degrading.
   * This gives detectors remaining 20% to wrap up.
   */
  checkTimeout(): SLATimeoutCheck {
    const elapsed = this.elapsedMs;
    const target = this.targetDurationMs;
    const threshold = target * 0.8; // 80% threshold

    if (elapsed >= threshold) {
      const reason = `Elapsed ${elapsed}ms exceeds 80% of target ${target}ms for SLA ${this.level}`;
      return {
        shouldDegrade: true,
        reason,
        elapsedMs: elapsed,
        targetMs: target,
      };
    }

    return {
      shouldDegrade: false,
      reason: `Within target: ${elapsed}ms / ${target}ms`,
      elapsedMs: elapsed,
      targetMs: target,
    };
  }

  /**
   * Mark this scan as degraded.
   */
  markDegraded(reason: string): void {
    this._degraded = true;
    this._degradeReason = reason;
  }

  /**
   * Collect final SLA metrics after the scan completes.
   */
  finalize(
    issues: UnifiedIssue[],
    detectorsUsed: number,
    detectorsTotal: number,
  ): SLAMetrics {
    const scanDurationMs = this.elapsedMs;
    const targetDurationMs = this.targetDurationMs;

    // Count issues by severity
    const counts = countBySeverity(issues);

    return {
      level: this.level,
      scanDurationMs,
      filesScanned: this.fileCount,
      detectorsUsed,
      detectorsTotal,
      aiAnalysis: SLA_AI_ANALYSIS[this.level],
      issuesFound: issues.length,
      criticalCount: counts.critical,
      highCount: counts.high,
      mediumCount: counts.medium,
      lowCount: counts.low,
      infoCount: counts.info,
      targetDurationMs,
      withinTarget: scanDurationMs <= targetDurationMs,
      degraded: this._degraded,
      degradeReason: this._degradeReason,
    };
  }
}

// ─── Helpers ───────────────────────────────────────────────────────

function countBySeverity(issues: UnifiedIssue[]): Record<Severity, number> {
  const counts: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const issue of issues) {
    counts[issue.severity] = (counts[issue.severity] ?? 0) + 1;
  }

  return counts;
}

// ─── SLA Level Helpers ─────────────────────────────────────────────

/**
 * Parse an SLA level string to enum value.
 */
export function parseSLALevel(value: string): SLALevel {
  const upper = value.toUpperCase();
  switch (upper) {
    case 'L1': return SLALevel.L1_FAST;
    case 'L2': return SLALevel.L2_STANDARD;
    case 'L3': return SLALevel.L3_DEEP;
    default: return SLALevel.L2_STANDARD;
  }
}
