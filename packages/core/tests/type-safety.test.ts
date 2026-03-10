/**
 * TypeSafetyDetector Tests
 *
 * Tests TypeScript-specific type safety detection.
 */

import { describe, it, expect } from 'vitest';
import { TypeSafetyDetector } from '../src/detectors/type-safety.js';
import type { FileAnalysis, UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';

// ─── Helper ───

function makeFile(path: string, content: string): FileAnalysis {
  return { path, content, language: 'typescript' };
}

function validateIssue(issue: UnifiedIssue) {
  expect(issue.id).toBeTruthy();
  expect(issue.detector).toBe('type-safety');
  expect(issue.category).toBe(AIDefectCategory.TYPE_SAFETY);
  expect(['critical', 'high', 'medium', 'low', 'info']).toContain(issue.severity);
  expect(issue.message).toBeTruthy();
  expect(issue.file).toBeTruthy();
  expect(issue.line).toBeGreaterThan(0);
}

// ─── Tests ───

describe('TypeSafetyDetector', () => {
  const detector = new TypeSafetyDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('type-safety');
    expect(detector.version).toBe('1.0.0');
    expect(detector.tier).toBe(1);
  });

  // ─── any Usage ───

  it('should detect moderate any usage (1-3 = info)', async () => {
    const files = [makeFile('service.ts', `
function fetchData(url: any): any {
  const result: any = fetch(url);
  return result;
}
`)];

    const issues = await detector.detect(files);
    const anyIssues = issues.filter(i => i.type === 'any-usage');
    expect(anyIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of anyIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('info');
    }
  });

  it('should detect medium any usage (4-8 = low)', async () => {
    const files = [makeFile('handler.ts', `
function handle(a: any, b: any, c: any, d: any): any {
  return a;
}
`)];

    const issues = await detector.detect(files);
    const anyIssues = issues.filter(i => i.type === 'any-usage' || i.type === 'any-abuse');
    expect(anyIssues.length).toBeGreaterThanOrEqual(1);
    // All should be severity low
    for (const issue of anyIssues) {
      expect(issue.severity).toBe('low');
    }
  });

  it('should detect excessive any usage (>8 = medium)', async () => {
    const anyLines = Array.from({ length: 10 }, (_, i) =>
      `const x${i}: any = ${i};`
    ).join('\n');

    const files = [makeFile('messy.ts', anyLines)];

    const issues = await detector.detect(files);
    const anyIssues = issues.filter(i => i.type === 'any-usage' || i.type === 'any-abuse');
    expect(anyIssues.length).toBeGreaterThanOrEqual(1);
    // Should have medium severity for >8
    const hasMedium = anyIssues.some(i => i.severity === 'medium');
    expect(hasMedium).toBe(true);
  });

  it('should detect "as any" assertions', async () => {
    const files = [makeFile('cast.ts', `
const data = response as any;
const value = obj.prop as any;
`)];

    const issues = await detector.detect(files);
    const anyIssues = issues.filter(i => i.type === 'any-usage');
    expect(anyIssues.length).toBeGreaterThanOrEqual(2);
    const asAnyIssues = anyIssues.filter(i => i.message.includes('as any'));
    expect(asAnyIssues.length).toBeGreaterThanOrEqual(2);
  });

  // ─── Missing Return Types ───

  it('should detect missing return types on exported functions', async () => {
    const files = [makeFile('api.ts', `
export function fetchUsers() {
  return db.users.findMany();
}

export async function createUser(data: UserInput) {
  return db.users.create({ data });
}
`)];

    const issues = await detector.detect(files);
    const returnIssues = issues.filter(i => i.type === 'missing-return-type');
    expect(returnIssues.length).toBeGreaterThanOrEqual(1);
    for (const issue of returnIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('low');
    }
  });

  it('should NOT flag exported functions WITH return types', async () => {
    const files = [makeFile('api.ts', `
export function fetchUsers(): Promise<User[]> {
  return db.users.findMany();
}

export async function createUser(data: UserInput): Promise<User> {
  return db.users.create({ data });
}
`)];

    const issues = await detector.detect(files);
    const returnIssues = issues.filter(i => i.type === 'missing-return-type');
    expect(returnIssues.length).toBe(0);
  });

  it('should NOT flag non-exported functions for missing return types', async () => {
    const files = [makeFile('internal.ts', `
function helperFunction() {
  return 42;
}

const privateHelper = () => {
  return 'hello';
};
`)];

    const issues = await detector.detect(files);
    const returnIssues = issues.filter(i => i.type === 'missing-return-type');
    expect(returnIssues.length).toBe(0);
  });

  // ─── Unsafe Assertions ───

  it('should detect "as unknown as X" double assertions', async () => {
    const files = [makeFile('cast.ts', `
const user = data as unknown as User;
const config = raw as unknown as AppConfig;
`)];

    const issues = await detector.detect(files);
    const assertIssues = issues.filter(i => i.type === 'unsafe-assertion');
    expect(assertIssues.length).toBe(2);
    for (const issue of assertIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('medium');
    }
  });

  // ─── Non-null Assertion ───

  it('should detect excessive non-null assertion usage', async () => {
    const files = [makeFile('risky.ts', `
const a = obj!.prop;
const b = arr!.length;
const c = map!.get('key');
const d = ref!.current;
const e = data!.value;
const f = config!.setting;
const g = state!.count;
`)];

    const issues = await detector.detect(files);
    const nonNullIssues = issues.filter(i => i.type === 'non-null-assertion-abuse');
    expect(nonNullIssues.length).toBe(1);
    validateIssue(nonNullIssues[0]);
    expect(nonNullIssues[0].severity).toBe('low');
  });

  it('should NOT flag moderate non-null assertion usage', async () => {
    const files = [makeFile('moderate.ts', `
const a = obj!.prop;
const b = arr!.length;
`)];

    const issues = await detector.detect(files);
    const nonNullIssues = issues.filter(i => i.type === 'non-null-assertion-abuse');
    expect(nonNullIssues.length).toBe(0);
  });

  // ─── File Type Filtering ───

  it('should only analyze .ts and .tsx files', async () => {
    const content = `
const data: any = null;
const x = data as any;
`;
    const jsFile = makeFile('script.js', content);
    const tsFile = makeFile('script.ts', content);
    const tsxFile = makeFile('component.tsx', content);

    const jsIssues = await detector.detect([jsFile]);
    expect(jsIssues.length).toBe(0);

    const tsIssues = await detector.detect([tsFile]);
    expect(tsIssues.length).toBeGreaterThan(0);

    const tsxIssues = await detector.detect([tsxFile]);
    expect(tsxIssues.length).toBeGreaterThan(0);
  });

  // ─── Clean Code ───

  it('should NOT report issues in well-typed code', async () => {
    const files = [makeFile('clean.ts', `
interface User {
  id: string;
  name: string;
  email: string;
}

export function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function createUser(data: Omit<User, 'id'>): User {
  return { ...data, id: crypto.randomUUID() };
}
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should handle empty files', async () => {
    const files = [makeFile('empty.ts', '')];
    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should skip comments with any in them', async () => {
    const files = [makeFile('commented.ts', `
// type: any is bad
/* as any should be avoided */
// const x: any = 1;
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });
});
