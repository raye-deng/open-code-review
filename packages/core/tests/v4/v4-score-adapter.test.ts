/**
 * V4 Score Adapter Tests
 */

import { describe, it, expect } from 'vitest';
import {
  v4ResultToV3Issue,
  v4ResultsToV3Issues,
  scoreV4Results,
  computeGrade,
  countByCategory,
  countBySeverity,
  getV4ResultStats,
} from '../../src/scorer/v4-adapter.js';
import type { DetectorResult } from '../../src/detectors/v4/types.js';
import { AIDefectCategory } from '../../src/types.js';

// Helper to create a test DetectorResult
function createDetectorResult(overrides: Partial<DetectorResult> = {}): DetectorResult {
  return {
    detectorId: 'test-detector',
    severity: 'warning',
    category: 'ai-faithfulness',
    messageKey: 'detector.hallucinated-import',
    message: 'Test issue',
    file: 'test.ts',
    line: 1,
    confidence: 0.8,
    ...overrides,
  };
}

describe('V4 Score Adapter', () => {
  describe('v4ResultToV3Issue', () => {
    it('should map DetectorResult to UnifiedIssue', () => {
      const result = createDetectorResult();
      const issue = v4ResultToV3Issue(result);

      expect(issue.detector).toBe('test-detector');
      expect(issue.file).toBe('test.ts');
      expect(issue.line).toBe(1);
      expect(issue.confidence).toBe(0.8);
    });

    it('should map ai-faithfulness category', () => {
      const result = createDetectorResult({ category: 'ai-faithfulness' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.category).toBe(AIDefectCategory.HALLUCINATION);
    });

    it('should map code-freshness category', () => {
      const result = createDetectorResult({ category: 'code-freshness' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.category).toBe(AIDefectCategory.STALE_KNOWLEDGE);
    });

    it('should map context-coherence category', () => {
      const result = createDetectorResult({ category: 'context-coherence' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.category).toBe(AIDefectCategory.CONTEXT_LOSS);
    });

    it('should map implementation category', () => {
      const result = createDetectorResult({ category: 'implementation' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.category).toBe(AIDefectCategory.OVER_ENGINEERING);
    });

    it('should map error severity to critical', () => {
      const result = createDetectorResult({ severity: 'error' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.severity).toBe('critical');
    });

    it('should map warning severity to medium', () => {
      const result = createDetectorResult({ severity: 'warning' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.severity).toBe('medium');
    });

    it('should map info severity to info', () => {
      const result = createDetectorResult({ severity: 'info' });
      const issue = v4ResultToV3Issue(result);
      expect(issue.severity).toBe('info');
    });
  });

  describe('v4ResultsToV3Issues', () => {
    it('should convert array of results', () => {
      const results: DetectorResult[] = [
        createDetectorResult({ file: 'a.ts' }),
        createDetectorResult({ file: 'b.ts' }),
        createDetectorResult({ file: 'c.ts' }),
      ];

      const issues = v4ResultsToV3Issues(results);

      expect(issues).toHaveLength(3);
      expect(issues[0].file).toBe('a.ts');
      expect(issues[1].file).toBe('b.ts');
      expect(issues[2].file).toBe('c.ts');
    });

    it('should return empty array for empty input', () => {
      const issues = v4ResultsToV3Issues([]);
      expect(issues).toHaveLength(0);
    });
  });

  describe('scoreV4Results', () => {
    it('should return perfect score for empty results', () => {
      const score = scoreV4Results([], 1);

      expect(score.totalScore).toBe(100);
      expect(score.grade).toBe('A+');
      expect(score.issueCount).toBe(0);
      expect(score.passed).toBe(true);
    });

    it('should calculate score with mixed categories', () => {
      const results: DetectorResult[] = [
        createDetectorResult({ category: 'ai-faithfulness', severity: 'error' }),
        createDetectorResult({ category: 'code-freshness', severity: 'warning' }),
        createDetectorResult({ category: 'context-coherence', severity: 'warning' }),
        createDetectorResult({ category: 'implementation', severity: 'info' }),
      ];

      const score = scoreV4Results(results, 1);

      expect(score.totalScore).toBeLessThan(100);
      expect(score.issueCount).toBe(4);
      expect(score.dimensions).toBeDefined();
    });

    it('should include dimension scores', () => {
      const results: DetectorResult[] = [
        createDetectorResult({ category: 'ai-faithfulness', severity: 'error' }),
      ];

      const score = scoreV4Results(results, 1);

      expect(score.dimensions.faithfulness).toBeDefined();
      expect(score.dimensions.freshness).toBeDefined();
      expect(score.dimensions.coherence).toBeDefined();
      expect(score.dimensions.quality).toBeDefined();
    });

    it('should calculate dimension percentages', () => {
      const score = scoreV4Results([], 1);

      expect(score.dimensions.faithfulness.percentage).toBe(100);
      expect(score.dimensions.freshness.percentage).toBe(100);
      expect(score.dimensions.coherence.percentage).toBe(100);
      expect(score.dimensions.quality.percentage).toBe(100);
    });

    it('should respect threshold parameter', () => {
      // Create issues that would result in score < 70
      const results: DetectorResult[] = Array(10).fill(null).map(() =>
        createDetectorResult({ category: 'ai-faithfulness', severity: 'error' })
      );

      const score70 = scoreV4Results(results, 1, 70);
      const score90 = scoreV4Results(results, 1, 90);

      // Both might fail, but threshold should be set correctly
      expect(score70.threshold).toBe(70);
      expect(score90.threshold).toBe(90);
    });

    it('should return grade based on score', () => {
      const score = scoreV4Results([], 1);
      expect(['A+', 'A', 'B', 'C', 'D', 'F']).toContain(score.grade);
    });
  });

  describe('computeGrade', () => {
    it('should return A+ for 95-100', () => {
      expect(computeGrade(100)).toBe('A+');
      expect(computeGrade(95)).toBe('A+');
    });

    it('should return A for 90-94', () => {
      expect(computeGrade(94)).toBe('A');
      expect(computeGrade(90)).toBe('A');
    });

    it('should return B for 80-89', () => {
      expect(computeGrade(89)).toBe('B');
      expect(computeGrade(80)).toBe('B');
    });

    it('should return C for 70-79', () => {
      expect(computeGrade(79)).toBe('C');
      expect(computeGrade(70)).toBe('C');
    });

    it('should return D for 60-69', () => {
      expect(computeGrade(69)).toBe('D');
      expect(computeGrade(60)).toBe('D');
    });

    it('should return F for 0-59', () => {
      expect(computeGrade(59)).toBe('F');
      expect(computeGrade(0)).toBe('F');
    });
  });

  describe('countByCategory', () => {
    it('should count issues by category', () => {
      const results: DetectorResult[] = [
        createDetectorResult({ category: 'ai-faithfulness' }),
        createDetectorResult({ category: 'ai-faithfulness' }),
        createDetectorResult({ category: 'code-freshness' }),
        createDetectorResult({ category: 'implementation' }),
      ];

      const counts = countByCategory(results);

      expect(counts['ai-faithfulness']).toBe(2);
      expect(counts['code-freshness']).toBe(1);
      expect(counts['context-coherence']).toBe(0);
      expect(counts['implementation']).toBe(1);
    });

    it('should return zeros for empty results', () => {
      const counts = countByCategory([]);

      expect(counts['ai-faithfulness']).toBe(0);
      expect(counts['code-freshness']).toBe(0);
      expect(counts['context-coherence']).toBe(0);
      expect(counts['implementation']).toBe(0);
    });
  });

  describe('countBySeverity', () => {
    it('should count issues by severity', () => {
      const results: DetectorResult[] = [
        createDetectorResult({ severity: 'error' }),
        createDetectorResult({ severity: 'error' }),
        createDetectorResult({ severity: 'warning' }),
        createDetectorResult({ severity: 'info' }),
      ];

      const counts = countBySeverity(results);

      expect(counts['error']).toBe(2);
      expect(counts['warning']).toBe(1);
      expect(counts['info']).toBe(1);
    });
  });

  describe('getV4ResultStats', () => {
    it('should return comprehensive stats', () => {
      const results: DetectorResult[] = [
        createDetectorResult({ file: 'a.ts', category: 'ai-faithfulness', severity: 'error' }),
        createDetectorResult({ file: 'a.ts', category: 'code-freshness', severity: 'warning' }),
        createDetectorResult({ file: 'b.ts', category: 'implementation', severity: 'info' }),
      ];

      const stats = getV4ResultStats(results);

      expect(stats.total).toBe(3);
      expect(stats.byCategory['ai-faithfulness']).toBe(1);
      expect(stats.bySeverity['error']).toBe(1);
      expect(stats.filesWithIssues).toBe(2);
    });

    it('should handle empty results', () => {
      const stats = getV4ResultStats([]);

      expect(stats.total).toBe(0);
      expect(stats.filesWithIssues).toBe(0);
    });
  });
});
