/**
 * V4 Configuration Parser Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm, writeFile as writeFs } from 'node:fs/promises';
import { join } from 'node:path';
import {
  loadV4Config,
  DEFAULT_V4_CONFIG,
  generateDefaultConfigYaml,
} from '../../src/config/v4-config.js';

const FIXTURES_DIR = join(__dirname, 'fixtures', 'v4-config');

describe('V4 Configuration Parser', () => {
  beforeEach(async () => {
    try {
      await mkdir(FIXTURES_DIR, { recursive: true });
    } catch {
      // Ignore
    }
  });

  afterEach(async () => {
    try {
      await rm(FIXTURES_DIR, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  describe('Default Config', () => {
    it('should have default SLA level L1', () => {
      expect(DEFAULT_V4_CONFIG.sla).toBe('L1');
    });

    it('should have default locale en', () => {
      expect(DEFAULT_V4_CONFIG.locale).toBe('en');
    });

    it('should have default include patterns', () => {
      expect(DEFAULT_V4_CONFIG.scan?.include).toBeDefined();
      expect(DEFAULT_V4_CONFIG.scan?.include).toContain('**/*.ts');
      expect(DEFAULT_V4_CONFIG.scan?.include).toContain('**/*.py');
    });

    it('should have default exclude patterns', () => {
      expect(DEFAULT_V4_CONFIG.scan?.exclude).toBeDefined();
      expect(DEFAULT_V4_CONFIG.scan?.exclude).toContain('**/node_modules/**');
      expect(DEFAULT_V4_CONFIG.scan?.exclude).toContain('**/.git/**');
    });

    it('should have default scoring threshold', () => {
      expect(DEFAULT_V4_CONFIG.scoring?.threshold).toBe(70);
    });
  });

  describe('loadV4Config', () => {
    it('should return default config when no file exists', async () => {
      // Use /tmp to avoid upward traversal finding .ocrrc.yml in project root
      const emptyDir = join('/tmp', 'ocr-test-empty-' + Date.now());
      await mkdir(emptyDir, { recursive: true });

      const config = loadV4Config({ projectRoot: emptyDir });

      expect(config.sla).toBe('L1');
      expect(config.locale).toBe('en');
      expect(config.threshold).toBe(70);
    });

    it('should load .ocrrc.yml', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), `
sla: L2
locale: zh
scoring:
  threshold: 80
`);

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.sla).toBe('L2');
      expect(config.locale).toBe('zh');
      expect(config.threshold).toBe(80);
    });

    it('should fallback to .aicv.yml if .ocrrc.yml not found', async () => {
      // Only create .aicv.yml, not .ocrrc.yml
      await writeFile(join(FIXTURES_DIR, '.aicv.yml'), `
slaLevel: L3
scoring:
  threshold: 85
`);

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.sla).toBe('L3');
      expect(config.threshold).toBe(85);
    });

    it('should prefer .ocrrc.yml over .aicv.yml', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'sla: L1');
      await writeFile(join(FIXTURES_DIR, '.aicv.yml'), 'slaLevel: L3');

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.sla).toBe('L1');
    });
  });

  describe('SLA Level Parsing', () => {
    it('should parse L1 SLA level', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'sla: L1');
      const config = loadV4Config({ projectRoot: FIXTURES_DIR });
      expect(config.sla).toBe('L1');
    });

    it('should parse L2 SLA level', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'sla: L2');
      const config = loadV4Config({ projectRoot: FIXTURES_DIR });
      expect(config.sla).toBe('L2');
    });

    it('should parse L3 SLA level', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'sla: L3');
      const config = loadV4Config({ projectRoot: FIXTURES_DIR });
      expect(config.sla).toBe('L3');
    });

    it('should normalize lowercase SLA', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'sla: l2');
      const config = loadV4Config({ projectRoot: FIXTURES_DIR });
      expect(config.sla).toBe('L2');
    });
  });

  describe('Locale Parsing', () => {
    it('should parse en locale', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'locale: en');
      const config = loadV4Config({ projectRoot: FIXTURES_DIR });
      expect(config.locale).toBe('en');
    });

    it('should parse zh locale', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'locale: zh');
      const config = loadV4Config({ projectRoot: FIXTURES_DIR });
      expect(config.locale).toBe('zh');
    });
  });

  describe('Registry Config Parsing', () => {
    it('should parse npm registry config', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), `
registry:
  npm:
    url: https://custom.registry.com
    token: secret-token
`);

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.registry?.npm?.url).toBe('https://custom.registry.com');
      expect(config.registry?.npm?.token).toBe('secret-token');
    });

    it('should parse multiple registry configs', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), `
registry:
  npm:
    url: https://npm.example.com
  pypi:
    url: https://pypi.example.com
  maven:
    url: https://maven.example.com
  go:
    proxy: https://go.example.com
`);

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.registry?.npm?.url).toBe('https://npm.example.com');
      expect(config.registry?.pypi?.url).toBe('https://pypi.example.com');
      expect(config.registry?.maven?.url).toBe('https://maven.example.com');
      expect(config.registry?.go?.proxy).toBe('https://go.example.com');
    });
  });

  describe('Include/Exclude Patterns', () => {
    it('should parse include patterns', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), `
scan:
  include:
    - "**/*.ts"
    - "**/*.go"
`);

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.include).toContain('**/*.ts');
      expect(config.include).toContain('**/*.go');
    });

    it('should parse exclude patterns', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), `
scan:
  exclude:
    - "**/dist/**"
    - "**/build/**"
`);

      const config = loadV4Config({ projectRoot: FIXTURES_DIR });

      expect(config.exclude).toContain('**/dist/**');
      expect(config.exclude).toContain('**/build/**');
    });
  });

  describe('CLI Overrides', () => {
    it('should apply SLA override', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'sla: L1');

      const config = loadV4Config({
        projectRoot: FIXTURES_DIR,
        overrides: { sla: 'L3' },
      });

      expect(config.sla).toBe('L3');
    });

    it('should apply locale override', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), 'locale: en');

      const config = loadV4Config({
        projectRoot: FIXTURES_DIR,
        overrides: { locale: 'zh' },
      });

      expect(config.locale).toBe('zh');
    });

    it('should apply threshold override', async () => {
      await writeFile(join(FIXTURES_DIR, '.ocrrc.yml'), `
scoring:
  threshold: 70
`);

      const config = loadV4Config({
        projectRoot: FIXTURES_DIR,
        overrides: { threshold: 90 },
      });

      expect(config.threshold).toBe(90);
    });
  });

  describe('generateDefaultConfigYaml', () => {
    it('should generate valid YAML', () => {
      const yaml = generateDefaultConfigYaml();
      expect(yaml).toContain('sla: L1');
      expect(yaml).toContain('locale: en');
      expect(yaml).toContain('threshold: 70');
    });

    it('should include all supported languages in include patterns', () => {
      const yaml = generateDefaultConfigYaml();
      expect(yaml).toContain('*.ts');
      expect(yaml).toContain('*.py');
      expect(yaml).toContain('*.java');
      expect(yaml).toContain('*.go');
      expect(yaml).toContain('*.kt');
    });
  });
});
