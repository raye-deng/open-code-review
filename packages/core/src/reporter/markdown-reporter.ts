/**
 * Enhanced Markdown Reporter
 *
 * Generates rich Markdown reports suitable for GitHub/GitLab PR comments.
 * Features:
 * - Dimension score tables with visual bars
 * - Issues grouped by file
 * - Fix suggestions
 * - SLA metrics panel
 * - Collapsible sections for large reports
 *
 * @since 0.3.0
 */

import type { UnifiedIssue } from '../types.js';
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

function severityBadge(severity: string): string {
  switch (severity) {
    case 'critical': return '🔴 **CRITICAL**';
    case 'high': return '🟠 **HIGH**';
    case 'medium': return '🟡 MEDIUM';
    case 'low': return '🔵 LOW';
    case 'info': return '⚪ INFO';
    default: return severity;
  }
}

function progressBar(score: number, maxScore: number): string {
  const pct = Math.round((score / maxScore) * 100);
  const filled = Math.round(pct / 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${pct}%`;
}

function slaLevelName(level: string): string {
  switch (level) {
    case 'L1': return 'Fast Scan';
    case 'L2': return 'Standard';
    case 'L3': return 'Deep Scan';
    default: return level;
  }
}

// ─── Markdown Generator ────────────────────────────────────────────

export function generateMarkdown(data: ReportData, _options: ReportOptions): string {
  const lines: string[] = [];
  const { score, issues } = data;

  // ── Header ──
  lines.push(`## ${gradeEmoji(score.grade)} Open Code Review Report — ${data.projectName}`);
  lines.push('');
  lines.push(`> 🕐 ${data.scanDate} · ⏱️ ${(data.duration / 1000).toFixed(1)}s · 📁 ${data.filesScanned} files · 🌐 ${data.languages.join(', ')}`);
  lines.push('');

  // ── Summary ──
  lines.push(`### Overall: ${score.overallScore}/100 (Grade ${score.grade}) ${score.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Files Scanned | ${score.totalFiles} |`);
  lines.push(`| Files Passed | ${score.passedFiles} |`);
  lines.push(`| Files Failed | ${score.failedFiles} |`);
  lines.push(`| Issues Found | ${score.issueCount} |`);
  lines.push(`| Threshold | ${score.threshold} |`);
  lines.push('');

  // ── Dimension Scores ──
  lines.push('### 📊 Scoring Dimensions');
  lines.push('');
  lines.push('| Dimension | Score | Bar | Issues |');
  lines.push('|-----------|-------|-----|--------|');
  for (const dim of Object.values(score.dimensions) as DimensionScoreV3[]) {
    lines.push(`| ${dim.name} | ${dim.score}/${dim.maxScore} | ${progressBar(dim.score, dim.maxScore)} | ${dim.issueCount} |`);
  }
  lines.push('');

  // ── Issue Summary ──
  if (issues.length > 0) {
    const severityCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    for (const issue of issues) {
      severityCounts[issue.severity] = (severityCounts[issue.severity] || 0) + 1;
    }

    lines.push('### ⚠️ Issue Summary');
    lines.push('');
    lines.push('| Severity | Count |');
    lines.push('|----------|-------|');
    for (const [sev, count] of Object.entries(severityCounts)) {
      if (count > 0) {
        lines.push(`| ${severityBadge(sev)} | ${count} |`);
      }
    }
    lines.push('');

    // ── Issues by File ──
    const issuesByFile = new Map<string, UnifiedIssue[]>();
    for (const issue of issues) {
      const existing = issuesByFile.get(issue.file) || [];
      existing.push(issue);
      issuesByFile.set(issue.file, existing);
    }

    lines.push('### 📁 Issues by File');
    lines.push('');

    for (const [file, fileIssues] of issuesByFile) {
      const sortedIssues = [...fileIssues].sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

      lines.push(`<details>`);
      lines.push(`<summary><strong>${file}</strong> — ${fileIssues.length} issue${fileIssues.length > 1 ? 's' : ''}</summary>`);
      lines.push('');

      for (const issue of sortedIssues) {
        lines.push(`#### ${severityBadge(issue.severity)} L${issue.line}: ${issue.message}`);
        lines.push('');
        lines.push(`- **Detector:** ${issue.detector}`);
        lines.push(`- **Category:** ${issue.category}`);
        if (issue.suggestion) {
          lines.push(`- **Fix:** ${issue.suggestion}`);
        }
        if (issue.source) {
          lines.push('');
          lines.push('```');
          lines.push(issue.source);
          lines.push('```');
        }
        lines.push('');
      }

      lines.push('</details>');
      lines.push('');
    }
  }

  // ── SLA Metrics ──
  if (data.sla) {
    const sla = data.sla;
    lines.push('<details>');
    lines.push('<summary>📊 SLA Metrics</summary>');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Scan Level | ${sla.level} (${slaLevelName(sla.level)}) |`);
    lines.push(`| Duration | ${(sla.scanDurationMs / 1000).toFixed(1)}s (target: ≤${(sla.targetDurationMs / 1000).toFixed(0)}s) ${sla.withinTarget ? '✅' : '⚠️'} |`);
    lines.push(`| Detectors | ${sla.detectorsUsed}/${sla.detectorsTotal} |`);
    lines.push(`| AI Analysis | ${sla.aiAnalysis} |`);
    lines.push(`| Critical | ${sla.criticalCount} |`);
    lines.push(`| High | ${sla.highCount} |`);
    lines.push(`| Medium | ${sla.mediumCount} |`);
    if (sla.degraded) {
      lines.push(`| ⚠️ Degraded | ${sla.degradeReason} |`);
    }
    lines.push('');
    lines.push('</details>');
    lines.push('');
  }

  // ── File Score Table ──
  if (score.files.length > 0) {
    lines.push('<details>');
    lines.push('<summary>📋 File Scores</summary>');
    lines.push('');
    lines.push('| File | Score | Grade | AI Faith. | Freshness | Coherence | Quality |');
    lines.push('|------|-------|-------|-----------|-----------|-----------|---------|');

    for (const file of score.files) {
      const d = file.dimensions;
      lines.push(
        `| \`${file.file}\` | ${file.totalScore}/100 | ${gradeEmoji(file.grade)} ${file.grade} | ${d.aiFaithfulness.score}/${d.aiFaithfulness.maxScore} | ${d.codeFreshness.score}/${d.codeFreshness.maxScore} | ${d.contextCoherence.score}/${d.contextCoherence.maxScore} | ${d.implementationQuality.score}/${d.implementationQuality.maxScore} |`,
      );
    }
    lines.push('');
    lines.push('</details>');
  }

  // ── Footer ──
  lines.push('');
  lines.push('---');
  lines.push('*Powered by [Open Code Review](https://github.com/raye-deng/open-code-review) v0.3.0*');

  return lines.join('\n');
}

// ─── Helpers ───────────────────────────────────────────────────────

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
