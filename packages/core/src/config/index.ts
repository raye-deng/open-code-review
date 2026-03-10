/**
 * Config Module — Public API
 */

export type {
  AICVConfig,
  ScanConfig,
  ScoringConfig,
  AIConfig,
  AILocalConfig,
  AIRemoteConfig,
  ReportConfig,
  ReportFormatType,
} from './types.js';

export { DEFAULT_CONFIG, mergeWithDefaults } from './defaults.js';

export { loadConfig } from './loader.js';
export type { CLIConfigOverrides, LoadConfigOptions } from './loader.js';
