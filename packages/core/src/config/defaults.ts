/**
 * Default Configuration
 *
 * Provides sensible defaults for all configuration options.
 * Priority chain: CLI args > env vars > .aicv.yml > user global > these defaults
 */

import type { AICVConfig } from './types.js';

export const DEFAULT_CONFIG: Readonly<AICVConfig> = {
  scan: {
    include: [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.js',
      'src/**/*.jsx',
    ],
    exclude: [
      '**/*.test.*',
      '**/*.spec.*',
      '**/__tests__/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
    ],
    languages: [], // auto-detect
    slaLevel: 'L2',
  },

  scoring: {
    threshold: 70,
    failOn: 'critical',
  },

  report: {
    format: ['terminal'],
  },
};

/**
 * Create a complete config by merging partial user config with defaults.
 * Shallow-merges each top-level section.
 */
export function mergeWithDefaults(partial: Partial<AICVConfig>): AICVConfig {
  return {
    license: partial.license ?? DEFAULT_CONFIG.license,
    scan: {
      ...DEFAULT_CONFIG.scan,
      ...(partial.scan ?? {}),
    },
    scoring: {
      ...DEFAULT_CONFIG.scoring,
      ...(partial.scoring ?? {}),
    },
    ai: partial.ai ?? DEFAULT_CONFIG.ai,
    report: {
      ...DEFAULT_CONFIG.report,
      ...(partial.report ?? {}),
    },
  };
}
