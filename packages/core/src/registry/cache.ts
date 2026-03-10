/**
 * Registry Cache
 *
 * File-based cache for registry lookup results.
 * Stored at ~/.ocr/registry-cache.json by default.
 *
 * Cache structure:
 * {
 *   "npm:express": { "result": {...}, "timestamp": 1710000000, "ttl": 86400 },
 *   "pypi:requests": { "result": {...}, "timestamp": 1710000000, "ttl": 86400 }
 * }
 *
 * @since 0.4.0 (V4)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import type { PackageVerifyResult, CacheEntry } from './types.js';

export class RegistryCache {
  private cacheDir: string;
  private cacheFile: string;
  private cache: Map<string, CacheEntry> = new Map();
  private hits: number = 0;
  private misses: number = 0;
  private loaded: boolean = false;

  constructor(cacheDir?: string) {
    this.cacheDir = cacheDir || path.join(os.homedir(), '.ocr');
    this.cacheFile = path.join(this.cacheDir, 'registry-cache.json');
  }

  /**
   * Get a cached result by key. Returns null on miss or expired entry.
   */
  async get(key: string): Promise<PackageVerifyResult | null> {
    if (!this.loaded) {
      await this.load();
    }

    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - entry.timestamp > entry.ttl) {
      // Expired
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return { ...entry.result, source: 'cache' as const };
  }

  /**
   * Store a result in the cache.
   */
  async set(key: string, result: PackageVerifyResult, ttlSeconds: number): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    this.cache.set(key, {
      result: { ...result },
      timestamp: Math.floor(Date.now() / 1000),
      ttl: ttlSeconds,
    });
  }

  /**
   * Load cache from disk.
   */
  async load(): Promise<void> {
    this.loaded = true;
    try {
      if (!fs.existsSync(this.cacheFile)) {
        return;
      }
      const data = fs.readFileSync(this.cacheFile, 'utf-8');
      const parsed = JSON.parse(data) as Record<string, CacheEntry>;
      this.cache = new Map(Object.entries(parsed));
    } catch {
      // If cache file is corrupted, start fresh
      this.cache = new Map();
    }
  }

  /**
   * Persist cache to disk.
   */
  async save(): Promise<void> {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }

      // Prune expired entries before saving
      const now = Math.floor(Date.now() / 1000);
      for (const [key, entry] of this.cache) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }

      const obj: Record<string, CacheEntry> = {};
      for (const [key, entry] of this.cache) {
        obj[key] = entry;
      }

      fs.writeFileSync(this.cacheFile, JSON.stringify(obj, null, 2), 'utf-8');
    } catch {
      // Cache persistence failure is non-fatal
    }
  }

  /**
   * Clear all cached entries.
   */
  async clear(): Promise<void> {
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
    try {
      if (fs.existsSync(this.cacheFile)) {
        fs.unlinkSync(this.cacheFile);
      }
    } catch {
      // Non-fatal
    }
  }

  /**
   * Get cache statistics.
   */
  stats(): { entries: number; hitRate: number; sizeBytes: number } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;

    // Estimate size
    let sizeBytes = 0;
    try {
      if (fs.existsSync(this.cacheFile)) {
        sizeBytes = fs.statSync(this.cacheFile).size;
      }
    } catch {
      // Estimate from in-memory data
      sizeBytes = JSON.stringify(Object.fromEntries(this.cache)).length;
    }

    return {
      entries: this.cache.size,
      hitRate,
      sizeBytes,
    };
  }
}
