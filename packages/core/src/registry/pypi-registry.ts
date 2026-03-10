/**
 * PyPI Registry — package verification against the Python Package Index.
 *
 * Supports:
 * - Regular packages (e.g. 'requests')
 * - Name normalization (hyphens ↔ underscores, case-insensitive)
 * - Deprecation detection from classifiers and description
 * - Custom registry URLs (enterprise)
 *
 * @since 0.4.0 (V4)
 */

import type { PackageRegistry, PackageVerifyResult, DeprecationInfo, RegistryConfig } from './types.js';
import { RegistryCache } from './cache.js';
import { PYTHON_BUILTINS } from './builtins/python-builtins.js';

export class PyPIRegistry implements PackageRegistry {
  readonly name = 'pypi';
  readonly language = 'python';

  private baseUrl: string;
  private token?: string;
  private timeout: number;
  private cacheTtl: number;
  private cache: RegistryCache;

  constructor(config?: RegistryConfig, cache?: RegistryCache) {
    this.baseUrl = config?.url || 'https://pypi.org';
    this.token = config?.token;
    this.timeout = config?.timeoutMs || 5000;
    this.cacheTtl = config?.cacheTtlSeconds || 86400;
    this.cache = cache || new RegistryCache();
  }

  /**
   * Normalize a PyPI package name.
   * PyPI package names are case-insensitive and treat hyphens, underscores,
   * and periods as equivalent.
   * PEP 503: normalize by lowering and replacing [-_.] with hyphens.
   */
  private normalizeName(name: string): string {
    return name.toLowerCase().replace(/[-_.]+/g, '-');
  }

  /**
   * Verify if a Python package exists on PyPI.
   *
   * 1. Check if it's a Python standard library module
   * 2. Check cache
   * 3. Query PyPI JSON API: GET {baseUrl}/pypi/{packageName}/json
   *    - 200 → exists
   *    - 404 → does not exist
   *    - error → assume exists (conservative)
   */
  async verify(packageName: string): Promise<PackageVerifyResult> {
    const start = Date.now();

    // Check Python stdlib first
    // Python imports use the top-level module name
    const topLevel = packageName.split('.')[0];
    if (PYTHON_BUILTINS.has(topLevel)) {
      return {
        exists: true,
        name: packageName,
        source: 'builtin',
        latencyMs: Date.now() - start,
      };
    }

    // Normalize name for cache and lookup
    const normalized = this.normalizeName(packageName);
    const cacheKey = `pypi:${normalized}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, name: packageName, latencyMs: Date.now() - start };
    }

    // Query PyPI
    try {
      const url = `${this.baseUrl}/pypi/${encodeURIComponent(normalized)}/json`;
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.timeout),
      });

      const latencyMs = Date.now() - start;

      if (response.status === 404) {
        const result: PackageVerifyResult = {
          exists: false,
          name: packageName,
          source: 'registry',
          latencyMs,
        };
        await this.cache.set(cacheKey, result, this.cacheTtl);
        return result;
      }

      // Extract version from response
      let version: string | undefined;
      try {
        const data = await response.json() as { info?: { version?: string } };
        version = data.info?.version;
      } catch {
        // Could not parse, but the package exists
      }

      const result: PackageVerifyResult = {
        exists: true,
        name: packageName,
        version,
        source: 'registry',
        latencyMs,
      };
      await this.cache.set(cacheKey, result, this.cacheTtl);
      return result;

    } catch {
      // Network error → assume exists (conservative)
      return {
        exists: true,
        name: packageName,
        source: 'registry',
        latencyMs: Date.now() - start,
      };
    }
  }

  /**
   * Check if a Python package is deprecated.
   * Looks for:
   * - "Development Status :: 7 - Inactive" in classifiers
   * - Deprecation notices in summary/description
   */
  async checkDeprecated(packageName: string): Promise<DeprecationInfo | null> {
    try {
      const normalized = this.normalizeName(packageName);
      const url = `${this.baseUrl}/pypi/${encodeURIComponent(normalized)}/json`;
      const headers: Record<string, string> = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as {
        info?: {
          classifiers?: string[];
          summary?: string;
          description?: string;
        };
      };

      const info = data.info;
      if (!info) return null;

      // Check classifiers for inactive status
      const classifiers = info.classifiers || [];
      const isInactive = classifiers.some(
        (c: string) => c.includes('Development Status :: 7 - Inactive')
      );

      if (isInactive) {
        return {
          deprecated: true,
          message: 'Package is marked as inactive (Development Status :: 7 - Inactive)',
        };
      }

      // Check summary for deprecation notice
      const summary = (info.summary || '').toLowerCase();
      const description = (info.description || '').toLowerCase();

      if (
        summary.includes('deprecated') ||
        summary.includes('no longer maintained') ||
        description.startsWith('deprecated')
      ) {
        return {
          deprecated: true,
          message: info.summary || 'Package appears to be deprecated',
        };
      }

      return null;
    } catch {
      return null;
    }
  }
}
