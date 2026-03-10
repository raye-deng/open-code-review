/**
 * Registry Cache Tests
 *
 * Tests the file-based caching layer for registry lookups.
 * Uses temporary directories to avoid polluting the real cache.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { RegistryCache } from '../../src/registry/cache.js';
import type { PackageVerifyResult } from '../../src/registry/types.js';

describe('RegistryCache', () => {
  let tmpDir: string;
  let cache: RegistryCache;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-cache-test-'));
    cache = new RegistryCache(tmpDir);
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // cleanup best-effort
    }
  });

  const mockResult: PackageVerifyResult = {
    exists: true,
    name: 'express',
    version: '4.18.2',
    source: 'registry',
    latencyMs: 100,
  };

  // 1. Cache miss returns null
  it('should return null on cache miss', async () => {
    const result = await cache.get('npm:nonexistent');
    expect(result).toBeNull();
  });

  // 2. Cache hit returns stored value
  it('should return stored value on cache hit', async () => {
    await cache.set('npm:express', mockResult, 3600);
    const result = await cache.get('npm:express');
    expect(result).not.toBeNull();
    expect(result!.exists).toBe(true);
    expect(result!.name).toBe('express');
    expect(result!.version).toBe('4.18.2');
    expect(result!.source).toBe('cache');
  });

  // 3. Cache expiry (TTL exceeded)
  it('should return null for expired entries', async () => {
    await cache.set('npm:old-package', mockResult, 1); // 1 second TTL

    // Manually expire by modifying the internal timestamp
    // Wait isn't practical in tests, so we manipulate the cache file directly
    const cacheFile = path.join(tmpDir, 'registry-cache.json');
    await cache.save();

    const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    data['npm:old-package'].timestamp = Math.floor(Date.now() / 1000) - 10; // 10 seconds ago
    fs.writeFileSync(cacheFile, JSON.stringify(data));

    // Create a new cache instance to reload
    const cache2 = new RegistryCache(tmpDir);
    const result = await cache2.get('npm:old-package');
    expect(result).toBeNull();
  });

  // 4. Cache persistence (save/load)
  it('should persist cache to disk and reload', async () => {
    await cache.set('npm:express', mockResult, 86400);
    await cache.save();

    // Verify file exists
    const cacheFile = path.join(tmpDir, 'registry-cache.json');
    expect(fs.existsSync(cacheFile)).toBe(true);

    // Create new cache instance and load
    const cache2 = new RegistryCache(tmpDir);
    const result = await cache2.get('npm:express');
    expect(result).not.toBeNull();
    expect(result!.name).toBe('express');
    expect(result!.exists).toBe(true);
  });

  // 5. Cache stats tracking — hits
  it('should track hit rate', async () => {
    await cache.set('npm:express', mockResult, 86400);

    // 2 hits
    await cache.get('npm:express');
    await cache.get('npm:express');
    // 1 miss
    await cache.get('npm:nonexistent');

    const stats = cache.stats();
    expect(stats.entries).toBe(1);
    expect(stats.hitRate).toBeCloseTo(2 / 3, 2);
  });

  // 6. Cache clear
  it('should clear all entries', async () => {
    await cache.set('npm:express', mockResult, 86400);
    await cache.set('npm:lodash', { ...mockResult, name: 'lodash' }, 86400);
    await cache.save();

    await cache.clear();

    const result = await cache.get('npm:express');
    expect(result).toBeNull();
    expect(cache.stats().entries).toBe(0);
  });

  // 7. Multiple entries
  it('should store and retrieve multiple entries', async () => {
    await cache.set('npm:express', mockResult, 86400);
    await cache.set('pypi:requests', {
      ...mockResult,
      name: 'requests',
      version: '2.31.0',
    }, 86400);

    const npmResult = await cache.get('npm:express');
    const pypiResult = await cache.get('pypi:requests');

    expect(npmResult).not.toBeNull();
    expect(npmResult!.name).toBe('express');
    expect(pypiResult).not.toBeNull();
    expect(pypiResult!.name).toBe('requests');
  });

  // 8. Overwrite existing entry
  it('should overwrite existing entry with new data', async () => {
    await cache.set('npm:express', mockResult, 86400);
    await cache.set('npm:express', {
      ...mockResult,
      version: '5.0.0',
    }, 86400);

    const result = await cache.get('npm:express');
    expect(result).not.toBeNull();
    expect(result!.version).toBe('5.0.0');
  });

  // 9. Corrupted cache file handling
  it('should handle corrupted cache file gracefully', async () => {
    const cacheFile = path.join(tmpDir, 'registry-cache.json');
    fs.writeFileSync(cacheFile, 'not valid json{{{');

    const cache2 = new RegistryCache(tmpDir);
    const result = await cache2.get('npm:express');
    expect(result).toBeNull();
  });

  // 10. Stats with no data
  it('should return zero stats when empty', async () => {
    const stats = cache.stats();
    expect(stats.entries).toBe(0);
    expect(stats.hitRate).toBe(0);
  });

  // 11. Save creates directory if it doesn't exist
  it('should create cache directory on save if it does not exist', async () => {
    const nestedDir = path.join(tmpDir, 'nested', 'cache', 'dir');
    const nestedCache = new RegistryCache(nestedDir);
    await nestedCache.set('npm:test', mockResult, 86400);
    await nestedCache.save();

    expect(fs.existsSync(nestedDir)).toBe(true);
    expect(fs.existsSync(path.join(nestedDir, 'registry-cache.json'))).toBe(true);
  });

  // 12. Source field is 'cache' on hit
  it('should set source to cache on cached result', async () => {
    await cache.set('npm:express', { ...mockResult, source: 'registry' }, 86400);
    const result = await cache.get('npm:express');
    expect(result).not.toBeNull();
    expect(result!.source).toBe('cache');
  });
});
