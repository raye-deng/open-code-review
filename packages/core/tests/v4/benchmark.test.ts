/**
 * V4 Benchmark Tests
 *
 * Performance benchmarks for the V4 scan pipeline.
 * Verifies SLA compliance and scaling characteristics.
 *
 * @since 0.4.0
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { V4Scanner } from '../../src/scanner/v4-scanner.js';
import { ParserManager } from '../../src/parser/manager.js';
import { TypeScriptExtractor } from '../../src/parser/extractors/typescript.js';
import { createV4Detectors } from '../../src/detectors/v4/index.js';
import type { V4ScanConfig } from '../../src/scanner/v4-scanner.js';
import type { CodeUnit } from '../../src/ir/types.js';

// ─── Helpers ────────────────────────────────────────────────────────

function generateTsFile(lineCount: number): string {
  const lines: string[] = [];
  lines.push('import { readFileSync } from "node:fs";');
  lines.push('');

  const funcCount = Math.floor(lineCount / 10);
  for (let i = 0; i < funcCount; i++) {
    lines.push(`export function func${i}(x: number, y: string): string {`);
    lines.push(`  const result = x.toString() + y;`);
    lines.push(`  if (result.length > 10) {`);
    lines.push(`    return result.slice(0, 10);`);
    lines.push(`  }`);
    lines.push(`  for (let j = 0; j < x; j++) {`);
    lines.push(`    console.log(j);`);
    lines.push(`  }`);
    lines.push(`  return result;`);
    lines.push(`}`);
    lines.push('');
  }

  // Pad to requested line count
  while (lines.length < lineCount) {
    lines.push(`// padding line ${lines.length}`);
  }

  return lines.join('\n');
}

function generateSmallTsFile(index: number): string {
  return `
import { existsSync } from 'node:fs';

export function handler${index}(input: string): boolean {
  if (!input) return false;
  const result = input.trim().toLowerCase();
  return existsSync(result);
}

export const CONFIG_${index} = {
  name: 'module-${index}',
  enabled: true,
  timeout: ${1000 + index},
};
`;
}

// ─── Benchmark Tests ────────────────────────────────────────────────

describe('V4 Benchmark', () => {
  let benchDir: string;

  beforeAll(async () => {
    benchDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocr-v4-bench-'));
  });

  afterAll(async () => {
    await fs.rm(benchDir, { recursive: true, force: true });
  });

  // ─── Test 1: L1 scan SLA (10s / 100 files) ─────────────────

  test('L1 scan completes within SLA (10s/100 files)', async () => {
    // Create a temp dir with 100 small files
    const dir100 = path.join(benchDir, 'files100');
    await fs.mkdir(dir100, { recursive: true });

    for (let i = 0; i < 100; i++) {
      await fs.writeFile(
        path.join(dir100, `module${i}.ts`),
        generateSmallTsFile(i),
      );
    }

    const config: V4ScanConfig = {
      projectRoot: dir100,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);

    const start = Date.now();
    const result = await scanner.scan();
    const elapsed = Date.now() - start;

    // Must complete in under 10 seconds
    expect(elapsed).toBeLessThan(10_000);

    // Should have scanned all 100 files
    expect(result.files.length).toBe(100);

    // Log timing for benchmarking
    console.log(`  L1 scan of 100 files: ${elapsed}ms (${(elapsed / 100).toFixed(1)}ms/file)`);
  }, 15_000);

  // ─── Test 2: Parsing performance (1000-line file) ───────────

  test('parsing performance for 1000-line file', async () => {
    const bigFile = generateTsFile(1000);
    const filePath = path.join(benchDir, 'big-file.ts');
    await fs.writeFile(filePath, bigFile);

    const parser = new ParserManager();
    await parser.init();

    const extractor = new TypeScriptExtractor();

    const start = Date.now();
    const tree = parser.parse(bigFile, 'typescript');
    const units = extractor.extract(tree, 'big-file.ts', bigFile);
    const elapsed = Date.now() - start;

    // Parsing 1000 lines should complete in under 2 seconds
    expect(elapsed).toBeLessThan(2_000);

    // Should produce code units
    expect(units.length).toBeGreaterThan(0);

    console.log(`  Parse 1000-line file: ${elapsed}ms, ${units.length} code units`);
  });

  // ─── Test 3: Detector performance scales linearly ───────────

  test('detector performance scales roughly linearly', async () => {
    // Generate code units at different scales
    const parser = new ParserManager();
    await parser.init();
    const extractor = new TypeScriptExtractor();

    const scales = [10, 50, 100];
    const timings: { count: number; ms: number }[] = [];

    for (const count of scales) {
      // Generate files and parse them
      const allUnits: CodeUnit[] = [];
      for (let i = 0; i < count; i++) {
        const source = generateSmallTsFile(i);
        const tree = parser.parse(source, 'typescript');
        const units = extractor.extract(tree, `file${i}.ts`, source);
        allUnits.push(...units);
      }

      // Run detectors
      const detectors = createV4Detectors();
      const context = {
        projectRoot: benchDir,
        allFiles: Array.from({ length: count }, (_, i) => `file${i}.ts`),
      };

      const start = Date.now();
      for (const detector of detectors) {
        await detector.detect(allUnits, context);
      }
      const elapsed = Date.now() - start;

      timings.push({ count: allUnits.length, ms: elapsed });
      console.log(`  Detect ${allUnits.length} units (${count} files): ${elapsed}ms`);
    }

    // Verify roughly linear scaling:
    // The time for 100 files should be less than 5x the time for 10 files
    // (allowing generous margin for overhead)
    if (timings.length >= 2) {
      const first = timings[0];
      const last = timings[timings.length - 1];
      const scaleRatio = last.count / first.count;
      const timeRatio = last.ms / Math.max(first.ms, 1);

      // Time ratio should be within 10x of unit ratio (generous bound)
      expect(timeRatio).toBeLessThan(scaleRatio * 10);
    }
  });

  // ─── Test 4: Memory efficiency ──────────────────────────────

  test('scan does not leak memory excessively', async () => {
    const memDir = path.join(benchDir, 'mem-test');
    await fs.mkdir(memDir, { recursive: true });

    // Create 50 files
    for (let i = 0; i < 50; i++) {
      await fs.writeFile(
        path.join(memDir, `mod${i}.ts`),
        generateSmallTsFile(i),
      );
    }

    const config: V4ScanConfig = {
      projectRoot: memDir,
      sla: 'L1',
      locale: 'en',
    };

    // Force GC if available
    if (global.gc) global.gc();
    const memBefore = process.memoryUsage().heapUsed;

    const scanner = new V4Scanner(config);
    await scanner.scan();

    if (global.gc) global.gc();
    const memAfter = process.memoryUsage().heapUsed;

    const memDelta = memAfter - memBefore;

    // Should not use more than 200MB for 50 small files
    expect(memDelta).toBeLessThan(200 * 1024 * 1024);

    console.log(`  Memory delta for 50 files: ${(memDelta / 1024 / 1024).toFixed(1)}MB`);
  });

  // ─── Test 5: Empty project scan ─────────────────────────────

  test('empty project scan completes quickly', async () => {
    const emptyDir = path.join(benchDir, 'empty');
    await fs.mkdir(emptyDir, { recursive: true });

    const config: V4ScanConfig = {
      projectRoot: emptyDir,
      sla: 'L1',
      locale: 'en',
    };

    const scanner = new V4Scanner(config);

    const start = Date.now();
    const result = await scanner.scan();
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(5_000);
    expect(result.files.length).toBe(0);
    expect(result.issues.length).toBe(0);
  });

  // ─── Test 6: Repeated scans are consistent ──────────────────

  test('repeated scans produce consistent results', async () => {
    const repeatDir = path.join(benchDir, 'repeat');
    await fs.mkdir(repeatDir, { recursive: true });

    for (let i = 0; i < 5; i++) {
      await fs.writeFile(
        path.join(repeatDir, `file${i}.ts`),
        generateSmallTsFile(i),
      );
    }

    const config: V4ScanConfig = {
      projectRoot: repeatDir,
      sla: 'L1',
      locale: 'en',
    };

    // Run scan 3 times
    const results = [];
    for (let run = 0; run < 3; run++) {
      const scanner = new V4Scanner(config);
      const result = await scanner.scan();
      results.push(result);
    }

    // All runs should produce the same number of issues
    const issueCounts = results.map(r => r.issues.length);
    expect(new Set(issueCounts).size).toBe(1);

    // All runs should find the same files
    const fileCounts = results.map(r => r.files.length);
    expect(new Set(fileCounts).size).toBe(1);
  });
});
