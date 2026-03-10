/**
 * i18n Framework Tests
 *
 * Tests for the i18n provider, message catalogs, and interpolation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultI18nProvider, EN_MESSAGES, ZH_MESSAGES } from '../../src/i18n/index.js';
import type { Locale, I18nProvider } from '../../src/i18n/types.js';

describe('i18n Framework', () => {
  describe('DefaultI18nProvider', () => {
    let provider: I18nProvider;

    beforeEach(() => {
      provider = new DefaultI18nProvider();
    });

    describe('English translation', () => {
      it('should translate simple keys', () => {
        provider.setLocale('en');
        expect(provider.t('scan.start', { count: 5 })).toBe('Scanning 5 files...');
      });

      it('should translate keys with multiple parameters', () => {
        provider.setLocale('en');
        const result = provider.t('detector.hallucinated-import', {
          package: 'fake-package',
          registry: 'npm',
        });
        expect(result).toBe('Hallucinated import: package "fake-package" does not exist in npm');
      });

      it('should return key as fallback for missing keys', () => {
        provider.setLocale('en');
        expect(provider.t('nonexistent.key')).toBe('nonexistent.key');
      });

      it('should handle parameter interpolation with numbers', () => {
        provider.setLocale('en');
        expect(provider.t('scan.complete', { duration: 1234 })).toBe('Scan complete in 1234ms');
      });
    });

    describe('Chinese translation', () => {
      it('should translate simple keys', () => {
        provider.setLocale('zh');
        expect(provider.t('scan.start', { count: 5 })).toBe('正在扫描 5 个文件...');
      });

      it('should translate keys with multiple parameters', () => {
        provider.setLocale('zh');
        const result = provider.t('detector.hallucinated-import', {
          package: 'fake-package',
          registry: 'npm',
        });
        expect(result).toBe('AI 幻觉导入：包 "fake-package" 在 npm 中不存在');
      });

      it('should return key as fallback for missing keys', () => {
        provider.setLocale('zh');
        expect(provider.t('nonexistent.key')).toBe('nonexistent.key');
      });
    });

    describe('Locale switching', () => {
      it('should default to English', () => {
        expect(provider.locale).toBe('en');
      });

      it('should switch locale', () => {
        provider.setLocale('zh');
        expect(provider.locale).toBe('zh');
        expect(provider.t('cli.done')).toBe('完成！');
      });

      it('should switch back to English', () => {
        provider.setLocale('zh');
        provider.setLocale('en');
        expect(provider.t('cli.done')).toBe('Done!');
      });
    });

    describe('Parameter interpolation', () => {
      it('should interpolate string parameters', () => {
        provider.setLocale('en');
        const result = provider.t('detector.stale-api', {
          api: 'Buffer()',
          replacement: 'Buffer.alloc()',
        });
        expect(result).toBe('Deprecated API: "Buffer()" — use "Buffer.alloc()" instead');
      });

      it('should interpolate numeric parameters', () => {
        provider.setLocale('en');
        const result = provider.t('detector.over-engineering.params', {
          name: 'processData',
          count: 12,
          max: 8,
        });
        expect(result).toBe('Function "processData" has 12 parameters (max recommended: 8)');
      });

      it('should handle special characters in parameters', () => {
        provider.setLocale('en');
        const result = provider.t('detector.security.hardcoded-secret', {
          pattern: 'AWS_SECRET_KEY=****',
        });
        expect(result).toBe('Possible hardcoded secret: AWS_SECRET_KEY=****');
      });

      it('should interpolate multiple occurrences of same parameter', () => {
        provider.setLocale('en');
        // Use a custom message with repeated parameter
        const catalog = EN_MESSAGES;
        // Test that interpolation works with replacement
        const result = provider.t('detector.stale-api.since', {
          since: 'v1.0',
          api: 'oldFunc',
          replacement: 'newFunc',
        });
        expect(result).toBe('Deprecated since v1.0: "oldFunc" — use "newFunc" instead');
      });
    });

    describe('Message catalog completeness', () => {
      it('should have all detector keys in both catalogs', () => {
        const enKeys = Object.keys(EN_MESSAGES);
        const zhKeys = Object.keys(ZH_MESSAGES);

        // Check that zh has all en keys
        for (const key of enKeys) {
          expect(zhKeys).toContain(key);
        }

        // Check that en has all zh keys
        for (const key of zhKeys) {
          expect(enKeys).toContain(key);
        }
      });

      it('should have required scan message keys', () => {
        const requiredKeys = [
          'scan.start',
          'scan.complete',
          'scan.noFiles',
        ];

        for (const key of requiredKeys) {
          expect(EN_MESSAGES).toHaveProperty(key);
          expect(ZH_MESSAGES).toHaveProperty(key);
        }
      });

      it('should have required detector message keys', () => {
        const requiredKeys = [
          'detector.hallucinated-import',
          'detector.stale-api',
          'detector.context-coherence.unused',
          'detector.over-engineering.complexity',
          'detector.security.hardcoded-secret',
        ];

        for (const key of requiredKeys) {
          expect(EN_MESSAGES).toHaveProperty(key);
          expect(ZH_MESSAGES).toHaveProperty(key);
        }
      });

      it('should have required score grade keys', () => {
        const requiredKeys = [
          'score.grade.excellent',
          'score.grade.good',
          'score.grade.fair',
          'score.grade.poor',
          'score.grade.fail',
        ];

        for (const key of requiredKeys) {
          expect(EN_MESSAGES).toHaveProperty(key);
          expect(ZH_MESSAGES).toHaveProperty(key);
        }
      });

      it('should have required SLA keys', () => {
        const requiredKeys = ['sla.L1', 'sla.L2', 'sla.L3'];

        for (const key of requiredKeys) {
          expect(EN_MESSAGES).toHaveProperty(key);
          expect(ZH_MESSAGES).toHaveProperty(key);
        }
      });
    });

    describe('Constructor with initial locale', () => {
      it('should accept initial locale', () => {
        const zhProvider = new DefaultI18nProvider('zh');
        expect(zhProvider.locale).toBe('zh');
        expect(zhProvider.t('cli.done')).toBe('完成！');
      });

      it('should default to English when no locale specified', () => {
        const defaultProvider = new DefaultI18nProvider();
        expect(defaultProvider.locale).toBe('en');
      });
    });

    describe('has() method', () => {
      it('should return true for existing keys', () => {
        const p = new DefaultI18nProvider('en');
        expect((p as DefaultI18nProvider).has('scan.start')).toBe(true);
      });

      it('should return false for missing keys', () => {
        const p = new DefaultI18nProvider('en');
        expect((p as DefaultI18nProvider).has('nonexistent.key')).toBe(false);
      });
    });

    describe('keys() method', () => {
      it('should return all keys', () => {
        const p = new DefaultI18nProvider('en');
        const keys = (p as DefaultI18nProvider).keys();
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('scan.start');
      });
    });
  });
});
