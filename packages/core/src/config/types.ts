/**
 * Configuration Type Definitions
 *
 * Defines the shape of .aicv.yml configuration and related types.
 */

// ─── Main Config ───────────────────────────────────────────────────

export interface AICVConfig {
  /** License key for Portal authentication */
  license?: string;

  /** Scan settings */
  scan: ScanConfig;

  /** Scoring settings */
  scoring: ScoringConfig;

  /** AI analysis settings (Phase 4 — type definitions only) */
  ai?: AIConfig;

  /** Report settings */
  report: ReportConfig;
}

// ─── Scan Config ───────────────────────────────────────────────────

export interface ScanConfig {
  /** Glob patterns to include */
  include: string[];

  /** Glob patterns to exclude */
  exclude: string[];

  /** Languages to scan (auto-detect if empty) */
  languages: string[];

  /** SLA level for this scan */
  slaLevel: 'L1' | 'L2' | 'L3';
}

// ─── Scoring Config ────────────────────────────────────────────────

export interface ScoringConfig {
  /** Minimum passing score (default: 70) */
  threshold: number;

  /** Fail the scan when issues of this severity or above are found */
  failOn: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

// ─── AI Config (Phase 4) ──────────────────────────────────────────

export interface AILocalConfig {
  enabled: boolean;
  provider: string;
  model: string;
  endpoint: string;
}

export interface AIRemoteConfig {
  enabled: boolean;
  provider: string;
  model: string;
  apiKey: string;
}

export interface AIConfig {
  local?: AILocalConfig;
  remote?: AIRemoteConfig;
  strategy: 'local-first' | 'remote-first' | 'local-only' | 'remote-only';
}

// ─── Report Config ─────────────────────────────────────────────────

export type ReportFormatType = 'terminal' | 'json' | 'html' | 'markdown' | 'sarif';

export interface ReportConfig {
  /** Output formats */
  format: ReportFormatType[];

  /** Output directory (optional) */
  output?: string;
}
