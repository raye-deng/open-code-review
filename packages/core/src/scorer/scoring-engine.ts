/**
 * Scoring Engine
 *
 * Calculates a composite quality score (0-100) for AI-generated code.
 *
 * Scoring dimensions (total: 100):
 * - Code Completeness (30): No hallucinated variables/functions/packages
 * - Logic Coherence   (25): No logic gaps, meaningful control flow
 * - Architecture Consistency (25): Consistent style and patterns
 * - Code Conciseness  (20): No obvious duplication or redundancy
 */

import type { HallucinationResult } from '../detectors/hallucination.js';
import type { LogicGapResult } from '../detectors/logic-gap.js';
import type { DuplicationResult } from '../detectors/duplication.js';
import type { ContextBreakResult } from '../detectors/context-break.js';

/** Individual dimension score */
export interface DimensionScore {
  name: string;
  maxScore: number;
  score: number;
  issueCount: number;
  details: string[];
}

/** Overall quality report for a single file */
export interface FileScore {
  file: string;
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  dimensions: {
    completeness: DimensionScore;
    coherence: DimensionScore;
    consistency: DimensionScore;
    conciseness: DimensionScore;
  };
  passed: boolean;
}

/** Aggregate report across all files */
export interface AggregateScore {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  totalFiles: number;
  passedFiles: number;
  failedFiles: number;
  files: FileScore[];
  passed: boolean;
  timestamp: string;
}

/** Score thresholds for grading */
function computeGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/** Weight configuration */
const WEIGHTS = {
  completeness: 30,
  coherence: 25,
  consistency: 25,
  conciseness: 20,
} as const;

/** Per-issue deductions */
const DEDUCTIONS = {
  error: 10,
  warning: 3,
} as const;

export class ScoringEngine {
  private threshold: number;

  constructor(threshold: number = 70) {
    this.threshold = threshold;
  }

  /**
   * Score a single file based on detector results
   */
  scoreFile(
    filePath: string,
    hallucination: HallucinationResult | null,
    logicGap: LogicGapResult | null,
    duplication: DuplicationResult | null,
    contextBreak: ContextBreakResult | null,
  ): FileScore {
    // Completeness dimension (hallucination)
    const completeness = this.scoreDimension(
      'Code Completeness',
      WEIGHTS.completeness,
      hallucination?.issues ?? [],
    );

    // Coherence dimension (logic gaps)
    const coherence = this.scoreDimension(
      'Logic Coherence',
      WEIGHTS.coherence,
      logicGap?.issues ?? [],
    );

    // Consistency dimension (context breaks)
    const consistency = this.scoreDimension(
      'Architecture Consistency',
      WEIGHTS.consistency,
      contextBreak?.issues ?? [],
    );

    // Conciseness dimension (duplication)
    const conciseness = this.scoreDimension(
      'Code Conciseness',
      WEIGHTS.conciseness,
      duplication?.issues ?? [],
    );

    const totalScore = Math.round(
      completeness.score + coherence.score + consistency.score + conciseness.score,
    );

    return {
      file: filePath,
      totalScore,
      grade: computeGrade(totalScore),
      dimensions: {
        completeness,
        coherence,
        consistency,
        conciseness,
      },
      passed: totalScore >= this.threshold,
    };
  }

  /**
   * Score a single dimension based on issues found
   */
  private scoreDimension(
    name: string,
    maxScore: number,
    issues: Array<{ severity: string; message: string }>,
  ): DimensionScore {
    let deduction = 0;
    const details: string[] = [];

    for (const issue of issues) {
      const amount = issue.severity === 'error' ? DEDUCTIONS.error : DEDUCTIONS.warning;
      deduction += amount;
      details.push(issue.message);
    }

    // Normalize deduction to the max score of this dimension
    const normalizedDeduction = Math.min(maxScore, (deduction / 100) * maxScore);
    const score = Math.round((maxScore - normalizedDeduction) * 100) / 100;

    return {
      name,
      maxScore,
      score: Math.max(0, score),
      issueCount: issues.length,
      details: details.slice(0, 10), // Top 10 details
    };
  }

  /**
   * Aggregate scores across multiple files
   */
  aggregate(fileScores: FileScore[]): AggregateScore {
    if (fileScores.length === 0) {
      return {
        overallScore: 100,
        grade: 'A',
        totalFiles: 0,
        passedFiles: 0,
        failedFiles: 0,
        files: [],
        passed: true,
        timestamp: new Date().toISOString(),
      };
    }

    const overallScore = Math.round(
      fileScores.reduce((sum, f) => sum + f.totalScore, 0) / fileScores.length,
    );

    const passedFiles = fileScores.filter(f => f.passed).length;

    return {
      overallScore,
      grade: computeGrade(overallScore),
      totalFiles: fileScores.length,
      passedFiles,
      failedFiles: fileScores.length - passedFiles,
      files: fileScores,
      passed: overallScore >= this.threshold,
      timestamp: new Date().toISOString(),
    };
  }
}

export default ScoringEngine;
