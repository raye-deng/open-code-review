/**
 * Terminal Reporter
 *
 * Generates human-readable terminal output with Unicode box drawing,
 * progress bars, and emoji icons.
 *
 * This is a thin wrapper that delegates to the existing ReportGenerator
 * for terminal format, re-exporting it in the new reporter module API.
 *
 * @since 0.3.0
 */

import type { DimensionScoreV3 } from '../scorer/scoring-engine.js';
import type { ReportData, ReportOptions } from './types.js';

// ─── Helpers ───────────────────────────────────────────────────────

function gradeEmoji(grade: string): string {
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

function severityIcon(severity: string): string {
  switch (severity) {
    case 'critical': return '🔴';
    case 'high': return '🟠';
    case 'medium': return '🟡';
    case 'low': return '🔵';
    case 'info': return '⚪';
    default: return '⚪';
  }
}

function dimensionBar(dim: DimensionScoreV3): string {
  const pct = Math.round((dim.score / dim.maxScore) * 100);
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `  ${dim.name.padEnd(25)} ${bar} ${dim.score}/${dim.maxScore} (${pct}%)`;
}

function slaLevelName(level: string): string {
  switch (level) {
    case 'L1': return 'Fast Scan';
    case 'L2': return 'Standard';
    case 'L3': return 'Deep Scan';
    default: return level;
  }
}

function severityOrder(severity: string): number {
  switch (severity) {
    case 'critical': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    case 'info': return 4;
    default: return 5;
  }
}

// ─── Terminal Generator ────────────────────────────────────────────

export function generateTerminal(data: ReportData, _options: ReportOptions): string {
  const lines: string[] = [];
  const { score } = data;

  lines.push('');
  lines.push('╔══════════════════════════════════════════════════════════════╗');
  lines.push('║           Open Code Review V3 — Quality Report              ║');
  lines.push('╚══════════════════════════════════════════════════════════════╝');
  lines.push('');
  lines.push(`  Project: ${data.projectName}`);
  lines.push(`  Date:    ${data.scanDate}`);
  lines.push(`  Overall Score: ${score.overallScore}/100  Grade: ${gradeEmoji(score.grade)} ${score.grade}`);
  lines.push(`  Files Scanned: ${score.totalFiles}  Passed: ${score.passedFiles}  Failed: ${score.failedFiles}`);
  lines.push(`  Issues Found: ${score.issueCount}  Threshold: ${score.threshold}`);
  lines.push(`  Status: ${score.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`  Duration: ${(data.duration / 1000).toFixed(1)}s  Languages: ${data.languages.join(', ')}`);
  lines.push('');

  // Dimension breakdown
  lines.push('  ── Scoring Dimensions ──');
  lines.push('');
  for (const dim of Object.values(score.dimensions) as DimensionScoreV3[]) {
    lines.push(dimensionBar(dim));
  }
  lines.push('');

  // SLA
  if (data.sla) {
    const sla = data.sla;
    lines.push('  ═══════════════════════════════════════════');
    lines.push('    SLA Metrics');
    lines.push('  ═══════════════════════════════════════════');
    lines.push(`    Scan Level:      ${sla.level} (${slaLevelName(sla.level)})`);
    lines.push(`    Scan Duration:   ${(sla.scanDurationMs / 1000).toFixed(1)}s (target: ≤${(sla.targetDurationMs / 1000).toFixed(0)}s ${sla.withinTarget ? '✅' : '⚠️'})`);
    lines.push(`    Detectors Used:  ${sla.detectorsUsed}/${sla.detectorsTotal}`);
    lines.push(`    AI Analysis:     ${sla.aiAnalysis === 'none' ? 'None' : sla.aiAnalysis}`);
    lines.push(`    Issues:          ${sla.issuesFound} (${sla.criticalCount} critical, ${sla.highCount} high, ${sla.mediumCount} medium)`);
    if (sla.degraded) {
      lines.push(`    ⚠️  DEGRADED:    ${sla.degradeReason}`);
    }
    lines.push('  ═══════════════════════════════════════════');
    lines.push('');
  }

  // Per-file details
  for (const file of score.files) {
    lines.push(`  ─── ${file.file} ─── Score: ${file.totalScore}/100 ${gradeEmoji(file.grade)}`);
    for (const dim of Object.values(file.dimensions) as DimensionScoreV3[]) {
      lines.push(dimensionBar(dim));
    }

    const allIssues = Object.values(file.dimensions)
      .flatMap((d: DimensionScoreV3) => d.issues ?? [])
      .sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

    if (allIssues.length > 0) {
      lines.push('');
      lines.push('  Issues:');
      for (const issue of allIssues.slice(0, 8)) {
        lines.push(`    ${severityIcon(issue.severity)} [${issue.severity}] L${issue.line}: ${issue.message}`);
      }
      if (allIssues.length > 8) {
        lines.push(`    ... and ${allIssues.length - 8} more`);
      }
    }
    lines.push('');
  }

  lines.push('─'.repeat(62));
  lines.push(`  Generated at: ${data.scanDate}`);
  lines.push('');

  return lines.join('\n');
}
