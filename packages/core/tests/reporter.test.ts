/**
 * Reporter Module Tests
 *
 * Tests for the unified report generation system:
 * - HTML report generation (all panels, themes)
 * - SARIF 2.1.0 format validation
 * - Enhanced Markdown report
 * - JSON output
 * - Terminal output
 * - Empty issues handling
 */

import { describe, it, expect } from 'vitest';
import { generateReport, generateHTML, generateSARIF, generateMarkdown, generateTerminal } from '../src/reporter/index.js';
import type { ReportData, ReportOptions } from '../src/reporter/types.js';
import type { AggregateScoreV3, DimensionScoreV3 } from '../src/scorer/scoring-engine.js';
import type { UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';
import type { SLAMetrics } from '../src/sla/types.js';
import { SLALevel } from '../src/sla/types.js';

// ─── Test Fixtures ─────────────────────────────────────────────────

function makeDimension(
  id: string,
  name: string,
  maxScore: number,
  score: number,
  issueCount: number,
  issues: UnifiedIssue[] = [],
): DimensionScoreV3 {
  return {
    id: id as any,
    name,
    maxScore,
    score,
    issueCount,
    rawDeduction: 0,
    normalizedDeduction: 0,
    issues,
  };
}

function makeIssue(overrides: Partial<UnifiedIssue> = {}): UnifiedIssue {
  return {
    id: 'hallucination:1',
    detector: 'hallucination-detector',
    category: AIDefectCategory.HALLUCINATION,
    severity: 'high',
    message: 'Package "nonexist-lib" does not exist on npm',
    file: 'src/utils.ts',
    line: 10,
    column: 1,
    suggestion: 'Remove or replace with a valid package',
    source: 'import nonexist from "nonexist-lib";',
    ...overrides,
  };
}

function makeScore(issues: UnifiedIssue[] = []): AggregateScoreV3 {
  return {
    overallScore: 82,
    grade: 'B',
    totalFiles: 3,
    passedFiles: 2,
    failedFiles: 1,
    issueCount: issues.length,
    passed: true,
    threshold: 70,
    timestamp: '2026-03-11T00:00:00.000Z',
    dimensions: {
      aiFaithfulness: makeDimension('aiFaithfulness', 'AI Faithfulness', 35, 28, 1, issues.filter(i => i.category === AIDefectCategory.HALLUCINATION)),
      codeFreshness: makeDimension('codeFreshness', 'Code Freshness', 25, 22, 0),
      contextCoherence: makeDimension('contextCoherence', 'Context Coherence', 20, 18, 0),
      implementationQuality: makeDimension('implementationQuality', 'Implementation Quality', 20, 14, 1, issues.filter(i => i.category === AIDefectCategory.INCOMPLETE_IMPL)),
    },
    files: [{
      file: 'src/utils.ts',
      totalScore: 75,
      grade: 'C',
      issueCount: issues.length,
      passed: true,
      threshold: 70,
      dimensions: {
        aiFaithfulness: makeDimension('aiFaithfulness', 'AI Faithfulness', 35, 25, 1),
        codeFreshness: makeDimension('codeFreshness', 'Code Freshness', 25, 22, 0),
        contextCoherence: makeDimension('contextCoherence', 'Context Coherence', 20, 16, 0),
        implementationQuality: makeDimension('implementationQuality', 'Implementation Quality', 20, 12, 1),
      },
    }],
  };
}

function makeSLA(): SLAMetrics {
  return {
    level: SLALevel.L2_STANDARD,
    scanDurationMs: 5200,
    filesScanned: 3,
    detectorsUsed: 7,
    detectorsTotal: 9,
    aiAnalysis: 'local',
    issuesFound: 2,
    criticalCount: 0,
    highCount: 1,
    mediumCount: 1,
    lowCount: 0,
    infoCount: 0,
    targetDurationMs: 30000,
    withinTarget: true,
    degraded: false,
  };
}

function makeReportData(opts: { withIssues?: boolean; withSLA?: boolean } = {}): ReportData {
  const issues: UnifiedIssue[] = opts.withIssues ? [
    makeIssue(),
    makeIssue({
      id: 'incomplete:1',
      detector: 'logic-gap-detector',
      category: AIDefectCategory.INCOMPLETE_IMPL,
      severity: 'medium',
      message: 'Empty catch block',
      file: 'src/handler.ts',
      line: 42,
      suggestion: 'Add error handling logic',
      source: 'catch (e) {}',
    }),
  ] : [];

  return {
    projectName: 'test-project',
    scanDate: '2026-03-11T00:00:00.000Z',
    score: makeScore(issues),
    issues,
    sla: opts.withSLA ? makeSLA() : undefined,
    filesScanned: 3,
    languages: ['typescript', 'kotlin'],
    duration: 5200,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('Reporter Module', () => {

  // ─── HTML Reporter ───

  describe('HTML Reporter', () => {
    it('should generate valid HTML with DOCTYPE', () => {
      const data = makeReportData({ withIssues: true });
      const html = generateHTML(data, { format: 'html' });
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
    });

    it('should include all main panels', () => {
      const data = makeReportData({ withIssues: true });
      const html = generateHTML(data, { format: 'html' });
      // Header
      expect(html).toContain('Open Code Review Report');
      expect(html).toContain('test-project');
      // Score gauge
      expect(html).toContain('Grade B');
      expect(html).toContain('82');
      // Dimensions
      expect(html).toContain('Scoring Dimensions');
      expect(html).toContain('AI Faithfulness');
      expect(html).toContain('Code Freshness');
      expect(html).toContain('Context Coherence');
      expect(html).toContain('Implementation Quality');
      // Issue summary
      expect(html).toContain('Issue Summary');
      // Issue list
      expect(html).toContain('Issue List');
      expect(html).toContain('nonexist-lib');
    });

    it('should support light theme', () => {
      const data = makeReportData();
      const html = generateHTML(data, { format: 'html', theme: 'light' });
      expect(html).toContain('--bg-primary: #ffffff');
    });

    it('should support dark theme', () => {
      const data = makeReportData();
      const html = generateHTML(data, { format: 'html', theme: 'dark' });
      expect(html).toContain('--bg-primary: #0f172a');
    });

    it('should include SLA panel when SLA data is provided', () => {
      const data = makeReportData({ withIssues: true, withSLA: true });
      const html = generateHTML(data, { format: 'html' });
      expect(html).toContain('SLA Metrics');
      expect(html).toContain('Standard');
      expect(html).toContain('7/9');
    });

    it('should not include SLA panel when no SLA data', () => {
      const data = makeReportData({ withIssues: true });
      const html = generateHTML(data, { format: 'html' });
      expect(html).not.toContain('SLA Metrics');
    });

    it('should include source snippets by default', () => {
      const data = makeReportData({ withIssues: true });
      const html = generateHTML(data, { format: 'html' });
      expect(html).toContain('nonexist-lib');
    });

    it('should handle empty issues gracefully', () => {
      const data = makeReportData({ withIssues: false });
      const html = generateHTML(data, { format: 'html' });
      expect(html).toContain('No Issues Found');
      expect(html).not.toContain('Issue List');
    });
  });

  // ─── SARIF Reporter ───

  describe('SARIF Reporter', () => {
    it('should generate valid SARIF 2.1.0 structure', () => {
      const data = makeReportData({ withIssues: true });
      const sarif = generateSARIF(data);
      expect(sarif.version).toBe('2.1.0');
      expect(sarif.$schema).toContain('sarif-schema-2.1.0');
      expect(sarif.runs).toHaveLength(1);
    });

    it('should include tool driver information', () => {
      const data = makeReportData({ withIssues: true });
      const sarif = generateSARIF(data);
      const driver = sarif.runs[0].tool.driver;
      expect(driver.name).toBe('open-code-review');
      expect(driver.version).toBe('0.3.0');
      expect(driver.informationUri).toBeTruthy();
    });

    it('should map issues to SARIF results', () => {
      const data = makeReportData({ withIssues: true });
      const sarif = generateSARIF(data);
      expect(sarif.runs[0].results).toHaveLength(2);
      expect(sarif.runs[0].results[0].ruleId).toBe('hallucination:1');
      expect(sarif.runs[0].results[0].level).toBe('error'); // high → error
    });

    it('should map severity correctly', () => {
      const data = makeReportData({ withIssues: true });
      const sarif = generateSARIF(data);
      const levels = sarif.runs[0].results.map((r: any) => r.level);
      expect(levels).toContain('error');   // high
      expect(levels).toContain('warning'); // medium
    });

    it('should include location information', () => {
      const data = makeReportData({ withIssues: true });
      const sarif = generateSARIF(data);
      const loc = sarif.runs[0].results[0].locations[0].physicalLocation;
      expect(loc.artifactLocation.uri).toBe('src/utils.ts');
      expect(loc.region.startLine).toBe(10);
    });

    it('should deduplicate rules', () => {
      const data = makeReportData({ withIssues: true });
      const sarif = generateSARIF(data);
      const ruleIds = sarif.runs[0].tool.driver.rules.map((r: any) => r.id);
      // Should have unique rule IDs
      expect(new Set(ruleIds).size).toBe(ruleIds.length);
    });

    it('should handle empty issues', () => {
      const data = makeReportData({ withIssues: false });
      const sarif = generateSARIF(data);
      expect(sarif.runs[0].results).toHaveLength(0);
      expect(sarif.runs[0].tool.driver.rules).toHaveLength(0);
    });
  });

  // ─── Markdown Reporter ───

  describe('Markdown Reporter', () => {
    it('should generate Markdown with overall score', () => {
      const data = makeReportData({ withIssues: true });
      const md = generateMarkdown(data, { format: 'markdown' });
      expect(md).toContain('## ');
      expect(md).toContain('82/100');
      expect(md).toContain('Grade B');
      expect(md).toContain('PASSED');
    });

    it('should include dimension score table', () => {
      const data = makeReportData({ withIssues: true });
      const md = generateMarkdown(data, { format: 'markdown' });
      expect(md).toContain('Scoring Dimensions');
      expect(md).toContain('AI Faithfulness');
      expect(md).toContain('Code Freshness');
    });

    it('should group issues by file', () => {
      const data = makeReportData({ withIssues: true });
      const md = generateMarkdown(data, { format: 'markdown' });
      expect(md).toContain('Issues by File');
      expect(md).toContain('src/utils.ts');
      expect(md).toContain('src/handler.ts');
    });

    it('should include fix suggestions', () => {
      const data = makeReportData({ withIssues: true });
      const md = generateMarkdown(data, { format: 'markdown' });
      expect(md).toContain('Remove or replace with a valid package');
      expect(md).toContain('Add error handling logic');
    });

    it('should include SLA metrics when provided', () => {
      const data = makeReportData({ withIssues: true, withSLA: true });
      const md = generateMarkdown(data, { format: 'markdown' });
      expect(md).toContain('SLA Metrics');
      expect(md).toContain('Standard');
    });

    it('should use collapsible sections', () => {
      const data = makeReportData({ withIssues: true });
      const md = generateMarkdown(data, { format: 'markdown' });
      expect(md).toContain('<details>');
      expect(md).toContain('</details>');
    });
  });

  // ─── JSON Reporter ───

  describe('JSON Reporter', () => {
    it('should generate valid JSON', () => {
      const data = makeReportData({ withIssues: true });
      const json = generateReport(data, { format: 'json' });
      const parsed = JSON.parse(json);
      expect(parsed.projectName).toBe('test-project');
      expect(parsed.issues).toHaveLength(2);
      expect(parsed.score.overallScore).toBe(82);
    });
  });

  // ─── Terminal Reporter ───

  describe('Terminal Reporter', () => {
    it('should generate terminal output with project info', () => {
      const data = makeReportData({ withIssues: true });
      const term = generateTerminal(data, { format: 'terminal' });
      expect(term).toContain('Open Code Review V3');
      expect(term).toContain('test-project');
      expect(term).toContain('82/100');
    });

    it('should include dimension bars', () => {
      const data = makeReportData({ withIssues: true });
      const term = generateTerminal(data, { format: 'terminal' });
      expect(term).toContain('AI Faithfulness');
      expect(term).toContain('█');
    });
  });

  // ─── generateReport ───

  describe('generateReport (unified entry)', () => {
    it('should route to HTML format', () => {
      const data = makeReportData();
      const result = generateReport(data, { format: 'html' });
      expect(result).toContain('<!DOCTYPE html>');
    });

    it('should route to SARIF format', () => {
      const data = makeReportData({ withIssues: true });
      const result = generateReport(data, { format: 'sarif' });
      const parsed = JSON.parse(result);
      expect(parsed.version).toBe('2.1.0');
    });

    it('should route to Markdown format', () => {
      const data = makeReportData();
      const result = generateReport(data, { format: 'markdown' });
      expect(result).toContain('##');
    });

    it('should route to JSON format', () => {
      const data = makeReportData();
      const result = generateReport(data, { format: 'json' });
      expect(JSON.parse(result).projectName).toBe('test-project');
    });

    it('should route to Terminal format', () => {
      const data = makeReportData();
      const result = generateReport(data, { format: 'terminal' });
      expect(result).toContain('Open Code Review');
    });
  });
});
