/**
 * V4 Parser Manager Tests
 *
 * Tests for tree-sitter parser initialization, grammar loading,
 * and source parsing across all supported languages.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ParserManager } from '../../src/parser/manager.js';
import type { SupportedLanguage } from '../../src/ir/types.js';

describe('V4 ParserManager', () => {
  let manager: ParserManager;

  beforeAll(async () => {
    manager = new ParserManager();
    await manager.init();
  });

  // ─── Initialization ──────────────────────────────────────────────

  describe('initialization', () => {
    it('should initialize successfully', () => {
      expect(manager.initialized).toBe(true);
    });

    it('should be idempotent (double init does not throw)', async () => {
      await expect(manager.init()).resolves.toBeUndefined();
      expect(manager.initialized).toBe(true);
    });

    it('should load grammars for all 6 supported languages', () => {
      const langs = manager.getSupportedLanguages();
      expect(langs).toContain('typescript');
      expect(langs).toContain('javascript');
      expect(langs).toContain('python');
      expect(langs).toContain('java');
      expect(langs).toContain('go');
      expect(langs).toContain('kotlin');
      expect(langs.length).toBeGreaterThanOrEqual(6);
    });

    it('should report hasLanguage correctly', () => {
      expect(manager.hasLanguage('typescript')).toBe(true);
      expect(manager.hasLanguage('python')).toBe(true);
    });
  });

  // ─── Error handling ──────────────────────────────────────────────

  describe('error handling', () => {
    it('should return null on parse before init', () => {
      const uninitManager = new ParserManager();
      const result = uninitManager.parse('const x = 1;', 'typescript');
      expect(result).toBeNull();
    });

    it('should not have unsupported language grammar', () => {
      // 'rust' is not in our supported list
      expect(manager.hasLanguage('rust' as SupportedLanguage)).toBe(false);
    });

    it('should return null for unsupported language parse', () => {
      const result = manager.parse('fn main() {}', 'rust' as SupportedLanguage);
      expect(result).toBeNull();
    });
  });

  // ─── WASM init failure graceful fallback ─────────────────────────

  describe('WASM init failure fallback', () => {
    it('should not crash when WASM init fails and should fall back gracefully', async () => {
      // Simulate a ParserManager where _initFailed is set
      const failManager = new ParserManager();
      // Manually trigger init failure state by accessing private field
      // This simulates what happens when Parser.init() throws (e.g., WASM not available)
      (failManager as any)._initFailed = true;

      // init() should be a no-op after failure
      await failManager.init();
      expect(failManager.initialized).toBe(false);
      expect(failManager.initFailed).toBe(true);

      // parse() should return null, not throw
      const result = failManager.parse('const x = 1;', 'typescript');
      expect(result).toBeNull();
    });

    it('should be idempotent after init failure (does not retry)', async () => {
      const failManager = new ParserManager();
      (failManager as any)._initFailed = true;
      await failManager.init(); // should return early
      await failManager.init(); // should still return early
      expect(failManager.initFailed).toBe(true);
      expect(failManager.initialized).toBe(false);
    });
  });

  // ─── Parsing: TypeScript ─────────────────────────────────────────

  describe('parse TypeScript', () => {
    it('should parse a simple variable declaration', () => {
      const tree = manager.parse('const x: number = 42;', 'typescript');
      expect(tree).toBeDefined();
      expect(tree.rootNode.type).toBe('program');
      expect(tree.rootNode.childCount).toBeGreaterThan(0);
    });

    it('should parse a function declaration', () => {
      const tree = manager.parse('function greet(name: string): string { return name; }', 'typescript');
      const rootNode = tree.rootNode;
      expect(rootNode.type).toBe('program');
      const funcNode = rootNode.child(0)!;
      expect(funcNode.type).toBe('function_declaration');
    });

    it('should parse import statements', () => {
      const tree = manager.parse("import { readFile } from 'fs';", 'typescript');
      const rootNode = tree.rootNode;
      const importNode = rootNode.child(0)!;
      expect(importNode.type).toBe('import_statement');
    });

    it('should parse a class with methods', () => {
      const source = `
class MyService {
  private count = 0;
  doWork(): void {}
}`;
      const tree = manager.parse(source, 'typescript');
      expect(tree.rootNode.type).toBe('program');
      // Find the class node
      const classNode = tree.rootNode.children.find(n => n.type === 'class_declaration');
      expect(classNode).toBeDefined();
    });
  });

  // ─── Parsing: JavaScript ─────────────────────────────────────────

  describe('parse JavaScript', () => {
    it('should parse ES module syntax', () => {
      const tree = manager.parse("import { foo } from 'bar';", 'javascript');
      expect(tree.rootNode.type).toBe('program');
      expect(tree.rootNode.child(0)!.type).toBe('import_statement');
    });

    it('should parse arrow functions', () => {
      const tree = manager.parse('const fn = (x) => x * 2;', 'javascript');
      expect(tree.rootNode.type).toBe('program');
    });
  });

  // ─── Parsing: Python ─────────────────────────────────────────────

  describe('parse Python', () => {
    it('should parse a function definition', () => {
      const tree = manager.parse('def hello():\n    print("world")', 'python');
      expect(tree.rootNode.type).toBe('module');
      const funcNode = tree.rootNode.child(0)!;
      expect(funcNode.type).toBe('function_definition');
    });

    it('should parse import statements', () => {
      const tree = manager.parse('from pathlib import Path', 'python');
      const importNode = tree.rootNode.child(0)!;
      expect(importNode.type).toBe('import_from_statement');
    });

    it('should parse a class definition', () => {
      const source = 'class MyClass:\n    def __init__(self):\n        self.x = 1';
      const tree = manager.parse(source, 'python');
      const classNode = tree.rootNode.child(0)!;
      expect(classNode.type).toBe('class_definition');
    });
  });

  // ─── Parsing: Java ───────────────────────────────────────────────

  describe('parse Java', () => {
    it('should parse a class with method', () => {
      const source = 'public class Main { public static void main(String[] args) {} }';
      const tree = manager.parse(source, 'java');
      expect(tree.rootNode.type).toBe('program');
      const classNode = tree.rootNode.child(0)!;
      expect(classNode.type).toBe('class_declaration');
    });
  });

  // ─── Parsing: Go ─────────────────────────────────────────────────

  describe('parse Go', () => {
    it('should parse a function declaration', () => {
      const source = 'package main\n\nfunc main() {\n\tfmt.Println("hello")\n}';
      const tree = manager.parse(source, 'go');
      expect(tree.rootNode.type).toBe('source_file');
    });
  });

  // ─── Parsing: Kotlin ─────────────────────────────────────────────

  describe('parse Kotlin', () => {
    it('should parse a function declaration', () => {
      const source = 'fun main() {\n    println("hello")\n}';
      const tree = manager.parse(source, 'kotlin');
      expect(tree.rootNode.type).toBe('source_file');
    });
  });

  // ─── Parse result structure ──────────────────────────────────────

  describe('parse result structure', () => {
    it('should return a tree with rootNode', () => {
      const tree = manager.parse('const x = 1;', 'typescript');
      expect(tree.rootNode).toBeDefined();
      expect(tree.rootNode.startPosition).toBeDefined();
      expect(tree.rootNode.endPosition).toBeDefined();
    });

    it('should provide source text from nodes', () => {
      const tree = manager.parse('const x = 42;', 'typescript');
      expect(tree.rootNode.text).toBe('const x = 42;');
    });

    it('should provide position info for nodes', () => {
      const tree = manager.parse('const x = 42;\nconst y = 43;', 'typescript');
      const secondDecl = tree.rootNode.child(1)!;
      expect(secondDecl.startPosition.row).toBe(1);
      expect(secondDecl.startPosition.column).toBe(0);
    });
  });
});
