/**
 * License Validator
 *
 * Validates license keys with local caching and API fallback.
 *
 * Validation flow:
 * 1. Check local cache (~/.aicv/license-cache.json, TTL 24h)
 * 2. Cache hit → return cached result
 * 3. Cache miss → call API to verify
 * 4. API success → update cache → return result
 * 5. API failure → if expired cache within grace period (7 days) → return cached (degraded)
 * 6. No cache + API failure → return valid (free product, don't block users)
 *
 * @since 0.3.0
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { isValidLicenseFormat } from './generator.js';
import type {
  LicenseValidationResult,
  LicenseCacheEntry,
  LicenseResolveOptions,
  LicenseValidatorOptions,
} from './types.js';

// ─── Constants ─────────────────────────────────────────────────────

/** Default cache TTL: 24 hours */
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Default grace period: 7 days */
const DEFAULT_GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

/** Default API endpoint */
const DEFAULT_API_ENDPOINT = 'https://codes.evallab.ai/api/license/verify';

/** Cache filename */
const CACHE_FILENAME = 'license-cache.json';

/** License file (stores key from login) */
const LICENSE_FILENAME = 'license';

// ─── LicenseValidator Class ────────────────────────────────────────

/**
 * Validates license keys against API with local caching.
 *
 * Design principle: as a free product, we never block users due to
 * API failures. If the API is unreachable, we treat the license as valid.
 */
export class LicenseValidator {
  private readonly cacheDir: string;
  private readonly apiEndpoint: string;
  private readonly cacheTtlMs: number;
  private readonly gracePeriodMs: number;

  constructor(options?: LicenseValidatorOptions) {
    this.cacheDir = options?.cacheDir ?? join(homedir(), '.aicv');
    this.apiEndpoint = options?.apiEndpoint ?? DEFAULT_API_ENDPOINT;
    this.cacheTtlMs = options?.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
    this.gracePeriodMs = options?.gracePeriodMs ?? DEFAULT_GRACE_PERIOD_MS;
  }

  /**
   * Validate a license key.
   *
   * @param licenseKey - License key to validate (AICV-XXXX-XXXX-XXXX-XXXX)
   * @returns Validation result with license info and cache status
   */
  async validate(licenseKey: string): Promise<LicenseValidationResult> {
    // Step 0: Format check
    if (!isValidLicenseFormat(licenseKey)) {
      return {
        valid: false,
        error: `Invalid license key format: ${licenseKey}. Expected: AICV-XXXX-XXXX-XXXX-XXXX`,
        cached: false,
      };
    }

    // Step 1: Check local cache
    const cached = this.readCache(licenseKey);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < cached.ttl) {
        // Cache hit (not expired)
        return { ...cached.result, cached: true };
      }
    }

    // Step 2: Call API for verification
    try {
      const apiResult = await this.callAPI(licenseKey);
      // Step 3: Update cache on API success
      this.writeCache({
        key: licenseKey,
        result: apiResult,
        timestamp: Date.now(),
        ttl: this.cacheTtlMs,
      });
      return { ...apiResult, cached: false };
    } catch (_error) {
      // Step 4: API failed — try degraded cache
      if (cached) {
        const age = Date.now() - cached.timestamp;
        if (age < this.gracePeriodMs) {
          // Expired cache within grace period → return degraded
          return {
            ...cached.result,
            cached: true,
            degraded: true,
          };
        }
      }

      // Step 5: No cache + API failure → treat as valid (free product)
      return {
        valid: true,
        cached: false,
        degraded: true,
        error: 'API unreachable, operating in offline mode',
        info: {
          key: licenseKey,
          valid: true,
          plan: 'free',
        },
      };
    }
  }

  /**
   * Resolve a license key from multiple sources.
   *
   * Priority:
   * 1. CLI parameter (--license)
   * 2. Environment variable (AICV_LICENSE)
   * 3. Config file (.aicv.yml)
   * 4. Stored license file (~/.aicv/license)
   *
   * @param options - Sources to check
   * @returns License key or null if not found
   */
  static resolveLicenseKey(options?: LicenseResolveOptions): string | null {
    // Priority 1: CLI argument
    if (options?.cli) {
      return options.cli;
    }

    // Priority 2: Environment variable
    const envKey = options?.env ?? process.env.AICV_LICENSE;
    if (envKey) {
      return envKey;
    }

    // Priority 3: Config file (.aicv.yml license field)
    if (options?.config) {
      return options.config;
    }

    // Priority 4: Stored license file (~/.aicv/license)
    try {
      const licensePath = join(homedir(), '.aicv', LICENSE_FILENAME);
      if (existsSync(licensePath)) {
        const key = readFileSync(licensePath, 'utf-8').trim();
        if (key) return key;
      }
    } catch {
      // Ignore read errors
    }

    return null;
  }

  /**
   * Save a license key to the user's home directory (~/.aicv/license).
   *
   * @param key - License key to save
   */
  static saveLicenseKey(key: string): void {
    const dir = join(homedir(), '.aicv');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const filePath = join(dir, LICENSE_FILENAME);
    writeFileSync(filePath, key, 'utf-8');
    try {
      chmodSync(filePath, 0o600);
    } catch {
      // chmod may fail on some platforms (Windows)
    }
  }

  // ─── Private: Cache Operations ─────────────────────────────────

  /**
   * Read cache entry for a specific key.
   * Returns null if cache doesn't exist or is for a different key.
   */
  private readCache(licenseKey: string): LicenseCacheEntry | null {
    try {
      const cachePath = join(this.cacheDir, CACHE_FILENAME);
      if (!existsSync(cachePath)) return null;

      const raw = readFileSync(cachePath, 'utf-8');
      const entry = JSON.parse(raw) as LicenseCacheEntry;

      // Validate cache entry structure
      if (!entry || typeof entry !== 'object') return null;
      if (entry.key !== licenseKey) return null;
      if (typeof entry.timestamp !== 'number') return null;
      if (!entry.result) return null;

      return entry;
    } catch {
      return null;
    }
  }

  /**
   * Write a cache entry to disk.
   * Creates the cache directory if it doesn't exist.
   * Sets file permissions to 0600 (user-only read/write).
   */
  private writeCache(entry: LicenseCacheEntry): void {
    try {
      if (!existsSync(this.cacheDir)) {
        mkdirSync(this.cacheDir, { recursive: true });
      }
      const cachePath = join(this.cacheDir, CACHE_FILENAME);
      writeFileSync(cachePath, JSON.stringify(entry, null, 2), 'utf-8');
      try {
        chmodSync(cachePath, 0o600);
      } catch {
        // chmod may fail on some platforms (Windows)
      }
    } catch {
      // Silently fail on cache write errors — don't block the user
    }
  }

  // ─── Private: API Call ─────────────────────────────────────────

  /**
   * Call the license verification API.
   *
   * POST {apiEndpoint}
   * Body: { "key": "AICV-..." }
   * Response: { "valid": true, "info": {...} }
   *
   * @throws Error if the API request fails
   */
  private async callAPI(key: string): Promise<LicenseValidationResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'open-code-review-cli/0.3.0',
        },
        body: JSON.stringify({ key }),
        signal: controller.signal,
      });

      if (response.ok) {
        const data = (await response.json()) as {
          valid: boolean;
          info?: Record<string, unknown>;
        };
        return {
          valid: data.valid,
          info: data.info
            ? {
                key,
                valid: data.valid,
                plan: 'free' as const,
                userId: data.info.userId as string | undefined,
                email: data.info.email as string | undefined,
                createdAt: data.info.createdAt as string | undefined,
                expiresAt: data.info.expiresAt as string | null | undefined,
                usageCount: data.info.usageCount as number | undefined,
              }
            : { key, valid: data.valid, plan: 'free' as const },
          cached: false,
        };
      }

      // Non-OK response (401, 403, etc.)
      return {
        valid: false,
        error: `License verification failed: HTTP ${response.status}`,
        cached: false,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
