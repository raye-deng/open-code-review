/**
 * Registry Manager Tests
 *
 * Tests the unified registry manager that routes verification
 * requests to the appropriate language registry.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { RegistryManager } from '../../src/registry/registry-manager.js';
import { RegistryCache } from '../../src/registry/cache.js';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('RegistryManager', () => {
  let tmpDir: string;
  let cache: RegistryCache;
  let manager: RegistryManager;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-manager-test-'));
    cache = new RegistryCache(tmpDir);
    manager = new RegistryManager(undefined, cache);
    mockFetch.mockReset();
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // cleanup
    }
  });

  // 1. Get correct registry per language
  it('should return npm registry for typescript', () => {
    const registry = manager.getRegistry('typescript');
    expect(registry).toBeDefined();
    expect(registry!.name).toBe('npm');
  });

  it('should return npm registry for javascript', () => {
    const registry = manager.getRegistry('javascript');
    expect(registry).toBeDefined();
    expect(registry!.name).toBe('npm');
  });

  it('should return pypi registry for python', () => {
    const registry = manager.getRegistry('python');
    expect(registry).toBeDefined();
    expect(registry!.name).toBe('pypi');
  });

  it('should return maven registry for java', () => {
    const registry = manager.getRegistry('java');
    expect(registry).toBeDefined();
    expect(registry!.name).toBe('maven');
  });

  it('should return maven registry for kotlin', () => {
    const registry = manager.getRegistry('kotlin');
    expect(registry).toBeDefined();
    expect(registry!.name).toBe('maven');
  });

  it('should return go registry for go', () => {
    const registry = manager.getRegistry('go');
    expect(registry).toBeDefined();
    expect(registry!.name).toBe('go');
  });

  // 2. Missing language returns graceful result
  it('should return exists=false for unsupported language', async () => {
    const result = await manager.verifyPackage('rust', 'serde');
    expect(result.exists).toBe(false);
    expect(result.name).toBe('serde');
    expect(result.source).toBe('builtin');
    expect(result.latencyMs).toBe(0);
  });

  // 3. Verify package delegates to correct registry
  it('should delegate verify to npm for typescript packages', async () => {
    // Node.js built-in should work without fetch
    const result = await manager.verifyPackage('typescript', 'fs');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 4. Verify Python built-in
  it('should verify Python stdlib package without network', async () => {
    const result = await manager.verifyPackage('python', 'os');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 5. Verify Go stdlib
  it('should verify Go stdlib package without network', async () => {
    const result = await manager.verifyPackage('go', 'fmt');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
  });

  // 6. Batch verification with concurrency
  it('should batch verify multiple packages', async () => {
    // All Node.js builtins should resolve without fetch
    const results = await manager.verifyBatch('typescript', [
      'fs', 'path', 'os', 'http', 'crypto',
    ]);

    expect(results.size).toBe(5);
    for (const [_name, result] of results) {
      expect(result.exists).toBe(true);
      expect(result.source).toBe('builtin');
    }
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 7. Batch verification deduplicates
  it('should deduplicate package names in batch', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        'dist-tags': { latest: '1.0.0' },
      }),
    });

    const results = await manager.verifyBatch('typescript', [
      'express', 'express', 'express',
    ]);

    expect(results.size).toBe(1);
    expect(results.get('express')?.exists).toBe(true);
    // Should only make 1 fetch call due to dedup
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  // 8. Batch verification for unsupported language
  it('should handle batch verification for unsupported language', async () => {
    const results = await manager.verifyBatch('ruby', ['rails', 'sinatra']);
    expect(results.size).toBe(2);
    for (const [_name, result] of results) {
      expect(result.exists).toBe(false);
    }
  });

  // 9. Cache stats
  it('should report cache stats', async () => {
    const stats = manager.cacheStats();
    expect(stats).toHaveProperty('entries');
    expect(stats).toHaveProperty('hitRate');
    expect(typeof stats.entries).toBe('number');
    expect(typeof stats.hitRate).toBe('number');
  });

  // 10. getRegistry returns undefined for unknown language
  it('should return undefined for unknown language', () => {
    const registry = manager.getRegistry('haskell');
    expect(registry).toBeUndefined();
  });

  // 11. Java stdlib verification
  it('should verify Java stdlib without network', async () => {
    const result = await manager.verifyPackage('java', 'java.util');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
