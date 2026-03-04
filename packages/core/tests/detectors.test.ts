/**
 * Detector unit tests
 *
 * Tests core detectors against real-world AI code patterns.
 */

import { describe, it, expect } from 'vitest';
import { HallucinationDetector } from '../src/detectors/hallucination.js';
import { LogicGapDetector } from '../src/detectors/logic-gap.js';
import { DuplicationDetector } from '../src/detectors/duplication.js';
import { ContextBreakDetector } from '../src/detectors/context-break.js';
import { ScoringEngine } from '../src/scorer/scoring-engine.js';

// ─── Hallucination Detector ───

describe('HallucinationDetector', () => {
  const detector = new HallucinationDetector({
    projectRoot: process.cwd(),
    knownPackages: ['vitest', 'typescript'],
  });

  it('should detect phantom npm packages', () => {
    const source = `
import { magic } from 'ai-hallucinated-package';
import { readFile } from 'node:fs';

const result = magic();
`;
    const result = detector.analyze('test.ts', source);
    const phantomPkgs = result.issues.filter(i => i.type === 'phantom-package');
    expect(phantomPkgs.length).toBeGreaterThan(0);
    expect(phantomPkgs[0].message).toContain('ai-hallucinated-package');
  });

  it('should allow Node.js built-in modules', () => {
    const source = `
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const data = readFileSync(join('.', 'file.txt'), 'utf-8');
`;
    const result = detector.analyze('test.ts', source);
    const phantomPkgs = result.issues.filter(i => i.type === 'phantom-package');
    expect(phantomPkgs.length).toBe(0);
  });

  it('should skip relative imports', () => {
    const source = `
import { helper } from './utils/helper';
import { config } from '../config';
`;
    const result = detector.analyze('test.ts', source);
    const phantomPkgs = result.issues.filter(i => i.type === 'phantom-package');
    expect(phantomPkgs.length).toBe(0);
  });

  it('should detect phantom function calls', () => {
    const source = `
const data = fetchUserData(123);
const processed = transformResponse(data);
`;
    const result = detector.analyze('test.ts', source);
    const phantomFns = result.issues.filter(i => i.type === 'phantom-function');
    expect(phantomFns.length).toBeGreaterThan(0);
  });
});

// ─── Logic Gap Detector ───

describe('LogicGapDetector', () => {
  const detector = new LogicGapDetector();

  it('should detect empty catch blocks', () => {
    const source = `
async function fetchData() {
  try {
    const res = await fetch('/api');
    return res.json();
  } catch (err) {
  }
}
`;
    const result = detector.analyze('test.ts', source);
    const emptyCatch = result.issues.filter(i => i.type === 'empty-catch');
    expect(emptyCatch.length).toBeGreaterThan(0);
  });

  it('should detect TODO markers', () => {
    const source = `
function processPayment(amount: number) {
  // TODO: implement payment logic
  return true;
}
`;
    const result = detector.analyze('test.ts', source);
    const incomplete = result.issues.filter(i => i.type === 'incomplete-implementation');
    expect(incomplete.length).toBeGreaterThan(0);
  });

  it('should detect not-implemented throws', () => {
    const source = `
function validateUser(user: any) {
  throw new Error('not implemented');
}
`;
    const result = detector.analyze('test.ts', source);
    const incomplete = result.issues.filter(i => i.type === 'incomplete-implementation');
    expect(incomplete.length).toBeGreaterThan(0);
  });
});

// ─── Duplication Detector ───

describe('DuplicationDetector', () => {
  const detector = new DuplicationDetector();

  it('should detect duplicate imports', () => {
    const source = `
import { readFile } from 'fs';
import { writeFile } from 'fs';
`;
    const result = detector.analyze('test.ts', source);
    const dupImports = result.issues.filter(i => i.type === 'duplicate-import');
    expect(dupImports.length).toBeGreaterThan(0);
  });

  it('should not flag different module imports', () => {
    const source = `
import { readFile } from 'fs';
import { join } from 'path';
`;
    const result = detector.analyze('test.ts', source);
    expect(result.issues.length).toBe(0);
  });
});

// ─── Context Break Detector ───

describe('ContextBreakDetector', () => {
  const detector = new ContextBreakDetector();

  it('should detect mixed module systems', () => {
    const source = `
import { readFile } from 'fs';

const path = require('path');
`;
    const result = detector.analyze('test.ts', source);
    const moduleMix = result.issues.filter(i => i.type === 'module-system-mix');
    expect(moduleMix.length).toBeGreaterThan(0);
  });

  it('should detect naming convention inconsistencies', () => {
    const source = `
const userName = 'Alice';
const user_age = 30;
const userEmail = 'alice@example.com';
const user_phone = '123';
const userAddress = '123 Main St';
`;
    const result = detector.analyze('test.ts', source);
    const namingIssues = result.issues.filter(i => i.type === 'naming-inconsistency');
    expect(namingIssues.length).toBeGreaterThan(0);
  });
});

// ─── Scoring Engine ───

describe('ScoringEngine', () => {
  const engine = new ScoringEngine(70);

  it('should produce 100 for clean code', () => {
    const score = engine.scoreFile('clean.ts', null, null, null, null);
    expect(score.totalScore).toBe(100);
    expect(score.grade).toBe('A');
    expect(score.passed).toBe(true);
  });

  it('should aggregate scores correctly', () => {
    const s1 = engine.scoreFile('a.ts', null, null, null, null);
    const s2 = engine.scoreFile('b.ts', null, null, null, null);
    const agg = engine.aggregate([s1, s2]);
    expect(agg.overallScore).toBe(100);
    expect(agg.passed).toBe(true);
  });
});
