/**
 * V4 Go Extractor Tests
 *
 * Tests for extracting CodeUnits from Go tree-sitter CSTs.
 * Covers: imports (single, grouped, aliased, dot, blank), functions,
 * methods (with receiver), calls, export detection (capitalization),
 * complexity, structs, multiple return values, goroutines, short var decls.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ParserManager } from '../../src/parser/manager.js';
import { GoExtractor } from '../../src/parser/extractors/go.js';
import type { CodeUnit } from '../../src/ir/types.js';

describe('V4 GoExtractor', () => {
  let manager: ParserManager;
  let extractor: GoExtractor;

  beforeAll(async () => {
    manager = new ParserManager();
    await manager.init();
    extractor = new GoExtractor();
  });

  function parse(source: string): CodeUnit[] {
    const tree = manager.parse(source, 'go');
    return extractor.extract(tree, 'main.go', source);
  }

  // ─── Imports ─────────────────────────────────────────────────────

  describe('import extraction', () => {
    it('should extract a single import', () => {
      const units = parse(`package main
import "fmt"
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('fmt');
      expect(fileUnit.imports[0].isRelative).toBe(false);
    });

    it('should extract grouped imports', () => {
      const units = parse(`package main
import (
  "fmt"
  "os"
  "strings"
)
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(3);
      expect(fileUnit.imports.map(i => i.module)).toEqual(['fmt', 'os', 'strings']);
    });

    it('should extract aliased imports', () => {
      const units = parse(`package main
import (
  f "fmt"
)
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('fmt');
      expect(fileUnit.imports[0].symbols).toContain('f');
    });

    it('should extract dot imports', () => {
      const units = parse(`package main
import (
  . "strings"
)
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('strings');
      expect(fileUnit.imports[0].symbols).toContain('.');
    });

    it('should extract blank imports', () => {
      const units = parse(`package main
import (
  _ "database/sql"
)
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(1);
      expect(fileUnit.imports[0].module).toBe('database/sql');
      expect(fileUnit.imports[0].symbols).toContain('_');
    });

    it('should extract mixed import types', () => {
      const units = parse(`package main
import (
  "fmt"
  f "os"
  . "strings"
  _ "database/sql"
)
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.imports).toHaveLength(4);
    });
  });

  // ─── Functions ───────────────────────────────────────────────────

  describe('function extraction', () => {
    it('should extract a function declaration', () => {
      const units = parse(`package main
func main() {
  fmt.Println("hello")
}
`);
      const funcUnit = units.find(u => u.kind === 'function' && u.id.includes('main'))!;
      expect(funcUnit).toBeDefined();
      expect(funcUnit.definitions[0].name).toBe('main');
      expect(funcUnit.definitions[0].kind).toBe('function');
    });

    it('should extract function parameters', () => {
      const units = parse(`package main
func add(x int, y int) int {
  return x + y
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.parameterCount).toBe(2);
      const params = funcUnit.definitions.filter(d => d.kind === 'parameter');
      expect(params).toHaveLength(2);
      expect(params.map(p => p.name)).toContain('x');
      expect(params.map(p => p.name)).toContain('y');
    });

    it('should link functions to file unit', () => {
      const units = parse(`package main
func foo() {}
func bar() {}
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const funcUnits = units.filter(u => u.kind === 'function');
      expect(funcUnits).toHaveLength(2);
      for (const func of funcUnits) {
        expect(fileUnit.childIds).toContain(func.id);
        expect(func.parentId).toBe(fileUnit.id);
      }
    });
  });

  // ─── Methods (with receiver) ─────────────────────────────────────

  describe('method extraction', () => {
    it('should extract a method with pointer receiver', () => {
      const units = parse(`package main
func (s *Server) Start() error {
  return nil
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit).toBeDefined();
      expect(methodUnit.definitions[0].name).toBe('Start');
      expect(methodUnit.id).toContain('Server.Start');
    });

    it('should extract a method with value receiver', () => {
      const units = parse(`package main
type Point struct { X, Y int }
func (p Point) String() string {
  return "point"
}
`);
      const methodUnit = units.find(u => u.kind === 'method')!;
      expect(methodUnit).toBeDefined();
      expect(methodUnit.definitions[0].name).toBe('String');
      expect(methodUnit.id).toContain('Point.String');
    });
  });

  // ─── Calls ───────────────────────────────────────────────────────

  describe('call extraction', () => {
    it('should extract function calls', () => {
      const units = parse(`package main
func main() {
  fmt.Println("hello")
  fmt.Sprintf("%d", 42)
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.calls.length).toBeGreaterThanOrEqual(2);
      const printlnCall = funcUnit.calls.find(c => c.method === 'Println');
      expect(printlnCall).toBeDefined();
      expect(printlnCall!.object).toBe('fmt');
      expect(printlnCall!.argCount).toBe(1);
    });

    it('should extract simple function calls', () => {
      const units = parse(`package main
func main() {
  result := process(42)
  handle(result)
}
func process(x int) int { return x }
func handle(x int) {}
`);
      const mainFunc = units.find(u => u.kind === 'function' && u.id.includes(':main'))!;
      const processCalls = mainFunc.calls.filter(c => c.method === 'process');
      expect(processCalls).toHaveLength(1);
      expect(processCalls[0].argCount).toBe(1);
    });
  });

  // ─── Export Detection ────────────────────────────────────────────

  describe('export detection (capitalization)', () => {
    it('should mark capitalized names as exported', () => {
      const units = parse(`package main
func PublicFunc() {}
func privateFunc() {}
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const publicDef = fileUnit.definitions.find(d => d.name === 'PublicFunc')!;
      const privateDef = fileUnit.definitions.find(d => d.name === 'privateFunc')!;
      expect(publicDef.exported).toBe(true);
      expect(privateDef.exported).toBe(false);
    });

    it('should mark capitalized type names as exported', () => {
      const units = parse(`package main
type Server struct {}
type helper struct {}
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const serverDef = fileUnit.definitions.find(d => d.name === 'Server')!;
      const helperDef = fileUnit.definitions.find(d => d.name === 'helper')!;
      expect(serverDef.exported).toBe(true);
      expect(helperDef.exported).toBe(false);
    });

    it('should mark capitalized const/var names as exported', () => {
      const units = parse(`package main
var MaxRetries = 3
var minRetries = 1
const DefaultTimeout = 30
const internalFlag = true
`);
      const fileUnit = units.find(u => u.kind === 'file')!;
      const maxDef = fileUnit.definitions.find(d => d.name === 'MaxRetries')!;
      const minDef = fileUnit.definitions.find(d => d.name === 'minRetries')!;
      expect(maxDef.exported).toBe(true);
      expect(minDef.exported).toBe(false);
    });
  });

  // ─── Complexity ──────────────────────────────────────────────────

  describe('complexity calculation', () => {
    it('should calculate complexity for if/for', () => {
      const units = parse(`package main
func process(x int) int {
  if x > 0 {
    for i := 0; i < 10; i++ {
      if x > 5 { }
    }
  }
  return x
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // base 1 + if + for + if = 4
      expect(funcUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(4);
    });

    it('should count switch/select in complexity', () => {
      const units = parse(`package main
func handler(x int, ch chan int) {
  switch {
  case x > 0:
    break
  case x < 0:
    break
  }
  select {
  case msg := <-ch:
    _ = msg
  }
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // base 1 + switch + case + case + select + communication_case
      expect(funcUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(4);
    });

    it('should calculate nesting depth', () => {
      const units = parse(`package main
func deep() {
  if true {
    for i := 0; i < 10; i++ {
      if true {
      }
    }
  }
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit.complexity.maxNestingDepth).toBeGreaterThanOrEqual(3);
    });

    it('should count logical operators', () => {
      const units = parse(`package main
func check(x, y int) bool {
  return x > 0 && y < 10 || x == y
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // base 1 + && + || = 3
      expect(funcUnit.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── Struct Types ────────────────────────────────────────────────

  describe('struct extraction', () => {
    it('should extract struct type declarations', () => {
      const units = parse(`package main
type Server struct {
  Port int
  Host string
}
`);
      const classUnit = units.find(u => u.kind === 'class' && u.id.includes('Server'))!;
      expect(classUnit).toBeDefined();
      expect(classUnit.definitions[0].name).toBe('Server');
      expect(classUnit.definitions[0].kind).toBe('type');
      expect(classUnit.definitions[0].exported).toBe(true);
    });

    it('should extract struct fields as definitions', () => {
      const units = parse(`package main
type Server struct {
  Port int
  host string
}
`);
      const classUnit = units.find(u => u.kind === 'class')!;
      const fields = classUnit.definitions.filter(d => d.kind === 'variable');
      expect(fields).toHaveLength(2);
      const portField = fields.find(f => f.name === 'Port')!;
      const hostField = fields.find(f => f.name === 'host')!;
      expect(portField.exported).toBe(true);
      expect(hostField.exported).toBe(false);
    });
  });

  // ─── Multiple Return Values ──────────────────────────────────────

  describe('multiple return values', () => {
    it('should handle functions with multiple return values', () => {
      const units = parse(`package main
func divide(a, b int) (int, error) {
  if b == 0 {
    return 0, fmt.Errorf("division by zero")
  }
  return a / b, nil
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      expect(funcUnit).toBeDefined();
      expect(funcUnit.definitions[0].name).toBe('divide');
    });
  });

  // ─── Goroutine Calls ─────────────────────────────────────────────

  describe('goroutine calls', () => {
    it('should extract calls within goroutines', () => {
      const units = parse(`package main
func main() {
  go func() {
    fmt.Println("goroutine")
  }()
}
`);
      const funcUnit = units.find(u => u.kind === 'function')!;
      // Should detect calls including the func literal call and Println
      expect(funcUnit.calls.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Short Variable Declarations ─────────────────────────────────

  describe('short variable declarations', () => {
    it('should handle short variable declarations in functions', () => {
      const units = parse(`package main
func process() {
  x := 42
  name := "hello"
  result, err := doSomething()
}
func doSomething() (int, error) { return 0, nil }
`);
      const funcUnit = units.find(u => u.kind === 'function' && u.id.includes(':process'))!;
      expect(funcUnit).toBeDefined();
      // The function should parse without errors
      expect(funcUnit.source).toContain('x := 42');
    });
  });

  // ─── Unit Structure ──────────────────────────────────────────────

  describe('unit structure', () => {
    it('should always include a file-level unit', () => {
      const units = parse('package main\n');
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit).toBeDefined();
      expect(fileUnit.language).toBe('go');
      expect(fileUnit.file).toBe('main.go');
    });

    it('should count lines of code', () => {
      const source = `package main

// This is a comment
/* Multi-line
 * comment
 */
func main() {
  fmt.Println("hello")
}
`;
      const units = parse(source);
      const fileUnit = units.find(u => u.kind === 'file')!;
      expect(fileUnit.complexity.linesOfCode).toBeGreaterThan(0);
    });
  });
});
