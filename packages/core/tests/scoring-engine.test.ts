/**
 * Scoring Engine V3 — Unit Tests
 */

import { describe, it, expect } from 'vitest';
import {
  ScoringEngine,
  DIMENSIONS,
  SEVERITY_DEDUCTIONS,
  CATEGORY_DIMENSION_MAP,
  computeGrade,
} from '../src/scorer/scoring-engine.js';
import { AIDefectCategory } from '../src/types.js';
import type { UnifiedIssue, Severity } from '../src/types.js';

// ─── Helper: Create a mock UnifiedIssue ────────────────────────────

function mockIssue(overrides: Partial<UnifiedIssue> = {}): UnifiedIssue {
  return {
    detector: 'test-detector',
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

// ─── Grade Computation ─────────────────────────────────────────────

describe('computeGrade', () => {
  it('returns A+ for scores 95-100', () => {
    expect(computeGrade(100)).toBe('A+');
    expect(computeGrade(95)).toBe('A+');
  });

  it('returns A for scores 90-94', () => {
    expect(computeGrade(94)).toBe('A');
    expect(computeGrade(90)).toBe('A');
  });

  it('returns B for scores 80-89', () => {
    expect(computeGrade(89)).toBe('B');
    expect(computeGrade(80)).toBe('B');
  });

  it('returns C for scores 70-79', () => {
    expect(computeGrade(79)).toBe('C');
    expect(computeGrade(70)).toBe('C');
  });

  it('returns D for scores 60-69', () => {
    expect(computeGrade(69)).toBe('D');
    expect(computeGrade(60)).toBe('D');
  });

  it('returns F for scores below 60', () => {
    expect(computeGrade(59)).toBe('F');
    expect(computeGrade(0)).toBe('F');
  });
});

// ─── Dimension Configuration ───────────────────────────────────────

describe('DIMENSIONS', () => {
  it('has 4 dimensions that sum to 100', () => {
    const totalWeight = Object.values(DIMENSIONS).reduce((sum, d) => sum + d.weight, 0);
    expect(totalWeight).toBe(100);
  });

  it('defines correct weights', () => {
    expect(DIMENSIONS.aiFaithfulness.weight).toBe(35);
    expect(DIMENSIONS.codeFreshness.weight).toBe(25);
    expect(DIMENSIONS.contextCoherence.weight).toBe(20);
    expect(DIMENSIONS.implementationQuality.weight).toBe(20);
  });
});

// ─── Severity Deductions ───────────────────────────────────────────

describe('SEVERITY_DEDUCTIONS', () => {
  it('assigns correct deduction values', () => {
    expect(SEVERITY_DEDUCTIONS.critical).toBe(15);
    expect(SEVERITY_DEDUCTIONS.high).toBe(10);
    expect(SEVERITY_DEDUCTIONS.medium).toBe(5);
    expect(SEVERITY_DEDUCTIONS.low).toBe(2);
    expect(SEVERITY_DEDUCTIONS.info).toBe(0);
  });
});

// ─── Category → Dimension Mapping ──────────────────────────────────

describe('CATEGORY_DIMENSION_MAP', () => {
  it('maps all categories to a dimension', () => {
    for (const cat of Object.values(AIDefectCategory)) {
      expect(CATEGORY_DIMENSION_MAP[cat]).toBeDefined();
    }
  });

  it('maps hallucination to aiFaithfulness', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.HALLUCINATION]).toBe('aiFaithfulness');
  });

  it('maps stale knowledge to codeFreshness', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.STALE_KNOWLEDGE]).toBe('codeFreshness');
  });

  it('maps context loss to contextCoherence', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.CONTEXT_LOSS]).toBe('contextCoherence');
  });

  it('maps implementation-related categories to implementationQuality', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.INCOMPLETE_IMPL]).toBe('implementationQuality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.OVER_ENGINEERING]).toBe('implementationQuality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.DUPLICATION]).toBe('implementationQuality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.TYPE_SAFETY]).toBe('implementationQuality');
  });
});

// ─── ScoringEngine.score() ─────────────────────────────────────────

describe('ScoringEngine.score()', () => {
  const engine = new ScoringEngine(70);

  it('returns perfect score for no issues', () => {
    const result = engine.score([]);
    expect(result.totalScore).toBe(100);
    expect(result.grade).toBe('A+');
    expect(result.passed).toBe(true);
  });

  it('deducts from AI Faithfulness for hallucination issues', () => {
    const issues = [
      mockIssue({ severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
    ];
    const result = engine.score(issues);

    // 1 critical = 15 raw deduction on aiFaithfulness (max 35)
    // normalized = min(35, (15/100)*35) = 5.25
    // aiFaithfulness score = 35 - 5.25 = 29.75
    expect(result.dimensions.aiFaithfulness.score).toBe(29.75);
    expect(result.dimensions.aiFaithfulness.rawDeduction).toBe(15);

    // Other dimensions untouched
    expect(result.dimensions.codeFreshness.score).toBe(25);
    expect(result.dimensions.contextCoherence.score).toBe(20);
    expect(result.dimensions.implementationQuality.score).toBe(20);

    // Total: 29.75 + 25 + 20 + 20 = 94.75 → 95
    expect(result.totalScore).toBe(95);
    expect(result.grade).toBe('A+');
  });

  it('deducts from Code Freshness for stale knowledge issues', () => {
    const issues = [
      mockIssue({ severity: 'high', category: AIDefectCategory.STALE_KNOWLEDGE }),
    ];
    const result = engine.score(issues);

    // 1 high = 10 raw deduction on codeFreshness (max 25)
    // normalized = min(25, (10/100)*25) = 2.5
    expect(result.dimensions.codeFreshness.score).toBe(22.5);
    expect(result.dimensions.aiFaithfulness.score).toBe(35);
  });

  it('caps dimension deduction at max score', () => {
    // Create enough issues to exceed the dimension max
    const issues = Array.from({ length: 20 }, () =>
      mockIssue({ severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
    );
    const result = engine.score(issues);

    // 20 * 15 = 300 raw deduction → normalized = min(35, (300/100)*35) = min(35, 105) = 35
    // aiFaithfulness score = 35 - 35 = 0
    expect(result.dimensions.aiFaithfulness.score).toBe(0);
  });

  it('handles mixed severity issues', () => {
    const issues = [
      mockIssue({ severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      mockIssue({ severity: 'medium', category: AIDefectCategory.HALLUCINATION }),
      mockIssue({ severity: 'info', category: AIDefectCategory.HALLUCINATION }),
    ];
    const result = engine.score(issues);

    // raw = 15 + 5 + 0 = 20
    // normalized = min(35, (20/100)*35) = 7
    expect(result.dimensions.aiFaithfulness.rawDeduction).toBe(20);
    expect(result.dimensions.aiFaithfulness.score).toBe(28);
  });

  it('distributes issues across dimensions correctly', () => {
    const issues = [
      mockIssue({ severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      mockIssue({ severity: 'high', category: AIDefectCategory.STALE_KNOWLEDGE }),
      mockIssue({ severity: 'medium', category: AIDefectCategory.CONTEXT_LOSS }),
      mockIssue({ severity: 'low', category: AIDefectCategory.INCOMPLETE_IMPL }),
    ];
    const result = engine.score(issues);

    expect(result.dimensions.aiFaithfulness.issueCount).toBe(1);
    expect(result.dimensions.codeFreshness.issueCount).toBe(1);
    expect(result.dimensions.contextCoherence.issueCount).toBe(1);
    expect(result.dimensions.implementationQuality.issueCount).toBe(1);
  });

  it('fails when below threshold', () => {
    // Create many critical issues across all dimensions
    const issues = [
      ...Array.from({ length: 10 }, () =>
        mockIssue({ severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      ),
      ...Array.from({ length: 10 }, () =>
        mockIssue({ severity: 'critical', category: AIDefectCategory.STALE_KNOWLEDGE }),
      ),
      ...Array.from({ length: 10 }, () =>
        mockIssue({ severity: 'critical', category: AIDefectCategory.CONTEXT_LOSS }),
      ),
      ...Array.from({ length: 10 }, () =>
        mockIssue({ severity: 'critical', category: AIDefectCategory.INCOMPLETE_IMPL }),
      ),
    ];
    const result = engine.score(issues);

    expect(result.totalScore).toBeLessThan(70);
    expect(result.passed).toBe(false);
    expect(result.grade).toBe('F');
  });

  it('info severity does not deduct', () => {
    const issues = Array.from({ length: 50 }, () =>
      mockIssue({ severity: 'info', category: AIDefectCategory.HALLUCINATION }),
    );
    const result = engine.score(issues);

    expect(result.totalScore).toBe(100);
    expect(result.grade).toBe('A+');
  });
});

// ─── ScoringEngine.scoreByFile() ───────────────────────────────────

describe('ScoringEngine.scoreByFile()', () => {
  const engine = new ScoringEngine(70);

  it('groups issues by file and scores each', () => {
    const issues = [
      mockIssue({ file: 'a.ts', severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      mockIssue({ file: 'a.ts', severity: 'medium', category: AIDefectCategory.STALE_KNOWLEDGE }),
      mockIssue({ file: 'b.ts', severity: 'low', category: AIDefectCategory.CONTEXT_LOSS }),
    ];

    const fileScores = engine.scoreByFile(issues);
    expect(fileScores).toHaveLength(2);

    const aScore = fileScores.find(f => f.file === 'a.ts');
    const bScore = fileScores.find(f => f.file === 'b.ts');

    expect(aScore).toBeDefined();
    expect(bScore).toBeDefined();

    // a.ts has more severe issues → lower score
    expect(aScore!.totalScore).toBeLessThan(bScore!.totalScore);
  });

  it('returns empty array for no issues', () => {
    expect(engine.scoreByFile([])).toEqual([]);
  });
});

// ─── ScoringEngine.aggregateV3() ──────────────────────────────────

describe('ScoringEngine.aggregateV3()', () => {
  const engine = new ScoringEngine(70);

  it('returns perfect score for no issues', () => {
    const result = engine.aggregateV3([]);
    expect(result.overallScore).toBe(100);
    expect(result.grade).toBe('A+');
    expect(result.totalFiles).toBe(0);
    expect(result.passed).toBe(true);
    expect(result.timestamp).toBeDefined();
  });

  it('aggregates project-level score from all issues', () => {
    const issues = [
      mockIssue({ file: 'a.ts', severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      mockIssue({ file: 'b.ts', severity: 'high', category: AIDefectCategory.STALE_KNOWLEDGE }),
    ];

    const result = engine.aggregateV3(issues);
    expect(result.totalFiles).toBe(2);
    expect(result.issueCount).toBe(2);
    expect(result.files).toHaveLength(2);
    expect(result.overallScore).toBeLessThan(100);
  });

  it('tracks passed/failed file counts', () => {
    // Create enough issues in one file to make it fail
    const issues = [
      ...Array.from({ length: 15 }, () =>
        mockIssue({ file: 'bad.ts', severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      ),
      mockIssue({ file: 'good.ts', severity: 'info', category: AIDefectCategory.HALLUCINATION }),
    ];

    const result = engine.aggregateV3(issues);
    expect(result.totalFiles).toBe(2);

    const badFile = result.files.find(f => f.file === 'bad.ts');
    const goodFile = result.files.find(f => f.file === 'good.ts');

    expect(badFile!.passed).toBe(false);
    expect(goodFile!.passed).toBe(true);
  });
});

// ─── Legacy API Backward Compatibility ─────────────────────────────

describe('ScoringEngine (legacy API)', () => {
  const engine = new ScoringEngine(70);

  it('scoreFile() still works with old-style detector results', () => {
    const hallResult = {
      issues: [{ severity: 'error', message: 'Phantom package: foo' }],
    };

    const score = engine.scoreFile('test.ts', hallResult, null, null, null);
    expect(score.file).toBe('test.ts');
    expect(score.totalScore).toBeLessThan(100);
    expect(score.dimensions.completeness).toBeDefined();
    expect(['A', 'B', 'C', 'D', 'F']).toContain(score.grade);
  });

  it('aggregate() still works with old FileScore format', () => {
    const hallResult = { issues: [{ severity: 'error', message: 'test' }] };
    const score1 = engine.scoreFile('a.ts', hallResult, null, null, null);
    const score2 = engine.scoreFile('b.ts', null, null, null, null);

    const agg = engine.aggregate([score1, score2]);
    expect(agg.totalFiles).toBe(2);
    expect(agg.overallScore).toBeGreaterThan(0);
    expect(agg.timestamp).toBeDefined();
  });

  it('aggregate() returns perfect score for empty array', () => {
    const agg = engine.aggregate([]);
    expect(agg.overallScore).toBe(100);
    expect(agg.grade).toBe('A');
    expect(agg.passed).toBe(true);
  });
});

// ─── Custom Threshold ──────────────────────────────────────────────

describe('ScoringEngine with custom threshold', () => {
  it('uses custom threshold for pass/fail', () => {
    const strict = new ScoringEngine(95);
    const lenient = new ScoringEngine(50);

    // Create issues that will drop total to ~80-85 range
    const issues = [
      mockIssue({ severity: 'critical', category: AIDefectCategory.HALLUCINATION }),
      mockIssue({ severity: 'critical', category: AIDefectCategory.STALE_KNOWLEDGE }),
      mockIssue({ severity: 'high', category: AIDefectCategory.CONTEXT_LOSS }),
      mockIssue({ severity: 'high', category: AIDefectCategory.INCOMPLETE_IMPL }),
      mockIssue({ severity: 'medium', category: AIDefectCategory.HALLUCINATION }),
    ];

    const strictResult = strict.score(issues);
    const lenientResult = lenient.score(issues);

    // Same score, different pass/fail
    expect(strictResult.totalScore).toBe(lenientResult.totalScore);
    expect(strictResult.totalScore).toBeLessThan(95);
    expect(strictResult.totalScore).toBeGreaterThanOrEqual(50);
    expect(strictResult.passed).toBe(false);
    expect(lenientResult.passed).toBe(true);
  });
});
