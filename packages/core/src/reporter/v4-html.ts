/**
 * V4 HTML Reporter
 *
 * Generates a self-contained, professional HTML report for V4 scan results.
 * No external dependencies — all CSS/JS/SVG inline.
 *
 * Features:
 * - Score gauge (SVG circle) with grade
 * - 4 dimension scores with animated progress bars
 * - Issue breakdown by category (CSS bar chart)
 * - Issue list grouped by file with severity colors
 * - Collapsible issue details
 * - Responsive layout
 * - Open Code Review branding
 *
 * @since 0.4.0
 */

import type { V4ScanResult } from '../scanner/v4-scanner.js';
import type { V4ScoreResult, DimensionInfo } from '../scorer/v4-adapter.js';
import type { DetectorResult, DetectorCategory } from '../detectors/v4/types.js';

// ─── Color System ──────────────────────────────────────────────────

const GRADE_COLORS: Record<string, string> = {
  'A+': '#22c55e', 'A': '#22c55e', 'B': '#3b82f6',
  'C': '#eab308', 'D': '#f97316', 'F': '#ef4444',
};

const SEVERITY_COLORS: Record<string, string> = {
  error: '#ef4444', warning: '#f59e0b', info: '#3b82f6',
};

const CATEGORY_COLORS: Record<string, string> = {
  'ai-faithfulness': '#8b5cf6',
  'code-freshness': '#06b6d4',
  'context-coherence': '#f59e0b',
  'implementation': '#10b981',
};

const CATEGORY_LABELS: Record<string, string> = {
  'ai-faithfulness': 'AI Faithfulness',
  'code-freshness': 'Code Freshness',
  'context-coherence': 'Context Coherence',
  'implementation': 'Implementation Quality',
};

const CATEGORY_ICONS: Record<string, string> = {
  'ai-faithfulness': '🤖',
  'code-freshness': '📅',
  'context-coherence': '🔗',
  'implementation': '⚙️',
};

// ─── Helpers ───────────────────────────────────────────────────────

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function gradeColor(grade: string): string {
  return GRADE_COLORS[grade] || '#6b7280';
}

function sevColor(sev: string): string {
  return SEVERITY_COLORS[sev] || '#6b7280';
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function sevOrder(s: string): number {
  return s === 'error' ? 0 : s === 'warning' ? 1 : 2;
}

// ─── CSS ───────────────────────────────────────────────────────────

function css(): string {
  return `
    :root {
      --bg: #0f172a; --bg2: #1e293b; --bg3: #334155;
      --text: #f1f5f9; --text2: #94a3b8; --text3: #64748b;
      --border: #334155; --accent: #3b82f6;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg); color: var(--text);
      line-height: 1.6; padding: 0;
    }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }

    /* Header */
    .hdr { text-align: center; padding: 40px 0 32px; border-bottom: 1px solid var(--border); margin-bottom: 40px; }
    .hdr .logo { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 8px; }
    .hdr h1 { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
    .hdr .sub { color: var(--text2); font-size: 14px; }

    /* Score Hero */
    .hero { display: flex; align-items: center; justify-content: center; gap: 48px; margin-bottom: 40px; flex-wrap: wrap; }
    .gauge { width: 180px; height: 180px; }
    .gauge circle { transition: stroke-dashoffset 1s ease; }
    .info .grade { font-size: 48px; font-weight: 900; margin-bottom: 2px; }
    .info .status { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
    .info .meta { color: var(--text2); font-size: 14px; line-height: 1.9; }

    /* Cards */
    .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .card h2 { font-size: 17px; font-weight: 700; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }

    /* Dimension grid */
    .dims { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    @media (max-width: 640px) { .dims { grid-template-columns: 1fr; } }
    .dim { background: var(--bg); border-radius: 8px; padding: 16px; }
    .dim .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .dim .name { font-weight: 600; font-size: 14px; }
    .dim .val { font-weight: 700; font-size: 14px; }
    .bar-t { width: 100%; height: 8px; background: var(--bg3); border-radius: 4px; overflow: hidden; }
    .bar-f { height: 100%; border-radius: 4px; transition: width 0.8s ease; }
    .dim .cnt { color: var(--text3); font-size: 12px; margin-top: 6px; }

    /* Category chart */
    .cat-chart { display: flex; flex-direction: column; gap: 12px; }
    .cat-row { display: flex; align-items: center; gap: 12px; }
    .cat-label { width: 180px; font-size: 13px; text-align: right; flex-shrink: 0; }
    .cat-bar-wrap { flex: 1; height: 28px; background: var(--bg); border-radius: 6px; overflow: hidden; position: relative; }
    .cat-bar { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 8px; font-size: 12px; font-weight: 600; color: #fff; min-width: 32px; transition: width 0.8s ease; }

    /* Severity badges */
    .sev-grid { display: flex; gap: 12px; flex-wrap: wrap; }
    .sev-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 20px; font-weight: 600; font-size: 14px; }
    .sev-dot { width: 10px; height: 10px; border-radius: 50%; }

    /* Issue list */
    .iss-list { list-style: none; }
    .iss-item { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
    .iss-hdr { display: flex; align-items: center; padding: 10px 16px; cursor: pointer; gap: 10px; background: var(--bg); user-select: none; }
    .iss-hdr:hover { opacity: 0.9; }
    .iss-sev { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #fff; flex-shrink: 0; }
    .iss-file { color: var(--text2); font-family: monospace; font-size: 12px; flex-shrink: 0; }
    .iss-msg { flex: 1; font-size: 13px; }
    .iss-tog { color: var(--text3); font-size: 12px; flex-shrink: 0; }
    .iss-body { display: none; padding: 16px; border-top: 1px solid var(--border); font-size: 13px; }
    .iss-body.open { display: block; }
    .iss-det { margin-bottom: 6px; }
    .iss-det strong { display: inline-block; min-width: 90px; color: var(--text3); }

    /* Stages */
    .stages { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
    .stage { background: var(--bg); border-radius: 6px; padding: 8px 16px; font-size: 13px; }
    .stage .sname { color: var(--text3); font-size: 11px; display: block; }
    .stage .sval { font-weight: 700; }

    /* Footer */
    .foot { text-align: center; color: var(--text3); font-size: 13px; padding: 24px 0; border-top: 1px solid var(--border); margin-top: 32px; }
    .foot a { color: var(--accent); text-decoration: none; }

    /* File groups */
    .file-group { margin-bottom: 16px; }
    .file-group-hdr { font-family: monospace; font-size: 13px; color: var(--text2); padding: 8px 0; border-bottom: 1px solid var(--border); margin-bottom: 8px; cursor: pointer; }
    .file-group-hdr:hover { color: var(--text); }
    .file-group-hdr .cnt { color: var(--text3); font-size: 12px; margin-left: 8px; }
  `;
}

// ─── SVG Gauge ─────────────────────────────────────────────────────

function gaugesvg(score: number, grade: string): string {
  const color = gradeColor(grade);
  const c = 2 * Math.PI * 54;
  const off = c * (1 - score / 100);
  return `<svg class="gauge" viewBox="0 0 130 130">
    <circle cx="65" cy="65" r="54" fill="none" stroke="var(--bg3)" stroke-width="10"/>
    <circle cx="65" cy="65" r="54" fill="none" stroke="${color}" stroke-width="10"
      stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
      stroke-linecap="round" transform="rotate(-90 65 65)"/>
    <text x="65" y="58" text-anchor="middle" font-size="32" font-weight="800" fill="var(--text)">${score}</text>
    <text x="65" y="78" text-anchor="middle" font-size="14" fill="var(--text2)">/ 100</text>
  </svg>`;
}

// ─── Section Builders ──────────────────────────────────────────────

function headerSection(projectName: string, sla: string, date: string): string {
  return `<div class="hdr">
    <div class="logo">Open Code Review</div>
    <h1>V4 Scan Report</h1>
    <div class="sub">${esc(projectName)} · SLA ${esc(sla)} · ${esc(date)}</div>
  </div>`;
}

function heroSection(score: V4ScoreResult, result: V4ScanResult): string {
  const c = gradeColor(score.grade);
  return `<div class="hero">
    ${gaugesvg(score.totalScore, score.grade)}
    <div class="info">
      <div class="grade" style="color:${c}">Grade ${esc(score.grade)}</div>
      <div class="status">${score.passed ? '✅ PASSED' : '❌ FAILED'} (threshold: ${score.threshold})</div>
      <div class="meta">
        📁 ${result.files.length} files scanned<br>
        🌐 ${result.languages.map(l => esc(l)).join(', ')}<br>
        ⚠️ ${score.issueCount} issues found<br>
        ⏱️ ${formatDuration(result.durationMs)}
      </div>
    </div>
  </div>`;
}

function dimensionsSection(score: V4ScoreResult): string {
  const dims: DimensionInfo[] = [
    score.dimensions.faithfulness,
    score.dimensions.freshness,
    score.dimensions.coherence,
    score.dimensions.quality,
  ];
  const icons = ['🤖', '📅', '🔗', '⚙️'];

  const cards = dims.map((d, i) => {
    const pct = d.percentage;
    const col = pct >= 90 ? '#22c55e' : pct >= 75 ? '#3b82f6' : pct >= 60 ? '#eab308' : '#ef4444';
    return `<div class="dim">
      <div class="top">
        <span class="name">${icons[i]} ${esc(d.name)}</span>
        <span class="val" style="color:${col}">${d.score}/${d.maxScore}</span>
      </div>
      <div class="bar-t"><div class="bar-f" style="width:${pct}%;background:${col}"></div></div>
      <div class="cnt">${d.issueCount} issue${d.issueCount !== 1 ? 's' : ''} · ${pct}%</div>
    </div>`;
  }).join('');

  return `<div class="card">
    <h2>📊 Scoring Dimensions</h2>
    <div class="dims">${cards}</div>
  </div>`;
}

function categoryChartSection(issues: DetectorResult[]): string {
  const counts: Record<string, number> = {
    'ai-faithfulness': 0, 'code-freshness': 0,
    'context-coherence': 0, 'implementation': 0,
  };
  for (const i of issues) counts[i.category] = (counts[i.category] || 0) + 1;
  const max = Math.max(...Object.values(counts), 1);

  const rows = Object.entries(counts).map(([cat, cnt]) => {
    const pct = (cnt / max) * 100;
    const col = CATEGORY_COLORS[cat] || '#6b7280';
    const icon = CATEGORY_ICONS[cat] || '';
    const label = CATEGORY_LABELS[cat] || cat;
    return `<div class="cat-row">
      <div class="cat-label">${icon} ${esc(label)}</div>
      <div class="cat-bar-wrap"><div class="cat-bar" style="width:${Math.max(pct, 3)}%;background:${col}">${cnt}</div></div>
    </div>`;
  }).join('');

  return `<div class="card">
    <h2>📋 Issues by Category</h2>
    <div class="cat-chart">${rows}</div>
  </div>`;
}

function severitySection(issues: DetectorResult[]): string {
  const counts: Record<string, number> = { error: 0, warning: 0, info: 0 };
  for (const i of issues) counts[i.severity] = (counts[i.severity] || 0) + 1;

  const labels: Record<string, string> = { error: '🔴 Error', warning: '🟡 Warning', info: '🔵 Info' };
  const badges = Object.entries(counts)
    .filter(([, c]) => c > 0)
    .map(([s, c]) => {
      const col = sevColor(s);
      return `<div class="sev-badge" style="background:${col}22">
        <span class="sev-dot" style="background:${col}"></span>
        ${labels[s] || s}: ${c}
      </div>`;
    }).join('');

  if (!badges) return `<div class="card"><h2>✅ No Issues Found</h2><p style="color:var(--text2)">Great job!</p></div>`;

  return `<div class="card">
    <h2>⚠️ Issue Summary</h2>
    <div class="sev-grid">${badges}</div>
  </div>`;
}

function issueListSection(issues: DetectorResult[]): string {
  if (issues.length === 0) return '';

  // Group by file
  const byFile = new Map<string, DetectorResult[]>();
  for (const i of issues) {
    const list = byFile.get(i.file) || [];
    list.push(i);
    byFile.set(i.file, list);
  }

  // Sort files by issue count desc
  const sortedFiles = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);

  let idx = 0;
  const groups = sortedFiles.map(([file, fileIssues]) => {
    const sorted = [...fileIssues].sort((a, b) => sevOrder(a.severity) - sevOrder(b.severity));
    const items = sorted.map(issue => {
      const id = idx++;
      return `<li class="iss-item">
        <div class="iss-hdr" onclick="tog(${id})">
          <span class="iss-sev" style="background:${sevColor(issue.severity)}">${issue.severity}</span>
          <span class="iss-file">:${issue.line}</span>
          <span class="iss-msg">${esc(issue.message)}</span>
          <span class="iss-tog" id="t${id}">▶</span>
        </div>
        <div class="iss-body" id="b${id}">
          <div class="iss-det"><strong>Detector:</strong> ${esc(issue.detectorId)}</div>
          <div class="iss-det"><strong>Category:</strong> ${esc(CATEGORY_LABELS[issue.category] || issue.category)}</div>
          <div class="iss-det"><strong>Line:</strong> ${issue.line}${issue.endLine ? `–${issue.endLine}` : ''}</div>
          ${issue.confidence !== undefined ? `<div class="iss-det"><strong>Confidence:</strong> ${(issue.confidence * 100).toFixed(0)}%</div>` : ''}
        </div>
      </li>`;
    }).join('');

    return `<div class="file-group">
      <div class="file-group-hdr">📄 ${esc(file)} <span class="cnt">(${fileIssues.length} issue${fileIssues.length !== 1 ? 's' : ''})</span></div>
      <ul class="iss-list">${items}</ul>
    </div>`;
  }).join('');

  return `<div class="card">
    <h2>🔍 Issues by File (${issues.length} total across ${byFile.size} files)</h2>
    ${groups}
  </div>`;
}

function stagesSection(result: V4ScanResult): string {
  const stages = [
    { name: 'Discovery', val: result.stages.discovery },
    { name: 'Parsing', val: result.stages.parsing },
    { name: 'Detection', val: result.stages.detection },
  ];
  if (result.stages.ai) stages.push({ name: 'AI Analysis', val: result.stages.ai });

  const items = stages.map(s =>
    `<div class="stage"><span class="sname">${s.name}</span><span class="sval">${formatDuration(s.val)}</span></div>`
  ).join('');

  return `<div class="card">
    <h2>⏱️ Pipeline Stages</h2>
    <div class="stages">${items}</div>
  </div>`;
}

function footerSection(): string {
  return `<div class="foot">
    Powered by <a href="https://github.com/user/open-code-review">Open Code Review</a> v0.4.0 · Generated ${new Date().toISOString().split('T')[0]}
  </div>`;
}

function toggleScript(): string {
  return `<script>
    function tog(i){var b=document.getElementById('b'+i),t=document.getElementById('t'+i);
    if(b.classList.contains('open')){b.classList.remove('open');t.textContent='▶';}
    else{b.classList.add('open');t.textContent='▼';}}
  </script>`;
}

// ─── Main Generator ────────────────────────────────────────────────

/**
 * Generate a professional HTML report from V4 scan results.
 */
export function generateV4HTML(
  result: V4ScanResult,
  score: V4ScoreResult,
  projectName?: string,
): string {
  const name = projectName || result.projectRoot.split('/').pop() || 'Project';
  const date = new Date().toISOString().split('T')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Open Code Review — ${esc(name)}</title>
  <style>${css()}</style>
</head>
<body>
  <div class="wrap">
    ${headerSection(name, result.sla, date)}
    ${heroSection(score, result)}
    ${dimensionsSection(score)}
    ${categoryChartSection(result.issues)}
    ${severitySection(result.issues)}
    ${issueListSection(result.issues)}
    ${stagesSection(result)}
    ${footerSection()}
  </div>
  ${toggleScript()}
</body>
</html>`;
}
