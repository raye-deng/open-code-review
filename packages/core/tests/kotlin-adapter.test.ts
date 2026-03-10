/**
 * Kotlin LanguageAdapter Tests
 *
 * Tests for the KotlinAdapter: parsing, import extraction, call extraction,
 * complexity metrics (including `when`), deprecated API detection,
 * package verification (stdlib + Java interop), and LanguageRegistry integration.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { KotlinAdapter, KOTLIN_STDLIB_PACKAGES, KOTLIN_COMMON_PACKAGES } from '../src/languages/kotlin/index.js';
import { LanguageRegistry } from '../src/languages/registry.js';

describe('KotlinAdapter', () => {
  const adapter = new KotlinAdapter();

  // ─── Properties ───

  describe('properties', () => {
    it('should have correct id', () => {
      expect(adapter.id).toBe('kotlin');
    });

    it('should support .kt and .kts extensions', () => {
      expect(adapter.extensions).toContain('.kt');
      expect(adapter.extensions).toContain('.kts');
    });
  });

  // ─── Parse ───

  describe('parse', () => {
    it('should parse Kotlin source code into a KotlinSourceFile node', async () => {
      const source = `
package com.example

import kotlin.collections.listOf

fun main() {
    val items = listOf(1, 2, 3)
    println(items)
}
`;
      const ast = await adapter.parse(source, 'Main.kt');
      expect(ast).toBeDefined();
      expect(ast.type).toBe('KotlinSourceFile');
      expect((ast as any).lines).toBeInstanceOf(Array);
      expect((ast as any).source).toBe(source);
    });

    it('should parse empty source', async () => {
      const ast = await adapter.parse('', 'Empty.kt');
      expect(ast.type).toBe('KotlinSourceFile');
      expect((ast as any).lines).toEqual(['']);
    });
  });

  // ─── Import Extraction ───

  describe('extractImports', () => {
    it('should extract simple import statements', () => {
      const source = `import kotlin.collections.listOf
import kotlin.io.println
import kotlin.text.Regex`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].module).toBe('kotlin.collections');
      expect(imports[0].bindings).toContain('listOf');
      expect(imports[0].isBuiltin).toBe(true);
    });

    it('should extract wildcard imports', () => {
      const source = `import kotlinx.coroutines.*
import kotlin.collections.*`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      expect(imports[0].module).toBe('kotlinx.coroutines');
      expect(imports[0].bindings).toContain('*');
      expect(imports[0].isBuiltin).toBe(true);
    });

    it('should extract aliased imports', () => {
      const source = `import java.io.File as JavaFile
import kotlin.collections.HashMap as KotlinHashMap`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(2);
      expect(imports[0].module).toBe('java.io');
      expect(imports[0].bindings).toContain('JavaFile');
      expect(imports[1].bindings).toContain('KotlinHashMap');
    });

    it('should extract Java interop imports as builtin', () => {
      const source = `import java.io.File
import java.util.concurrent.ConcurrentHashMap
import java.net.URL`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].isBuiltin).toBe(true);
      expect(imports[1].isBuiltin).toBe(true);
      expect(imports[2].isBuiltin).toBe(true);
    });

    it('should correctly identify third-party imports', () => {
      const source = `import io.ktor.server.application.Application
import com.squareup.moshi.Moshi
import arrow.core.Either`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].isBuiltin).toBe(false);
      expect(imports[1].isBuiltin).toBe(false);
      expect(imports[2].isBuiltin).toBe(false);
    });

    it('should skip comments', () => {
      const source = `// import kotlin.collections.listOf
import kotlin.io.println
/* import kotlin.text.Regex */`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(1);
      expect(imports[0].module).toBe('kotlin.io');
    });

    it('should extract kotlinx imports as builtin', () => {
      const source = `import kotlinx.serialization.Serializable
import kotlinx.datetime.Clock
import kotlinx.coroutines.flow.Flow`;
      const imports = adapter.extractImports(source);
      expect(imports.length).toBe(3);
      expect(imports[0].isBuiltin).toBe(true);
      expect(imports[1].isBuiltin).toBe(true);
      expect(imports[2].isBuiltin).toBe(true);
    });
  });

  // ─── Call Extraction ───

  describe('extractCalls', () => {
    it('should extract method calls', () => {
      const source = `System.out.println("hello")
list.add(item)
String.format("%s", value)`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).toContain('System.out.println');
      expect(names).toContain('list.add');
      expect(names).toContain('String.format');
    });

    it('should extract top-level function calls', () => {
      const source = `println("hello")
listOf(1, 2, 3)
mutableMapOf("key" to "value")`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).toContain('println');
      expect(names).toContain('listOf');
      expect(names).toContain('mutableMapOf');
    });

    it('should not extract Kotlin keywords as calls', () => {
      const source = `if (x > 0) {
    for (i in 1..10) {
        while (running) {
            when (state) {
                1 -> println("one")
            }
        }
    }
}`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).not.toContain('if');
      expect(names).not.toContain('for');
      expect(names).not.toContain('while');
      expect(names).not.toContain('when');
    });

    it('should skip import declarations', () => {
      const source = `import kotlin.collections.listOf
import java.io.File
println("test")`;
      const calls = adapter.extractCalls(source);
      const names = calls.map(c => c.name);
      expect(names).toContain('println');
      // Should not have calls from import lines
      expect(calls.length).toBe(1);
    });
  });

  // ─── Complexity ───

  describe('computeComplexity', () => {
    it('should compute base complexity for simple code', () => {
      const source = `fun add(a: Int, b: Int): Int {
    return a + b
}`;
      const metrics = adapter.computeComplexity(source);
      expect(metrics.cyclomatic).toBe(1);
      expect(metrics.loc).toBeGreaterThan(0);
      expect(metrics.functionCount).toBe(1);
    });

    it('should increase complexity for if/else branches', () => {
      const source = `fun classify(x: Int): String {
    if (x > 0) {
        if (x > 100) {
            return "big"
        } else {
            return "small"
        }
    } else if (x < 0) {
        return "negative"
    } else {
        return "zero"
    }
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 3 (if, if, else if) = 4
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(4);
    });

    it('should count when expression branches', () => {
      const source = `fun describe(x: Int): String {
    return when {
        x > 100 -> "large"
        x > 0 -> "positive"
        x == 0 -> "zero"
        else -> "negative"
    }
}`;
      const metrics = adapter.computeComplexity(source);
      // when block + branches contribute to cyclomatic complexity
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(3);
    });

    it('should count logical operators', () => {
      const source = `fun check(x: Int, y: Int): Boolean {
    if (x > 0 && y > 0 || x < -10) {
        return true
    }
    return false
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 1 (if) + 2 (&&, ||) = 4
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(4);
    });

    it('should count elvis operators', () => {
      const source = `fun safe(name: String?): String {
    val result = name ?: "default"
    val other = getVal() ?: fallback()
    return result
}`;
      const metrics = adapter.computeComplexity(source);
      // 1 (base) + 2 (?:) = 3
      expect(metrics.cyclomatic).toBeGreaterThanOrEqual(3);
    });

    it('should track nesting depth', () => {
      const source = `fun deep() {
    if (true) {
        for (i in 1..10) {
            while (true) {
                if (false) {
                    break
                }
            }
        }
    }
}`;
      const metrics = adapter.computeComplexity(source);
      expect(metrics.maxNestingDepth).toBeGreaterThanOrEqual(4);
    });

    it('should count functions including suspend functions', () => {
      const source = `fun regular() { }
suspend fun async() { }
fun String.extension() { }`;
      const metrics = adapter.computeComplexity(source);
      expect(metrics.functionCount).toBe(3);
    });

    it('should have higher complexity for complex code', () => {
      const simple = `fun add(a: Int, b: Int) = a + b`;
      const complex = `fun process(data: List<String>?) {
    if (data == null) return
    for (item in data) {
        if (item.isNotEmpty() && item.length > 3) {
            try {
                transform(item)
            } catch (e: Exception) {
                continue
            }
        } else if (item.isEmpty()) {
            handleEmpty()
        }
    }
}`;
      const simpleMetrics = adapter.computeComplexity(simple);
      const complexMetrics = adapter.computeComplexity(complex);
      expect(complexMetrics.cyclomatic).toBeGreaterThan(simpleMetrics.cyclomatic);
      expect(complexMetrics.cognitive).toBeGreaterThan(simpleMetrics.cognitive);
    });
  });

  // ─── Deprecated API Detection ───

  describe('checkDeprecated', () => {
    it('should detect kotlin.coroutines.experimental as deprecated', () => {
      const result = adapter.checkDeprecated('import kotlin.coroutines.experimental.buildSequence');
      expect(result).not.toBeNull();
      expect(result!.api).toContain('kotlin.coroutines.experimental');
    });

    it('should detect @JvmDefault as deprecated', () => {
      const result = adapter.checkDeprecated('@JvmDefault fun defaultImpl()');
      expect(result).not.toBeNull();
    });

    it('should detect kotlin.reflect.jvm.internal as deprecated', () => {
      const result = adapter.checkDeprecated('import kotlin.reflect.jvm.internal.KClassImpl');
      expect(result).not.toBeNull();
    });

    it('should detect newSingleThreadContext as deprecated', () => {
      const result = adapter.checkDeprecated('val ctx = newSingleThreadContext("worker")');
      expect(result).not.toBeNull();
      expect(result!.replacement).toContain('Dispatchers');
    });

    it('should detect Vector usage in Kotlin as deprecated', () => {
      const result = adapter.checkDeprecated('val list = Vector<String>()');
      expect(result).not.toBeNull();
    });

    it('should detect StringBuffer in Kotlin as deprecated', () => {
      const result = adapter.checkDeprecated('val sb = StringBuffer()');
      expect(result).not.toBeNull();
      expect(result!.replacement).toContain('StringBuilder');
    });

    it('should return null for non-deprecated APIs', () => {
      const result = adapter.checkDeprecated('val list = mutableListOf<String>()');
      expect(result).toBeNull();
    });
  });

  // ─── Package Verification ───

  describe('verifyPackage', () => {
    it('should recognize Kotlin stdlib packages', async () => {
      const result = await adapter.verifyPackage('kotlin.collections');
      expect(result.exists).toBe(true);
    });

    it('should recognize kotlinx packages', async () => {
      const result = await adapter.verifyPackage('kotlinx.coroutines');
      expect(result.exists).toBe(true);
    });

    it('should recognize Java stdlib packages (interop)', async () => {
      const result = await adapter.verifyPackage('java.util');
      expect(result.exists).toBe(true);
    });

    it('should recognize Java sub-packages via interop', async () => {
      const result = await adapter.verifyPackage('java.util.concurrent');
      expect(result.exists).toBe(true);
    });

    it('should recognize common third-party packages', async () => {
      const result = await adapter.verifyPackage('io.ktor');
      expect(result.exists).toBe(true);
    });

    it('should recognize Android/AndroidX packages', async () => {
      const result = await adapter.verifyPackage('androidx.compose');
      expect(result.exists).toBe(true);
    });

    it('should recognize sub-packages of known packages', async () => {
      const result = await adapter.verifyPackage('io.ktor.server.application');
      expect(result.exists).toBe(true);
    });

    it('should report unknown packages as not existing', async () => {
      const result = await adapter.verifyPackage('com.nonexistent.fake.package');
      expect(result.exists).toBe(false);
    });

    it('should recognize arrow.core', async () => {
      const result = await adapter.verifyPackage('arrow.core');
      expect(result.exists).toBe(true);
    });
  });

  // ─── Whitelists ───

  describe('whitelists', () => {
    it('should have at least 20 stdlib packages', () => {
      expect(KOTLIN_STDLIB_PACKAGES.size).toBeGreaterThanOrEqual(20);
    });

    it('should have at least 20 common third-party packages', () => {
      expect(KOTLIN_COMMON_PACKAGES.size).toBeGreaterThanOrEqual(20);
    });

    it('should include key Kotlin stdlib packages', () => {
      const expected = ['kotlin', 'kotlin.collections', 'kotlin.coroutines', 'kotlin.io', 'kotlin.text'];
      for (const pkg of expected) {
        expect(KOTLIN_STDLIB_PACKAGES.has(pkg)).toBe(true);
      }
    });

    it('should include key third-party packages', () => {
      const expected = ['io.ktor', 'org.mockk', 'arrow.core', 'androidx.compose'];
      for (const pkg of expected) {
        expect(KOTLIN_COMMON_PACKAGES.has(pkg)).toBe(true);
      }
    });

    it('should include Java interop packages in stdlib', () => {
      const expected = ['java.lang', 'java.util', 'java.io'];
      for (const pkg of expected) {
        expect(KOTLIN_STDLIB_PACKAGES.has(pkg)).toBe(true);
      }
    });
  });
});

// ─── LanguageRegistry Integration ───

describe('LanguageRegistry + KotlinAdapter', () => {
  beforeEach(() => {
    LanguageRegistry.resetInstance();
  });

  it('should register KotlinAdapter and find it by .kt extension', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new KotlinAdapter());

    const adapter = registry.getByExtension('.kt');
    expect(adapter).toBeDefined();
    expect(adapter!.id).toBe('kotlin');
  });

  it('should find KotlinAdapter by .kts extension', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new KotlinAdapter());

    const adapter = registry.getByExtension('.kts');
    expect(adapter).toBeDefined();
    expect(adapter!.id).toBe('kotlin');
  });

  it('should find KotlinAdapter by file path', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new KotlinAdapter());

    expect(registry.getByFilePath('src/main/kotlin/Main.kt')).toBeDefined();
    expect(registry.getByFilePath('build.gradle.kts')).toBeDefined();
  });

  it('should detect kotlin language from file path', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new KotlinAdapter());

    expect(registry.detectLanguage('App.kt')).toBe('kotlin');
    expect(registry.detectLanguage('build.gradle.kts')).toBe('kotlin');
  });

  it('should mark .kt and .kts as supported', () => {
    const registry = LanguageRegistry.getInstance();
    registry.register(new KotlinAdapter());

    expect(registry.isSupported('.kt')).toBe(true);
    expect(registry.isSupported('.kts')).toBe(true);
    expect(registry.isSupported('Main.kt')).toBe(true);
    expect(registry.isSupported('build.gradle.kts')).toBe(true);
  });

  it('should coexist with other adapters', async () => {
    const registry = LanguageRegistry.getInstance();
    const { TypeScriptAdapter } = await import('../src/languages/typescript/index.js');
    const { JavaAdapter } = await import('../src/languages/java/index.js');
    registry.register(new TypeScriptAdapter());
    registry.register(new JavaAdapter());
    registry.register(new KotlinAdapter());

    expect(registry.getByExtension('.ts')!.id).toBe('typescript');
    expect(registry.getByExtension('.java')!.id).toBe('java');
    expect(registry.getByExtension('.kt')!.id).toBe('kotlin');
    expect(registry.getRegisteredLanguages()).toContain('kotlin');
  });
});
