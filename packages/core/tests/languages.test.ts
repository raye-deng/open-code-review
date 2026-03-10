/**
 * Multi-Language Architecture Tests
 *
 * Tests the LanguageRegistry, TypeScriptAdapter, and related types.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LanguageRegistry } from '../src/languages/registry.js';
import { TypeScriptAdapter } from '../src/languages/typescript/parser.js';

describe('LanguageRegistry', () => {
  beforeEach(() => {
    LanguageRegistry.resetInstance();
  });

  it('should be a singleton', () => {
    const a = LanguageRegistry.getInstance();
    const b = LanguageRegistry.getInstance();
    expect(a).toBe(b);
  });

  it('should register and retrieve adapters by ID', () => {
    const registry = LanguageRegistry.getInstance();
    const adapter = new TypeScriptAdapter();
    registry.register(adapter);

    expect(registry.getById('typescript')).toBe(adapter);
  });

  it('should retrieve adapters by file extension', () => {
    const registry = LanguageRegistry.getInstance();
    const adapter = new TypeScriptAdapter();
    registry.register(adapter);

    expect(registry.getByExtension('.ts')).toBe(adapter);
    expect(registry.getByExtension('.tsx')).toBe(adapter);
    expect(registry.getByExtension('.js')).toBe(adapter);
    expect(registry.getByExtension('.jsx')).toBe(adapter);
    expect(registry.getByExtension('.mts')).toBe(adapter);
    expect(registry.getByExtension('.cts')).toBe(adapter);
    expect(registry.getByExtension('.mjs')).toBe(adapter);
    expect(registry.getByExtension('.cjs')).toBe(adapter);
  });

  it('should retrieve adapters by file path', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    expect(registry.getByFilePath('src/app.ts')).toBeDefined();
    expect(registry.getByFilePath('/home/user/project/index.tsx')).toBeDefined();
    expect(registry.getByFilePath('test.js')).toBeDefined();
  });

  it('should return undefined for unknown extensions', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    expect(registry.getByExtension('.py')).toBeUndefined();
    expect(registry.getByExtension('.java')).toBeUndefined();
    expect(registry.getByFilePath('main.go')).toBeUndefined();
  });

  it('should detect language from file path', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    expect(registry.detectLanguage('src/app.ts')).toBe('typescript');
    expect(registry.detectLanguage('src/utils.js')).toBe('typescript');
    expect(registry.detectLanguage('main.py')).toBeUndefined();
  });

  it('should throw when registering duplicate adapter', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    expect(() => registry.register(new TypeScriptAdapter())).toThrow(
      "Language adapter 'typescript' is already registered"
    );
  });

  it('should unregister adapters', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    registry.unregister('typescript');
    expect(registry.getById('typescript')).toBeUndefined();
    expect(registry.getByExtension('.ts')).toBeUndefined();
  });

  it('should list registered languages', () => {
    const registry = LanguageRegistry.getInstance();
    expect(registry.getRegisteredLanguages()).toEqual([]);

    registry.register(new TypeScriptAdapter());
    expect(registry.getRegisteredLanguages()).toEqual(['typescript']);
  });

  it('should list supported extensions', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    const exts = registry.getSupportedExtensions();
    expect(exts).toContain('.ts');
    expect(exts).toContain('.tsx');
    expect(exts).toContain('.js');
    expect(exts).toContain('.jsx');
  });

  it('should check if extension/path is supported', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    expect(registry.isSupported('.ts')).toBe(true);
    expect(registry.isSupported('.py')).toBe(false);
    expect(registry.isSupported('src/app.tsx')).toBe(true);
    expect(registry.isSupported('main.go')).toBe(false);
  });

  it('should handle case-insensitive extensions', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new TypeScriptAdapter());

    expect(registry.getByExtension('.TS')).toBeDefined();
    expect(registry.getByExtension('.Tsx')).toBeDefined();
  });
});

describe('TypeScriptAdapter', () => {
  const adapter = new TypeScriptAdapter();

  describe('properties', () => {
    it('should have correct id', () => {
      expect(adapter.id).toBe('typescript');
    });

    it('should support all TS/JS extensions', () => {
      expect(adapter.extensions).toContain('.ts');
      expect(adapter.extensions).toContain('.tsx');
      expect(adapter.extensions).toContain('.js');
      expect(adapter.extensions).toContain('.jsx');
      expect(adapter.extensions).toContain('.mts');
      expect(adapter.extensions).toContain('.cts');
      expect(adapter.extensions).toContain('.mjs');
      expect(adapter.extensions).toContain('.cjs');
    });
  });

  describe('parse', () => {
    it('should parse TypeScript source code', async () => {
      const source = `
const x: number = 42;
function hello(name: string): string {
  return \`Hello, \${name}\`;
}
`;
      const ast = await adapter.parse(source, 'test.ts');
      expect(ast).toBeDefined();
      expect(ast.type).toBe('Program');
    });

    it('should parse JSX/TSX', async () => {
      const source = `
const App = () => <div>Hello</div>;
`;
      const ast = await adapter.parse(source, 'test.tsx');
      expect(ast).toBeDefined();
      expect(ast.type).toBe('Program');
    });
  });

  describe('extractImports', () => {
    it('should extract ES imports', () => {
      const source = `
import { readFile } from 'node:fs';
import path from 'path';
import * as util from 'util';
`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].module).toBe('node:fs');
      expect(imports[0].bindings).toContain('readFile');
      expect(imports[0].isBuiltin).toBe(true);
      expect(imports[1].module).toBe('path');
      expect(imports[1].bindings).toContain('path');
      expect(imports[2].module).toBe('util');
    });

    it('should extract CommonJS requires', () => {
      const source = `
const fs = require('fs');
const { join } = require('path');
`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      expect(imports[0].module).toBe('fs');
      expect(imports[0].bindings).toContain('fs');
      expect(imports[1].module).toBe('path');
      expect(imports[1].bindings).toContain('join');
    });

    it('should extract dynamic imports', () => {
      const source = `const mod = await import('lodash');`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(1);
      expect(imports[0].module).toBe('lodash');
    });

    it('should extract side-effect imports', () => {
      const source = `import 'reflect-metadata';`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(1);
      expect(imports[0].module).toBe('reflect-metadata');
      expect(imports[0].bindings).toEqual([]);
    });

    it('should correctly identify relative imports', () => {
      const source = `
import { helper } from './utils';
import { config } from '../config';
import { lib } from 'some-lib';
`;
      const imports = adapter.extractImports(source);
      expect(imports[0].isRelative).toBe(true);
      expect(imports[1].isRelative).toBe(true);
      expect(imports[2].isRelative).toBe(false);
    });

    it('should correctly identify builtin modules', () => {
      const source = `
import { readFile } from 'node:fs';
import { join } from 'path';
import express from 'express';
`;
      const imports = adapter.extractImports(source);
      expect(imports[0].isBuiltin).toBe(true);
      expect(imports[1].isBuiltin).toBe(true);
      expect(imports[2].isBuiltin).toBe(false);
    });
  });

  describe('extractCalls', () => {
    it('should extract function calls', () => {
      const source = `
console.log('hello');
readFile('./test.txt');
`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).toContain('console.log');
      expect(names).toContain('readFile');
    });

    it('should identify method calls', () => {
      const source = `obj.method();`;
      const calls = adapter.extractCalls(source);
      const methodCalls = calls.filter(c => c.isMethodCall);
      expect(methodCalls.length).toBeGreaterThan(0);
    });

    it('should skip comments', () => {
      const source = `
// console.log('commented');
/* another.call() */
`;
      const calls = adapter.extractCalls(source);
      expect(calls.length).toBe(0);
    });
  });

  describe('computeComplexity', () => {
    it('should compute basic complexity for simple code', () => {
      const source = `
function add(a: number, b: number): number {
  return a + b;
}
`;
      const metrics = adapter.computeComplexity(source);
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(1);
      expect(metrics.loc).toBeGreaterThan(0);
    });

    it('should detect higher complexity for branching code', () => {
      const simple = `function simple() { return 1; }`;
      const complex = `
function complex(x: number) {
  if (x > 0) {
    if (x > 10) {
      return 'big';
    } else {
      return 'small';
    }
  } else if (x < 0) {
    return 'negative';
  } else {
    return 'zero';
  }
}
`;
      const simpleMetrics = adapter.computeComplexity(simple);
      const complexMetrics = adapter.computeComplexity(complex);
      expect(complexMetrics.cyclomatic).toBeGreaterThan(simpleMetrics.cyclomatic);
    });
  });
});
