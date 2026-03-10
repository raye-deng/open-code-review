/**
 * Registry Manager — manages all language-specific registries.
 *
 * Provides a unified interface for verifying packages across
 * all supported languages. Routes verification requests to the
 * appropriate registry based on language.
 *
 * @since 0.4.0 (V4)
 */

import type { PackageRegistry, PackageVerifyResult, RegistryOptions } from './types.js';
import { RegistryCache } from './cache.js';
import { NpmRegistry } from './npm-registry.js';
import { PyPIRegistry } from './pypi-registry.js';
import { MavenRegistry } from './maven-registry.js';
import { GoProxyRegistry } from './go-registry.js';

export class RegistryManager {
  private registries: Map<string, PackageRegistry> = new Map();
  private cache: RegistryCache;

  constructor(options?: RegistryOptions, cache?: RegistryCache) {
    this.cache = cache || new RegistryCache();

    // Initialize registries based on config
    const npmRegistry = new NpmRegistry(options?.npm, this.cache);
    const pypiRegistry = new PyPIRegistry(options?.pypi, this.cache);
    const mavenRegistry = new MavenRegistry(options?.maven, this.cache);
    const goRegistry = new GoProxyRegistry(options?.go, this.cache);

    this.registries.set('typescript', npmRegistry);
    this.registries.set('javascript', npmRegistry);
    this.registries.set('python', pypiRegistry);
    this.registries.set('java', mavenRegistry);
    this.registries.set('kotlin', mavenRegistry);
    this.registries.set('go', goRegistry);
  }

  /**
   * Get the registry for a given language.
   */
  getRegistry(language: string): PackageRegistry | undefined {
    return this.registries.get(language);
  }

  /**
   * Verify a package exists for a given language.
   * If no registry is configured for the language, returns a graceful result.
   */
  async verifyPackage(language: string, packageName: string): Promise<PackageVerifyResult> {
    const registry = this.registries.get(language);
    if (!registry) {
      return {
        exists: false,
        name: packageName,
        source: 'builtin',
        latencyMs: 0,
      };
    }
    return registry.verify(packageName);
  }

  /**
   * Batch verify multiple packages concurrently with rate limiting.
   *
   * @param language Target language
   * @param packageNames Packages to verify
   * @param concurrency Max concurrent verifications (default: 5)
   */
  async verifyBatch(
    language: string,
    packageNames: string[],
    concurrency: number = 5,
  ): Promise<Map<string, PackageVerifyResult>> {
    const results = new Map<string, PackageVerifyResult>();
    const registry = this.registries.get(language);

    if (!registry) {
      for (const name of packageNames) {
        results.set(name, {
          exists: false,
          name,
          source: 'builtin',
          latencyMs: 0,
        });
      }
      return results;
    }

    // Deduplicate package names
    const uniqueNames = [...new Set(packageNames)];

    // Process in batches with concurrency limit
    for (let i = 0; i < uniqueNames.length; i += concurrency) {
      const batch = uniqueNames.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(async (name) => {
          const result = await registry.verify(name);
          return { name, result };
        }),
      );

      for (const { name, result } of batchResults) {
        results.set(name, result);
      }
    }

    return results;
  }

  /**
   * Get cache statistics.
   */
  cacheStats(): { entries: number; hitRate: number } {
    const stats = this.cache.stats();
    return {
      entries: stats.entries,
      hitRate: stats.hitRate,
    };
  }

  /**
   * Persist the cache to disk.
   */
  async persistCache(): Promise<void> {
    await this.cache.save();
  }
}
