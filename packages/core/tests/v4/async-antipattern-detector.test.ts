/**
 * AsyncAntipatternDetector Tests
 *
 * Tests detection of async/Promise anti-patterns in AI-generated code:
 * - async forEach (classic AI mistake)
 * - Promise constructor anti-pattern
 * - .then() without .catch()
 * - Sequential independent awaits
 * - Python sync-in-async
 * - Go goroutine error handling
 */

import { describe, it, expect } from 'vitest';
import { AsyncAntipatternDetector } from '../../src/detectors/v4/async-antipattern.js';
import type { CodeUnit, SupportedLanguage } from '../../src/ir/types.js';
import type { DetectorContext } from '../../src/detectors/v4/types.js';

// ─── Test Helpers ──────────────────────────────────────────────────

function makeUnit(
  source: string,
  overrides: Partial<CodeUnit> = {},
): CodeUnit {
  const lines = source.split('\n');
  return {
    id: overrides.id ?? 'test-unit',
    file: overrides.file ?? 'test.ts',
    kind: overrides.kind ?? 'file',
    language: (overrides.language ?? 'typescript') as SupportedLanguage,
    source,
    location: overrides.location ?? { startLine: 0, endLine: lines.length - 1 },
    imports: overrides.imports ?? [],
    definitions: overrides.definitions ?? [],
    references: overrides.references ?? [],
    calls: overrides.calls ?? [],
    complexity: overrides.complexity ?? {
      linesOfCode: lines.length,
      cyclomaticComplexity: 1,
      maxNestingDepth: 0,
      parameterCount: 0,
    },
  };
}

const DEFAULT_CONTEXT: DetectorContext = {
  projectRoot: '/test',
  allFiles: ['test.ts'],
};

// ─── Tests ─────────────────────────────────────────────────────────

describe('AsyncAntipatternDetector', () => {
  const detector = new AsyncAntipatternDetector();

  describe('metadata', () => {
    it('should have correct id and category', () => {
      expect(detector.id).toBe('async-antipattern');
      expect(detector.category).toBe('implementation');
    });
  });

  // ── async forEach ──────────────────────────────────────────────

  describe('async forEach detection', () => {
    it('should detect async callback in forEach', async () => {
      const unit = makeUnit(`
const items = [1, 2, 3];
items.forEach(async (item) => {
  await processItem(item);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      const asyncForEach = results.filter(r => r.metadata?.patternId === 'async-foreach');
      expect(asyncForEach.length).toBe(1);
      expect(asyncForEach[0].severity).toBe('error');
      expect(asyncForEach[0].confidence).toBe(0.95);
    });

    it('should detect async function keyword in forEach', async () => {
      const unit = makeUnit(`
data.forEach(async function(item) {
  await save(item);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'async-foreach')).toBe(true);
    });

    it('should not flag non-async forEach', async () => {
      const unit = makeUnit(`
items.forEach((item) => {
  console.log(item);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'async-foreach')).toBe(false);
    });
  });

  // ── Promise constructor anti-pattern ───────────────────────────

  describe('Promise constructor anti-pattern', () => {
    it('should detect async executor in Promise constructor', async () => {
      const unit = makeUnit(`
const result = new Promise(async (resolve, reject) => {
  const data = await fetchData();
  resolve(data);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      const promiseAsync = results.filter(r => r.metadata?.patternId === 'promise-constructor-async');
      expect(promiseAsync.length).toBe(1);
      expect(promiseAsync[0].severity).toBe('warning');
    });

    it('should detect Promise constructor wrapping await', async () => {
      const unit = makeUnit(`
const result = new Promise((resolve, reject) => {
  const data = await fetchData();
  resolve(data);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'promise-constructor-wrapping-await')).toBe(true);
    });

    it('should not flag normal Promise constructor', async () => {
      const unit = makeUnit(`
const result = new Promise((resolve, reject) => {
  fs.readFile('test.txt', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'promise-constructor-async')).toBe(false);
    });
  });

  // ── .then() without .catch() ───────────────────────────────────

  describe('.then() without .catch()', () => {
    it('should detect .then() without .catch()', async () => {
      const unit = makeUnit(`
fetchData().then(data => {
  processData(data);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'then-without-catch')).toBe(true);
    });

    it('should not flag .then().catch() chain', async () => {
      const unit = makeUnit(`
fetchData().then(data => {
  processData(data);
}).catch(err => {
  handleError(err);
});
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'then-without-catch')).toBe(false);
    });
  });

  // ── Sequential independent awaits ──────────────────────────────

  describe('sequential independent awaits', () => {
    it('should detect consecutive independent awaits', async () => {
      const unit = makeUnit(`
async function loadDashboard() {
  const users = await fetchUsers();
  const orders = await fetchOrders();
  return { users, orders };
}
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'sequential-independent-awaits')).toBe(true);
    });
  });

  // ── Python async anti-patterns ─────────────────────────────────

  describe('Python async anti-patterns', () => {
    it('should detect asyncio.run() usage', async () => {
      const unit = makeUnit(`
    result = asyncio.run(fetch_data())
    return result
`, { language: 'python' as SupportedLanguage, file: 'main.py' });
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'python-asyncio-run-in-async')).toBe(true);
    });
  });

  // ── Go async anti-patterns ─────────────────────────────────────

  describe('Go goroutine patterns', () => {
    it('should not flag goroutine with errgroup in context', async () => {
      const unit = makeUnit(`
g, ctx := errgroup.WithContext(context.Background())
go func() {
  doWork()
}
`, { language: 'go' as SupportedLanguage, file: 'main.go' });
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'go-goroutine-no-error-handling')).toBe(false);
    });
  });

  // ── Edge cases ─────────────────────────────────────────────────

  describe('edge cases', () => {
    it('should not crash on empty source', async () => {
      const unit = makeUnit('');
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results).toEqual([]);
    });

    it('should skip comment lines', async () => {
      const unit = makeUnit(`
// items.forEach(async (item) => {
//   await processItem(item);
// });
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.some(r => r.metadata?.patternId === 'async-foreach')).toBe(false);
    });

    it('should handle multiple patterns in same file', async () => {
      const unit = makeUnit(`
items.forEach(async (item) => {
  await process(item);
});

const result = new Promise(async (resolve) => {
  resolve(await getData());
});

fetchData().then(handler);
`);
      const results = await detector.detect([unit], DEFAULT_CONTEXT);
      expect(results.length).toBeGreaterThanOrEqual(2);
    });
  });
});
