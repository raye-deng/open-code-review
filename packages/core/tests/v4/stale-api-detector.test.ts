/**
 * StaleAPIDetector Tests
 *
 * Tests detection of deprecated APIs and packages using both
 * registry-based and pattern-based approaches.
 * All registry calls are mocked — no real HTTP.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, vi } from 'vitest';
import { StaleAPIDetector } from '../../src/detectors/v4/stale-api.js';
import type { DetectorContext } from '../../src/detectors/v4/types.js';
import type { CodeUnit } from '../../src/ir/types.js';
import { createCodeUnit } from '../../src/ir/types.js';
import type { RegistryManager } from '../../src/registry/registry-manager.js';
import type { PackageRegistry, DeprecationInfo } from '../../src/registry/types.js';

// ─── Helper: create a file-level CodeUnit ──────────────────────────

function makeFileUnit(overrides: Partial<CodeUnit> & { file?: string; language?: CodeUnit['language'] }): CodeUnit {
  return createCodeUnit({
    id: `file:${overrides.file || 'test.ts'}`,
    file: overrides.file || 'test.ts',
    language: overrides.language || 'typescript',
    kind: 'file',
    location: { startLine: 0, startColumn: 0, endLine: 100, endColumn: 0 },
    source: overrides.source || '',
    ...overrides,
  });
}

function makeFuncUnit(overrides: Partial<CodeUnit>): CodeUnit {
  return createCodeUnit({
    id: `func:${overrides.file || 'test.ts'}:fn`,
    file: overrides.file || 'test.ts',
    language: overrides.language || 'typescript',
    kind: 'function',
    location: { startLine: 0, startColumn: 0, endLine: 20, endColumn: 0 },
    source: overrides.source || '',
    ...overrides,
  });
}

// ─── Helper: create a mock RegistryManager ─────────────────────────

function createMockRegistryManager(
  deprecationMap: Map<string, DeprecationInfo | null>,
): RegistryManager {
  const mockRegistry: PackageRegistry = {
    name: 'mock',
    language: 'typescript',
    verify: vi.fn().mockResolvedValue({ exists: true, name: 'mock', source: 'registry', latencyMs: 0 }),
    checkDeprecated: vi.fn().mockImplementation(async (name: string) => {
      return deprecationMap.get(name) ?? null;
    }),
  };

  return {
    getRegistry: vi.fn().mockReturnValue(mockRegistry),
    verifyBatch: vi.fn(),
    verifyPackage: vi.fn(),
    cacheStats: vi.fn(),
    persistCache: vi.fn(),
  } as unknown as RegistryManager;
}

function createContext(registryManager?: RegistryManager): DetectorContext {
  return {
    projectRoot: '/project',
    allFiles: ['test.ts'],
    registryManager,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('StaleAPIDetector', () => {
  const detector = new StaleAPIDetector();

  it('should have correct metadata', () => {
    expect(detector.id).toBe('stale-api');
    expect(detector.name).toBe('Stale API Detector');
    expect(detector.category).toBe('code-freshness');
    expect(detector.supportedLanguages).toEqual([]);
  });

  // ── Pattern-based detection ────────────────────────────────────

  it('should detect new Buffer() in TypeScript', async () => {
    const unit = makeFuncUnit({
      source: 'const buf = new Buffer("hello");',
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const bufferResult = results.find(r => r.message.includes('Buffer constructor'));
    expect(bufferResult).toBeDefined();
    expect(bufferResult!.severity).toBe('warning');
    expect(bufferResult!.category).toBe('code-freshness');
    expect(bufferResult!.metadata?.replacement).toContain('Buffer.from');
  });

  it('should detect ioutil.ReadFile in Go', async () => {
    const unit = makeFuncUnit({
      file: 'main.go',
      language: 'go',
      source: 'data, err := ioutil.ReadFile("config.json")',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const ioutilResult = results.find(r => r.message.includes('ioutil') || r.metadata?.replacement === 'os.ReadFile');
    expect(ioutilResult).toBeDefined();
    expect(ioutilResult!.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('should detect optparse in Python via deprecated imports', async () => {
    const unit = makeFileUnit({
      file: 'app.py',
      language: 'python',
      imports: [
        { module: 'optparse', symbols: ['OptionParser'], line: 0, isRelative: false, raw: 'from optparse import OptionParser' },
      ],
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const optparseResult = results.find(r => r.message.includes('optparse'));
    expect(optparseResult).toBeDefined();
    expect(optparseResult!.metadata?.replacement).toBe('argparse');
  });

  it('should detect Vector usage in Java', async () => {
    const unit = makeFuncUnit({
      file: 'App.java',
      language: 'java',
      source: 'Vector<String> list = new Vector<>();',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const vectorResult = results.find(r => r.message.includes('Vector'));
    expect(vectorResult).toBeDefined();
    expect(vectorResult!.metadata?.replacement).toContain('ArrayList');
  });

  it('should detect StringBuffer usage in Java', async () => {
    const unit = makeFuncUnit({
      file: 'App.java',
      language: 'java',
      source: 'StringBuffer sb = new StringBuffer();',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const sbResult = results.find(r => r.message.includes('StringBuffer'));
    expect(sbResult).toBeDefined();
  });

  // ── Registry-based deprecation ─────────────────────────────────

  it('should detect registry-level deprecation (mock)', async () => {
    const unit = makeFileUnit({
      imports: [
        { module: 'deprecated-pkg', symbols: ['x'], line: 3, isRelative: false, raw: "import { x } from 'deprecated-pkg'" },
      ],
    });

    const deprecationMap = new Map<string, DeprecationInfo | null>([
      ['deprecated-pkg', {
        deprecated: true,
        message: 'This package is no longer maintained',
        replacement: 'better-pkg',
        since: '2023-01-01',
      }],
    ]);

    const results = await detector.detect([unit], createContext(createMockRegistryManager(deprecationMap)));
    // Should find registry-based deprecation
    const registryResult = results.find(r => r.metadata?.source === 'registry');
    expect(registryResult).toBeDefined();
    expect(registryResult!.message).toContain('deprecated-pkg');
    expect(registryResult!.message).toContain('better-pkg');
    expect(registryResult!.confidence).toBe(0.95);
  });

  it('should not flag current APIs', async () => {
    const unit = makeFuncUnit({
      source: `
const data = Buffer.from("hello");
const url = new URL("https://example.com");
const exists = fs.existsSync("./file");
      `.trim(),
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    // None of these should match deprecated patterns
    expect(results.filter(r => r.message.includes('Buffer constructor'))).toHaveLength(0);
  });

  it('should have correct per-language pattern matching (not cross-pollinate)', async () => {
    // Python patterns should not fire on TypeScript code
    const tsUnit = makeFuncUnit({
      source: 'import optparse from "optparse-cli";', // npm package, not Python
      language: 'typescript',
    });

    const results = await detector.detect([tsUnit], createContext());
    // The Python-specific "import optparse" pattern should not match here
    // because it uses \bimport\s+optparse\b which is Python-specific import syntax
    const optparseResults = results.filter(r => r.message.includes('optparse'));
    expect(optparseResults).toHaveLength(0);
  });

  it('should assign appropriate confidence levels', async () => {
    const unit = makeFuncUnit({
      source: 'const buf = new Buffer(10);',
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    // All results should have confidence between 0 and 1
    for (const r of results) {
      expect(r.confidence).toBeGreaterThan(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('should detect deprecated io/ioutil import in Go', async () => {
    const unit = makeFileUnit({
      file: 'main.go',
      language: 'go',
      imports: [
        { module: 'io/ioutil', symbols: [], line: 2, isRelative: false, raw: '"io/ioutil"' },
      ],
    });

    const results = await detector.detect([unit], createContext());
    const ioutilResult = results.find(r => r.message.includes('io/ioutil') || r.message.includes('ioutil'));
    expect(ioutilResult).toBeDefined();
  });

  it('should detect asyncio.coroutine in Python', async () => {
    const unit = makeFuncUnit({
      file: 'app.py',
      language: 'python',
      source: '@asyncio.coroutine\ndef my_coroutine():\n    pass',
    });

    const results = await detector.detect([unit], createContext());
    const asyncResult = results.find(r => r.message.includes('asyncio.coroutine') || r.metadata?.replacement === 'async def');
    expect(asyncResult).toBeDefined();
  });

  it('should detect kotlin.coroutines.experimental in Kotlin', async () => {
    const unit = makeFuncUnit({
      file: 'App.kt',
      language: 'kotlin',
      source: 'import kotlin.coroutines.experimental.CoroutineContext',
    });

    const results = await detector.detect([unit], createContext());
    const kotlinResult = results.find(r => r.message.includes('coroutines') || r.metadata?.replacement === 'kotlin.coroutines');
    expect(kotlinResult).toBeDefined();
  });

  it('should not flag when registry says not deprecated', async () => {
    const unit = makeFileUnit({
      imports: [
        { module: 'active-pkg', symbols: ['x'], line: 0, isRelative: false, raw: "import { x } from 'active-pkg'" },
      ],
    });

    const deprecationMap = new Map<string, DeprecationInfo | null>([
      ['active-pkg', null], // Not deprecated
    ]);

    const results = await detector.detect([unit], createContext(createMockRegistryManager(deprecationMap)));
    const registryResults = results.filter(r => r.metadata?.source === 'registry');
    expect(registryResults).toHaveLength(0);
  });

  it('should detect url.parse() in TypeScript', async () => {
    const unit = makeFuncUnit({
      source: 'const parsed = url.parse(myUrl);',
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    const urlResult = results.find(r => r.message.includes('url.parse'));
    expect(urlResult).toBeDefined();
  });
});
