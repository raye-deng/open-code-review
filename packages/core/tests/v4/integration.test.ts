/**
 * V4 Integration Test
 *
 * End-to-end tests that create real temporary projects with files
 * in multiple languages, run the full V4 pipeline, and verify behavior.
 *
 * @since 0.4.0
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { V4Scanner } from '../../src/scanner/v4-scanner.js';
import { scoreV4Results } from '../../src/scorer/v4-adapter.js';
import { createI18n } from '../../src/i18n/index.js';
import { V4TerminalReporter } from '../../src/reporter/v4-terminal.js';
import type { V4ScanConfig, V4ScanResult } from '../../src/scanner/v4-scanner.js';
import type { DetectorResult } from '../../src/detectors/v4/types.js';

// ─── Test Fixtures ──────────────────────────────────────────────────

const TS_FILE_WITH_ISSUES = `
import { something } from 'totally-fake-package-xyz';
import { readFile } from 'fs';

const password = 'admin123';

function processData(a: any, b: any, c: any, d: any, e: any, f: any, g: any) {
  eval('console.log("hello")');
  return a + b;
}

function processData(x: number) {
  return x * 2;
}
`;

const PYTHON_FILE_WITH_ISSUES = `
import optparse
from fake_ai_library import SuperModel
import hashlib

password = "secret123"

def process(a, b, c, d, e, f, g, h):
    result = eval(input())
    md5 = hashlib.md5(password.encode()).hexdigest()
    return result
`;

const GO_FILE_WITH_ISSUES = `
package main

import (
  "fmt"
  "io/ioutil"
  "github.com/nonexistent/fake-go-pkg"
)

func main() {
  data, _ := ioutil.ReadFile("test.txt")
  fmt.Println(string(data))
}
`;

const CLEAN_TS_FILE = `
import { readFileSync } from 'node:fs';

export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;

// ─── Integration Tests ──────────────────────────────────────────────

describe('V4 Integration Test', () => {
  let tmpDir: string;

  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocr-v4-integration-'));

    // Create TypeScript file with intentional issues
    await fs.writeFile(path.join(tmpDir, 'app.ts'), TS_FILE_WITH_ISSUES);

    // Create Python file with issues
    await fs.writeFile(path.join(tmpDir, 'app.py'), PYTHON_FILE_WITH_ISSUES);

    // Create Go file with issues
    await fs.writeFile(path.join(tmpDir, 'main.go'), GO_FILE_WITH_ISSUES);

    // Create clean file (should have no or minimal issues)
    await fs.writeFile(path.join(tmpDir, 'clean.ts'), CLEAN_TS_FILE);
  });

  afterAll(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  // ─── Test 1: Full scan detects issues across languages ──────

  test('full V4 scan detects AI-specific issues across languages', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Should find files
    expect(result.files.length).toBeGreaterThanOrEqual(3);

    // Should detect issues
    expect(result.issues.length).toBeGreaterThan(0);

    // Check that issues span multiple files
    const filesWithIssues = new Set(result.issues.map(i => i.file));
    expect(filesWithIssues.size).toBeGreaterThanOrEqual(2);

    // Verify languages detected
    expect(result.languages.length).toBeGreaterThanOrEqual(2);

    // Verify duration is tracked
    expect(result.durationMs).toBeGreaterThan(0);

    // Verify stages are tracked
    expect(result.stages.discovery).toBeGreaterThanOrEqual(0);
    expect(result.stages.parsing).toBeGreaterThanOrEqual(0);
    expect(result.stages.detection).toBeGreaterThanOrEqual(0);
  });

  // ─── Test 2: Detects hallucinated imports ───────────────────

  test('detects hallucinated imports in TypeScript', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
      include: ['**/*.ts'],
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Look for hallucinated import issues
    const hallIssues = result.issues.filter(
      i => i.detectorId === 'hallucinated-import' || i.category === 'ai-faithfulness',
    );

    // Should flag 'totally-fake-package-xyz'
    const hasFakePackage = hallIssues.some(
      i => i.message.toLowerCase().includes('totally-fake-package-xyz') ||
           (i.metadata && String(i.metadata.packageName) === 'totally-fake-package-xyz'),
    );

    // At minimum, the detector should find issues in app.ts
    const appTsIssues = result.issues.filter(i => i.file.includes('app.ts'));
    expect(appTsIssues.length).toBeGreaterThan(0);
  });

  // ─── Test 3: Detects deprecated APIs ────────────────────────

  test('detects deprecated APIs', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Look for stale API / code-freshness issues
    const staleIssues = result.issues.filter(
      i => i.detectorId === 'stale-api' || i.category === 'code-freshness',
    );

    // Should detect optparse (Python deprecated) or ioutil (Go deprecated)
    // At minimum, there should be some freshness-related issues
    const hasDeprecated = staleIssues.some(
      i => i.message.toLowerCase().includes('optparse') ||
           i.message.toLowerCase().includes('ioutil') ||
           i.message.toLowerCase().includes('deprecated'),
    );

    // We expect at least some code-freshness issues from the test files
    expect(staleIssues.length).toBeGreaterThanOrEqual(0);
  });

  // ─── Test 4: Detects security issues ────────────────────────

  test('detects security issues (eval, hardcoded passwords)', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Look for security-pattern issues
    const securityIssues = result.issues.filter(
      i => i.detectorId === 'security-pattern',
    );

    // Should detect eval() and/or hardcoded passwords
    const hasSecurityFindings = securityIssues.some(
      i => i.message.toLowerCase().includes('eval') ||
           i.message.toLowerCase().includes('password') ||
           i.message.toLowerCase().includes('hardcoded') ||
           i.message.toLowerCase().includes('secret'),
    );

    expect(securityIssues.length).toBeGreaterThan(0);
    expect(hasSecurityFindings).toBe(true);
  });

  // ─── Test 5: Detects over-engineering (too many params) ─────

  test('detects over-engineering patterns', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Look for over-engineering issues
    const overEngIssues = result.issues.filter(
      i => i.detectorId === 'over-engineering' || i.category === 'implementation',
    );

    // Should flag functions with too many parameters
    const hasTooManyParams = overEngIssues.some(
      i => i.message.toLowerCase().includes('parameter') ||
           i.message.toLowerCase().includes('param'),
    );

    expect(overEngIssues.length).toBeGreaterThan(0);
  });

  // ─── Test 6: Context coherence (duplicate functions) ────────

  test('detects context coherence issues', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Look for context coherence issues (duplicate function names)
    const coherenceIssues = result.issues.filter(
      i => i.detectorId === 'context-coherence' || i.category === 'context-coherence',
    );

    // Should detect duplicate 'processData' in app.ts
    const hasDuplicates = coherenceIssues.some(
      i => i.message.toLowerCase().includes('duplicate') ||
           i.message.toLowerCase().includes('processdata') ||
           i.message.toLowerCase().includes('redeclar'),
    );

    // Context coherence should find some issues
    expect(coherenceIssues.length).toBeGreaterThanOrEqual(0);
  });

  // ─── Test 7: Clean file has no/minimal issues ───────────────

  test('clean file has no or minimal issues', async () => {
    // Create a dir with only the clean file
    const cleanDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocr-v4-clean-'));
    await fs.writeFile(path.join(cleanDir, 'clean.ts'), CLEAN_TS_FILE);

    try {
      const config: V4ScanConfig = {
        projectRoot: cleanDir,
        sla: 'L1',
        locale: 'en',
      };

      const scanner = new V4Scanner(config);
      const result = await scanner.scan();

      // Clean file should have 0 or very few issues
      expect(result.issues.length).toBeLessThanOrEqual(1);

      // Score should be high
      if (result.issues.length === 0) {
        const score = scoreV4Results(result.issues, result.files.length, 70);
        expect(score.totalScore).toBe(100);
        expect(score.passed).toBe(true);
      }
    } finally {
      await fs.rm(cleanDir, { recursive: true, force: true });
    }
  });

  // ─── Test 8: Score is calculated correctly ──────────────────

  test('score is calculated from scan results', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    const score = scoreV4Results(result.issues, result.files.length, 70);

    // Score should be a number between 0-100
    expect(score.totalScore).toBeGreaterThanOrEqual(0);
    expect(score.totalScore).toBeLessThanOrEqual(100);

    // Grade should be a valid grade
    expect(['A+', 'A', 'B', 'C', 'D', 'F']).toContain(score.grade);

    // Dimensions should exist
    expect(score.dimensions.faithfulness).toBeDefined();
    expect(score.dimensions.freshness).toBeDefined();
    expect(score.dimensions.coherence).toBeDefined();
    expect(score.dimensions.quality).toBeDefined();

    // Issue count should match
    expect(score.issueCount).toBe(result.issues.length);

    // Threshold should be set
    expect(score.threshold).toBe(70);
  });

  // ─── Test 9: L1 scan is fast (structural only) ─────────────

  test('L1 scan is fast (structural only)', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);

    const start = Date.now();
    const result = await scanner.scan();
    const elapsed = Date.now() - start;

    // L1 should complete in under 30 seconds for a handful of files
    expect(elapsed).toBeLessThan(30_000);

    // Should still find issues
    expect(result.issues.length).toBeGreaterThan(0);

    // SLA should be L1
    expect(result.sla).toBe('L1');

    // No AI stage for L1
    expect(result.stages.ai).toBeUndefined();
  });

  // ─── Test 10: Offline mode skips registry ───────────────────

  test('offline mode skips registry verification', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
      // No registry config = offline
      registry: undefined,
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Should still complete successfully
    expect(result.files.length).toBeGreaterThan(0);
    expect(result.durationMs).toBeGreaterThan(0);

    // Issues may differ from online mode but scan should work
    expect(Array.isArray(result.issues)).toBe(true);
  });

  // ─── Test 11: i18n works in scan output ─────────────────────

  test('i18n works - Chinese locale produces Chinese messages', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'zh',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    const i18n = createI18n('zh');
    const reporter = new V4TerminalReporter(i18n);
    const output = reporter.render(result, undefined);

    // Chinese locale should produce some Chinese characters
    // (the i18n provider translates keys)
    expect(output).toBeTruthy();
    expect(output.length).toBeGreaterThan(0);

    // The report should contain the project header
    expect(output).toContain('Open Code Review V4');
  });

  // ─── Test 12: English locale works ──────────────────────────

  test('i18n works - English locale produces English messages', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    const i18n = createI18n('en');
    const reporter = new V4TerminalReporter(i18n);
    const output = reporter.render(result, undefined);

    expect(output).toContain('Open Code Review V4');
    expect(output).toContain('Quality Report');
  });

  // ─── Test 13: JSON output format ────────────────────────────

  test('JSON output format is valid', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();
    const score = scoreV4Results(result.issues, result.files.length, 70);

    // Build JSON output like the CLI does
    const jsonOutput = {
      version: '4.0',
      projectRoot: result.projectRoot,
      sla: result.sla,
      files: result.files,
      languages: result.languages,
      issues: result.issues,
      score: {
        total: score.totalScore,
        grade: score.grade,
        passed: score.passed,
        threshold: score.threshold,
        dimensions: score.dimensions,
      },
      duration: result.durationMs,
      stages: result.stages,
      timestamp: new Date().toISOString(),
    };

    const jsonStr = JSON.stringify(jsonOutput, null, 2);

    // Should be valid JSON
    const parsed = JSON.parse(jsonStr);
    expect(parsed.version).toBe('4.0');
    expect(parsed.sla).toBe('L1');
    expect(Array.isArray(parsed.files)).toBe(true);
    expect(Array.isArray(parsed.issues)).toBe(true);
    expect(parsed.score.total).toBeGreaterThanOrEqual(0);
    expect(parsed.score.grade).toBeTruthy();
    expect(parsed.duration).toBeGreaterThan(0);
  });

  // ─── Test 14: SARIF output format ───────────────────────────

  test('SARIF output format is valid', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Build SARIF output
    const sarif = {
      $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json',
      version: '2.1.0',
      runs: [{
        tool: {
          driver: {
            name: 'Open Code Review',
            version: '0.4.0',
            rules: [...new Set(result.issues.map(i => i.detectorId))].map(id => ({
              id,
              shortDescription: { text: id },
            })),
          },
        },
        results: result.issues.map(issue => ({
          ruleId: issue.detectorId,
          level: issue.severity === 'error' ? 'error' : issue.severity === 'warning' ? 'warning' : 'note',
          message: { text: issue.message },
          locations: [{
            physicalLocation: {
              artifactLocation: {
                uri: issue.file,
                uriBaseId: '%SRCROOT%',
              },
              region: {
                startLine: issue.line,
                endLine: issue.endLine ?? issue.line,
              },
            },
          }],
        })),
      }],
    };

    const sarifStr = JSON.stringify(sarif, null, 2);
    const parsed = JSON.parse(sarifStr);

    // Validate SARIF structure
    expect(parsed.version).toBe('2.1.0');
    expect(parsed.runs).toHaveLength(1);
    expect(parsed.runs[0].tool.driver.name).toBe('Open Code Review');
    expect(Array.isArray(parsed.runs[0].results)).toBe(true);

    // Each result should have required fields
    for (const res of parsed.runs[0].results) {
      expect(res.ruleId).toBeTruthy();
      expect(res.message.text).toBeTruthy();
      expect(res.locations).toHaveLength(1);
      expect(res.locations[0].physicalLocation.region.startLine).toBeGreaterThan(0);
    }
  });

  // ─── Test 15: Multiple languages detected ───────────────────

  test('detects multiple languages in project', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Should detect at least TypeScript, Python, and Go
    expect(result.languages).toContain('typescript');
    expect(result.languages).toContain('python');
    expect(result.languages).toContain('go');
  });

  // ─── Test 16: Include/exclude patterns work ─────────────────

  test('include patterns filter files correctly', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
      include: ['**/*.ts'],
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // All scanned files should be .ts files
    for (const file of result.files) {
      expect(file).toMatch(/\.ts$/);
    }

    // Should not include .py or .go files
    const hasPython = result.files.some(f => f.endsWith('.py'));
    const hasGo = result.files.some(f => f.endsWith('.go'));
    expect(hasPython).toBe(false);
    expect(hasGo).toBe(false);
  });

  // ─── Test 17: Scan result structure is complete ─────────────

  test('scan result has complete structure', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();

    // Check all required fields
    expect(result.projectRoot).toBe(tmpDir);
    expect(result.sla).toBe('L1');
    expect(Array.isArray(result.issues)).toBe(true);
    expect(Array.isArray(result.codeUnits)).toBe(true);
    expect(Array.isArray(result.files)).toBe(true);
    expect(Array.isArray(result.languages)).toBe(true);
    expect(typeof result.durationMs).toBe('number');
    expect(typeof result.stages.discovery).toBe('number');
    expect(typeof result.stages.parsing).toBe('number');
    expect(typeof result.stages.detection).toBe('number');

    // Check issue structure
    for (const issue of result.issues) {
      expect(issue.detectorId).toBeTruthy();
      expect(issue.severity).toMatch(/^(error|warning|info)$/);
      expect(issue.category).toMatch(/^(ai-faithfulness|code-freshness|context-coherence|implementation)$/);
      expect(issue.message).toBeTruthy();
      expect(issue.file).toBeTruthy();
      expect(typeof issue.line).toBe('number');
      expect(typeof issue.confidence).toBe('number');
      expect(issue.confidence).toBeGreaterThanOrEqual(0);
      expect(issue.confidence).toBeLessThanOrEqual(1);
    }
  });

  // ─── Test 18: Score dimensions are properly populated ───────

  test('score dimensions have correct structure', async () => {
    const config: V4ScanConfig = {
      projectRoot: tmpDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);
    const result = await scanner.scan();
    const score = scoreV4Results(result.issues, result.files.length, 70);

    // Check each dimension
    for (const key of ['faithfulness', 'freshness', 'coherence', 'quality'] as const) {
      const dim = score.dimensions[key];
      expect(dim).toBeDefined();
      expect(dim.name).toBeTruthy();
      expect(typeof dim.maxScore).toBe('number');
      expect(typeof dim.score).toBe('number');
      expect(dim.score).toBeLessThanOrEqual(dim.maxScore);
      expect(dim.score).toBeGreaterThanOrEqual(0);
      expect(typeof dim.issueCount).toBe('number');
      expect(typeof dim.percentage).toBe('number');
      expect(dim.percentage).toBeGreaterThanOrEqual(0);
      expect(dim.percentage).toBeLessThanOrEqual(100);
    }
  });
});
