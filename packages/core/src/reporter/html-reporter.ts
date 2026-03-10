/**
 * HTML Reporter
 *
 * Generates a self-contained HTML report file with no external dependencies.
 * Inspired by Google Lighthouse report design.
 *
 * Features:
 * - Overall score gauge with grade
 * - Dimension bar charts (pure CSS)
 * - Issue summary by severity
 * - Issue list with collapsible source code
 * - SLA metrics panel
 * - Light/dark theme support
 * - Responsive layout
 *
 * @since 0.3.0
 */

import type { UnifiedIssue } from '../types.js';
import type { DimensionScoreV3 } from '../scorer/scoring-engine.js';
import type { SLAMetrics } from '../sla/types.js';
import type { ReportData, ReportOptions } from './types.js';

// ─── Color System ──────────────────────────────────────────────────

const GRADE_COLORS: Record<string, string> = {
  'A+': '#22c55e',
  'A': '#22c55e',
  'B': '#3b82f6',
  'C': '#eab308',
  'D': '#f97316',
  'F': '#ef4444',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280',
};

// ─── Helper Functions ──────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function gradeColor(grade: string): string {
  return GRADE_COLORS[grade] || '#6b7280';
}

function severityColor(severity: string): string {
  return SEVERITY_COLORS[severity] || '#6b7280';
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

// ─── CSS Styles ────────────────────────────────────────────────────

function generateCSS(theme: 'light' | 'dark'): string {
  const isDark = theme === 'dark';

  return `
    :root {
      --bg-primary: ${isDark ? '#0f172a' : '#ffffff'};
      --bg-secondary: ${isDark ? '#1e293b' : '#f8fafc'};
      --bg-card: ${isDark ? '#1e293b' : '#ffffff'};
      --text-primary: ${isDark ? '#f1f5f9' : '#0f172a'};
      --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
      --border: ${isDark ? '#334155' : '#e2e8f0'};
      --shadow: ${isDark ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)'};
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      padding: 0;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px;
    }

    .header {
      text-align: center;
      padding: 32px 0 24px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 32px;
    }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .header .subtitle {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .score-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 48px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .score-gauge {
      width: 160px;
      height: 160px;
    }

    .score-gauge circle {
      transition: stroke-dashoffset 0.8s ease-in-out;
    }

    .score-info {
      text-align: left;
    }

    .score-info .grade {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 4px;
    }

    .score-info .status {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .score-info .meta {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.8;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow);
    }

    .card h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .dimensions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .dim-card {
      background: var(--bg-secondary);
      border-radius: 6px;
      padding: 16px;
    }

    .dim-card .dim-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .dim-card .dim-name {
      font-weight: 600;
      font-size: 14px;
    }

    .dim-card .dim-score {
      font-weight: 700;
      font-size: 14px;
    }

    .bar-track {
      width: 100%;
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease-in-out;
    }

    .dim-card .dim-issues {
      color: var(--text-secondary);
      font-size: 12px;
      margin-top: 6px;
    }

    .severity-grid {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .severity-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
    }

    .severity-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .issue-list {
      list-style: none;
    }

    .issue-item {
      border: 1px solid var(--border);
      border-radius: 6px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .issue-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      gap: 12px;
      background: var(--bg-secondary);
      user-select: none;
    }

    .issue-header:hover {
      opacity: 0.85;
    }

    .issue-sev {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #fff;
      flex-shrink: 0;
    }

    .issue-file {
      color: var(--text-secondary);
      font-family: monospace;
      font-size: 13px;
      flex-shrink: 0;
    }

    .issue-msg {
      flex: 1;
      font-size: 14px;
    }

    .issue-toggle {
      color: var(--text-secondary);
      font-size: 12px;
      flex-shrink: 0;
    }

    .issue-body {
      display: none;
      padding: 16px;
      border-top: 1px solid var(--border);
      font-size: 14px;
    }

    .issue-body.open {
      display: block;
    }

    .issue-detail {
      margin-bottom: 8px;
    }

    .issue-detail strong {
      display: inline-block;
      min-width: 100px;
      color: var(--text-secondary);
    }

    .issue-source {
      background: ${isDark ? '#0d1117' : '#f6f8fa'};
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 12px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 13px;
      overflow-x: auto;
      white-space: pre;
      margin-top: 8px;
    }

    .sla-table {
      width: 100%;
      border-collapse: collapse;
    }

    .sla-table th,
    .sla-table td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }

    .sla-table th {
      color: var(--text-secondary);
      font-weight: 600;
    }

    .footer {
      text-align: center;
      color: var(--text-secondary);
      font-size: 13px;
      padding: 24px 0;
      border-top: 1px solid var(--border);
      margin-top: 32px;
    }

    .footer a {
      color: var(--text-secondary);
      text-decoration: underline;
    }

    @media (max-width: 640px) {
      .container { padding: 16px; }
      .score-section { gap: 24px; }
      .score-gauge { width: 120px; height: 120px; }
      .score-info .grade { font-size: 28px; }
      .dimensions-grid { grid-template-columns: 1fr; }
    }
  `;
}

// ─── SVG Gauge ─────────────────────────────────────────────────────

function scoreGaugeSVG(score: number, grade: string): string {
  const color = gradeColor(grade);
  const circumference = 2 * Math.PI * 50;
  const offset = circumference * (1 - score / 100);

  return `<svg class="score-gauge" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="8"/>
    <circle cx="60" cy="60" r="50" fill="none"
            stroke="${color}" stroke-width="8"
            stroke-dasharray="${circumference.toFixed(2)}"
            stroke-dashoffset="${offset.toFixed(2)}"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"/>
    <text x="60" y="52" text-anchor="middle" font-size="28" font-weight="700"
          fill="var(--text-primary)">${score}</text>
    <text x="60" y="72" text-anchor="middle" font-size="13"
          fill="var(--text-secondary)">Grade ${escapeHtml(grade)}</text>
  </svg>`;
}

// ─── Section Generators ────────────────────────────────────────────

function headerSection(data: ReportData): string {
  return `
    <div class="header">
      <h1>🔬 Open Code Review Report</h1>
      <div class="subtitle">${escapeHtml(data.projectName)} · ${escapeHtml(data.scanDate)}</div>
    </div>`;
}

function scoreSection(data: ReportData): string {
  const { score } = data;
  const color = gradeColor(score.grade);

  return `
    <div class="score-section">
      ${scoreGaugeSVG(score.overallScore, score.grade)}
      <div class="score-info">
        <div class="grade" style="color: ${color}">Grade ${escapeHtml(score.grade)}</div>
        <div class="status">${score.passed
          ? '✅ PASSED'
          : '❌ FAILED'} (threshold: ${score.threshold})</div>
        <div class="meta">
          📁 ${data.filesScanned} files scanned (${score.passedFiles} passed, ${score.failedFiles} failed)<br>
          ⚠️ ${score.issueCount} issues found<br>
          ⏱️ ${(data.duration / 1000).toFixed(1)}s · 🌐 ${data.languages.map(l => escapeHtml(l)).join(', ')}
        </div>
      </div>
    </div>`;
}

function dimensionsSection(data: ReportData): string {
  const dims = Object.values(data.score.dimensions) as DimensionScoreV3[];

  const dimCards = dims.map(dim => {
    const pct = Math.round((dim.score / dim.maxScore) * 100);
    const color = pct >= 90 ? '#22c55e' : pct >= 75 ? '#3b82f6' : pct >= 60 ? '#eab308' : '#ef4444';

    return `
      <div class="dim-card">
        <div class="dim-header">
          <span class="dim-name">${escapeHtml(dim.name)}</span>
          <span class="dim-score">${dim.score}/${dim.maxScore}</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%; background: ${color};"></div>
        </div>
        <div class="dim-issues">${dim.issueCount} issue${dim.issueCount !== 1 ? 's' : ''} · ${pct}%</div>
      </div>`;
  }).join('');

  return `
    <div class="card">
      <h2>📊 Scoring Dimensions</h2>
      <div class="dimensions-grid">
        ${dimCards}
      </div>
    </div>`;
}

function severitySummarySection(issues: UnifiedIssue[]): string {
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const issue of issues) {
    counts[issue.severity] = (counts[issue.severity] || 0) + 1;
  }

  const badges = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([sev, count]) => {
      const color = severityColor(sev);
      return `
        <div class="severity-badge" style="background: ${color}22;">
          <span class="severity-dot" style="background: ${color};"></span>
          ${sev.charAt(0).toUpperCase() + sev.slice(1)}: ${count}
        </div>`;
    }).join('');

  if (!badges) {
    return `
      <div class="card">
        <h2>✅ No Issues Found</h2>
        <p style="color: var(--text-secondary);">Great job! No issues were detected in the scanned files.</p>
      </div>`;
  }

  return `
    <div class="card">
      <h2>⚠️ Issue Summary</h2>
      <div class="severity-grid">
        ${badges}
      </div>
    </div>`;
}

function dimensionDetailsSection(data: ReportData): string {
  const dims = Object.values(data.score.dimensions) as DimensionScoreV3[];

  const details = dims.map(dim => {
    const pct = Math.round((dim.score / dim.maxScore) * 100);
    const topIssues = [...dim.issues]
      .sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity))
      .slice(0, 3);

    const issueRows = topIssues.map(issue => `
      <div style="display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 13px;">
        <span class="issue-sev" style="background: ${severityColor(issue.severity)};">${issue.severity}</span>
        <span style="font-family: monospace; color: var(--text-secondary);">${escapeHtml(issue.file)}:${issue.line}</span>
        <span>${escapeHtml(issue.message)}</span>
      </div>`
    ).join('');

    return `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <strong>${escapeHtml(dim.name)}</strong>
          <span>${dim.score}/${dim.maxScore} (${pct}%) · ${dim.issueCount} issues</span>
        </div>
        <div class="bar-track" style="margin-bottom: 8px;">
          <div class="bar-fill" style="width: ${pct}%; background: ${pct >= 90 ? '#22c55e' : pct >= 75 ? '#3b82f6' : pct >= 60 ? '#eab308' : '#ef4444'};"></div>
        </div>
        ${issueRows || '<div style="color: var(--text-secondary); font-size: 13px;">No issues in this dimension.</div>'}
      </div>`;
  }).join('');

  return `
    <div class="card">
      <h2>📋 Dimension Details</h2>
      ${details}
    </div>`;
}

function issueListSection(issues: UnifiedIssue[], includeSource: boolean): string {
  if (issues.length === 0) return '';

  const sorted = [...issues].sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity));

  const issueItems = sorted.map((issue, idx) => {
    const bodyParts: string[] = [];
    bodyParts.push(`<div class="issue-detail"><strong>Detector:</strong> ${escapeHtml(issue.detector)}</div>`);
    bodyParts.push(`<div class="issue-detail"><strong>Category:</strong> ${escapeHtml(issue.category)}</div>`);
    if (issue.suggestion) {
      bodyParts.push(`<div class="issue-detail"><strong>Fix:</strong> ${escapeHtml(issue.suggestion)}</div>`);
    }
    if (issue.confidence !== undefined) {
      bodyParts.push(`<div class="issue-detail"><strong>Confidence:</strong> ${(issue.confidence * 100).toFixed(0)}%</div>`);
    }
    if (includeSource && issue.source) {
      bodyParts.push(`<div class="issue-source">${escapeHtml(issue.source)}</div>`);
    }

    return `
      <li class="issue-item">
        <div class="issue-header" onclick="toggleIssue(${idx})">
          <span class="issue-sev" style="background: ${severityColor(issue.severity)};">${issue.severity}</span>
          <span class="issue-file">${escapeHtml(issue.file)}:${issue.line}</span>
          <span class="issue-msg">${escapeHtml(issue.message)}</span>
          <span class="issue-toggle" id="toggle-${idx}">▶</span>
        </div>
        <div class="issue-body" id="issue-${idx}">
          ${bodyParts.join('\n')}
        </div>
      </li>`;
  }).join('');

  return `
    <div class="card">
      <h2>🔍 Issue List (${issues.length})</h2>
      <ul class="issue-list">
        ${issueItems}
      </ul>
    </div>`;
}

function slaSection(sla: SLAMetrics): string {
  return `
    <div class="card">
      <h2>📊 SLA Metrics</h2>
      <table class="sla-table">
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Scan Level</td><td>${sla.level} (${slaLevelName(sla.level)})</td></tr>
        <tr><td>Files Scanned</td><td>${sla.filesScanned}</td></tr>
        <tr>
          <td>Scan Duration</td>
          <td>${(sla.scanDurationMs / 1000).toFixed(1)}s
            (target: ≤${(sla.targetDurationMs / 1000).toFixed(0)}s)
            ${sla.withinTarget ? '✅' : '⚠️'}
          </td>
        </tr>
        <tr><td>Detectors Used</td><td>${sla.detectorsUsed}/${sla.detectorsTotal}</td></tr>
        <tr><td>AI Analysis</td><td>${sla.aiAnalysis === 'none' ? 'None' : sla.aiAnalysis}</td></tr>
        <tr><td>Issues Found</td><td>${sla.issuesFound} (${sla.criticalCount} critical, ${sla.highCount} high, ${sla.mediumCount} medium)</td></tr>
        ${sla.degraded ? `<tr><td>⚠️ Degraded</td><td>${escapeHtml(sla.degradeReason || 'Unknown')}</td></tr>` : ''}
      </table>
    </div>`;
}

function footerSection(): string {
  return `
    <div class="footer">
      Powered by <a href="https://github.com/raye-deng/open-code-review">Open Code Review</a> v0.3.0
    </div>`;
}

function toggleScript(): string {
  return `
    <script>
      function toggleIssue(idx) {
        var body = document.getElementById('issue-' + idx);
        var toggle = document.getElementById('toggle-' + idx);
        if (body.classList.contains('open')) {
          body.classList.remove('open');
          toggle.textContent = '▶';
        } else {
          body.classList.add('open');
          toggle.textContent = '▼';
        }
      }
    </script>`;
}

// ─── HTML Generator ────────────────────────────────────────────────

export function generateHTML(data: ReportData, options: ReportOptions): string {
  const theme = options.theme || 'light';
  const includeSource = options.includeSource !== false;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open Code Review Report — ${escapeHtml(data.projectName)}</title>
  <style>${generateCSS(theme)}</style>
</head>
<body>
  <div class="container">
    ${headerSection(data)}
    ${scoreSection(data)}
    ${dimensionsSection(data)}
    ${severitySummarySection(data.issues)}
    ${dimensionDetailsSection(data)}
    ${issueListSection(data.issues, includeSource)}
    ${data.sla ? slaSection(data.sla) : ''}
    ${footerSection()}
  </div>
  ${toggleScript()}
</body>
</html>`;
}
