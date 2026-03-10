/**
 * V4 IR Types Tests
 *
 * Tests for the Unified Intermediate Representation type structures,
 * helper functions, and CodeUnit creation.
 */

import { describe, it, expect } from 'vitest';
import {
  createCodeUnit,
  emptyComplexity,
  type CodeUnit,
  type ImportInfo,
  type CallInfo,
  type ComplexityMetrics,
  type SymbolDef,
  type SymbolRef,
  type SourceLocation,
  type CodeUnitKind,
  type SupportedLanguage,
} from '../../src/ir/types.js';

describe('V4 IR Types', () => {
  // ─── emptyComplexity ─────────────────────────────────────────────

  describe('emptyComplexity()', () => {
    it('should return all-zero complexity metrics', () => {
      const metrics = emptyComplexity();
      expect(metrics.cyclomaticComplexity).toBe(0);
      expect(metrics.cognitiveComplexity).toBe(0);
      expect(metrics.maxNestingDepth).toBe(0);
      expect(metrics.linesOfCode).toBe(0);
      expect(metrics.parameterCount).toBeUndefined();
    });

    it('should return a new object each time', () => {
      const a = emptyComplexity();
      const b = emptyComplexity();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });

  // ─── createCodeUnit ──────────────────────────────────────────────

  describe('createCodeUnit()', () => {
    it('should create a CodeUnit with required fields and defaults', () => {
      const unit = createCodeUnit({
        id: 'file:test.ts',
        file: 'test.ts',
        language: 'typescript',
        kind: 'file',
        location: { startLine: 0, startColumn: 0, endLine: 10, endColumn: 0 },
        source: 'const x = 1;',
      });

      expect(unit.id).toBe('file:test.ts');
      expect(unit.file).toBe('test.ts');
      expect(unit.language).toBe('typescript');
      expect(unit.kind).toBe('file');
      expect(unit.source).toBe('const x = 1;');
      expect(unit.imports).toEqual([]);
      expect(unit.calls).toEqual([]);
      expect(unit.complexity).toEqual(emptyComplexity());
      expect(unit.definitions).toEqual([]);
      expect(unit.references).toEqual([]);
      expect(unit.childIds).toEqual([]);
      expect(unit.parentId).toBeUndefined();
    });

    it('should allow overriding default fields', () => {
      const imports: ImportInfo[] = [{
        module: 'fs',
        symbols: ['readFile'],
        line: 0,
        isRelative: false,
        raw: "import { readFile } from 'fs';",
      }];

      const unit = createCodeUnit({
        id: 'file:test.ts',
        file: 'test.ts',
        language: 'typescript',
        kind: 'file',
        location: { startLine: 0, startColumn: 0, endLine: 10, endColumn: 0 },
        source: 'const x = 1;',
        imports,
        parentId: 'parent:test',
      });

      expect(unit.imports).toHaveLength(1);
      expect(unit.imports[0].module).toBe('fs');
      expect(unit.parentId).toBe('parent:test');
    });

    it('should create a function-level CodeUnit', () => {
      const unit = createCodeUnit({
        id: 'func:test.ts:main',
        file: 'test.ts',
        language: 'typescript',
        kind: 'function',
        location: { startLine: 5, startColumn: 0, endLine: 15, endColumn: 1 },
        source: 'function main() { return 0; }',
        parentId: 'file:test.ts',
        complexity: {
          cyclomaticComplexity: 3,
          cognitiveComplexity: 2,
          maxNestingDepth: 1,
          linesOfCode: 10,
          parameterCount: 0,
        },
      });

      expect(unit.kind).toBe('function');
      expect(unit.parentId).toBe('file:test.ts');
      expect(unit.complexity.cyclomaticComplexity).toBe(3);
      expect(unit.complexity.parameterCount).toBe(0);
    });

    it('should create a method-level CodeUnit with parent class', () => {
      const unit = createCodeUnit({
        id: 'method:test.ts:MyClass.doWork',
        file: 'test.ts',
        language: 'typescript',
        kind: 'method',
        location: { startLine: 10, startColumn: 2, endLine: 20, endColumn: 3 },
        source: 'async doWork() {}',
        parentId: 'class:test.ts:MyClass',
      });

      expect(unit.kind).toBe('method');
      expect(unit.parentId).toBe('class:test.ts:MyClass');
    });
  });

  // ─── Type structure validation ───────────────────────────────────

  describe('ImportInfo structure', () => {
    it('should represent a named import correctly', () => {
      const imp: ImportInfo = {
        module: 'fs',
        symbols: ['readFile', 'writeFile'],
        line: 0,
        isRelative: false,
        raw: "import { readFile, writeFile } from 'fs';",
      };

      expect(imp.module).toBe('fs');
      expect(imp.symbols).toHaveLength(2);
      expect(imp.isRelative).toBe(false);
    });

    it('should represent a relative import correctly', () => {
      const imp: ImportInfo = {
        module: './utils',
        symbols: ['helper'],
        line: 1,
        isRelative: true,
        raw: "import { helper } from './utils';",
      };

      expect(imp.isRelative).toBe(true);
      expect(imp.module).toBe('./utils');
    });

    it('should represent a whole-module import (no specific symbols)', () => {
      const imp: ImportInfo = {
        module: 'os',
        symbols: [],
        line: 0,
        isRelative: false,
        raw: 'import os',
      };

      expect(imp.symbols).toHaveLength(0);
    });
  });

  describe('CallInfo structure', () => {
    it('should represent a simple function call', () => {
      const call: CallInfo = {
        callee: 'print',
        method: 'print',
        line: 5,
        argCount: 1,
      };

      expect(call.callee).toBe('print');
      expect(call.object).toBeUndefined();
      expect(call.argCount).toBe(1);
    });

    it('should represent a method call with object', () => {
      const call: CallInfo = {
        callee: 'console.log',
        object: 'console',
        method: 'log',
        line: 10,
        argCount: 2,
      };

      expect(call.object).toBe('console');
      expect(call.method).toBe('log');
    });
  });

  describe('SymbolDef structure', () => {
    it('should represent an exported function', () => {
      const sym: SymbolDef = {
        name: 'greet',
        kind: 'function',
        line: 0,
        exported: true,
      };

      expect(sym.exported).toBe(true);
      expect(sym.kind).toBe('function');
    });

    it('should represent a private variable', () => {
      const sym: SymbolDef = {
        name: '_count',
        kind: 'variable',
        line: 5,
        exported: false,
      };

      expect(sym.exported).toBe(false);
    });
  });

  // ─── Language types ──────────────────────────────────────────────

  describe('SupportedLanguage type', () => {
    it('should accept all 6 supported languages', () => {
      const languages: SupportedLanguage[] = [
        'typescript', 'javascript', 'python', 'java', 'go', 'kotlin',
      ];
      expect(languages).toHaveLength(6);
    });
  });

  describe('CodeUnitKind type', () => {
    it('should accept all valid kinds', () => {
      const kinds: CodeUnitKind[] = [
        'file', 'class', 'function', 'method', 'block', 'module',
      ];
      expect(kinds).toHaveLength(6);
    });
  });
});
