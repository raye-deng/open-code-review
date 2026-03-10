/**
 * Maven Registry — package verification against Maven Central.
 *
 * Supports:
 * - groupId:artifactId format (e.g. 'org.springframework.boot:spring-boot')
 * - Java package name lookup (e.g. 'org.springframework.boot')
 * - Custom Nexus/Artifactory URLs
 *
 * Used for both Java and Kotlin packages.
 *
 * @since 0.4.0 (V4)
 */

import type { PackageRegistry, PackageVerifyResult, DeprecationInfo, RegistryConfig } from './types.js';
import { RegistryCache } from './cache.js';
import { JAVA_BUILTINS } from './builtins/java-builtins.js';

export class MavenRegistry implements PackageRegistry {
  readonly name = 'maven';
  readonly language = 'java';

  private baseUrl: string;
  private token?: string;
  private timeout: number;
  private cacheTtl: number;
  private cache: RegistryCache;

  constructor(config?: RegistryConfig, cache?: RegistryCache) {
    this.baseUrl = config?.url || 'https://search.maven.org';
    this.token = config?.token;
    this.timeout = config?.timeoutMs || 5000;
    this.cacheTtl = config?.cacheTtlSeconds || 86400;
    this.cache = cache || new RegistryCache();
  }

  /**
   * Check if a Java/Kotlin import is a standard library package.
   * Matches against top-level prefixes (e.g. 'java.util' matches 'java.util.List').
   */
  private isBuiltin(packageName: string): boolean {
    for (const builtin of JAVA_BUILTINS) {
      if (packageName === builtin || packageName.startsWith(builtin + '.')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Extract groupId from a package name or groupId:artifactId format.
   *
   * Formats:
   * - "org.springframework.boot:spring-boot" → groupId: "org.springframework.boot"
   * - "org.springframework.boot" → groupId: "org.springframework.boot"
   * - "com.google.guava" → groupId: "com.google.guava"
   */
  private extractGroupId(packageName: string): { groupId: string; artifactId?: string } {
    if (packageName.includes(':')) {
      const [groupId, artifactId] = packageName.split(':', 2);
      return { groupId, artifactId };
    }
    return { groupId: packageName };
  }

  /**
   * Verify if a Maven package/group exists.
   *
   * 1. Check if it's a Java/Kotlin standard library package
   * 2. Check cache
   * 3. Query Maven Central Search API:
   *    GET {baseUrl}/solrsearch/select?q=g:{groupId}&rows=1&wt=json
   *    - response.numFound > 0 → exists
   *    - response.numFound === 0 → does not exist
   *    - error → assume exists (conservative)
   */
  async verify(packageName: string): Promise<PackageVerifyResult> {
    const start = Date.now();

    // Check standard library first
    if (this.isBuiltin(packageName)) {
      return {
        exists: true,
        name: packageName,
        source: 'builtin',
        latencyMs: Date.now() - start,
      };
    }

    // Check cache
    const cacheKey = `maven:${packageName}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, name: packageName, latencyMs: Date.now() - start };
    }

    // Query Maven Central
    try {
      const { groupId, artifactId } = this.extractGroupId(packageName);

      let query: string;
      if (artifactId) {
        query = `g:${encodeURIComponent(groupId)}+AND+a:${encodeURIComponent(artifactId)}`;
      } else {
        query = `g:${encodeURIComponent(groupId)}`;
      }

      const url = `${this.baseUrl}/solrsearch/select?q=${query}&rows=1&wt=json`;
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

      if (!response.ok) {
        // Non-200 → assume exists (conservative)
        return {
          exists: true,
          name: packageName,
          source: 'registry',
          latencyMs,
        };
      }

      const data = await response.json() as {
        response?: {
          numFound?: number;
          docs?: Array<{ latestVersion?: string; v?: string }>;
        };
      };

      const numFound = data.response?.numFound || 0;
      const exists = numFound > 0;

      let version: string | undefined;
      if (exists && data.response?.docs?.[0]) {
        version = data.response.docs[0].latestVersion || data.response.docs[0].v;
      }

      const result: PackageVerifyResult = {
        exists,
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
   * Check if a Maven package is deprecated.
   * Maven Central doesn't have a native deprecation field.
   * This is a best-effort check — returns null in most cases.
   */
  async checkDeprecated(_packageName: string, _version?: string): Promise<DeprecationInfo | null> {
    // Maven Central does not provide deprecation info via API.
    // Future: could check POM metadata or known deprecation databases.
    return null;
  }
}
