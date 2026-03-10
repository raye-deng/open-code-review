/**
 * License Module — Type Definitions
 *
 * Defines types for the License system: key format, validation results,
 * and cache entries.
 *
 * @since 0.3.0
 */

// ─── License Info ──────────────────────────────────────────────────

/**
 * Information about a License Key.
 * Returned from the validation API and stored in cache.
 */
export interface LicenseInfo {
  /** License key in format AICV-XXXX-XXXX-XXXX-XXXX */
  key: string;
  /** Whether the license is currently valid */
  valid: boolean;
  /** Associated user ID (from Portal) */
  userId?: string;
  /** Associated email address */
  email?: string;
  /** When the license was created (ISO 8601) */
  createdAt?: string;
  /** When the license expires (ISO 8601), null = never expires (free plan) */
  expiresAt?: string | null;
  /** License plan — currently only 'free' */
  plan: 'free';
  /** Number of times this license has been used for scans */
  usageCount?: number;
}

// ─── Validation Result ─────────────────────────────────────────────

/**
 * Result of a license validation attempt.
 * Contains the validation status, license info, and caching metadata.
 */
export interface LicenseValidationResult {
  /** Whether the license is valid */
  valid: boolean;
  /** License information (when valid or cached) */
  info?: LicenseInfo;
  /** Error message (when invalid or failed) */
  error?: string;
  /** Whether this result came from local cache */
  cached: boolean;
  /** Whether this result is from a degraded/fallback path */
  degraded?: boolean;
}

// ─── Cache Entry ───────────────────────────────────────────────────

/**
 * Cache entry stored in ~/.aicv/license-cache.json
 */
export interface LicenseCacheEntry {
  /** The license key that was validated */
  key: string;
  /** The cached validation result */
  result: LicenseValidationResult;
  /** Timestamp when the cache entry was created (ms since epoch) */
  timestamp: number;
  /** Cache TTL in milliseconds (default: 24h = 86400000) */
  ttl: number;
}

// ─── License Resolve Options ───────────────────────────────────────

/**
 * Options for resolving a license key from various sources.
 * Priority: cli > env > config > file
 */
export interface LicenseResolveOptions {
  /** License key from CLI --license flag */
  cli?: string;
  /** License key from environment variable (AICV_LICENSE) */
  env?: string;
  /** License key from .aicv.yml config file */
  config?: string;
}

// ─── Validator Options ─────────────────────────────────────────────

/**
 * Options for creating a LicenseValidator instance.
 */
export interface LicenseValidatorOptions {
  /** Directory for cache files (default: ~/.aicv/) */
  cacheDir?: string;
  /** API endpoint for license verification */
  apiEndpoint?: string;
  /** Cache TTL in ms (default: 86400000 = 24h) */
  cacheTtlMs?: number;
  /** Grace period for expired cache when API fails (default: 604800000 = 7 days) */
  gracePeriodMs?: number;
}
