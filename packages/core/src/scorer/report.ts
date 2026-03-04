/**
 * Report Generator
 *
 * Formats validation results into various output formats:
 * - Terminal (human-readable with colors)
 * - JSON (machine-readable)
 * - Markdown (for PR comments)
 * - GitLab Code Quality (for CI integration)
 */

import type { AggregateScore, FileScore, DimensionScore } from './scoring-engine.js';

/** Output format type */
export type ReportFormat = 'terminal' | 'json' | 'markdown' | 'gitlab-report';

/** GitLab Code Quality issue format */
interface GitLabCodeQualityIssue {
  description: string;
  check_name: string;
  fingerprint: string;
  severity: 'info' | 'minor' | 'major' | 'critical' | 'blocker';
  location: {
    path: string;
    lines: { begin: number };
  };
}

/**
 * Format a dimension score as a visual bar
 */
function dimensionBar(dim: DimensionScore): string {
  const pct = Math.round((dim.score / dim.maxScore) * 100);
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `  ${dim.name.padEnd(25)} ${bar} ${dim.score}/${dim.maxScore} (${pct}%)`;
}

/**
 * Grade emoji
 */
function gradeEmoji(grade: string): string {
  switch (grade) {
    case 'A': return '🟢';
    case 'B': return '🔵';
    case 'C': return '🟡';
    case 'D': return '🟠';
    case 'F': return '🔴';
    default: return '⚪';
  }
}

export class ReportGenerator {
  /**
   * Generate a report in the specified format
   */
  generate(result: AggregateScore, format: ReportFormat): string {
    switch (format) {
      case 'terminal': return this.formatTerminal(result);
      case 'json': return this.formatJSON(result);
      case 'markdown': return this.formatMarkdown(result);
      case 'gitlab-report': return this.formatGitLabReport(result);
      default: return this.formatJSON(result);
    }
  }

  /** Terminal-friendly output */
  private formatTerminal(result: AggregateScore): string {
    const lines: string[] = [];

    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push('║              AI Code Validator — Quality Report              ║');
    lines.push('╚══════════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push(`  Overall Score: ${result.overallScore}/100  Grade: ${gradeEmoji(result.grade)} ${result.grade}`);
    lines.push(`  Files Scanned: ${result.totalFiles}  Passed: ${result.passedFiles}  Failed: ${result.failedFiles}`);
    lines.push(`  Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push('');

    for (const file of result.files) {
      lines.push(`  ─── ${file.file} ─── Score: ${file.totalScore}/100 ${gradeEmoji(file.grade)}`);
      lines.push(dimensionBar(file.dimensions.completeness));
      lines.push(dimensionBar(file.dimensions.coherence));
      lines.push(dimensionBar(file.dimensions.consistency));
      lines.push(dimensionBar(file.dimensions.conciseness));

      // Show top issues
      const allDetails = [
        ...file.dimensions.completeness.details,
        ...file.dimensions.coherence.details,
        ...file.dimensions.consistency.details,
        ...file.dimensions.conciseness.details,
      ];
      if (allDetails.length > 0) {
        lines.push('');
        lines.push('  Issues:');
        for (const detail of allDetails.slice(0, 5)) {
          lines.push(`    ⚠ ${detail}`);
        }
        if (allDetails.length > 5) {
          lines.push(`    ... and ${allDetails.length - 5} more`);
        }
      }
      lines.push('');
    }

    lines.push('─'.repeat(62));
    lines.push(`  Generated at: ${result.timestamp}`);
    lines.push('');

    return lines.join('\n');
  }

  /** JSON output */
  private formatJSON(result: AggregateScore): string {
    return JSON.stringify(result, null, 2);
  }

  /** Markdown output (for PR comments) */
  private formatMarkdown(result: AggregateScore): string {
    const lines: string[] = [];

    lines.push(`## ${gradeEmoji(result.grade)} AI Code Validator Report`);
    lines.push('');
    lines.push(`**Overall Score:** ${result.overallScore}/100 (Grade: ${result.grade})`);
    lines.push(`**Status:** ${result.passed ? '✅ Passed' : '❌ Failed'}`);
    lines.push(`**Files:** ${result.totalFiles} scanned, ${result.passedFiles} passed, ${result.failedFiles} failed`);
    lines.push('');

    if (result.files.length > 0) {
      lines.push('### File Details');
      lines.push('');
      lines.push('| File | Score | Completeness | Coherence | Consistency | Conciseness |');
      lines.push('|------|-------|-------------|-----------|-------------|-------------|');

      for (const file of result.files) {
        const d = file.dimensions;
        lines.push(
          `| \`${file.file}\` | ${file.totalScore}/100 ${gradeEmoji(file.grade)} | ${d.completeness.score}/${d.completeness.maxScore} | ${d.coherence.score}/${d.coherence.maxScore} | ${d.consistency.score}/${d.consistency.maxScore} | ${d.conciseness.score}/${d.conciseness.maxScore} |`,
        );
      }
    }

    lines.push('');
    lines.push('---');
    lines.push('*Powered by [AI Code Validator](https://github.com/raye-deng/ai-code-validator)*');

    return lines.join('\n');
  }

  /** GitLab Code Quality report format */
  private formatGitLabReport(result: AggregateScore): string {
    const issues: GitLabCodeQualityIssue[] = [];

    for (const file of result.files) {
      const allIssues = [
        ...file.dimensions.completeness.details.map(d => ({ d, check: 'completeness' })),
        ...file.dimensions.coherence.details.map(d => ({ d, check: 'coherence' })),
        ...file.dimensions.consistency.details.map(d => ({ d, check: 'consistency' })),
        ...file.dimensions.conciseness.details.map(d => ({ d, check: 'conciseness' })),
      ];

      for (const { d, check } of allIssues) {
        const hash = Buffer.from(`${file.file}:${d}`).toString('base64').slice(0, 32);
        issues.push({
          description: d,
          check_name: `ai-validator/${check}`,
          fingerprint: hash,
          severity: file.totalScore < 50 ? 'major' : 'minor',
          location: {
            path: file.file,
            lines: { begin: 1 },
          },
        });
      }
    }

    return JSON.stringify(issues, null, 2);
  }
}

export default ReportGenerator;
