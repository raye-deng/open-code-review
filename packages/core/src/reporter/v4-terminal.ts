/**
 * V4 Terminal Reporter
 *
 * Generates human-readable terminal output for V4 scan results.
 * Uses i18n for all user-visible strings.
 *
 * @since 0.4.0
 */

import type { I18nProvider } from '../i18n/index.js';
import type { V4ScanResult } from '../scanner/v4-scanner.js';
import type { V4ScoreResult } from '../scorer/v4-adapter.js';
import type { DetectorResult, DetectorCategory } from '../detectors/v4/types.js';

// ─── Types ──────────────────────────────────────────────────────────

export interface V4TerminalReportOptions {
  /** Whether to include detailed per-file breakdown */
  includeFiles?: boolean;
  /** Max issues to show per file */
  maxIssuesPerFile?: number;
  /** Whether to colorize output */
  colorize?: boolean;
}

// ─── V4 Terminal Reporter ────────────────────────────────────────────

/**
 * Terminal reporter for V4 results.
 * Uses i18n for all user-visible strings.
 *
 * @example
 * ```ts
 * const reporter = new V4TerminalReporter(i18n);
 * const output = reporter.render(scanResult, scoreResult);
 * console.log(output);
 * ```
 */
export class V4TerminalReporter {
  constructor(
    private i18n: I18nProvider,
    private options: V4TerminalReportOptions = {},
  ) {}

  /**
   * Render the scan result to a terminal-friendly string.
   */
  render(result: V4ScanResult, score?: V4ScoreResult): string {
    const lines: string[] = [];
    const { t } = this.i18n;

    // Header
    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push('║           Open Code Review V4 — Quality Report              ║');
    lines.push('╚══════════════════════════════════════════════════════════════╝');
    lines.push('');

    // Project info
    lines.push(`  ${t('report.project', { name: result.projectRoot })}`);
    lines.push(`  ${t('report.date', { date: new Date().toISOString() })}`);
    lines.push(`  SLA: ${t(`sla.${result.sla}`)}`);
    lines.push('');

    // Summary
    if (result.issues.length === 0) {
      lines.push(`  ✅ ${t('report.noIssues')}`);
    } else {
      lines.push(`  📊 ${t('report.summary', { total: String(result.issues.length), files: String(result.files.length) })}`);
    }
    lines.push('');

    // Score
    if (score) {
      lines.push(`  ${t('report.score', { score: String(score.totalScore) })}  ${this.gradeEmoji(score.grade)} ${score.grade}`);
      lines.push(`  ${t('report.threshold', { threshold: String(score.threshold) })}`);
      lines.push(`  Status: ${score.passed ? `✅ ${t('report.status.passed')}` : `❌ ${t('report.status.failed')}`}`);
      lines.push('');
    }

    // Files and languages
    lines.push(`  ${t('report.filesScanned', { count: String(result.files.length) })}`);
    lines.push(`  ${t('report.languages', { languages: result.languages.join(', ') || 'N/A' })}`);
    lines.push(`  ${t('report.duration', { duration: this.formatDuration(result.durationMs) })}`);
    lines.push('');

    // Stage timing
    lines.push('  ── Stage Timing ──');
    lines.push(`    Discovery:  ${result.stages.discovery}ms`);
    lines.push(`    Parsing:    ${result.stages.parsing}ms`);
    lines.push(`    Detection:  ${result.stages.detection}ms`);
    if (result.stages.ai) {
      lines.push(`    AI:         ${result.stages.ai}ms`);
    }
    lines.push('');

    // Dimension scores
    if (score) {
      lines.push('  ── Scoring Dimensions ──');
      lines.push('');
      lines.push(this.formatDimensionBar('faithfulness', score.dimensions.faithfulness));
      lines.push(this.formatDimensionBar('freshness', score.dimensions.freshness));
      lines.push(this.formatDimensionBar('coherence', score.dimensions.coherence));
      lines.push(this.formatDimensionBar('quality', score.dimensions.quality));
      lines.push('');
    }

    // Issues by category
    if (result.issues.length > 0) {
      lines.push('  ── Issues by Category ──');
      lines.push('');
      const byCategory = this.groupByCategory(result.issues);
      for (const [category, issues] of Object.entries(byCategory)) {
        const dimKey = this.categoryToDimensionKey(category as DetectorCategory);
        lines.push(`    ${t(`score.dimension.${dimKey}`)}: ${issues.length}`);
      }
      lines.push('');
    }

    // Per-file details (if enabled)
    if (this.options.includeFiles !== false && result.issues.length > 0) {
      lines.push('  ── File Details ──');
      lines.push('');

      const byFile = this.groupByFile(result.issues);
      const maxPerFile = this.options.maxIssuesPerFile ?? 10;

      for (const [file, issues] of Object.entries(byFile)) {
        lines.push(`  ─── ${file} (${issues.length} issues)`);
        lines.push('');

        const sorted = issues.sort((a, b) => {
          const sevOrder = { error: 0, warning: 1, info: 2 };
          return (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3);
        });

        for (const issue of sorted.slice(0, maxPerFile)) {
          const icon = this.severityIcon(issue.severity);
          lines.push(`    ${icon} [${issue.severity}] L${issue.line}: ${issue.message}`);
        }

        if (issues.length > maxPerFile) {
          lines.push(`    ${t('report.more', { count: String(issues.length - maxPerFile) })}`);
        }
        lines.push('');
      }
    }

    lines.push('─'.repeat(62));
    lines.push(`  Generated at: ${new Date().toISOString()}`);
    lines.push('');

    return lines.join('\n');
  }

  // ─── Helpers ────────────────────────────────────────────────────

  private gradeEmoji(grade: string): string {
    switch (grade) {
      case 'A+': return '🏆';
      case 'A': return '🟢';
      case 'B': return '🔵';
      case 'C': return '🟡';
      case 'D': return '🟠';
      case 'F': return '🔴';
      default: return '⚪';
    }
  }

  private severityIcon(severity: string): string {
    switch (severity) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '⚪';
      default: return '⚪';
    }
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  private formatDimensionBar(key: string, dim: { score: number; maxScore: number }): string {
    const name = this.i18n.t(`score.dimension.${key}`);
    const pct = Math.round((dim.score / dim.maxScore) * 100);
    const filled = Math.round(pct / 5);
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `  ${name.padEnd(25)} ${bar} ${dim.score}/${dim.maxScore} (${pct}%)`;
  }

  private categoryToDimensionKey(category: DetectorCategory): string {
    switch (category) {
      case 'ai-faithfulness': return 'faithfulness';
      case 'code-freshness': return 'freshness';
      case 'context-coherence': return 'coherence';
      case 'implementation': return 'quality';
    }
  }

  private groupByCategory(issues: DetectorResult[]): Record<string, DetectorResult[]> {
    const groups: Record<string, DetectorResult[]> = {};
    for (const issue of issues) {
      const cat = issue.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(issue);
    }
    return groups;
  }

  private groupByFile(issues: DetectorResult[]): Record<string, DetectorResult[]> {
    const groups: Record<string, DetectorResult[]> = {};
    for (const issue of issues) {
      const file = issue.file;
      if (!groups[file]) groups[file] = [];
      groups[file].push(issue);
    }
    return groups;
  }
}

// ─── Factory ─────────────────────────────────────────────────────────

/**
 * Create a V4 terminal reporter.
 */
export function createV4TerminalReporter(
  i18n: I18nProvider,
  options?: V4TerminalReportOptions,
): V4TerminalReporter {
  return new V4TerminalReporter(i18n, options);
}

/**
 * Render a V4 scan result to terminal output.
 */
export function renderV4Terminal(
  result: V4ScanResult,
  score: V4ScoreResult | undefined,
  i18n: I18nProvider,
  options?: V4TerminalReportOptions,
): string {
  const reporter = new V4TerminalReporter(i18n, options);
  return reporter.render(result, score);
}
