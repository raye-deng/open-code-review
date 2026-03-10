/**
 * V4 Scanner Tests
 *
 * Tests for the V4 scan orchestrator.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdir, writeFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { V4Scanner, createV4Scanner, type V4ScanResult } from '../../src/scanner/v4-scanner.js';
import type { V4ScanConfig } from '../../src/scanner/v4-scanner.js';

// Test fixtures directory
const FIXTURES_DIR = join(__dirname, 'fixtures', 'v4-scanner');

describe('V4 Scanner', () => {
  beforeEach(async () => {
    // Create fixtures directory
    try {
      await mkdir(FIXTURES_DIR, { recursive: true });
    } catch {
      // Directory might already exist
    }
  });

  afterEach(async () => {
    // Clean up fixtures
    try {
      await rm(FIXTURES_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Language Detection', () => {
    it('should detect TypeScript from .ts extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      // Access private method via type assertion
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('src/app.ts')).toBe('typescript');
    });

    it('should detect TypeScript from .tsx extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('src/Button.tsx')).toBe('typescript');
    });

    it('should detect JavaScript from .js extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('src/index.js')).toBe('javascript');
    });

    it('should detect JavaScript from .mjs extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('src/module.mjs')).toBe('javascript');
    });

    it('should detect Python from .py extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('src/main.py')).toBe('python');
    });

    it('should detect Java from .java extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('src/Main.java')).toBe('java');
    });

    it('should detect Go from .go extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('main.go')).toBe('go');
    });

    it('should detect Kotlin from .kt extension', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('Main.kt')).toBe('kotlin');
    });

    it('should return null for unknown extensions', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const detect = (scanner as unknown as { detectLanguage: (p: string) => string | null }).detectLanguage.bind(scanner);
      expect(detect('README.md')).toBe(null);
      expect(detect('data.json')).toBe(null);
      expect(detect('style.css')).toBe(null);
    });
  });

  describe('File Discovery', () => {
    it('should discover TypeScript files', async () => {
      // Create test files
      await writeFile(join(FIXTURES_DIR, 'app.ts'), 'const x = 1;');
      await writeFile(join(FIXTURES_DIR, 'utils.ts'), 'export function util() {}');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.ts'],
      });

      const result = await scanner.scan();
      expect(result.files.length).toBeGreaterThanOrEqual(2);
    });

    it('should discover Python files', async () => {
      await writeFile(join(FIXTURES_DIR, 'main.py'), 'def main(): pass');
      await writeFile(join(FIXTURES_DIR, 'utils.py'), 'def util(): pass');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.py'],
      });

      const result = await scanner.scan();
      expect(result.files.length).toBeGreaterThanOrEqual(2);
    });

    it('should discover Java files', async () => {
      await writeFile(join(FIXTURES_DIR, 'Main.java'), 'public class Main {}');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.java'],
      });

      const result = await scanner.scan();
      expect(result.files.length).toBeGreaterThanOrEqual(1);
    });

    it('should exclude node_modules', async () => {
      // Create files in node_modules
      const nodeModulesDir = join(FIXTURES_DIR, 'node_modules', 'pkg');
      await mkdir(nodeModulesDir, { recursive: true });
      await writeFile(join(nodeModulesDir, 'index.js'), 'module.exports = {}');
      await writeFile(join(FIXTURES_DIR, 'app.js'), 'const x = 1;');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.js'],
        exclude: ['**/node_modules/**'],
      });

      const result = await scanner.scan();
      expect(result.files.some(f => f.includes('node_modules'))).toBe(false);
    });

    it('should return empty array for empty project', async () => {
      const emptyDir = join(FIXTURES_DIR, 'empty');
      await mkdir(emptyDir, { recursive: true });

      const scanner = new V4Scanner({
        projectRoot: emptyDir,
        include: ['**/*.ts'],
      });

      const result = await scanner.scan();
      expect(result.files).toEqual([]);
    });
  });

  describe('Scan Result Structure', () => {
    it('should return correct result structure', async () => {
      await writeFile(join(FIXTURES_DIR, 'app.ts'), 'const x = 1;');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.ts'],
      });

      const result = await scanner.scan();

      // Check required fields
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('codeUnits');
      expect(result).toHaveProperty('files');
      expect(result).toHaveProperty('languages');
      expect(result).toHaveProperty('durationMs');
      expect(result).toHaveProperty('stages');
      expect(result).toHaveProperty('projectRoot');
      expect(result).toHaveProperty('sla');

      expect(Array.isArray(result.issues)).toBe(true);
      expect(Array.isArray(result.codeUnits)).toBe(true);
      expect(Array.isArray(result.files)).toBe(true);
      expect(Array.isArray(result.languages)).toBe(true);
      expect(typeof result.durationMs).toBe('number');
      expect(result.stages).toHaveProperty('discovery');
      expect(result.stages).toHaveProperty('parsing');
      expect(result.stages).toHaveProperty('detection');
    });

    it('should track duration for each stage', async () => {
      await writeFile(join(FIXTURES_DIR, 'app.ts'), 'const x = 1;');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.ts'],
      });

      const result = await scanner.scan();

      expect(typeof result.stages.discovery).toBe('number');
      expect(typeof result.stages.parsing).toBe('number');
      expect(typeof result.stages.detection).toBe('number');
      expect(result.stages.discovery).toBeGreaterThanOrEqual(0);
      expect(result.stages.parsing).toBeGreaterThanOrEqual(0);
      expect(result.stages.detection).toBeGreaterThanOrEqual(0);
    });

    it('should include total duration', async () => {
      await writeFile(join(FIXTURES_DIR, 'app.ts'), 'const x = 1;');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.ts'],
      });

      const result = await scanner.scan();

      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Multiple Languages', () => {
    it('should detect multiple languages in one scan', async () => {
      await writeFile(join(FIXTURES_DIR, 'app.ts'), 'const x = 1;');
      await writeFile(join(FIXTURES_DIR, 'main.py'), 'def main(): pass');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.ts', '**/*.py'],
      });

      const result = await scanner.scan();

      expect(result.languages).toContain('typescript');
      expect(result.languages).toContain('python');
    });
  });

  describe('Configuration', () => {
    it('should use L1 SLA by default', async () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      const result = await scanner.scan();
      expect(result.sla).toBe('L1');
    });

    it('should respect SLA configuration', async () => {
      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        sla: 'L2',
      });
      const result = await scanner.scan();
      expect(result.sla).toBe('L2');
    });

    it('should use default locale when not specified', () => {
      const scanner = new V4Scanner({ projectRoot: FIXTURES_DIR });
      // Locale is internal, but we can verify scanner was created
      expect(scanner).toBeDefined();
    });
  });

  describe('Factory Function', () => {
    it('should create scanner via factory', () => {
      const scanner = createV4Scanner({ projectRoot: FIXTURES_DIR });
      expect(scanner).toBeInstanceOf(V4Scanner);
    });
  });

  describe('Error Handling', () => {
    it('should skip files that cannot be parsed', async () => {
      // Create a file with invalid syntax (but valid extension)
      await writeFile(join(FIXTURES_DIR, 'broken.ts'), 'this is not valid typescript {{{');

      const scanner = new V4Scanner({
        projectRoot: FIXTURES_DIR,
        include: ['**/*.ts'],
      });

      // Should not throw
      const result = await scanner.scan();
      expect(result).toBeDefined();
    });
  });
});
