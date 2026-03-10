/**
 * SLA Tracker — Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SLATracker, parseSLALevel } from '../src/sla/tracker.js';
import {
  SLALevel,
  SLA_TARGET_DURATIONS,
  SLA_AI_ANALYSIS,
} from '../src/sla/types.js';
import { AIDefectCategory } from '../src/types.js';
import type { UnifiedIssue } from '../src/types.js';

// ─── Helper ────────────────────────────────────────────────────────

function mockIssue(overrides: Partial<UnifiedIssue> = {}): UnifiedIssue {
  return {
    detector: 'test',
    type: 'test-type',
    severity: 'medium',
    file: 'test.ts',
    line: 1,
    message: 'Test issue',
    category: AIDefectCategory.HALLUCINATION,
    attribution: { rootCause: 'test', frequency: 'common' },
    autoFixable: false,
    fixEffort: 'small',
    confidence: 0.9,
    source: 'static',
    ...overrides,
  };
}

// ─── SLA Level Constants ───────────────────────────────────────────

describe('SLA Level Constants', () => {
  it('defines correct target durations', () => {
    expect(SLA_TARGET_DURATIONS[SLALevel.L1_FAST]).toBe(10_000);
    expect(SLA_TARGET_DURATIONS[SLALevel.L2_STANDARD]).toBe(30_000);
    expect(SLA_TARGET_DURATIONS[SLALevel.L3_DEEP]).toBe(120_000);
  });

  it('defines correct AI analysis types', () => {
    expect(SLA_AI_ANALYSIS[SLALevel.L1_FAST]).toBe('none');
    expect(SLA_AI_ANALYSIS[SLALevel.L2_STANDARD]).toBe('local');
    expect(SLA_AI_ANALYSIS[SLALevel.L3_DEEP]).toBe('local+remote');
  });
});

// ─── parseSLALevel ─────────────────────────────────────────────────

describe('parseSLALevel', () => {
  it('parses valid levels', () => {
    expect(parseSLALevel('L1')).toBe(SLALevel.L1_FAST);
    expect(parseSLALevel('L2')).toBe(SLALevel.L2_STANDARD);
    expect(parseSLALevel('L3')).toBe(SLALevel.L3_DEEP);
  });

  it('is case insensitive', () => {
    expect(parseSLALevel('l1')).toBe(SLALevel.L1_FAST);
    expect(parseSLALevel('l2')).toBe(SLALevel.L2_STANDARD);
  });

  it('defaults to L2 for invalid input', () => {
    expect(parseSLALevel('invalid')).toBe(SLALevel.L2_STANDARD);
    expect(parseSLALevel('')).toBe(SLALevel.L2_STANDARD);
  });
});

// ─── SLATracker construction ───────────────────────────────────────

describe('SLATracker', () => {
  it('calculates target duration scaled by file count', () => {
    // L2: 30s/100files → 47 files = 14.1s → 15s (ceil)
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 47);
    expect(tracker.targetDurationMs).toBe(Math.ceil((47 / 100) * 30_000));
  });

  it('enforces minimum target of 1000ms', () => {
    const tracker = new SLATracker(SLALevel.L1_FAST, 1);
    expect(tracker.targetDurationMs).toBeGreaterThanOrEqual(1000);
  });

  it('handles default fileCount of 100', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD);
    expect(tracker.targetDurationMs).toBe(30_000);
  });

  it('reports 0 elapsed before start', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD);
    expect(tracker.elapsedMs).toBe(0);
  });
});

// ─── SLATracker timing ────────────────────────────────────────────

describe('SLATracker timing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks elapsed time after start', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 100);
    tracker.start();

    vi.advanceTimersByTime(5000);
    expect(tracker.elapsedMs).toBe(5000);
  });

  it('checkTimeout returns false when within target', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 100);
    // target = 30s, 80% threshold = 24s
    tracker.start();

    vi.advanceTimersByTime(10_000); // 10s — well within target
    const check = tracker.checkTimeout();
    expect(check.shouldDegrade).toBe(false);
    expect(check.elapsedMs).toBe(10_000);
    expect(check.targetMs).toBe(30_000);
  });

  it('checkTimeout returns true when 80% of target consumed', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 100);
    // target = 30s, 80% threshold = 24s
    tracker.start();

    vi.advanceTimersByTime(25_000); // 25s — exceeds 80% threshold
    const check = tracker.checkTimeout();
    expect(check.shouldDegrade).toBe(true);
    expect(check.elapsedMs).toBe(25_000);
  });

  it('checkTimeout works for L1 (fast scan)', () => {
    const tracker = new SLATracker(SLALevel.L1_FAST, 100);
    // target = 10s, 80% threshold = 8s
    tracker.start();

    vi.advanceTimersByTime(9_000);
    expect(tracker.checkTimeout().shouldDegrade).toBe(true);
  });
});

// ─── SLATracker.finalize() ─────────────────────────────────────────

describe('SLATracker.finalize()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('collects comprehensive metrics', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 50);
    tracker.start();

    vi.advanceTimersByTime(8_000);

    const issues: UnifiedIssue[] = [
      mockIssue({ severity: 'critical' }),
      mockIssue({ severity: 'high' }),
      mockIssue({ severity: 'high' }),
      mockIssue({ severity: 'medium' }),
      mockIssue({ severity: 'low' }),
      mockIssue({ severity: 'info' }),
    ];

    const metrics = tracker.finalize(issues, 7, 9);

    expect(metrics.level).toBe(SLALevel.L2_STANDARD);
    expect(metrics.scanDurationMs).toBe(8_000);
    expect(metrics.filesScanned).toBe(50);
    expect(metrics.detectorsUsed).toBe(7);
    expect(metrics.detectorsTotal).toBe(9);
    expect(metrics.aiAnalysis).toBe('local');
    expect(metrics.issuesFound).toBe(6);
    expect(metrics.criticalCount).toBe(1);
    expect(metrics.highCount).toBe(2);
    expect(metrics.mediumCount).toBe(1);
    expect(metrics.lowCount).toBe(1);
    expect(metrics.infoCount).toBe(1);
    expect(metrics.withinTarget).toBe(true);
    expect(metrics.degraded).toBe(false);
    expect(metrics.degradeReason).toBeUndefined();
  });

  it('marks as not within target when exceeded', () => {
    const tracker = new SLATracker(SLALevel.L1_FAST, 100);
    // target = 10s
    tracker.start();

    vi.advanceTimersByTime(15_000);

    const metrics = tracker.finalize([], 5, 5);
    expect(metrics.withinTarget).toBe(false);
  });

  it('tracks degradation', () => {
    const tracker = new SLATracker(SLALevel.L3_DEEP, 100);
    tracker.start();

    tracker.markDegraded('Tier 2 skipped due to timeout');

    vi.advanceTimersByTime(5_000);

    const metrics = tracker.finalize([], 4, 9);
    expect(metrics.degraded).toBe(true);
    expect(metrics.degradeReason).toBe('Tier 2 skipped due to timeout');
  });

  it('handles empty issues array', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 10);
    tracker.start();
    vi.advanceTimersByTime(100);

    const metrics = tracker.finalize([], 3, 3);
    expect(metrics.issuesFound).toBe(0);
    expect(metrics.criticalCount).toBe(0);
    expect(metrics.highCount).toBe(0);
    expect(metrics.mediumCount).toBe(0);
    expect(metrics.lowCount).toBe(0);
    expect(metrics.infoCount).toBe(0);
  });
});

// ─── SLATracker.markDegraded() ─────────────────────────────────────

describe('SLATracker.markDegraded()', () => {
  it('marks degraded state with reason', () => {
    const tracker = new SLATracker(SLALevel.L2_STANDARD, 100);
    tracker.start();
    tracker.markDegraded('AI timeout');

    const metrics = tracker.finalize([], 5, 9);
    expect(metrics.degraded).toBe(true);
    expect(metrics.degradeReason).toBe('AI timeout');
  });
});
