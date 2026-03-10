/**
 * Configuration Loader
 *
 * Loads .aicv.yml with the following priority chain:
 *   1. CLI args (passed directly)
 *   2. Environment variables (AICV_*)
 *   3. Project .aicv.yml (cwd)
 *   4. User global ~/.aicv/config.yml
 *   5. Built-in defaults
 *
 * Uses the `yaml` package for YAML parsing.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { parse as parseYaml } from 'yaml';
import type { AICVConfig, ReportFormatType } from './types.js';
import { mergeWithDefaults } from './defaults.js';

// ─── Config File Discovery ─────────────────────────────────────────

const CONFIG_FILENAMES = ['.aicv.yml', '.aicv.yaml', 'aicv.yml', 'aicv.yaml'];

/**
 * Search for a config file starting from `startDir` up to the filesystem root.
 */
function findConfigFile(startDir: string): string | null {
  let dir = resolve(startDir);
  const root = resolve('/');

  while (true) {
    for (const name of CONFIG_FILENAMES) {
      const candidate = join(dir, name);
      if (existsSync(candidate)) {
        return candidate;
      }
    }
    const parent = resolve(dir, '..');
    if (parent === dir || dir === root) break;
    dir = parent;
  }

  return null;
}

/**
 * Read and parse a YAML config file, returning a partial AICVConfig.
 * Returns null if the file cannot be read or parsed.
 */
function readYamlConfig(filePath: string): Partial<AICVConfig> | null {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const parsed = parseYaml(raw);
    if (parsed && typeof parsed === 'object') {
      return normalizeRawConfig(parsed);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize raw YAML object into Partial<AICVConfig>.
 * Handles alternate key names and type coercion.
 */
function normalizeRawConfig(raw: Record<string, unknown>): Partial<AICVConfig> {
  const config: Partial<AICVConfig> = {};

  if (typeof raw.license === 'string') {
    config.license = raw.license;
  }

  // Scan section
  if (raw.scan && typeof raw.scan === 'object') {
    const s = raw.scan as Record<string, unknown>;
    config.scan = {
      include: toStringArray(s.include ?? s.paths ?? []),
      exclude: toStringArray(s.exclude ?? []),
      languages: toStringArray(s.languages ?? []),
      slaLevel: normalizeSlaLevel(s.slaLevel ?? s.sla_level ?? 'L2'),
    };
  }

  // Scoring section
  if (raw.scoring && typeof raw.scoring === 'object') {
    const sc = raw.scoring as Record<string, unknown>;
    config.scoring = {
      threshold: typeof sc.threshold === 'number' ? sc.threshold : 70,
      failOn: normalizeFailOn(sc.failOn ?? sc.fail_on ?? 'critical'),
    };
  }

  // AI section (type definition only, no runtime behavior yet)
  if (raw.ai && typeof raw.ai === 'object') {
    const ai = raw.ai as Record<string, unknown>;
    config.ai = {
      local: ai.local as AICVConfig['ai'] extends { local?: infer L } ? L : never,
      remote: ai.remote as AICVConfig['ai'] extends { remote?: infer R } ? R : never,
      strategy: (ai.strategy as string as AICVConfig['ai'] extends { strategy: infer S } ? S : never) ?? 'local-first',
    };
  }

  // Report section
  if (raw.report && typeof raw.report === 'object') {
    const r = raw.report as Record<string, unknown>;
    config.report = {
      format: normalizeFormats(r.format),
      output: typeof r.output === 'string' ? r.output : undefined,
    };
  }

  return config;
}

// ─── Env Var Extraction ────────────────────────────────────────────

/**
 * Extract config overrides from environment variables.
 * Supported vars:
 *   AICV_LICENSE
 *   AICV_SLA_LEVEL
 *   AICV_THRESHOLD
 *   AICV_FAIL_ON
 *   AICV_FORMAT
 */
function configFromEnv(): Partial<AICVConfig> {
  const config: Partial<AICVConfig> = {};
  const env = process.env;

  if (env.AICV_LICENSE) {
    config.license = env.AICV_LICENSE;
  }

  if (env.AICV_SLA_LEVEL || env.AICV_THRESHOLD || env.AICV_FAIL_ON) {
    config.scan = {} as AICVConfig['scan'];
    config.scoring = {} as AICVConfig['scoring'];

    if (env.AICV_SLA_LEVEL) {
      config.scan.slaLevel = normalizeSlaLevel(env.AICV_SLA_LEVEL);
    }
    if (env.AICV_THRESHOLD) {
      const num = parseInt(env.AICV_THRESHOLD, 10);
      if (!isNaN(num)) {
        config.scoring.threshold = num;
      }
    }
    if (env.AICV_FAIL_ON) {
      config.scoring.failOn = normalizeFailOn(env.AICV_FAIL_ON);
    }
  }

  if (env.AICV_FORMAT) {
    config.report = {
      format: normalizeFormats(env.AICV_FORMAT),
    };
  }

  return config;
}

// ─── CLI Args Merging ──────────────────────────────────────────────

export interface CLIConfigOverrides {
  license?: string;
  threshold?: number;
  format?: string | string[];
  slaLevel?: string;
  failOn?: string;
  output?: string;
}

function configFromCLI(overrides: CLIConfigOverrides): Partial<AICVConfig> {
  const config: Partial<AICVConfig> = {};

  if (overrides.license) {
    config.license = overrides.license;
  }

  if (overrides.threshold !== undefined || overrides.failOn || overrides.slaLevel) {
    config.scan = {} as AICVConfig['scan'];
    config.scoring = {} as AICVConfig['scoring'];

    if (overrides.slaLevel) {
      config.scan.slaLevel = normalizeSlaLevel(overrides.slaLevel);
    }
    if (overrides.threshold !== undefined) {
      config.scoring.threshold = overrides.threshold;
    }
    if (overrides.failOn) {
      config.scoring.failOn = normalizeFailOn(overrides.failOn);
    }
  }

  if (overrides.format || overrides.output) {
    config.report = {
      format: overrides.format ? normalizeFormats(overrides.format) : [],
      output: overrides.output,
    };
  }

  return config;
}

// ─── Main Loader ───────────────────────────────────────────────────

export interface LoadConfigOptions {
  /** Current working directory (default: process.cwd()) */
  cwd?: string;
  /** CLI argument overrides */
  cliOverrides?: CLIConfigOverrides;
}

/**
 * Load configuration with full priority chain:
 *   CLI args > env vars > project .aicv.yml > user global > defaults
 */
export function loadConfig(options: LoadConfigOptions = {}): AICVConfig {
  const cwd = options.cwd ?? process.cwd();

  // Layer 5: defaults (handled by mergeWithDefaults)

  // Layer 4: user global config
  const globalConfigPath = join(homedir(), '.aicv', 'config.yml');
  const globalConfig = existsSync(globalConfigPath)
    ? readYamlConfig(globalConfigPath) ?? {}
    : {};

  // Layer 3: project config
  const projectConfigPath = findConfigFile(cwd);
  const projectConfig = projectConfigPath
    ? readYamlConfig(projectConfigPath) ?? {}
    : {};

  // Layer 2: environment variables
  const envConfig = configFromEnv();

  // Layer 1: CLI args
  const cliConfig = options.cliOverrides
    ? configFromCLI(options.cliOverrides)
    : {};

  // Merge: defaults < global < project < env < cli
  const merged = deepMergeConfigs(
    {},
    globalConfig,
    projectConfig,
    envConfig,
    cliConfig,
  );

  return mergeWithDefaults(merged);
}

// ─── Utility Helpers ───────────────────────────────────────────────

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string');
  if (typeof val === 'string') return [val];
  return [];
}

function normalizeSlaLevel(val: unknown): 'L1' | 'L2' | 'L3' {
  const s = String(val).toUpperCase();
  if (s === 'L1' || s === 'L2' || s === 'L3') return s;
  return 'L2';
}

function normalizeFailOn(val: unknown): 'critical' | 'high' | 'medium' | 'low' | 'none' {
  const s = String(val).toLowerCase();
  if (['critical', 'high', 'medium', 'low', 'none'].includes(s)) {
    return s as 'critical' | 'high' | 'medium' | 'low' | 'none';
  }
  return 'critical';
}

const VALID_FORMATS = new Set<ReportFormatType>(['terminal', 'json', 'html', 'markdown', 'sarif']);

function normalizeFormats(val: unknown): ReportFormatType[] {
  const arr = toStringArray(val);
  const result = arr.filter((f): f is ReportFormatType => VALID_FORMATS.has(f as ReportFormatType));
  return result.length > 0 ? result : ['terminal'];
}

/**
 * Deep-merge multiple partial configs (left to right, later wins).
 */
function deepMergeConfigs(
  ...configs: Partial<AICVConfig>[]
): Partial<AICVConfig> {
  const result: Partial<AICVConfig> = {};

  for (const cfg of configs) {
    if (cfg.license !== undefined) result.license = cfg.license;

    if (cfg.scan) {
      result.scan = { ...(result.scan ?? {} as AICVConfig['scan']), ...cfg.scan };
    }
    if (cfg.scoring) {
      result.scoring = { ...(result.scoring ?? {} as AICVConfig['scoring']), ...cfg.scoring };
    }
    if (cfg.ai) {
      result.ai = { ...(result.ai ?? {} as NonNullable<AICVConfig['ai']>), ...cfg.ai };
    }
    if (cfg.report) {
      result.report = { ...(result.report ?? {} as AICVConfig['report']), ...cfg.report };
    }
  }

  return result;
}
