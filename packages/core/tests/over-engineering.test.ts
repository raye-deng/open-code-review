/**
 * OverEngineeringDetector Tests
 *
 * Tests code complexity detection for AI-generated code.
 */

import { describe, it, expect } from 'vitest';
import { OverEngineeringDetector } from '../src/detectors/over-engineering.js';
import type { FileAnalysis, UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';

// ─── Helper ───

function makeFile(path: string, content: string): FileAnalysis {
  return { path, content, language: 'typescript' };
}

function validateIssue(issue: UnifiedIssue) {
  expect(issue.id).toBeTruthy();
  expect(issue.detector).toBe('over-engineering');
  expect(issue.category).toBe(AIDefectCategory.OVER_ENGINEERING);
  expect(['critical', 'high', 'medium', 'low', 'info']).toContain(issue.severity);
  expect(issue.message).toBeTruthy();
  expect(issue.file).toBeTruthy();
  expect(issue.line).toBeGreaterThan(0);
}

// ─── Tests ───

describe('OverEngineeringDetector', () => {
  const detector = new OverEngineeringDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('over-engineering');
    expect(detector.version).toBe('1.0.0');
    expect(detector.tier).toBe(1);
  });

  // ─── Cyclomatic Complexity ───

  it('should detect high cyclomatic complexity (>15)', async () => {
    // Generate a function with many branches
    const branches = Array.from({ length: 16 }, (_, i) =>
      `  if (x === ${i}) { return ${i}; }`
    ).join('\n');

    const files = [makeFile('complex.ts', `
function complexFunction(x: number): number {
${branches}
  return -1;
}
`)];

    const issues = await detector.detect(files);
    const ccIssues = issues.filter(i => i.type === 'high-complexity');
    expect(ccIssues.length).toBeGreaterThanOrEqual(1);
    validateIssue(ccIssues[0]);
    expect(ccIssues[0].severity).toBe('medium');
  });

  it('should detect very high cyclomatic complexity (>25)', async () => {
    const branches = Array.from({ length: 26 }, (_, i) =>
      `  if (x === ${i}) { return ${i}; }`
    ).join('\n');

    const files = [makeFile('verycomplex.ts', `
function veryComplexFunction(x: number): number {
${branches}
  return -1;
}
`)];

    const issues = await detector.detect(files);
    const ccIssues = issues.filter(i => i.type === 'high-complexity');
    expect(ccIssues.length).toBeGreaterThanOrEqual(1);
    expect(ccIssues[0].severity).toBe('high');
  });

  // ─── Function Length ───

  it('should detect long functions (>80 lines)', async () => {
    const bodyLines = Array.from({ length: 85 }, (_, i) =>
      `  const x${i} = ${i};`
    ).join('\n');

    const files = [makeFile('long.ts', `
function longFunction() {
${bodyLines}
}
`)];

    const issues = await detector.detect(files);
    const lenIssues = issues.filter(i => i.type === 'long-function');
    expect(lenIssues.length).toBeGreaterThanOrEqual(1);
    validateIssue(lenIssues[0]);
    expect(lenIssues[0].severity).toBe('low');
  });

  it('should detect very long functions (>150 lines)', async () => {
    const bodyLines = Array.from({ length: 155 }, (_, i) =>
      `  const x${i} = ${i};`
    ).join('\n');

    const files = [makeFile('verylong.ts', `
function veryLongFunction() {
${bodyLines}
}
`)];

    const issues = await detector.detect(files);
    const lenIssues = issues.filter(i => i.type === 'long-function');
    expect(lenIssues.length).toBeGreaterThanOrEqual(1);
    expect(lenIssues[0].severity).toBe('medium');
  });

  // ─── Nesting Depth ───

  it('should detect deep nesting (>4 levels)', async () => {
    const files = [makeFile('nested.ts', `
function deeplyNested(data: any) {
  if (data) {
    for (const item of data) {
      if (item.active) {
        for (const sub of item.children) {
          if (sub.valid) {
            console.log(sub);
          }
        }
      }
    }
  }
}
`)];

    const issues = await detector.detect(files);
    const nestIssues = issues.filter(i => i.type === 'deep-nesting');
    expect(nestIssues.length).toBeGreaterThanOrEqual(1);
    validateIssue(nestIssues[0]);
  });

  it('should detect very deep nesting (>6 levels)', async () => {
    const files = [makeFile('very-nested.ts', `
function extremelyNested(data: any) {
  if (data) {
    for (const a of data) {
      if (a.x) {
        for (const b of a.children) {
          if (b.y) {
            for (const c of b.items) {
              if (c.z) {
                console.log(c);
              }
            }
          }
        }
      }
    }
  }
}
`)];

    const issues = await detector.detect(files);
    const nestIssues = issues.filter(i => i.type === 'deep-nesting');
    expect(nestIssues.length).toBeGreaterThanOrEqual(1);
    expect(nestIssues[0].severity).toBe('high');
  });

  // ─── Parameter Count ───

  it('should detect too many parameters (>5)', async () => {
    const files = [makeFile('params.ts', `
function tooManyParams(a: string, b: number, c: boolean, d: string, e: number, f: boolean) {
  return a + b + c + d + e + f;
}
`)];

    const issues = await detector.detect(files);
    const paramIssues = issues.filter(i => i.type === 'too-many-params');
    expect(paramIssues.length).toBe(1);
    validateIssue(paramIssues[0]);
    expect(paramIssues[0].severity).toBe('low');
    expect(paramIssues[0].suggestion).toContain('options object');
  });

  it('should detect excessive parameters (>8)', async () => {
    const files = [makeFile('params.ts', `
function wayTooManyParams(a: string, b: number, c: boolean, d: string, e: number, f: boolean, g: string, h: number, i: boolean) {
  return a;
}
`)];

    const issues = await detector.detect(files);
    const paramIssues = issues.filter(i => i.type === 'too-many-params');
    expect(paramIssues.length).toBe(1);
    expect(paramIssues[0].severity).toBe('medium');
  });

  // ─── Clean Code ───

  it('should NOT report issues for simple clean functions', async () => {
    const files = [makeFile('clean.ts', `
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string): string {
  if (!name) {
    return 'Hello, World!';
  }
  return \`Hello, \${name}!\`;
}

const multiply = (x: number, y: number) => x * y;
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should handle empty files', async () => {
    const files = [makeFile('empty.ts', '')];
    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should handle files with no functions', async () => {
    const files = [makeFile('constants.ts', `
export const MAX_SIZE = 100;
export const MIN_SIZE = 10;
export type Config = { name: string };
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  // ─── Multiple Issues ───

  it('should detect multiple complexity issues in one function', async () => {
    const branches = Array.from({ length: 20 }, (_, i) =>
      `  if (x === ${i}) { return ${i}; }`
    ).join('\n');
    const padding = Array.from({ length: 70 }, (_, i) =>
      `  const pad${i} = ${i};`
    ).join('\n');

    const files = [makeFile('multi.ts', `
function messyFunction(a: number, b: string, c: boolean, d: number, e: string, f: boolean, x: number) {
${branches}
${padding}
  return -1;
}
`)];

    const issues = await detector.detect(files);
    // Should have complexity, length, and param count issues
    const types = new Set(issues.map(i => i.type));
    expect(types.size).toBeGreaterThanOrEqual(2);
  });
});
