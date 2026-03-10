/**
 * Go LanguageAdapter Tests
 *
 * Tests for the GoAdapter: parsing, import extraction, call extraction,
 * complexity metrics, deprecated API detection, package verification,
 * and integration with the LanguageRegistry.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GoAdapter, GO_STDLIB_PACKAGES, GO_COMMON_MODULES } from '../src/languages/go/index.js';
import { LanguageRegistry } from '../src/languages/registry.js';

describe('GoAdapter', () => {
  const adapter = new GoAdapter();

  // ─── Properties ───

  describe('properties', () => {
    it('should have correct id', () => {
      expect(adapter.id).toBe('go');
    });

    it('should support .go extension', () => {
      expect(adapter.extensions).toContain('.go');
    });
  });

  // ─── Parse ───

  describe('parse', () => {
    it('should parse Go source code into a GoSourceFile node', async () => {
      const source = `package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
`;
      const ast = await adapter.parse(source, 'main.go');
      expect(ast).toBeDefined();
      expect(ast.type).toBe('GoSourceFile');
      expect((ast as any).lines).toBeInstanceOf(Array);
      expect((ast as any).source).toBe(source);
    });

    it('should parse empty source', async () => {
      const ast = await adapter.parse('', 'empty.go');
      expect(ast.type).toBe('GoSourceFile');
      expect((ast as any).lines).toEqual(['']);
    });
  });

  // ─── Import Extraction ───

  describe('extractImports', () => {
    it('should extract single-line imports', () => {
      const source = `package main

import "fmt"
import "os"`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      expect(imports[0].module).toBe('fmt');
      expect(imports[0].isBuiltin).toBe(true);
      expect(imports[1].module).toBe('os');
      expect(imports[1].isBuiltin).toBe(true);
    });

    it('should extract grouped imports', () => {
      const source = `package main

import (
	"fmt"
	"os"
	"net/http"
)`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].module).toBe('fmt');
      expect(imports[1].module).toBe('os');
      expect(imports[2].module).toBe('net/http');
      expect(imports.every(i => i.isBuiltin)).toBe(true);
    });

    it('should extract aliased imports', () => {
      const source = `package main

import (
	log "github.com/sirupsen/logrus"
	pb "google.golang.org/protobuf"
)`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      expect(imports[0].module).toBe('github.com/sirupsen/logrus');
      expect(imports[0].bindings).toContain('log');
      expect(imports[0].isBuiltin).toBe(false);
      expect(imports[1].module).toBe('google.golang.org/protobuf');
      expect(imports[1].bindings).toContain('pb');
    });

    it('should extract third-party imports', () => {
      const source = `package main

import (
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      expect(imports[0].module).toBe('github.com/gin-gonic/gin');
      expect(imports[0].isBuiltin).toBe(false);
      expect(imports[1].module).toBe('github.com/stretchr/testify/assert');
      expect(imports[1].isBuiltin).toBe(false);
    });

    it('should correctly identify stdlib vs third-party', () => {
      const source = `package main

import (
	"fmt"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)`;
      const imports = adapter.extractImports(source);
      expect(imports[0].isBuiltin).toBe(true);   // fmt
      expect(imports[1].isBuiltin).toBe(true);   // encoding/json
      expect(imports[2].isBuiltin).toBe(false);  // github.com/gin-gonic/gin
      expect(imports[3].isBuiltin).toBe(false);  // go.uber.org/zap
    });

    it('should extract sub-path stdlib imports', () => {
      const source = `package main

import (
	"os/exec"
	"os/signal"
	"path/filepath"
)`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].module).toBe('os/exec');
      expect(imports[0].isBuiltin).toBe(true);
      expect(imports[1].module).toBe('os/signal');
      expect(imports[2].module).toBe('path/filepath');
    });

    it('should handle blank import (side-effect)', () => {
      const source = `package main

import (
	_ "github.com/lib/pq"
)`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(1);
      expect(imports[0].module).toBe('github.com/lib/pq');
    });

    it('should skip comments in import blocks', () => {
      const source = `package main

import (
	"fmt"
	// "os" -- not needed
	"net/http"
)`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      const modules = imports.map(i => i.module);
      expect(modules).toContain('fmt');
      expect(modules).toContain('net/http');
      expect(modules).not.toContain('os');
    });
  });

  // ─── Call Extraction ───

  describe('extractCalls', () => {
    it('should extract package-qualified function calls', () => {
      const source = `fmt.Println("hello")
http.Get("https://example.com")
json.Marshal(data)`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).toContain('fmt.Println');
      expect(names).toContain('http.Get');
      expect(names).toContain('json.Marshal');
    });

    it('should extract standalone function calls', () => {
      const source = `make([]string, 0)
len(data)
append(slice, item)`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).toContain('make');
      expect(names).toContain('len');
      expect(names).toContain('append');
    });

    it('should not extract Go keywords as calls', () => {
      const source = `if x > 0 {
	for i := range items {
		switch state {
		case 1:
			break
		}
	}
	select {
	case msg := <-ch:
		handle(msg)
	}
}`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).not.toContain('if');
      expect(names).not.toContain('for');
      expect(names).not.toContain('switch');
      expect(names).not.toContain('select');
      expect(names).not.toContain('case');
      expect(names).toContain('handle');
    });

    it('should skip comments', () => {
      const source = `// fmt.Println("commented out")
fmt.Println("real call")`;
      const calls = adapter.extractCalls(source);
      expect(calls.length).toBe(1);
      expect(calls[0].name).toBe('fmt.Println');
    });
  });

  // ─── Complexity ───

  describe('computeComplexity', () => {
    it('should compute base complexity for simple code', () => {
      const source = `func add(a, b int) int {
	return a + b
}`;
      const metrics = adapter.computeComplexity(source);
      expect(metrics.cyclomatic).toBe(1);
      expect(metrics.loc).toBeGreaterThan(0);
      expect(metrics.functionCount).toBe(1);
    });

    it('should increase complexity for if/else branches', () => {
      const source = `func classify(x int) string {
	if x > 0 {
		if x > 100 {
			return "big"
		}
		return "small"
	}
	return "non-positive"
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 2 (if, if) = 3
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(3);
    });

    it('should count for loops', () => {
      const source = `func process(items []string) {
	for _, item := range items {
		if item != "" {
			handle(item)
		}
	}
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 1 (for) + 1 (if) = 3
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(3);
    });

    it('should count switch/case statements', () => {
      const source = `func dayName(d int) string {
	switch d {
	case 1:
		return "Monday"
	case 2:
		return "Tuesday"
	case 3:
		return "Wednesday"
	}
	return "Unknown"
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 3 (cases) = 4
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(4);
    });

    it('should count select statements', () => {
      const source = `func fanIn(ch1, ch2 <-chan int) int {
	select {
	case v := <-ch1:
		return v
	case v := <-ch2:
		return v
	}
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 1 (select) + 2 (cases) = 4
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(4);
    });

    it('should count logical operators', () => {
      const source = `func check(x, y int) bool {
	if x > 0 && y > 0 || x == -1 {
		return true
	}
	return false
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 1 (if) + 2 (&&, ||) = 4
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(4);
    });

    it('should count multiple functions', () => {
      const source = `func a() {}
func b() {}
func (s *Server) c() {}`;
      const metrics = adapter.computeComplexity(source);
      expect(metrics.functionCount).toBe(3);
    });

    it('should have higher complexity for complex code vs simple code', () => {
      const simple = `func add(a, b int) int {
	return a + b
}`;
      const complex = `func process(data []string) error {
	if data == nil {
		return errors.New("nil data")
	}
	for _, item := range data {
		if item != "" && len(item) > 0 {
			if err := transform(item); err != nil {
				return err
			}
		}
	}
	return nil
}`;
      const simpleMetrics = adapter.computeComplexity(simple);
      const complexMetrics = adapter.computeComplexity(complex);
      expect(complexMetrics.cyclomatic).toBeGreaterThan(simpleMetrics.cyclomatic);
      expect(complexMetrics.cognitive).toBeGreaterThan(simpleMetrics.cognitive);
    });
  });

  // ─── Deprecated API Detection ───

  describe('checkDeprecated', () => {
    it('should detect io/ioutil as deprecated', () => {
      const result = adapter.checkDeprecated('import "io/ioutil"');
      expect(result).not.toBeNull();
      expect(result!.api).toContain('io/ioutil');
    });

    it('should detect ioutil.ReadAll as deprecated', () => {
      const result = adapter.checkDeprecated('ioutil.ReadAll(resp.Body)');
      expect(result).not.toBeNull();
    });

    it('should detect ioutil.ReadFile as deprecated', () => {
      const result = adapter.checkDeprecated('ioutil.ReadFile("config.json")');
      expect(result).not.toBeNull();
      expect(result!.replacement).toContain('os.ReadFile');
    });

    it('should detect strings.Title as deprecated', () => {
      const result = adapter.checkDeprecated('strings.Title("hello world")');
      expect(result).not.toBeNull();
      expect(result!.replacement).toContain('golang.org/x/text');
    });

    it('should detect rand.Seed as deprecated', () => {
      const result = adapter.checkDeprecated('rand.Seed(time.Now().UnixNano())');
      expect(result).not.toBeNull();
      expect(result!.since).toContain('Go 1.20');
    });

    it('should detect os.IsPermission as deprecated', () => {
      const result = adapter.checkDeprecated('os.IsPermission(err)');
      expect(result).not.toBeNull();
      expect(result!.replacement).toContain('errors.Is');
    });

    it('should return null for non-deprecated APIs', () => {
      const result = adapter.checkDeprecated('fmt.Println("hello")');
      expect(result).toBeNull();
    });
  });

  // ─── Package Verification ───

  describe('verifyPackage', () => {
    it('should recognize Go stdlib packages', async () => {
      const result = await adapter.verifyPackage('fmt');
      expect(result.exists).toBe(true);
    });

    it('should recognize stdlib sub-path packages', async () => {
      const result = await adapter.verifyPackage('net/http');
      expect(result.exists).toBe(true);
    });

    it('should recognize encoding sub-packages', async () => {
      const result = await adapter.verifyPackage('encoding/json');
      expect(result.exists).toBe(true);
    });

    it('should recognize common third-party modules', async () => {
      const result = await adapter.verifyPackage('github.com/gin-gonic/gin');
      expect(result.exists).toBe(true);
    });

    it('should recognize sub-packages of known modules', async () => {
      const result = await adapter.verifyPackage('github.com/gin-gonic/gin/binding');
      expect(result.exists).toBe(true);
    });

    it('should report unknown packages as not existing', async () => {
      const result = await adapter.verifyPackage('github.com/nonexistent/fake-package');
      expect(result.exists).toBe(false);
    });

    it('should recognize golang.org/x packages', async () => {
      const result = await adapter.verifyPackage('golang.org/x/sync');
      expect(result.exists).toBe(true);
    });
  });

  // ─── Whitelists ───

  describe('whitelists', () => {
    it('should have at least 40 stdlib packages', () => {
      expect(GO_STDLIB_PACKAGES.size).toBeGreaterThanOrEqual(40);
    });

    it('should have at least 30 common third-party modules', () => {
      expect(GO_COMMON_MODULES.size).toBeGreaterThanOrEqual(30);
    });

    it('should include key stdlib packages', () => {
      const expected = ['fmt', 'os', 'io', 'net/http', 'encoding/json', 'context', 'sync'];
      for (const pkg of expected) {
        expect(GO_STDLIB_PACKAGES.has(pkg)).toBe(true);
      }
    });

    it('should include key third-party modules', () => {
      const expected = [
        'github.com/gin-gonic/gin',
        'github.com/stretchr/testify',
        'gorm.io/gorm',
        'google.golang.org/grpc',
      ];
      for (const mod of expected) {
        expect(GO_COMMON_MODULES.has(mod)).toBe(true);
      }
    });
  });
});

// ─── LanguageRegistry Integration ───

describe('LanguageRegistry + GoAdapter', () => {
  beforeEach(() => {
    LanguageRegistry.resetInstance();
  });

  it('should register GoAdapter and find it by .go extension', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new GoAdapter());

    const adapter = registry.getByExtension('.go');
    expect(adapter).toBeDefined();
    expect(adapter!.id).toBe('go');
  });

  it('should find GoAdapter by file path', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new GoAdapter());

    expect(registry.getByFilePath('cmd/server/main.go')).toBeDefined();
    expect(registry.getByFilePath('/home/user/project/handler.go')).toBeDefined();
  });

  it('should detect go language from file path', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new GoAdapter());

    expect(registry.detectLanguage('main.go')).toBe('go');
  });

  it('should mark .go as supported', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new GoAdapter());

    expect(registry.isSupported('.go')).toBe(true);
    expect(registry.isSupported('main.go')).toBe(true);
  });

  it('should coexist with other adapters', async () => {
    const registry = LanguageRegistry.getInstance();
    const { TypeScriptAdapter } = await import('../src/languages/typescript/index.js');
    const { PythonAdapter } = await import('../src/languages/python/index.js');
    const { JavaAdapter } = await import('../src/languages/java/index.js');
    registry.register(new TypeScriptAdapter());
    registry.register(new PythonAdapter());
    registry.register(new JavaAdapter());
    registry.register(new GoAdapter());

    expect(registry.getByExtension('.ts')!.id).toBe('typescript');
    expect(registry.getByExtension('.py')!.id).toBe('python');
    expect(registry.getByExtension('.java')!.id).toBe('java');
    expect(registry.getByExtension('.go')!.id).toBe('go');
    expect(registry.getRegisteredLanguages()).toContain('go');
  });
});
