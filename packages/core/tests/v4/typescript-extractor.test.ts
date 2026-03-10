/**
 * V4 TypeScript Extractor Tests
 *
 * Tests for extracting CodeUnits from TypeScript/JavaScript tree-sitter CSTs.
 * Covers: imports, functions, classes, methods, calls, complexity, symbols.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ParserManager } from '../../src/parser/manager.js';
import { TypeScriptExtractor } from '../../src/parser/extractors/typescript.js';
import type { CodeUnit } from '../../src/ir/types.js';

describe('V4 TypeScriptExtractor', () => {
  let manager: ParserManager;
  let extractor: TypeScriptExtractor;
  let jsExtractor: TypeScriptExtractor;

  beforeAll(async () => {
    manager = new ParserManager();
    await manager.init();
    extractor = new TypeScriptExtractor('typescript');
    jsExtractor = new TypeScriptExtractor('javascript');
  });

  function parse(source: string, lang: 'typescript' | 'javascript' = 'typescript'): CodeUnit[] {
    const tree = manager.parse(source, lang);
    const ext = lang === 'javascript' ? jsExtractor : extractor;
    return ext.extract(tree, 'test.ts', source);
  }

  // ─── Imports ─────────────────────────────────────────────────────

  describe('import extraction', () => {
    it('should extract named imports', () => {
      const units = parse("import { readFile, writeFile } from 'fs';");
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('fs');
      expect(fileUnit.imports[0].symbols).toContain('readFile');
      expect(fileUnit.imports[0].symbols).toContain('writeFile');
      expect(fileUnit.imports[0].isRelative).toBe(false);
    });

    it('should extract default imports', () => {
      const units = parse("import React from 'react';");
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('react');
      expect(fileUnit.imports[0].symbols).toContain('React');
    });

    it('should extract star/namespace imports', () => {
      const units = parse("import * as path from 'path';");
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('path');
      expect(fileUnit.imports[0].symbols).toEqual(['* as path']);
    });

    it('should extract require() as import', () => {
      const units = parse("const fs = require('fs');");
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('fs');
      expect(fileUnit.imports[0].symbols).toContain('fs');
    });

    it('should extract relative imports', () => {
      const units = parse("import { helper } from './utils';");
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('./utils');
      expect(fileUnit.imports[0].isRelative).toBe(true);
    });

    it('should extract multiple imports', () => {
      const source = `
import { readFile } from 'fs';
import * as path from 'path';
import React from 'react';
`;
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(3);
    });

    it('should extract re-exports as imports', () => {
      const units = parse("export { foo, bar } from './module';");
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('./module');
      expect(fileUnit.imports[0].isRelative).toBe(true);
    });
  });

  // ─── Functions ───────────────────────────────────────────────────

  describe('function extraction', () => {
    it('should extract a simple function declaration', () => {
      const source = 'function greet(name: string): string { return name; }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('greet');
      expect(funcUnit!.definitions).toContainEqual(
        expect.objectContaining({ name: 'greet', kind: 'function' })
      );
    });

    it('should extract exported functions', () => {
      const source = 'export function greet() { return "hi"; }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.definitions[0].exported).toBe(true);
    });

    it('should extract export default function', () => {
      const source = 'export default function main() {}';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('main');
    });

    it('should extract arrow functions assigned to const', () => {
      const source = 'const greet = (name: string) => name;';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('greet');
    });

    it('should extract exported arrow functions', () => {
      const source = 'export const greet = (name: string) => name;';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.definitions[0].exported).toBe(true);
    });

    it('should set parentId to file unit', () => {
      const source = 'function foo() {}';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.parentId).toBe(fileUnit.id);
      expect(fileUnit.childIds).toContain(funcUnit.id);
    });

    it('should extract parameter count', () => {
      const source = 'function foo(a: number, b: string, c?: boolean) {}';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.parameterCount).toBe(3);
    });

    it('should extract parameter definitions', () => {
      const source = 'function foo(name: string, age: number) {}';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const paramDefs = funcUnit.definitions.filter(d => d.kind === 'parameter');
      expect(paramDefs).toHaveLength(2);
      expect(paramDefs[0].name).toBe('name');
      expect(paramDefs[1].name).toBe('age');
    });
  });

  // ─── Classes ─────────────────────────────────────────────────────

  describe('class extraction', () => {
    it('should extract a class declaration', () => {
      const source = 'class MyService { doWork() {} }';
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class');
      expect(classUnit).toBeDefined();
      expect(classUnit!.id).toContain('MyService');
    });

    it('should extract exported classes', () => {
      const source = 'export class MyService {}';
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class');
      expect(classUnit).toBeDefined();
      expect(classUnit!.definitions[0].exported).toBe(true);
    });

    it('should set class as child of file', () => {
      const source = 'class MyService {}';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const classUnit = units.find(u => u.kind === 'class')!;
      expect(classUnit.parentId).toBe(fileUnit.id);
      expect(fileUnit.childIds).toContain(classUnit.id);
    });
  });

  // ─── Methods ─────────────────────────────────────────────────────

  describe('method extraction', () => {
    it('should extract methods from a class', () => {
      const source = `
class MyService {
  doWork() { return 1; }
  processItem(item: string) { return item; }
}`;
      const units = parse(source);
      const methods = units.filter(u => u.kind === 'method');
      expect(methods).toHaveLength(2);
      expect(methods[0].id).toContain('MyService.doWork');
      expect(methods[1].id).toContain('MyService.processItem');
    });

    it('should mark private methods as not exported', () => {
      const source = `
class MyService {
  private secretMethod() {}
  publicMethod() {}
}`;
      const units = parse(source);
      const methods = units.filter(u => u.kind === 'method');
      const secretMethod = methods.find(m => m.id.includes('secretMethod'));
      const publicMethod = methods.find(m => m.id.includes('publicMethod'));
      expect(secretMethod!.definitions[0].exported).toBe(false);
      expect(publicMethod!.definitions[0].exported).toBe(true);
    });

    it('should set method parentId to class', () => {
      const source = 'class Svc { doWork() {} }';
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class')!;
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit.parentId).toBe(classUnit.id);
      expect(classUnit.childIds).toContain(methodUnit.id);
    });

    it('should extract method parameter count', () => {
      const source = 'class Svc { doWork(a: number, b: string) {} }';
      const units = parse(source);
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit.complexity.parameterCount).toBe(2);
    });
  });

  // ─── Calls ───────────────────────────────────────────────────────

  describe('call extraction', () => {
    it('should extract simple function calls', () => {
      const source = 'function foo() { console.log("hello"); }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const logCall = funcUnit.calls.find(c => c.method === 'log');
      expect(logCall).toBeDefined();
      expect(logCall!.object).toBe('console');
      expect(logCall!.callee).toBe('console.log');
    });

    it('should extract standalone function calls', () => {
      const source = 'function foo() { doSomething(1, 2); }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const call = funcUnit.calls.find(c => c.method === 'doSomething');
      expect(call).toBeDefined();
      expect(call!.argCount).toBe(2);
      expect(call!.object).toBeUndefined();
    });

    it('should extract chained method calls', () => {
      const source = 'function foo() { arr.filter(x => x > 0).map(x => x * 2); }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('should count arguments correctly', () => {
      const source = 'function foo() { fn(a, b, c); }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const call = funcUnit.calls.find(c => c.method === 'fn');
      expect(call!.argCount).toBe(3);
    });

    it('should extract calls at file level', () => {
      const source = 'console.log("top level");';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.calls.length).toBeGreaterThan(0);
    });
  });

  // ─── Complexity ──────────────────────────────────────────────────

  describe('complexity calculation', () => {
    it('should compute base cyclomatic complexity of 1 for simple function', () => {
      const source = 'function simple() { return 1; }';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.cyclomaticComplexity).toBe(1);
    });

    it('should increment cyclomatic complexity for if/for/while', () => {
      const source = `
function complex(x: number) {
  if (x > 0) {
    for (let i = 0; i < x; i++) {
      while (true) { break; }
    }
  }
  return x;
}`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // 1 (base) + 1 (if) + 1 (for) + 1 (while) = 4
      expect(funcUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(4);
    });

    it('should track nesting depth', () => {
      const source = `
function nested() {
  if (true) {
    for (let i = 0; i < 10; i++) {
      if (i > 5) {
        console.log(i);
      }
    }
  }
}`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.maxNestingDepth).toBeGreaterThanOrEqual(3);
    });

    it('should count lines of code (excluding blanks and comments)', () => {
      const source = `function foo() {
  // comment
  const x = 1;

  /* block comment */
  return x;
}`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // Lines: function foo() {, const x = 1;, return x;, } = 4
      expect(funcUnit.complexity.linesOfCode).toBeGreaterThanOrEqual(3);
    });

    it('should count cognitive complexity', () => {
      const source = `
function cognitiveTest(x: number) {
  if (x > 0) {
    if (x > 10) {
      return "big";
    }
  }
  return "small";
}`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // First if: 1 (at nesting 0)
      // Nested if: 1 + 1 (at nesting 1) = 2
      // Total: 3
      expect(funcUnit.complexity.cognitiveComplexity).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── Symbol definitions ──────────────────────────────────────────

  describe('symbol definitions', () => {
    it('should extract variable definitions at file level', () => {
      const source = 'const x = 1;\nlet y = 2;';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'x', kind: 'variable' })
      );
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'y', kind: 'variable' })
      );
    });

    it('should extract exported function definitions', () => {
      const source = 'export function greet() {}';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const greetDef = fileUnit.definitions.find(d => d.name === 'greet');
      expect(greetDef).toBeDefined();
      expect(greetDef!.exported).toBe(true);
    });

    it('should extract non-exported function definitions', () => {
      const source = 'function helper() {}';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const helperDef = fileUnit.definitions.find(d => d.name === 'helper');
      expect(helperDef).toBeDefined();
      expect(helperDef!.exported).toBe(false);
    });

    it('should extract class definitions', () => {
      const source = 'export class MyService {}';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'MyService', kind: 'class', exported: true })
      );
    });

    it('should extract type alias definitions', () => {
      const source = 'export type Options = { verbose: boolean };';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'Options', kind: 'type', exported: true })
      );
    });

    it('should extract interface definitions', () => {
      const source = 'export interface Config { name: string }';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'Config', kind: 'interface', exported: true })
      );
    });

    it('should extract enum definitions', () => {
      const source = 'export enum Color { Red, Green, Blue }';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'Color', kind: 'enum', exported: true })
      );
    });
  });

  // ─── Full file extraction ────────────────────────────────────────

  describe('full file extraction', () => {
    it('should extract a complete TypeScript file', () => {
      const source = `
import { readFile } from 'fs';
import * as path from 'path';

export function processFile(filePath: string): void {
  const content = readFile(filePath);
  console.log(content);
}

export class FileProcessor {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  process(file: string): string {
    const fullPath = path.join(this.basePath, file);
    return processFile(fullPath);
  }
}

const helper = (x: number) => x * 2;
`;
      const units = parse(source);

      // Should have file, function, class, methods, arrow function
      const fileUnit = units.find(u => u.kind === 'file')!;
      const funcUnit = units.find(u => u.kind === 'function' && u.id.includes('processFile'));
      const classUnit = units.find(u => u.kind === 'class');
      const methods = units.filter(u => u.kind === 'method');
      const helperFunc = units.find(u => u.kind === 'function' && u.id.includes('helper'));

      expect(fileUnit).toBeDefined();
      expect(fileUnit.imports).toHaveLength(2);
      expect(funcUnit).toBeDefined();
      expect(classUnit).toBeDefined();
      expect(methods.length).toBeGreaterThanOrEqual(1);
      expect(helperFunc).toBeDefined();
    });
  });

  // ─── JavaScript support ──────────────────────────────────────────

  describe('JavaScript support', () => {
    it('should extract from JavaScript with correct language tag', () => {
      const source = "const x = require('lodash');\nfunction test() { return x.map([1,2]); }";
      const tree = manager.parse(source, 'javascript');
      const units = jsExtractor.extract(tree, 'test.js', source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.language).toBe('javascript');
      expect(fileUnit.imports).toHaveLength(1);
    });
  });
});
