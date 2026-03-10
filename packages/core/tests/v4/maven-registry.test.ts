/**
 * Maven Registry Tests
 *
 * Tests Maven Central package verification using mocked fetch.
 * No real HTTP calls are made.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { MavenRegistry } from '../../src/registry/maven-registry.js';
import { RegistryCache } from '../../src/registry/cache.js';

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('MavenRegistry', () => {
  let tmpDir: string;
  let cache: RegistryCache;
  let registry: MavenRegistry;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-maven-test-'));
    cache = new RegistryCache(tmpDir);
    registry = new MavenRegistry(undefined, cache);
    mockFetch.mockReset();
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // cleanup
    }
  });

  // 1. Verify existing group
  it('should verify existing Maven group returns exists=true', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        response: {
          numFound: 15,
          docs: [{ latestVersion: '2.7.0' }],
        },
      }),
    });

    const result = await registry.verify('org.springframework.boot');
    expect(result.exists).toBe(true);
    expect(result.name).toBe('org.springframework.boot');
    expect(result.version).toBe('2.7.0');
    expect(result.source).toBe('registry');
  });

  // 2. Verify non-existent group
  it('should verify non-existent Maven group returns exists=false', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        response: {
          numFound: 0,
          docs: [],
        },
      }),
    });

    const result = await registry.verify('com.fake.nonexistent');
    expect(result.exists).toBe(false);
    expect(result.source).toBe('registry');
  });

  // 3. Handle groupId:artifactId format
  it('should handle groupId:artifactId format', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        response: {
          numFound: 1,
          docs: [{ latestVersion: '3.0.0' }],
        },
      }),
    });

    const result = await registry.verify('org.springframework.boot:spring-boot');
    expect(result.exists).toBe(true);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('g:');
    expect(calledUrl).toContain('a:');
  });

  // 4. Custom Nexus URL
  it('should use custom Nexus/Artifactory URL', async () => {
    const customRegistry = new MavenRegistry(
      { url: 'https://nexus.company.com/service/rest/v1/search' },
      cache,
    );

    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        response: { numFound: 1, docs: [{ latestVersion: '1.0.0' }] },
      }),
    });

    await customRegistry.verify('com.company.internal');
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('nexus.company.com');
  });

  // 5. Java stdlib built-in detection
  it('should return builtin source for Java standard library packages', async () => {
    const result = await registry.verify('java.util');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 6. Java stdlib sub-package detection
  it('should detect Java stdlib sub-packages (e.g. java.util.List)', async () => {
    const result = await registry.verify('java.util.List');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 7. javax built-in detection
  it('should detect javax packages as built-in', async () => {
    const result = await registry.verify('javax.swing.JFrame');
    expect(result.exists).toBe(true);
    expect(result.source).toBe('builtin');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  // 8. Cache integration
  it('should use cache on second call', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        response: { numFound: 1, docs: [{ latestVersion: '2.7.0' }] },
      }),
    });

    await registry.verify('org.springframework.boot');
    const result2 = await registry.verify('org.springframework.boot');
    expect(result2.source).toBe('cache');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  // 9. Network error returns conservative result
  it('should return exists=true on network error (conservative)', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await registry.verify('org.unknown.package');
    expect(result.exists).toBe(true);
  });

  // 10. Non-200 response returns conservative result
  it('should assume exists=true on non-200 response', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      ok: false,
    });

    const result = await registry.verify('org.server.error');
    expect(result.exists).toBe(true);
  });

  // 11. checkDeprecated returns null (Maven doesn't support deprecation API)
  it('should return null for checkDeprecated (not supported by Maven)', async () => {
    const result = await registry.checkDeprecated('org.old.package');
    expect(result).toBeNull();
  });
});
