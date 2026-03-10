/**
 * Reporter Type Definitions
 *
 * Types for the unified report generation system.
 * Supports multiple output formats: terminal, JSON, HTML, Markdown, SARIF.
 *
 * @since 0.3.0
 */

import type { AggregateScoreV3 } from '../scorer/scoring-engine.js';
import type { UnifiedIssue } from '../types.js';
import type { SLAMetrics } from '../sla/types.js';

// ─── Report Format ─────────────────────────────────────────────────

export type ReportFormat = 'terminal' | 'json' | 'html' | 'markdown' | 'sarif';

// ─── Report Options ────────────────────────────────────────────────

export interface ReportOptions {
  /** Output format */
  format: ReportFormat;
  /** Output directory for file-based reports */
  outputDir?: string;
  /** Whether to include source code snippets */
  includeSource?: boolean;
  /** Whether to include SLA metrics panel */
  includeSLA?: boolean;
  /** Theme for HTML report */
  theme?: 'light' | 'dark';
}

// ─── Report Data ───────────────────────────────────────────────────

export interface ReportData {
  /** Project name */
  projectName: string;
  /** Scan date (ISO string) */
  scanDate: string;
  /** Aggregate score result */
  score: AggregateScoreV3;
  /** All detected issues */
  issues: UnifiedIssue[];
  /** Optional SLA metrics */
  sla?: SLAMetrics;
  /** Number of files scanned */
  filesScanned: number;
  /** Languages detected in the project */
  languages: string[];
  /** Total scan duration in milliseconds */
  duration: number;
}
