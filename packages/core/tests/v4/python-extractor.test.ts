/**
 * V4 Python Extractor Tests
 *
 * Tests for extracting CodeUnits from Python tree-sitter CSTs.
 * Covers: imports, functions (def/async def), classes, methods, calls,
 * complexity, decorators, symbols.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ParserManager } from '../../src/parser/manager.js';
import { PythonExtractor } from '../../src/parser/extractors/python.js';
import type { CodeUnit } from '../../src/ir/types.js';

describe('V4 PythonExtractor', () => {
  let manager: ParserManager;
  let extractor: PythonExtractor;

  beforeAll(async () => {
    manager = new ParserManager();
    await manager.init();
    extractor = new PythonExtractor();
  });

  function parse(source: string): CodeUnit[] {
    const tree = manager.parse(source, 'python');
    return extractor.extract(tree, 'test.py', source);
  }

  // ─── Imports ─────────────────────────────────────────────────────

  describe('import extraction', () => {
    it('should extract simple import (import os)', () => {
      const units = parse('import os');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('os');
      expect(fileUnit.imports[0].symbols).toEqual([]);
      expect(fileUnit.imports[0].isRelative).toBe(false);
    });

    it('should extract aliased import (import sys as system)', () => {
      const units = parse('import sys as system');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('sys');
    });

    it('should extract from-import (from pathlib import Path)', () => {
      const units = parse('from pathlib import Path');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('pathlib');
      expect(fileUnit.imports[0].symbols).toContain('Path');
      expect(fileUnit.imports[0].isRelative).toBe(false);
    });

    it('should extract from-import with multiple symbols', () => {
      const units = parse('from pathlib import Path, PurePath');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].symbols).toContain('Path');
      expect(fileUnit.imports[0].symbols).toContain('PurePath');
    });

    it('should extract relative import (from . import utils)', () => {
      const units = parse('from . import utils');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].isRelative).toBe(true);
      expect(fileUnit.imports[0].module).toBe('.');
    });

    it('should extract parent-relative import (from ..base import BaseClass)', () => {
      const units = parse('from ..base import BaseClass');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].isRelative).toBe(true);
      expect(fileUnit.imports[0].module).toContain('..');
      expect(fileUnit.imports[0].symbols).toContain('BaseClass');
    });

    it('should extract wildcard import', () => {
      const units = parse('from os.path import *');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].symbols).toContain('*');
    });

    it('should extract multiple import statements', () => {
      const source = `import os
import sys
from pathlib import Path`;
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(3);
    });
  });

  // ─── Functions ───────────────────────────────────────────────────

  describe('function extraction', () => {
    it('should extract a simple function (def)', () => {
      const source = 'def greet(name):\n    return name';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('greet');
    });

    it('should extract an async function', () => {
      const source = 'async def fetch_data():\n    return await get_data()';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('fetch_data');
    });

    it('should extract a typed function', () => {
      const source = 'def greet(name: str) -> str:\n    return name';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
    });

    it('should set function parentId to file unit', () => {
      const source = 'def foo():\n    pass';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.parentId).toBe(fileUnit.id);
      expect(fileUnit.childIds).toContain(funcUnit.id);
    });

    it('should extract parameter count (excluding self)', () => {
      const source = 'def foo(a, b, c):\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.parameterCount).toBe(3);
    });

    it('should extract parameter definitions', () => {
      const source = 'def foo(name: str, age: int):\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const paramDefs = funcUnit.definitions.filter(d => d.kind === 'parameter');
      expect(paramDefs).toHaveLength(2);
      expect(paramDefs[0].name).toBe('name');
      expect(paramDefs[1].name).toBe('age');
    });

    it('should mark private functions (leading underscore) as not exported', () => {
      const source = 'def _private_func():\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.definitions[0].exported).toBe(false);
    });

    it('should mark public functions as exported', () => {
      const source = 'def public_func():\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.definitions[0].exported).toBe(true);
    });
  });

  // ─── Decorated functions ─────────────────────────────────────────

  describe('decorated functions', () => {
    it('should extract decorated functions', () => {
      const source = '@decorator\ndef decorated_func():\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('decorated_func');
    });

    it('should include decorator in source text', () => {
      const source = '@my_decorator\ndef my_func():\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.source).toContain('@my_decorator');
    });

    it('should extract async decorated functions', () => {
      const source = '@some_decorator\nasync def async_func():\n    pass';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function');
      expect(funcUnit).toBeDefined();
      expect(funcUnit!.id).toContain('async_func');
    });
  });

  // ─── Classes ─────────────────────────────────────────────────────

  describe('class extraction', () => {
    it('should extract a class definition', () => {
      const source = 'class MyService:\n    pass';
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class');
      expect(classUnit).toBeDefined();
      expect(classUnit!.id).toContain('MyService');
      expect(classUnit!.language).toBe('python');
    });

    it('should set class as child of file', () => {
      const source = 'class Svc:\n    pass';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const classUnit = units.find(u => u.kind === 'class')!;
      expect(classUnit.parentId).toBe(fileUnit.id);
      expect(fileUnit.childIds).toContain(classUnit.id);
    });

    it('should mark public classes as exported', () => {
      const source = 'class PublicClass:\n    pass';
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class')!;
      expect(classUnit.definitions[0].exported).toBe(true);
    });

    it('should mark private classes (leading underscore) as not exported', () => {
      const source = 'class _PrivateClass:\n    pass';
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class')!;
      expect(classUnit.definitions[0].exported).toBe(false);
    });
  });

  // ─── Methods ─────────────────────────────────────────────────────

  describe('method extraction', () => {
    it('should extract methods from a class', () => {
      const source = `class Svc:
    def do_work(self):
        pass
    def process(self, item):
        pass`;
      const units = parse(source);
      const methods = units.filter(u => u.kind === 'method');
      expect(methods).toHaveLength(2);
    });

    it('should extract __init__ as a method', () => {
      const source = `class Svc:
    def __init__(self, count: int = 0):
        self.count = count`;
      const units = parse(source);
      const initMethod = units.find(u => u.kind === 'method' && u.id.includes('__init__'));
      expect(initMethod).toBeDefined();
    });

    it('should mark __init__ as exported', () => {
      const source = `class Svc:
    def __init__(self):
        pass`;
      const units = parse(source);
      const initMethod = units.find(u => u.kind === 'method')!;
      expect(initMethod.definitions[0].exported).toBe(true);
    });

    it('should mark private methods (leading underscore) as not exported', () => {
      const source = `class Svc:
    def _private_method(self):
        pass`;
      const units = parse(source);
      const method = units.find(u => u.kind === 'method')!;
      expect(method.definitions[0].exported).toBe(false);
    });

    it('should count parameters excluding self', () => {
      const source = `class Svc:
    def do_work(self, a, b, c):
        pass`;
      const units = parse(source);
      const method = units.find(u => u.kind === 'method')!;
      expect(method.complexity.parameterCount).toBe(3);
    });

    it('should set method parentId to class', () => {
      const source = `class Svc:
    def do_work(self):
        pass`;
      const units = parse(source);
      const classUnit = units.find(u => u.kind === 'class')!;
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit.parentId).toBe(classUnit.id);
      expect(classUnit.childIds).toContain(methodUnit.id);
    });
  });

  // ─── Calls ───────────────────────────────────────────────────────

  describe('call extraction', () => {
    it('should extract simple function calls', () => {
      const source = 'def foo():\n    print("hello")';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const printCall = funcUnit.calls.find(c => c.method === 'print');
      expect(printCall).toBeDefined();
      expect(printCall!.argCount).toBe(1);
    });

    it('should extract method calls with object', () => {
      const source = 'def foo():\n    sys.stdout.write("hello")';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const writeCall = funcUnit.calls.find(c => c.method === 'write');
      expect(writeCall).toBeDefined();
      expect(writeCall!.object).toBeDefined();
    });

    it('should extract self method calls', () => {
      const source = `class Svc:
    def work(self):
        self.process()`;
      const units = parse(source);
      const methodUnit = units.find(u => u.kind === 'method')!;
      const processCall = methodUnit.calls.find(c => c.method === 'process');
      expect(processCall).toBeDefined();
      expect(processCall!.object).toBe('self');
    });

    it('should count arguments correctly', () => {
      const source = 'def foo():\n    bar(1, 2, 3)';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      const barCall = funcUnit.calls.find(c => c.method === 'bar');
      expect(barCall!.argCount).toBe(3);
    });

    it('should extract nested calls', () => {
      const source = 'def foo():\n    print(str(len(items)))';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.calls.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── Complexity ──────────────────────────────────────────────────

  describe('complexity calculation', () => {
    it('should compute base cyclomatic complexity of 1 for simple function', () => {
      const source = 'def simple():\n    return 1';
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.cyclomaticComplexity).toBe(1);
    });

    it('should increment cyclomatic complexity for if/elif/for/while', () => {
      const source = `def complex(x):
    if x > 0:
        for i in range(x):
            while True:
                break
    elif x < 0:
        pass
    return x`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // 1 (base) + 1 (if) + 1 (for) + 1 (while) + 1 (elif) = 5
      expect(funcUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(5);
    });

    it('should track nesting depth', () => {
      const source = `def nested():
    if True:
        for i in range(10):
            if i > 5:
                print(i)`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.maxNestingDepth).toBeGreaterThanOrEqual(3);
    });

    it('should count boolean operators for complexity', () => {
      const source = `def check(a, b, c):
    if a and b or c:
        return True
    return False`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // 1 (base) + 1 (if) + 1 (and) + 1 (or) = 4
      expect(funcUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(4);
    });

    it('should count lines of code (excluding blanks and comments)', () => {
      const source = `def foo():
    # comment
    x = 1

    return x`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.linesOfCode).toBeGreaterThanOrEqual(3);
    });

    it('should count cognitive complexity', () => {
      const source = `def cognitive(x):
    if x > 0:
        if x > 10:
            return "big"
    return "small"`;
      const units = parse(source);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // First if: 1 (depth 0)
      // Nested if: 1 + 1 (depth 1) = 2
      // Total >= 3
      expect(funcUnit.complexity.cognitiveComplexity).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── File-level definitions ──────────────────────────────────────

  describe('file-level definitions', () => {
    it('should extract function definitions', () => {
      const source = 'def greet():\n    pass';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'greet', kind: 'function' })
      );
    });

    it('should extract class definitions', () => {
      const source = 'class MyClass:\n    pass';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'MyClass', kind: 'class' })
      );
    });

    it('should extract variable assignments', () => {
      const source = 'x = 1\ny = "hello"';
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions).toContainEqual(
        expect.objectContaining({ name: 'x', kind: 'variable' })
      );
    });
  });

  // ─── Full file extraction ────────────────────────────────────────

  describe('full file extraction', () => {
    it('should extract a complete Python file', () => {
      const source = `import os
from pathlib import Path

def process_file(file_path: str) -> None:
    content = Path(file_path).read_text()
    print(content)

class FileProcessor:
    def __init__(self, base_path: str):
        self.base_path = base_path
    
    def process(self, file: str) -> str:
        full_path = os.path.join(self.base_path, file)
        return process_file(full_path)

_helper = lambda x: x * 2
`;
      const units = parse(source);

      const fileUnit = units.find(u => u.kind === 'file')!;
      const funcUnit = units.find(u => u.kind === 'function' && u.id.includes('process_file'));
      const classUnit = units.find(u => u.kind === 'class');
      const methods = units.filter(u => u.kind === 'method');

      expect(fileUnit).toBeDefined();
      expect(fileUnit.imports).toHaveLength(2);
      expect(funcUnit).toBeDefined();
      expect(classUnit).toBeDefined();
      expect(methods.length).toBeGreaterThanOrEqual(2);
    });
  });
});
