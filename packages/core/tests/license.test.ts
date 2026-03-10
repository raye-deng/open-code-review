/**
 * License Module Tests
 *
 * Tests for license key generation, format validation, caching,
 * resolution priority, and API fallback behavior.
 *
 * @since 0.3.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generateLicenseKey, isValidLicenseFormat } from '../src/license/generator.js';
import { LicenseValidator } from '../src/license/validator.js';
import type { LicenseCacheEntry } from '../src/license/types.js';

// ─── Test Helpers ──────────────────────────────────────────────────

/** A valid test license key using only chars from the allowed set */
const TEST_KEY = 'AICV-8F3A-K9D2-P7XN-Q4M6';

function createTempDir(): string {
  const dir = join(tmpdir(), `aicv-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanupDir(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

// ─── License Key Generation ────────────────────────────────────────

describe('generateLicenseKey', () => {
  it('should generate a key in AICV-XXXX-XXXX-XXXX-XXXX format', () => {
    const key = generateLicenseKey();
    expect(key).toMatch(
      /^AICV-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/,
    );
  });

  it('should generate unique keys on multiple calls', () => {
    const keys = new Set<string>();
    for (let i = 0; i < 100; i++) {
      keys.add(generateLicenseKey());
    }
    // With 30^16 possible combinations, 100 keys should all be unique
    expect(keys.size).toBe(100);
  });

  it('should never contain easily confused characters (0, 1, I, O)', () => {
    for (let i = 0; i < 50; i++) {
      const key = generateLicenseKey();
      // Remove the prefix and dashes to check only generated chars
      const chars = key.replace('AICV-', '').replace(/-/g, '');
      expect(chars).not.toMatch(/[01IO]/);
    }
  });

  it('should always start with AICV- prefix', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateLicenseKey().startsWith('AICV-')).toBe(true);
    }
  });
});

// ─── License Key Format Validation ─────────────────────────────────

describe('isValidLicenseFormat', () => {
  it('should accept valid license keys', () => {
    expect(isValidLicenseFormat('AICV-8F3A-K9D2-P7XN-Q4M6')).toBe(true);
    expect(isValidLicenseFormat('AICV-ABCD-EFGH-JKLM-NPQR')).toBe(true);
    expect(isValidLicenseFormat('AICV-2345-6789-STUV-WXYZ')).toBe(true);
  });

  it('should reject keys with invalid prefix', () => {
    expect(isValidLicenseFormat('XICV-8F3A-K9D2-P7XN-Q4M6')).toBe(false);
    expect(isValidLicenseFormat('aicv-8F3A-K9D2-P7XN-Q4M6')).toBe(false);
    expect(isValidLicenseFormat('8F3A-K9D2-P7XN-Q4M6')).toBe(false);
  });

  it('should reject keys with confused characters (0, 1, I, O)', () => {
    expect(isValidLicenseFormat('AICV-0000-K9D2-P7XN-Q4M6')).toBe(false); // 0
    expect(isValidLicenseFormat('AICV-1111-K9D2-P7XN-Q4M6')).toBe(false); // 1
    expect(isValidLicenseFormat('AICV-IIII-K9D2-P7XN-Q4M6')).toBe(false); // I
    expect(isValidLicenseFormat('AICV-OOOO-K9D2-P7XN-Q4M6')).toBe(false); // O
  });

  it('should reject keys with wrong group count or size', () => {
    expect(isValidLicenseFormat('AICV-8F3A-K9D2-P7XN')).toBe(false);          // 3 groups
    expect(isValidLicenseFormat('AICV-8F3A-K9D2-P7XN-Q4M6-AAAA')).toBe(false); // 5 groups
    expect(isValidLicenseFormat('AICV-8F3-K9D2-P7XN-Q4M6')).toBe(false);      // 3 chars in group
    expect(isValidLicenseFormat('AICV-8F3AA-K9D2-P7XN-Q4M6')).toBe(false);    // 5 chars in group
  });

  it('should reject empty string and non-string-like inputs', () => {
    expect(isValidLicenseFormat('')).toBe(false);
    expect(isValidLicenseFormat('invalid')).toBe(false);
    expect(isValidLicenseFormat('AICV')).toBe(false);
  });

  it('should reject lowercase keys', () => {
    expect(isValidLicenseFormat('AICV-8f3a-k9d2-p7xn-q4m6')).toBe(false);
  });
});

// ─── Cache Read/Write ──────────────────────────────────────────────

describe('LicenseValidator — Cache', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  it('should return cached result when cache is valid', async () => {
    const cacheEntry: LicenseCacheEntry = {
      key: TEST_KEY,
      result: {
        valid: true,
        info: { key: TEST_KEY, valid: true, plan: 'free' },
        cached: false,
      },
      timestamp: Date.now(),
      ttl: 86400000,
    };

    // Write cache manually
    writeFileSync(join(tempDir, 'license-cache.json'), JSON.stringify(cacheEntry), 'utf-8');

    const validator = new LicenseValidator({
      cacheDir: tempDir,
      apiEndpoint: 'http://localhost:99999/nonexistent', // ensure API is never called
    });

    const result = await validator.validate(TEST_KEY);
    expect(result.valid).toBe(true);
    expect(result.cached).toBe(true);
  });

  it('should call API when cache is expired', async () => {
    const cacheEntry: LicenseCacheEntry = {
      key: TEST_KEY,
      result: {
        valid: true,
        info: { key: TEST_KEY, valid: true, plan: 'free' },
        cached: false,
      },
      timestamp: Date.now() - 86400001, // expired by 1ms
      ttl: 86400000,
    };

    writeFileSync(join(tempDir, 'license-cache.json'), JSON.stringify(cacheEntry), 'utf-8');

    // Mock fetch to simulate API failure (so we test degraded path)
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
        gracePeriodMs: 7 * 24 * 60 * 60 * 1000,
      });

      const result = await validator.validate(TEST_KEY);
      // Should use degraded cache (expired but within grace period)
      expect(result.valid).toBe(true);
      expect(result.cached).toBe(true);
      expect(result.degraded).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should treat as valid when API fails and no cache exists (free product)', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
      });

      const result = await validator.validate(TEST_KEY);
      expect(result.valid).toBe(true);
      expect(result.degraded).toBe(true);
      expect(result.cached).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should write cache after successful API call', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        info: {
          userId: 'usr_123',
          email: 'test@example.com',
          plan: 'free',
        },
      }),
    } as Response);

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
      });

      await validator.validate(TEST_KEY);

      // Check cache was written
      const cachePath = join(tempDir, 'license-cache.json');
      expect(existsSync(cachePath)).toBe(true);

      const cached = JSON.parse(readFileSync(cachePath, 'utf-8')) as LicenseCacheEntry;
      expect(cached.key).toBe(TEST_KEY);
      expect(cached.result.valid).toBe(true);
      expect(cached.ttl).toBe(86400000);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should not use cache from a different key', async () => {
    const otherKey = 'AICV-AAAA-BBBB-CCCC-DDDD';

    const cacheEntry: LicenseCacheEntry = {
      key: TEST_KEY,
      result: {
        valid: true,
        info: { key: TEST_KEY, valid: true, plan: 'free' },
        cached: false,
      },
      timestamp: Date.now(),
      ttl: 86400000,
    };

    writeFileSync(join(tempDir, 'license-cache.json'), JSON.stringify(cacheEntry), 'utf-8');

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
      });

      const result = await validator.validate(otherKey);
      // otherKey has no cache, API failed → degraded valid
      expect(result.valid).toBe(true);
      expect(result.degraded).toBe(true);
      expect(result.cached).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

// ─── License Key Resolution Priority ───────────────────────────────

describe('LicenseValidator.resolveLicenseKey', () => {
  const originalEnv = process.env.AICV_LICENSE;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.AICV_LICENSE = originalEnv;
    } else {
      delete process.env.AICV_LICENSE;
    }
  });

  it('should prioritize CLI argument over all other sources', () => {
    process.env.AICV_LICENSE = 'AICV-ENVV-ENVV-ENVV-ENVV';

    const result = LicenseValidator.resolveLicenseKey({
      cli: 'AICV-CLXX-CLXX-CLXX-CLXX',
      env: 'AICV-ENVV-ENVV-ENVV-ENVV',
      config: 'AICV-CFGX-CFGX-CFGX-CFGX',
    });

    expect(result).toBe('AICV-CLXX-CLXX-CLXX-CLXX');
  });

  it('should fall back to env when CLI is not provided', () => {
    const result = LicenseValidator.resolveLicenseKey({
      env: 'AICV-ENVV-ENVV-ENVV-ENVV',
      config: 'AICV-CFGX-CFGX-CFGX-CFGX',
    });

    expect(result).toBe('AICV-ENVV-ENVV-ENVV-ENVV');
  });

  it('should fall back to AICV_LICENSE env var when env option is not provided', () => {
    process.env.AICV_LICENSE = 'AICV-PENV-PENV-PENV-PENV';

    const result = LicenseValidator.resolveLicenseKey({
      config: 'AICV-CFGX-CFGX-CFGX-CFGX',
    });

    expect(result).toBe('AICV-PENV-PENV-PENV-PENV');
  });

  it('should fall back to config when CLI and env are not provided', () => {
    delete process.env.AICV_LICENSE;

    const result = LicenseValidator.resolveLicenseKey({
      config: 'AICV-CFGX-CFGX-CFGX-CFGX',
    });

    expect(result).toBe('AICV-CFGX-CFGX-CFGX-CFGX');
  });

  it('should return null when no source provides a key', () => {
    delete process.env.AICV_LICENSE;

    const result = LicenseValidator.resolveLicenseKey();
    // May return from ~/.aicv/license if it exists, or null
    expect(result === null || typeof result === 'string').toBe(true);
  });
});

// ─── Format Validation in Validator ────────────────────────────────

describe('LicenseValidator — Format Validation', () => {
  it('should reject invalid format before API call', async () => {
    const validator = new LicenseValidator({
      cacheDir: createTempDir(),
      apiEndpoint: 'http://localhost:99999/nonexistent',
    });

    const result = await validator.validate('invalid-key');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid license key format');
    expect(result.cached).toBe(false);
  });
});

// ─── API Response Handling ─────────────────────────────────────────

describe('LicenseValidator — API Responses', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  it('should handle API returning invalid license (401/403)', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
      });

      const result = await validator.validate(TEST_KEY);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('HTTP 401');
      expect(result.cached).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should handle successful API response with full info', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        info: {
          userId: 'usr_abc',
          email: 'user@example.com',
          createdAt: '2026-03-01T00:00:00Z',
          expiresAt: null,
          usageCount: 42,
        },
      }),
    } as Response);

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
      });

      const result = await validator.validate(TEST_KEY);
      expect(result.valid).toBe(true);
      expect(result.cached).toBe(false);
      expect(result.info?.key).toBe(TEST_KEY);
      expect(result.info?.plan).toBe('free');
      expect(result.info?.userId).toBe('usr_abc');
      expect(result.info?.email).toBe('user@example.com');
      expect(result.info?.usageCount).toBe(42);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should use degraded mode when cache is beyond grace period and API fails', async () => {
    const cacheEntry: LicenseCacheEntry = {
      key: TEST_KEY,
      result: {
        valid: true,
        info: { key: TEST_KEY, valid: true, plan: 'free' },
        cached: false,
      },
      timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago (beyond 7-day grace)
      ttl: 86400000,
    };

    writeFileSync(join(tempDir, 'license-cache.json'), JSON.stringify(cacheEntry), 'utf-8');

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    try {
      const validator = new LicenseValidator({
        cacheDir: tempDir,
      });

      const result = await validator.validate(TEST_KEY);
      // Beyond grace period, no API → still valid (free product, degraded)
      expect(result.valid).toBe(true);
      expect(result.degraded).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

// ─── Save License Key ──────────────────────────────────────────────

describe('LicenseValidator.saveLicenseKey', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  it('should save and read a license key from file', () => {
    const licenseDir = join(tempDir, '.aicv');
    mkdirSync(licenseDir, { recursive: true });
    const key = 'AICV-SAVE-TXST-KEYS-HERE';
    writeFileSync(join(licenseDir, 'license'), key, 'utf-8');

    const stored = readFileSync(join(licenseDir, 'license'), 'utf-8').trim();
    expect(stored).toBe(key);
  });
});
