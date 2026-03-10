/**
 * Config System — Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DEFAULT_CONFIG, mergeWithDefaults } from '../src/config/defaults.js';
import type { AICVConfig } from '../src/config/types.js';

// ─── Default Config ────────────────────────────────────────────────

describe('DEFAULT_CONFIG', () => {
  it('has scan defaults', () => {
    expect(DEFAULT_CONFIG.scan.include).toContain('src/**/*.ts');
    expect(DEFAULT_CONFIG.scan.exclude).toContain('**/node_modules/**');
    expect(DEFAULT_CONFIG.scan.languages).toEqual([]);
    expect(DEFAULT_CONFIG.scan.slaLevel).toBe('L2');
  });

  it('has scoring defaults', () => {
    expect(DEFAULT_CONFIG.scoring.threshold).toBe(70);
    expect(DEFAULT_CONFIG.scoring.failOn).toBe('critical');
  });

  it('has report defaults', () => {
    expect(DEFAULT_CONFIG.report.format).toEqual(['terminal']);
    expect(DEFAULT_CONFIG.report.output).toBeUndefined();
  });

  it('has no license by default', () => {
    expect(DEFAULT_CONFIG.license).toBeUndefined();
  });

  it('has no AI config by default', () => {
    expect(DEFAULT_CONFIG.ai).toBeUndefined();
  });
});

// ─── mergeWithDefaults ─────────────────────────────────────────────

describe('mergeWithDefaults', () => {
  it('returns full config from empty partial', () => {
    const config = mergeWithDefaults({});
    expect(config.scan).toBeDefined();
    expect(config.scoring).toBeDefined();
    expect(config.report).toBeDefined();
  });

  it('overrides scan settings', () => {
    const config = mergeWithDefaults({
      scan: {
        include: ['lib/**/*.ts'],
        exclude: [],
        languages: ['typescript'],
        slaLevel: 'L1',
      },
    });
    expect(config.scan.include).toEqual(['lib/**/*.ts']);
    expect(config.scan.slaLevel).toBe('L1');
  });

  it('overrides scoring settings', () => {
    const config = mergeWithDefaults({
      scoring: { threshold: 80, failOn: 'high' },
    });
    expect(config.scoring.threshold).toBe(80);
    expect(config.scoring.failOn).toBe('high');
  });

  it('preserves license', () => {
    const config = mergeWithDefaults({ license: 'AICV-TEST-1234' });
    expect(config.license).toBe('AICV-TEST-1234');
  });

  it('preserves AI config', () => {
    const config = mergeWithDefaults({
      ai: {
        strategy: 'local-only',
        local: {
          enabled: true,
          provider: 'ollama',
          model: 'deepseek-coder',
          endpoint: 'http://localhost:11434',
        },
      },
    });
    expect(config.ai?.strategy).toBe('local-only');
    expect(config.ai?.local?.enabled).toBe(true);
  });

  it('overrides report format', () => {
    const config = mergeWithDefaults({
      report: { format: ['json', 'html'] },
    });
    expect(config.report.format).toEqual(['json', 'html']);
  });
});

// ─── Config Loader (integration tests need filesystem mock) ────────

describe('Config Loader edge cases', () => {
  it('loadConfig is importable', async () => {
    const { loadConfig } = await import('../src/config/loader.js');
    expect(typeof loadConfig).toBe('function');
  });

  it('loadConfig returns defaults when no config file exists', async () => {
    const { loadConfig } = await import('../src/config/loader.js');

    // Load from a directory with no config file
    const config = loadConfig({ cwd: '/tmp/nonexistent-dir-12345' });
    expect(config.scan.slaLevel).toBe('L2');
    expect(config.scoring.threshold).toBe(70);
    expect(config.report.format).toEqual(['terminal']);
  });

  it('loadConfig applies CLI overrides', async () => {
    const { loadConfig } = await import('../src/config/loader.js');

    const config = loadConfig({
      cwd: '/tmp/nonexistent-dir-12345',
      cliOverrides: {
        threshold: 90,
        license: 'AICV-CLI-TEST',
        format: 'json',
      },
    });

    expect(config.scoring.threshold).toBe(90);
    expect(config.license).toBe('AICV-CLI-TEST');
    expect(config.report.format).toEqual(['json']);
  });
});
