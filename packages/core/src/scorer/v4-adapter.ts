/**
 * V4 Score Adapter
 *
 * Bridges V4 DetectorResults to V3 scoring engine.
 * Reuses V3 scoring logic (4 dimensions, 5 grades).
 *
 * @since 0.4.0
 */

import type { DetectorResult, DetectorCategory } from '../detectors/v4/types.js';
import type { UnifiedIssue, Severity } from '../types.js';
import { AIDefectCategory } from '../types.js';
import { ScoringEngine, computeGrade, type ScoreResult, type DimensionScoreV3 } from '../scorer/scoring-engine.js';

// ─── Category Mapping ───────────────────────────────────────────────

/**
 * Maps V4 DetectorCategory to V3 AIDefectCategory.
 */
const CATEGORY_MAP: Record<DetectorCategory, AIDefectCategory> = {
  'ai-faithfulness': AIDefectCategory.HALLUCINATION,
  'code-freshness': AIDefectCategory.STALE_KNOWLEDGE,
  'context-coherence': AIDefectCategory.CONTEXT_LOSS,
  'implementation': AIDefectCategory.OVER_ENGINEERING,
};

/**
 * Maps V4 detector severity to V3 Severity.
 */
const SEVERITY_MAP: Record<string, Severity> = {
  'error': 'critical',
  'warning': 'medium',
  'info': 'info',
};

// ─── Adapter Functions ──────────────────────────────────────────────

/**
 * Convert a V4 DetectorResult to V3 UnifiedIssue format.
 */
export function v4ResultToV3Issue(result: DetectorResult): UnifiedIssue {
  return {
    id: `${result.detectorId}:${result.file}:${result.line}`,
    detector: result.detectorId,
    category: CATEGORY_MAP[result.category] ?? AIDefectCategory.OVER_ENGINEERING,
    severity: SEVERITY_MAP[result.severity] ?? 'medium',
    message: result.message,
    file: result.file,
    line: result.line,
    endLine: result.endLine,
    confidence: result.confidence,
    autoFixable: false,
    detectionSource: 'static',
  };
}

/**
 * Convert an array of V4 DetectorResults to V3 UnifiedIssues.
 */
export function v4ResultsToV3Issues(results: DetectorResult[]): UnifiedIssue[] {
  return results.map(v4ResultToV3Issue);
}

// ─── V4 Score Result ─────────────────────────────────────────────────

/**
 * Score result for V4 scan.
 */
export interface V4ScoreResult {
  /** Total score (0-100) */
  totalScore: number;
  /** Letter grade */
  grade: string;
  /** Per-dimension scores */
  dimensions: {
    faithfulness: DimensionInfo;
    freshness: DimensionInfo;
    coherence: DimensionInfo;
    quality: DimensionInfo;
  };
  /** Total issue count */
  issueCount: number;
  /** Whether the score passes the threshold */
  passed: boolean;
  /** The threshold used */
  threshold: number;
}

/**
 * Score info for a single dimension.
 */
export interface DimensionInfo {
  /** Dimension name */
  name: string;
  /** Maximum possible score */
  maxScore: number;
  /** Actual score */
  score: number;
  /** Number of issues in this dimension */
  issueCount: number;
  /** Score as percentage */
  percentage: number;
}

// ─── V4 Score Adapter ────────────────────────────────────────────────

/**
 * Score V4 results using the V3 scoring engine.
 *
 * @param results - V4 DetectorResults
 * @param fileCount - Number of files scanned
 * @param threshold - Passing threshold (default: 70)
 * @returns V4ScoreResult
 */
export function scoreV4Results(
  results: DetectorResult[],
  fileCount: number,
  threshold: number = 70,
): V4ScoreResult {
  // Convert V4 results to V3 issues
  const issues = v4ResultsToV3Issues(results);

  // Use V3 scoring engine
  const engine = new ScoringEngine(threshold);
  const scoreResult = engine.score(issues);

  // Map V3 dimension scores to V4 format
  const dimensions = {
    faithfulness: mapDimension(scoreResult.dimensions.aiFaithfulness, 'AI Faithfulness'),
    freshness: mapDimension(scoreResult.dimensions.codeFreshness, 'Code Freshness'),
    coherence: mapDimension(scoreResult.dimensions.contextCoherence, 'Context Coherence'),
    quality: mapDimension(scoreResult.dimensions.implementationQuality, 'Implementation Quality'),
  };

  return {
    totalScore: scoreResult.totalScore,
    grade: scoreResult.grade,
    dimensions,
    issueCount: scoreResult.issueCount,
    passed: scoreResult.passed,
    threshold,
  };
}

/**
 * Map a V3 DimensionScoreV3 to V4 DimensionInfo.
 */
function mapDimension(dim: DimensionScoreV3, name: string): DimensionInfo {
  return {
    name,
    maxScore: dim.maxScore,
    score: dim.score,
    issueCount: dim.issueCount,
    percentage: Math.round((dim.score / dim.maxScore) * 100),
  };
}

/**
 * Compute grade from score.
 */
export { computeGrade };

// ─── Issue Counting Helpers ──────────────────────────────────────────

/**
 * Count issues by category.
 */
export function countByCategory(results: DetectorResult[]): Record<DetectorCategory, number> {
  const counts: Record<DetectorCategory, number> = {
    'ai-faithfulness': 0,
    'code-freshness': 0,
    'context-coherence': 0,
    'implementation': 0,
  };

  for (const result of results) {
    counts[result.category]++;
  }

  return counts;
}

/**
 * Count issues by severity.
 */
export function countBySeverity(results: DetectorResult[]): Record<string, number> {
  const counts: Record<string, number> = {
    error: 0,
    warning: 0,
    info: 0,
  };

  for (const result of results) {
    counts[result.severity]++;
  }

  return counts;
}

/**
 * Get summary statistics for V4 results.
 */
export function getV4ResultStats(results: DetectorResult[]): {
  total: number;
  byCategory: Record<DetectorCategory, number>;
  bySeverity: Record<string, number>;
  filesWithIssues: number;
} {
  const byCategory = countByCategory(results);
  const bySeverity = countBySeverity(results);
  const filesWithIssues = new Set(results.map(r => r.file)).size;

  return {
    total: results.length,
    byCategory,
    bySeverity,
    filesWithIssues,
  };
}
