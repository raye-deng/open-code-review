/**
 * License Module — Public API
 *
 * Provides license key generation, validation, and caching.
 *
 * @since 0.3.0
 */

// Types
export type {
  LicenseInfo,
  LicenseValidationResult,
  LicenseCacheEntry,
  LicenseResolveOptions,
  LicenseValidatorOptions,
} from './types.js';

// Generator
export { generateLicenseKey, isValidLicenseFormat } from './generator.js';

// Validator
export { LicenseValidator } from './validator.js';
