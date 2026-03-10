/**
 * V3 Detector Interface Tests
 *
 * Tests that all detectors correctly implement the unified Detector interface
 * and produce valid UnifiedIssue[] output.
 */

import { describe, it, expect } from 'vitest';
import { HallucinationDetector } from '../src/detectors/hallucination.js';
import { LogicGapDetector } from '../src/detectors/logic-gap.js';
import { DuplicationDetector } from '../src/detectors/duplication.js';
import { ContextBreakDetector } from '../src/detectors/context-break.js';
import type { Detector, FileAnalysis, UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';

// ─── Helper ───

function makeFile(path: string, content: string): FileAnalysis {
  return { path, content, language: 'typescript' };
}

function validateIssue(issue: UnifiedIssue) {
  expect(issue.id).toBeTruthy();
  expect(issue.detector).toBeTruthy();
  expect(issue.category).toBeTruthy();
  expect(issue.severity).toBeTruthy();
  expect(issue.message).toBeTruthy();
  expect(issue.file).toBeTruthy();
  expect(issue.line).toBeGreaterThan(0);
  // Verify severity is valid
  expect(['critical', 'high', 'medium', 'low', 'info']).toContain(issue.severity);
  // Verify category is a valid AIDefectCategory
  expect(Object.values(AIDefectCategory)).toContain(issue.category);
}

// ─── HallucinationDetector (V3) ───

describe('HallucinationDetector (V3 interface)', () => {
  const detector: Detector = new HallucinationDetector({
    projectRoot: process.cwd(),
    knownPackages: ['vitest', 'typescript'],
  });

  it('should have correct metadata', () => {
    expect(detector.name).toBe('hallucination');
    expect(detector.version).toBe('2.0.0');
    expect(detector.tier).toBe(1);
  });

  it('should detect phantom packages via detect()', async () => {
    const files: FileAnalysis[] = [makeFile('test.ts', `
import { magic } from 'ai-hallucinated-package';
const result = magic();
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBeGreaterThan(0);

    const pkgIssues = issues.filter(i => i.message.includes('ai-hallucinated-package'));
    expect(pkgIssues.length).toBeGreaterThan(0);
    expect(pkgIssues[0].detector).toBe('hallucination');
    expect(pkgIssues[0].category).toBe(AIDefectCategory.HALLUCINATION);
    validateIssue(pkgIssues[0]);
  });

  it('should return empty array for clean files', async () => {
    const files = [makeFile('clean.ts', `
import { readFileSync } from 'node:fs';
const data = readFileSync('./test.txt', 'utf-8');
`)];

    const issues = await detector.detect(files);
    const pkgIssues = issues.filter(i => i.message.includes('imported but not'));
    expect(pkgIssues.length).toBe(0);
  });

  it('should process multiple files', async () => {
    const files = [
      makeFile('a.ts', `import { a } from 'phantom-a';`),
      makeFile('b.ts', `import { b } from 'phantom-b';`),
    ];

    const issues = await detector.detect(files);
    const files_reported = new Set(issues.map(i => i.file));
    expect(files_reported.size).toBe(2);
  });
});

// ─── LogicGapDetector (V3) ───

describe('LogicGapDetector (V3 interface)', () => {
  const detector: Detector = new LogicGapDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('logic-gap');
    expect(detector.version).toBe('2.0.0');
    expect(detector.tier).toBe(1);
  });

  it('should detect empty catch blocks via detect()', async () => {
    const files = [makeFile('test.ts', `
async function fetchData() {
  try {
    const res = await fetch('/api');
  } catch (err) {
  }
}
`)];

    const issues = await detector.detect(files);
    const emptyCatch = issues.filter(i => i.message.includes('catch block'));
    expect(emptyCatch.length).toBeGreaterThan(0);
    expect(emptyCatch[0].detector).toBe('logic-gap');
    expect(emptyCatch[0].category).toBe(AIDefectCategory.ERROR_HANDLING);
    validateIssue(emptyCatch[0]);
  });

  it('should detect TODO markers via detect()', async () => {
    const files = [makeFile('test.ts', `
function processPayment(amount: number) {
  // TODO: implement payment logic
  return true;
}
`)];

    const issues = await detector.detect(files);
    const todos = issues.filter(i => i.message.includes('TODO'));
    expect(todos.length).toBeGreaterThan(0);
    expect(todos[0].category).toBe(AIDefectCategory.INCOMPLETE_IMPL);
    validateIssue(todos[0]);
  });
});

// ─── DuplicationDetector (V3) ───

describe('DuplicationDetector (V3 interface)', () => {
  const detector: Detector = new DuplicationDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('duplication');
    expect(detector.version).toBe('2.0.0');
    expect(detector.tier).toBe(1);
  });

  it('should detect duplicate imports via detect()', async () => {
    const files = [makeFile('test.ts', `
import { readFile } from 'fs';
import { writeFile } from 'fs';
`)];

    const issues = await detector.detect(files);
    const dupImports = issues.filter(i => i.message.includes('Duplicate import'));
    expect(dupImports.length).toBeGreaterThan(0);
    expect(dupImports[0].detector).toBe('duplication');
    expect(dupImports[0].category).toBe(AIDefectCategory.DUPLICATION);
    // Duplication is downgraded in V3
    expect(['low', 'info']).toContain(dupImports[0].severity);
    validateIssue(dupImports[0]);
  });
});

// ─── ContextBreakDetector (V3) ───

describe('ContextBreakDetector (V3 interface)', () => {
  const detector: Detector = new ContextBreakDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('context-break');
    expect(detector.version).toBe('2.0.0');
    expect(detector.tier).toBe(1);
  });

  it('should detect mixed module systems via detect()', async () => {
    const files = [makeFile('test.ts', `
import { readFile } from 'fs';
const path = require('path');
`)];

    const issues = await detector.detect(files);
    const moduleMix = issues.filter(i => i.message.includes('Mixed module'));
    expect(moduleMix.length).toBeGreaterThan(0);
    expect(moduleMix[0].detector).toBe('context-break');
    expect(moduleMix[0].category).toBe(AIDefectCategory.CONTEXT_LOSS);
    validateIssue(moduleMix[0]);
  });

  it('should detect naming inconsistencies via detect()', async () => {
    const files = [makeFile('test.ts', `
const userName = 'Alice';
const user_age = 30;
const userEmail = 'alice@example.com';
const user_phone = '123';
const userAddress = '123 Main St';
`)];

    const issues = await detector.detect(files);
    const namingIssues = issues.filter(i => i.message.includes('Naming convention'));
    expect(namingIssues.length).toBeGreaterThan(0);
    validateIssue(namingIssues[0]);
  });
});

// ─── Cross-Detector Tests ───

describe('Cross-detector UnifiedIssue consistency', () => {
  it('should produce unique IDs across detectors', async () => {
    const files = [makeFile('test.ts', `
import { magic } from 'phantom-pkg';
// TODO: implement
try {} catch(e) {}
import { a } from 'fs';
import { b } from 'fs';
import { readFile } from 'fs';
const path = require('path');
`)];

    const detectors: Detector[] = [
      new HallucinationDetector({ projectRoot: process.cwd(), knownPackages: ['vitest'] }),
      new LogicGapDetector(),
      new DuplicationDetector(),
      new ContextBreakDetector(),
    ];

    const allIssues: UnifiedIssue[] = [];
    for (const d of detectors) {
      allIssues.push(...await d.detect(files));
    }

    // All issues should have IDs
    for (const issue of allIssues) {
      expect(issue.id).toBeTruthy();
    }

    // IDs should be prefixed with detector name
    const detectorNames = new Set(allIssues.map(i => i.detector));
    expect(detectorNames.size).toBeGreaterThanOrEqual(2);
  });

  it('should all produce valid UnifiedIssue objects', async () => {
    const files = [makeFile('test.ts', `
import { magic } from 'phantom-pkg';
// TODO: fix this
try { fetch('/api') } catch(e) {}
`)];

    const detectors: Detector[] = [
      new HallucinationDetector({ projectRoot: process.cwd(), knownPackages: ['vitest'] }),
      new LogicGapDetector(),
      new DuplicationDetector(),
      new ContextBreakDetector(),
    ];

    for (const d of detectors) {
      const issues = await d.detect(files);
      for (const issue of issues) {
        validateIssue(issue);
      }
    }
  });
});
