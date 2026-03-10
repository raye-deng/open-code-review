/**
 * V4 Java Extractor Tests
 *
 * Tests for extracting CodeUnits from Java tree-sitter CSTs.
 * Covers: imports (single, wildcard, static), classes, interfaces, enums,
 * methods (public/private), constructors, calls, complexity, symbols,
 * nested classes, annotations.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ParserManager } from '../../src/parser/manager.js';
import { JavaExtractor } from '../../src/parser/extractors/java.js';
import type { CodeUnit } from '../../src/ir/types.js';

describe('V4 JavaExtractor', () => {
  let manager: ParserManager;
  let extractor: JavaExtractor;

  beforeAll(async () => {
    manager = new ParserManager();
    await manager.init();
    extractor = new JavaExtractor();
  });

  function parse(source: string): CodeUnit[] {
    const tree = manager.parse(source, 'java');
    return extractor.extract(tree, 'Test.java', source);
  }

  // ─── Imports ─────────────────────────────────────────────────────

  describe('import extraction', () => {
    it('should extract a single import', () => {
      const units = parse('import java.util.List;');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('java.util');
      expect(fileUnit.imports[0].symbols).toEqual(['List']);
      expect(fileUnit.imports[0].isRelative).toBe(false);
    });

    it('should extract wildcard import', () => {
      const units = parse('import java.util.*;');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('java.util');
      expect(fileUnit.imports[0].symbols).toEqual(['*']);
    });

    it('should extract static import', () => {
      const units = parse('import static org.junit.Assert.*;');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('org.junit.Assert');
      expect(fileUnit.imports[0].symbols).toEqual(['*']);
    });

    it('should extract multiple imports', () => {
      const source = `
import java.util.List;
import java.util.Map;
import java.io.File;
`;
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(3);
      expect(fileUnit.imports[0].module).toBe('java.util');
      expect(fileUnit.imports[0].symbols).toEqual(['List']);
      expect(fileUnit.imports[1].module).toBe('java.util');
      expect(fileUnit.imports[1].symbols).toEqual(['Map']);
      expect(fileUnit.imports[2].module).toBe('java.io');
      expect(fileUnit.imports[2].symbols).toEqual(['File']);
    });

    it('should extract static single-symbol import', () => {
      const units = parse('import static java.lang.Math.PI;');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('java.lang.Math');
      expect(fileUnit.imports[0].symbols).toEqual(['PI']);
    });
  });

  // ─── Classes ─────────────────────────────────────────────────────

  describe('class extraction', () => {
    it('should extract a public class declaration', () => {
      const units = parse('public class Foo { }');
      const classUnit = units.find(u => u.kind === 'class' && u.id.includes('Foo'))!;
      expect(classUnit).toBeDefined();
      expect(classUnit.definitions[0].name).toBe('Foo');
      expect(classUnit.definitions[0].kind).toBe('class');
      expect(classUnit.definitions[0].exported).toBe(true);
    });

    it('should extract a package-private class as not exported', () => {
      const units = parse('class Bar { }');
      const classUnit = units.find(u => u.kind === 'class' && u.id.includes('Bar'))!;
      expect(classUnit).toBeDefined();
      expect(classUnit.definitions[0].name).toBe('Bar');
      expect(classUnit.definitions[0].exported).toBe(false);
    });

    it('should link class to file unit as child', () => {
      const units = parse('public class Foo { }');
      const fileUnit = units.find(u => u.kind === 'file')!;
      const classUnit = units.find(u => u.kind === 'class')!;
      expect(fileUnit.childIds).toContain(classUnit.id);
      expect(classUnit.parentId).toBe(fileUnit.id);
    });
  });

  // ─── Interfaces ──────────────────────────────────────────────────

  describe('interface extraction', () => {
    it('should extract an interface declaration', () => {
      const units = parse(`
public interface Printable {
  void print();
}
`);
      const ifaceUnit = units.find(u => u.kind === 'class' && u.id.includes('Printable'))!;
      expect(ifaceUnit).toBeDefined();
      expect(ifaceUnit.definitions[0].name).toBe('Printable');
      expect(ifaceUnit.definitions[0].kind).toBe('interface');
      expect(ifaceUnit.definitions[0].exported).toBe(true);
    });

    it('should extract methods from interface', () => {
      const units = parse(`
interface Serializable {
  String serialize();
  void deserialize(String data);
}
`);
      const methodUnits = units.filter(u => u.kind === 'method');
      expect(methodUnits).toHaveLength(2);
      expect(methodUnits.map(u => u.definitions[0].name)).toContain('serialize');
      expect(methodUnits.map(u => u.definitions[0].name)).toContain('deserialize');
    });
  });

  // ─── Enums ───────────────────────────────────────────────────────

  describe('enum extraction', () => {
    it('should extract an enum declaration with constants', () => {
      const units = parse(`
public enum Color { RED, GREEN, BLUE }
`);
      const enumUnit = units.find(u => u.kind === 'class' && u.id.includes('Color'))!;
      expect(enumUnit).toBeDefined();
      expect(enumUnit.definitions[0].name).toBe('Color');
      expect(enumUnit.definitions[0].kind).toBe('enum');
      expect(enumUnit.definitions[0].exported).toBe(true);

      // Check enum constants are extracted as definitions
      const constants = enumUnit.definitions.filter(d => d.kind === 'variable');
      expect(constants).toHaveLength(3);
      expect(constants.map(c => c.name)).toEqual(['RED', 'GREEN', 'BLUE']);
    });
  });

  // ─── Methods ─────────────────────────────────────────────────────

  describe('method extraction', () => {
    it('should extract a public method', () => {
      const units = parse(`
public class Foo {
  public int getX() { return 0; }
}
`);
      const methodUnit = units.find(u => u.kind === 'method' && u.id.includes('getX'))!;
      expect(methodUnit).toBeDefined();
      expect(methodUnit.definitions[0].name).toBe('getX');
      expect(methodUnit.definitions[0].kind).toBe('method');
      expect(methodUnit.definitions[0].exported).toBe(true);
    });

    it('should extract a private method as not exported', () => {
      const units = parse(`
public class Foo {
  private void helper() { }
}
`);
      const methodUnit = units.find(u => u.kind === 'method' && u.id.includes('helper'))!;
      expect(methodUnit).toBeDefined();
      expect(methodUnit.definitions[0].exported).toBe(false);
    });

    it('should extract method parameters', () => {
      const units = parse(`
public class Foo {
  public void process(int x, String name) { }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit.complexity.parameterCount).toBe(2);
      // Check parameter definitions
      const params = methodUnit.definitions.filter(d => d.kind === 'parameter');
      expect(params).toHaveLength(2);
      expect(params.map(p => p.name)).toContain('x');
      expect(params.map(p => p.name)).toContain('name');
    });
  });

  // ─── Constructors ────────────────────────────────────────────────

  describe('constructor extraction', () => {
    it('should extract a constructor', () => {
      const units = parse(`
public class Foo {
  public Foo(int x) { }
}
`);
      const ctorUnit = units.find(u => u.kind === 'method' && u.id.includes('Foo.Foo'))!;
      expect(ctorUnit).toBeDefined();
      expect(ctorUnit.definitions[0].name).toBe('Foo');
      expect(ctorUnit.definitions[0].exported).toBe(true);
      expect(ctorUnit.complexity.parameterCount).toBe(1);
    });
  });

  // ─── Calls ───────────────────────────────────────────────────────

  describe('call extraction', () => {
    it('should extract method invocations', () => {
      const units = parse(`
public class Foo {
  public void bar() {
    list.add("hello");
    System.out.println("world");
  }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit.calls.length).toBeGreaterThanOrEqual(2);
      const addCall = methodUnit.calls.find(c => c.method === 'add');
      expect(addCall).toBeDefined();
      expect(addCall!.object).toBe('list');
      expect(addCall!.argCount).toBe(1);

      const printlnCall = methodUnit.calls.find(c => c.method === 'println');
      expect(printlnCall).toBeDefined();
    });

    it('should extract object creation expressions (new)', () => {
      const units = parse(`
public class Foo {
  public void bar() {
    List<String> list = new ArrayList<>();
    Object obj = new Object();
  }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      const newCalls = methodUnit.calls.filter(c => c.callee.startsWith('new '));
      expect(newCalls.length).toBeGreaterThanOrEqual(2);
      expect(newCalls.map(c => c.method)).toContain('ArrayList');
      expect(newCalls.map(c => c.method)).toContain('Object');
    });
  });

  // ─── Complexity ──────────────────────────────────────────────────

  describe('complexity calculation', () => {
    it('should calculate cyclomatic complexity for control flow', () => {
      const units = parse(`
public class Foo {
  public void complex(int x) {
    if (x > 0) {
      for (int i = 0; i < 10; i++) {
        if (x > 5) { }
      }
    }
    while (x > 0) { x--; }
    try { } catch (Exception e) { }
  }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      // base 1 + if + for + if + while + catch = 6
      expect(methodUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(6);
    });

    it('should count logical operators in complexity', () => {
      const units = parse(`
public class Foo {
  public boolean check(int x, int y) {
    return x > 0 && y < 10 || x == y;
  }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      // base 1 + && + || = 3
      expect(methodUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(3);
    });

    it('should calculate nesting depth', () => {
      const units = parse(`
public class Foo {
  public void nested() {
    if (true) {
      for (int i = 0; i < 10; i++) {
        while (true) { }
      }
    }
  }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit.complexity.maxNestingDepth).toBeGreaterThanOrEqual(3);
    });

    it('should count ternary expressions in complexity', () => {
      const units = parse(`
public class Foo {
  public int ternary(int x) {
    return x > 0 ? 1 : 0;
  }
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      // base 1 + ternary = 2
      expect(methodUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(2);
    });
  });

  // ─── Symbol Definitions ──────────────────────────────────────────

  describe('symbol definitions', () => {
    it('should extract field declarations', () => {
      const units = parse(`
public class Foo {
  private int x;
  public String name;
}
`);
      const classUnit = units.find(u => u.kind === 'class')!;
      const fields = classUnit.definitions.filter(d => d.kind === 'variable');
      expect(fields).toHaveLength(2);
      expect(fields.map(f => f.name)).toContain('x');
      expect(fields.map(f => f.name)).toContain('name');

      const xField = fields.find(f => f.name === 'x')!;
      expect(xField.exported).toBe(false); // private

      const nameField = fields.find(f => f.name === 'name')!;
      expect(nameField.exported).toBe(true); // public
    });

    it('should extract file-level definitions', () => {
      const units = parse(`
public class Foo { }
interface Bar { }
enum Baz { A, B }
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.definitions.length).toBeGreaterThanOrEqual(3);
      expect(fileUnit.definitions.map(d => d.name)).toContain('Foo');
      expect(fileUnit.definitions.map(d => d.name)).toContain('Bar');
      expect(fileUnit.definitions.map(d => d.name)).toContain('Baz');
    });
  });

  // ─── Nested Classes ──────────────────────────────────────────────

  describe('nested classes', () => {
    it('should extract nested class declarations', () => {
      const units = parse(`
public class Outer {
  public class Inner {
    public void innerMethod() { }
  }
}
`);
      const outerUnit = units.find(u => u.kind === 'class' && u.id.includes('Outer'))!;
      const innerUnit = units.find(u => u.kind === 'class' && u.id.includes('Inner'))!;
      expect(outerUnit).toBeDefined();
      expect(innerUnit).toBeDefined();
      expect(innerUnit.parentId).toBe(outerUnit.id);
      expect(outerUnit.childIds).toContain(innerUnit.id);

      // Inner class should have its method
      const innerMethodUnit = units.find(u => u.kind === 'method' && u.id.includes('Inner.innerMethod'))!;
      expect(innerMethodUnit).toBeDefined();
      expect(innerMethodUnit.parentId).toBe(innerUnit.id);
    });
  });

  // ─── Annotations ────────────────────────────────────────────────

  describe('annotations', () => {
    it('should extract methods with annotations', () => {
      const units = parse(`
public class Foo {
  @Override
  public String toString() { return "Foo"; }

  @Test
  public void testSomething() { }
}
`);
      const methodUnits = units.filter(u => u.kind === 'method');
      expect(methodUnits).toHaveLength(2);
      expect(methodUnits.map(u => u.definitions[0].name)).toContain('toString');
      expect(methodUnits.map(u => u.definitions[0].name)).toContain('testSomething');
    });
  });

  // ─── Unit Structure ──────────────────────────────────────────────

  describe('unit structure', () => {
    it('should always include a file-level unit', () => {
      const units = parse('public class Foo { }');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit).toBeDefined();
      expect(fileUnit.language).toBe('java');
      expect(fileUnit.file).toBe('Test.java');
    });

    it('should set correct parent-child relationships', () => {
      const units = parse(`
public class Foo {
  public void bar() { }
  public void baz() { }
}
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const classUnit = units.find(u => u.kind === 'class')!;
      const methodUnits = units.filter(u => u.kind === 'method');

      expect(fileUnit.childIds).toContain(classUnit.id);
      expect(classUnit.parentId).toBe(fileUnit.id);

      for (const method of methodUnits) {
        expect(classUnit.childIds).toContain(method.id);
        expect(method.parentId).toBe(classUnit.id);
      }
    });

    it('should count lines of code', () => {
      const source = `
public class Foo {
  // This is a comment
  /* Multi-line
   * comment
   */
  public void bar() {
    System.out.println("hello");
  }
}
`;
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.complexity.linesOfCode).toBeGreaterThan(0);
    });
  });
});
