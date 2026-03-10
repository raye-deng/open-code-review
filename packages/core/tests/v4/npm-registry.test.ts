/**
 * npm Registry Tests
 *
 * Tests npm package verification using mocked fetch.
 * No real HTTP calls are made.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { NpmRegistry } from '../../src/registry/npm-registry.js';
import { RegistryCache } from '../../src/registry/cache.js';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('NpmRegistry', () => {
  let tmpDir: string;
  let cache: RegistryCache;
  let registry: NpmRegistry;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-npm-test-'));
    cache = new RegistryCache(tmpDir);
    registry = new NpmRegistry(undefined, cache);
    mockFetch.mockReset();
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // cleanup
    }
  });

  // 1. Verify existing package (mock 200 response)
  it('should verify existing package returns exists=true', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        'dist-tags': { latest: '4.18.2' },
      }),
    });

    const result = await registry.verify('express');
    expect(result.exists).toBe(true);
    expect(result.name).toBe('express');
    expect(result.version).toBe('4.18.2');
    expect(result.source).toBe('registry');
  });

  // 2. Verify non-existent package (mock 404)
  it('should verify non-existent package returns exists=false', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      ok: false,
      json: async () => ({}),
    });

    const result = await registry.verify('totally-fake-package-xyz');
    expect(result.exists).toBe(false);
    expect(result.name).toBe('totally-fake-package-xyz');
    expect(result.source).toBe('registry');
  });

  // 3. Verify scoped package (@scope/name)
  it('should handle scoped packages correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        'dist-tags': { latest: '5.0.0' },
      }),
    });

    const result = await registry.verify('@angular/core');
    expect(result.exists).toBe(true);
    expect(result.name).toBe('@angular/core');

    // Verify the URL was encoded properly
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('@');
    expect(calledUrl).toContain(encodeURIComponent('angular/core'));
  });

  // 4. Handle timeout gracefully
  it('should handle timeout by returning exists=true (conservative)', async () => {
    mockFetch.mockRejectedValueOnce(new DOMException('The operation was aborted', 'AbortError'));

    const result = await registry.verify('some-package');
    expect(result.exists).toBe(true); // Conservative: assume exists on error
    expect(result.name).toBe('some-package');
  });

  // 5. Cache integration (second call hits cache)
  it('should use cache on second call', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        'dist-tags': { latest: '1.0.0' },
      }),
    });

    // First call — hits registry
    const result1 = await registry.verify('lodash');
    expect(result1.exists).toBe(true);
    expect(result1.source).toBe('registry');

    // Second call — should hit cache (no new fetch)
    const result2 = await registry.verify('lodash');
    expect(result2.exists).toBe(true);
    expect(result2.source).toBe('cache');
    expect(mockFetch).toHaveBeenCalledTimes(1); // Only one fetch call
  });

  // 6. Check deprecated package
  it('should detect deprecated packages', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        deprecated: 'Use @new-package/core instead',
      }),
    });

    const result = await registry.checkDeprecated('old-package');
    expect(result).not.toBeNull();
    expect(result!.deprecated).toBe(true);
    expect(result!.message).toContain('@new-package/core');
  });

  // 7. Non-deprecated package
  it('should return null for non-deprecated packages', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        name: 'express',
        version: '4.18.2',
      }),
    });

    const result = await registry.checkDeprecated('express');
    expect(result).toBeNull();
  });

  // 8. Custom registry URL (enterprise)
  it('should use custom registry URL', async () => {
    const customRegistry = new NpmRegistry(
      { url: 'https://nexus.company.com/repository/npm-group' },
      cache,
    );

    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        'dist-tags': { latest: '1.0.0' },
      }),
    });

    await customRegistry.verify('internal-package');
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('nexus.company.com');
  });

  // 9. Auth token header sent correctly
  it('should send auth token in headers when configured', async () => {
    const authedRegistry = new NpmRegistry(
      { url: 'https://registry.npmjs.org', token: 'my-secret-token' },
      cache,
    );

    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        'dist-tags': { latest: '1.0.0' },
      }),
    });

    await authedRegistry.verify('private-package');
    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect((calledOptions.headers as Record<string, string>)['Authorization']).toBe('Bearer my-secret-token');
  });

  // 10. Node.js built-in modules skip registry lookup
  it('should return builtin source for Node.js built-in modules', async () => {
    const result = await registry.verify('fs');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 11. node: prefix built-ins
  it('should handle node: prefix built-in modules', async () => {
    const result = await registry.verify('node:path');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 12. Network error returns conservative result
  it('should return exists=true on network error (conservative)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await registry.verify('some-package');
    expect(result.exists).toBe(true);
  });

  // 13. JSON parse error on body but status OK
  it('should handle JSON parse failure gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); },
    });

    const result = await registry.verify('weird-package');
    expect(result.exists).toBe(true);
    expect(result.version).toBeUndefined();
  });
});
