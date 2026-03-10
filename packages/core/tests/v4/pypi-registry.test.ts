/**
 * PyPI Registry Tests
 *
 * Tests Python package verification using mocked fetch.
 * No real HTTP calls are made.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { PyPIRegistry } from '../../src/registry/pypi-registry.js';
import { RegistryCache } from '../../src/registry/cache.js';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('PyPIRegistry', () => {
  let tmpDir: string;
  let cache: RegistryCache;
  let registry: PyPIRegistry;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-pypi-test-'));
    cache = new RegistryCache(tmpDir);
    registry = new PyPIRegistry(undefined, cache);
    mockFetch.mockReset();
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // cleanup
    }
  });

  // 1. Verify existing package
  it('should verify existing package returns exists=true', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: { version: '2.31.0', name: 'requests' },
      }),
    });

    const result = await registry.verify('requests');
    expect(result.exists).toBe(true);
    expect(result.name).toBe('requests');
    expect(result.version).toBe('2.31.0');
    expect(result.source).toBe('registry');
  });

  // 2. Verify non-existent package
  it('should verify non-existent package returns exists=false', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      ok: false,
    });

    const result = await registry.verify('totally-fake-python-package');
    expect(result.exists).toBe(false);
    expect(result.source).toBe('registry');
  });

  // 3. Handle name normalization (hyphens → underscores)
  it('should normalize package names for lookup', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: { version: '4.12.2', name: 'beautifulsoup4' },
      }),
    });

    const result = await registry.verify('Beautiful_Soup4');
    expect(result.exists).toBe(true);

    // Should have normalized: Beautiful_Soup4 → beautiful-soup4
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('beautiful-soup4');
  });

  // 4. Python stdlib detection
  it('should return builtin source for Python stdlib modules', async () => {
    const result = await registry.verify('os');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 5. Python sub-module stdlib detection
  it('should detect stdlib sub-modules (e.g. os.path)', async () => {
    const result = await registry.verify('os.path');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 6. Deprecation detection from classifiers
  it('should detect deprecated packages from classifiers', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: {
          classifiers: [
            'Development Status :: 7 - Inactive',
            'Programming Language :: Python :: 3',
          ],
          summary: 'An old package',
        },
      }),
    });

    const result = await registry.checkDeprecated('old-package');
    expect(result).not.toBeNull();
    expect(result!.deprecated).toBe(true);
    expect(result!.message).toContain('Inactive');
  });

  // 7. Deprecation detection from summary
  it('should detect deprecated packages from summary text', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: {
          classifiers: [],
          summary: 'DEPRECATED: Use new-package instead',
        },
      }),
    });

    const result = await registry.checkDeprecated('deprecated-pkg');
    expect(result).not.toBeNull();
    expect(result!.deprecated).toBe(true);
  });

  // 8. Non-deprecated package
  it('should return null for non-deprecated packages', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: {
          classifiers: [
            'Development Status :: 5 - Production/Stable',
            'Programming Language :: Python :: 3',
          ],
          summary: 'A great package',
        },
      }),
    });

    const result = await registry.checkDeprecated('good-package');
    expect(result).toBeNull();
  });

  // 9. Cache integration
  it('should use cache on second call', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: { version: '2.31.0' },
      }),
    });

    await registry.verify('requests');
    const result2 = await registry.verify('requests');
    expect(result2.source).toBe('cache');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  // 10. Network error returns conservative result
  it('should return exists=true on network error (conservative)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await registry.verify('some-package');
    expect(result.exists).toBe(true);
  });

  // 11. Custom registry URL
  it('should use custom registry URL', async () => {
    const customRegistry = new PyPIRegistry(
      { url: 'https://nexus.company.com/repository/pypi-group' },
      cache,
    );

    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        info: { version: '1.0.0' },
      }),
    });

    await customRegistry.verify('internal-package');
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('nexus.company.com');
  });
});
