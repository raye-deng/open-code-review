/**
 * Kotlin Language Adapter
 *
 * Regex-based parser for Kotlin source code. No native AST dependencies needed.
 *
 * Supports:
 * - Import extraction (single, wildcard, aliased imports)
 * - Function/method call extraction (including top-level functions)
 * - Complexity metrics (cyclomatic, cognitive, nesting; includes `when` expression)
 * - Deprecated API detection (via deprecated-apis-kotlin.json)
 * - Package verification (Kotlin stdlib + Java interop + common third-party)
 *
 * @since 0.3.0
 */

import { createRequire } from 'node:module';
import type { SupportedLanguage } from '../../types.js';
import type {
  LanguageAdapter,
  ASTNode,
  ImportInfo,
  CallInfo,
  PackageVerifyResult,
  DeprecatedInfo,
  ComplexityMetrics,
} from '../types.js';

// ─── Kotlin Standard Library Packages ───

/**
 * Kotlin standard library packages and commonly used kotlinx packages.
 * Also includes Java stdlib prefixes since Kotlin has full Java interop.
 */
export const KOTLIN_STDLIB_PACKAGES = new Set([
  // Kotlin stdlib
  'kotlin',
  'kotlin.annotation',
  'kotlin.collections',
  'kotlin.comparisons',
  'kotlin.concurrent',
  'kotlin.contracts',
  'kotlin.coroutines',
  'kotlin.enums',
  'kotlin.io',
  'kotlin.jvm',
  'kotlin.math',
  'kotlin.properties',
  'kotlin.random',
  'kotlin.ranges',
  'kotlin.reflect',
  'kotlin.sequences',
  'kotlin.system',
  'kotlin.text',
  'kotlin.time',
  // kotlinx official extensions
  'kotlinx.coroutines',
  'kotlinx.serialization',
  'kotlinx.datetime',
  'kotlinx.html',
  'kotlinx.cli',
  'kotlinx.atomicfu',
  'kotlinx.io',
  // Java stdlib — Kotlin has full interop
  'java.lang',
  'java.util',
  'java.io',
  'java.nio',
  'java.net',
  'java.sql',
  'java.time',
  'java.math',
  'java.security',
  'java.text',
  'java.beans',
  'java.lang.reflect',
  'java.lang.invoke',
  'java.util.concurrent',
  'java.util.stream',
  'java.util.function',
  'java.util.regex',
  'java.nio.file',
  'java.nio.charset',
  'java.net.http',
  'javax.swing',
  'javax.annotation',
  'javax.crypto',
  'javax.net',
  'javax.net.ssl',
]);

// ─── Common Third-Party Packages ───

/**
 * Well-known Kotlin/JVM third-party packages.
 * Covers Ktor, Android, testing, DI, serialization, Arrow, etc.
 */
export const KOTLIN_COMMON_PACKAGES = new Set([
  // Ktor
  'io.ktor',
  'io.ktor.client',
  'io.ktor.server',
  'io.ktor.http',
  'io.ktor.serialization',
  // Exposed (JetBrains ORM)
  'org.jetbrains.exposed',
  'org.jetbrains.exposed.sql',
  'org.jetbrains.exposed.dao',
  // Serialization (third-party formats)
  'com.squareup.moshi',
  'com.squareup.moshi.kotlin',
  // Retrofit / OkHttp
  'com.squareup.retrofit2',
  'com.squareup.okhttp3',
  'okhttp3',
  // Testing
  'io.kotest',
  'io.kotest.core',
  'io.kotest.matchers',
  'io.kotest.property',
  'org.mockk',
  'io.mockk',
  // DI
  'com.google.dagger',
  'dagger',
  'dagger.hilt',
  'org.koin',
  'org.koin.core',
  'org.koin.android',
  'io.insert.koin',
  // Android / AndroidX
  'androidx.compose',
  'androidx.compose.ui',
  'androidx.compose.material',
  'androidx.compose.material3',
  'androidx.compose.foundation',
  'androidx.compose.runtime',
  'androidx.lifecycle',
  'androidx.room',
  'androidx.navigation',
  'androidx.activity',
  'androidx.fragment',
  'androidx.core',
  'androidx.appcompat',
  'androidx.recyclerview',
  'android.content',
  'android.os',
  'android.view',
  'android.widget',
  'android.app',
  'android.util',
  // Firebase
  'com.google.firebase',
  'com.google.firebase.auth',
  'com.google.firebase.firestore',
  // Arrow (FP for Kotlin)
  'arrow.core',
  'arrow.fx',
  'arrow.optics',
  // Spring (Kotlin support)
  'org.springframework',
  'org.springframework.boot',
  'org.springframework.web',
  // Google / Protobuf
  'com.google.gson',
  'com.google.protobuf',
  // Logging
  'org.slf4j',
  'io.github.microutils',
  'mu',
  // JUnit (Kotlin-compatible)
  'org.junit',
  'org.junit.jupiter',
  // Jackson Kotlin module
  'com.fasterxml.jackson',
  'com.fasterxml.jackson.module.kotlin',
  // Coroutines test
  'kotlinx.coroutines.test',
]);

// ─── Deprecated API Database ───

interface DeprecatedAPIEntry {
  api: string;
  pattern: string;
  replacement: string;
  deprecated_since: string;
  severity: string;
  reason: string;
}

/** Load deprecated APIs from JSON data file */
function loadDeprecatedAPIs(): DeprecatedAPIEntry[] {
  try {
    const require = createRequire(import.meta.url);
    return require('../../data/deprecated-apis-kotlin.json') as DeprecatedAPIEntry[];
  } catch {
    return [];
  }
}

const KOTLIN_DEPRECATED_DB = loadDeprecatedAPIs();

// ─── Helpers ───

/**
 * Extract the top-level package prefix from a fully-qualified Kotlin/Java package.
 * e.g. "kotlin.collections.listOf" → "kotlin.collections"
 *      "androidx.compose.material3" → "androidx.compose"
 */
function getPackagePrefix(fullPkg: string): string {
  const parts = fullPkg.split('.');

  // For kotlin.* / kotlinx.*, use first two segments
  if (parts[0] === 'kotlin' || parts[0] === 'kotlinx') {
    return parts.slice(0, 2).join('.');
  }

  // For java.* / javax.*, use first two segments
  if (parts[0] === 'java' || parts[0] === 'javax') {
    return parts.slice(0, 2).join('.');
  }

  // For androidx.*, use first two segments
  if (parts[0] === 'androidx') {
    return parts.slice(0, 2).join('.');
  }

  // For android.*, use first two segments
  if (parts[0] === 'android') {
    return parts.slice(0, 2).join('.');
  }

  // For third-party: use first two segments
  return parts.slice(0, Math.min(2, parts.length)).join('.');
}

// ─── Kotlin Adapter ───

/**
 * KotlinAdapter — LanguageAdapter implementation for Kotlin.
 *
 * Covers: .kt, .kts
 *
 * Uses regex-based parsing. Kotlin's syntax is similar to Java but with
 * differences like `when` expressions, `val`/`var`, extension functions,
 * and top-level functions.
 */
export class KotlinAdapter implements LanguageAdapter {
  readonly id: SupportedLanguage = 'kotlin';
  readonly extensions = ['.kt', '.kts'];

  /**
   * Parse Kotlin source code.
   * Returns a lightweight AST-like structure with lines and source.
   */
  async parse(source: string, _filePath: string): Promise<ASTNode> {
    return {
      type: 'KotlinSourceFile',
      lines: source.split('\n'),
      source,
    };
  }

  /**
   * Extract import statements from Kotlin source.
   *
   * Matches:
   * - import kotlin.collections.listOf
   * - import kotlinx.coroutines.*
   * - import java.io.File
   * - import com.example.Foo as Bar
   */
  extractImports(source: string, _ast?: ASTNode): ImportInfo[] {
    const lines = source.split('\n');
    const imports: ImportInfo[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        continue;
      }

      // Match: import package.path.Name
      // Match: import package.path.*
      // Match: import package.path.Name as Alias
      const importMatch = trimmed.match(
        /^import\s+([\w.]+(?:\.\*)?)\s*(?:as\s+(\w+))?\s*$/
      );
      if (importMatch) {
        const fullPath = importMatch[1];
        const alias = importMatch[2];

        const parts = fullPath.split('.');
        let moduleName: string;
        let bindings: string[] = [];

        if (fullPath.endsWith('.*')) {
          // Wildcard import: kotlinx.coroutines.* → module = "kotlinx.coroutines"
          moduleName = parts.slice(0, -1).join('.');
          bindings = ['*'];
        } else {
          // Regular import: kotlin.collections.listOf → module = "kotlin.collections", binding = "listOf"
          moduleName = parts.slice(0, -1).join('.');
          bindings = [alias || parts[parts.length - 1]];
        }

        // Determine if this is a stdlib package
        const prefix = getPackagePrefix(moduleName);
        const isBuiltin = KOTLIN_STDLIB_PACKAGES.has(prefix) ||
                          KOTLIN_STDLIB_PACKAGES.has(moduleName);

        imports.push({
          module: moduleName,
          bindings,
          line: lineNum,
          isRelative: false, // Kotlin doesn't have relative imports
          isBuiltin,
        });
      }
    }

    return imports;
  }

  /**
   * Extract function/method calls from Kotlin source.
   *
   * Matches patterns like:
   * - println(...)
   * - list.add(...)
   * - System.out.println(...)
   * - TopLevelFunction(...)
   * - obj.extensionFunc(...)
   */
  extractCalls(source: string, _ast?: ASTNode): CallInfo[] {
    const lines = source.split('\n');
    const calls: CallInfo[] = [];

    // Kotlin keywords that look like function calls but aren't
    const kotlinKeywords = new Set([
      'if', 'else', 'for', 'while', 'do', 'when', 'switch',
      'break', 'continue', 'return', 'throw', 'try', 'catch', 'finally',
      'class', 'interface', 'object', 'enum', 'annotation',
      'fun', 'val', 'var', 'const', 'typealias',
      'import', 'package', 'as', 'is', 'in', 'out',
      'super', 'this', 'null', 'true', 'false',
      'constructor', 'init', 'companion', 'data', 'sealed', 'inline',
      'suspend', 'tailrec', 'operator', 'infix', 'external',
      'open', 'abstract', 'final', 'override', 'internal', 'private',
      'protected', 'public', 'lateinit', 'by', 'where', 'typeof',
    ]);

    let inBlockComment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      // Handle block comments
      if (inBlockComment) {
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
        continue;
      }
      if (trimmed.startsWith('/*')) {
        inBlockComment = true;
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
        continue;
      }

      // Skip single-line comments
      if (trimmed.startsWith('//')) continue;

      // Skip import/package declarations
      if (trimmed.startsWith('import ') || trimmed.startsWith('package ')) continue;

      // Match method/qualified calls: word.word.word(
      const methodCallPattern = /(\w+(?:\.\w+)+)\s*\(/g;
      let match: RegExpExecArray | null;
      while ((match = methodCallPattern.exec(line)) !== null) {
        calls.push({
          name: match[1],
          line: lineNum,
          column: match.index + 1,
          isMethodCall: true,
        });
      }

      // Match standalone function calls: name(
      const funcCallPattern = /(?<!\.)(?<!\w)([a-zA-Z_]\w*)\s*\(/g;
      while ((match = funcCallPattern.exec(line)) !== null) {
        const name = match[1];
        // Skip keywords
        if (kotlinKeywords.has(name)) continue;
        // Skip annotations
        if (line.charAt(match.index - 1) === '@') continue;

        calls.push({
          name,
          line: lineNum,
          column: match.index + 1,
          isMethodCall: false,
        });
      }
    }

    return calls;
  }

  /**
   * Verify if a Kotlin/Java package exists.
   *
   * Checks against Kotlin stdlib, Java stdlib (interop), and common third-party whitelists.
   */
  async verifyPackage(name: string): Promise<PackageVerifyResult> {
    const prefix = getPackagePrefix(name);

    // Check Kotlin stdlib + Java stdlib
    if (KOTLIN_STDLIB_PACKAGES.has(name) || KOTLIN_STDLIB_PACKAGES.has(prefix)) {
      return {
        name,
        exists: true,
        checkedAt: Date.now(),
      };
    }

    // Check common third-party packages
    if (KOTLIN_COMMON_PACKAGES.has(name) || KOTLIN_COMMON_PACKAGES.has(prefix)) {
      return {
        name,
        exists: true,
        checkedAt: Date.now(),
      };
    }

    // Also check with progressively longer prefixes
    const parts = name.split('.');
    for (let len = 2; len <= parts.length; len++) {
      const candidate = parts.slice(0, len).join('.');
      if (KOTLIN_STDLIB_PACKAGES.has(candidate) || KOTLIN_COMMON_PACKAGES.has(candidate)) {
        return {
          name,
          exists: true,
          checkedAt: Date.now(),
        };
      }
    }

    return {
      name,
      exists: false,
      checkedAt: Date.now(),
    };
  }

  /**
   * Check if an API is deprecated.
   * Searches the deprecated-apis-kotlin.json database.
   */
  checkDeprecated(api: string): DeprecatedInfo | null {
    for (const entry of KOTLIN_DEPRECATED_DB) {
      const regex = new RegExp(entry.pattern);
      if (regex.test(api)) {
        return {
          api: entry.api,
          reason: entry.reason,
          replacement: entry.replacement,
          since: entry.deprecated_since,
        };
      }
    }
    return null;
  }

  /**
   * Compute complexity metrics for Kotlin source code.
   *
   * Uses brace-based nesting detection and regex matching for decision points.
   * Kotlin-specific: `when` expression branches add to complexity.
   */
  computeComplexity(source: string, _ast?: ASTNode): ComplexityMetrics {
    const lines = source.split('\n');

    let cyclomatic = 1; // base complexity
    let cognitive = 0;
    let maxNestingDepth = 0;
    let currentDepth = 0;
    let functionCount = 0;
    let inBlockComment = false;

    const codeLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Handle block comments
      if (inBlockComment) {
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
        continue;
      }
      if (trimmed.startsWith('/*')) {
        inBlockComment = true;
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
        continue;
      }

      // Skip single-line comments and empty lines
      if (!trimmed || trimmed.startsWith('//')) continue;

      codeLines.push(trimmed);

      // Decision points → cyclomatic complexity
      const ifMatches = (trimmed.match(/\b(if|else\s+if)\s*\(/g) || []).length;
      cyclomatic += ifMatches;

      const forMatches = (trimmed.match(/\b(for|while)\s*\(/g) || []).length;
      cyclomatic += forMatches;

      // `when` branches (Kotlin's pattern matching)
      // Each branch in a `when` block adds a decision path
      // We count `when {` or `when (expr) {` as starting a when block
      const whenMatches = (trimmed.match(/\bwhen\b\s*(?:\([^)]*\))?\s*\{/g) || []).length;
      cyclomatic += whenMatches;

      // Individual when branches (lines that look like "value ->" or "is Type ->")
      // Only count if not the else branch
      if (/^\s*(?:(?:is\s+\w+|in\s+|!in\s+|[^{}\n]+)\s*->)/.test(trimmed) && !trimmed.startsWith('else')) {
        cyclomatic += 1;
      }

      const catchMatches = (trimmed.match(/\bcatch\s*\(/g) || []).length;
      cyclomatic += catchMatches;

      // Logical operators
      const logicalOps = (trimmed.match(/&&|\|\|/g) || []).length;
      cyclomatic += logicalOps;

      // Ternary / elvis operator
      const elvisOps = (trimmed.match(/\?:/g) || []).length;
      cyclomatic += elvisOps;

      // Track nesting depth via braces
      const opens = (trimmed.match(/\{/g) || []).length;
      const closes = (trimmed.match(/\}/g) || []).length;
      currentDepth += opens - closes;
      if (currentDepth > maxNestingDepth) {
        maxNestingDepth = currentDepth;
      }

      // Cognitive complexity: nested conditions add more
      if (/\b(if|for|while|catch|when)\b/.test(trimmed)) {
        cognitive += 1 + Math.max(0, currentDepth - 1);
      }

      cognitive += logicalOps;

      // Count functions
      // Matches: fun name( or fun Type.name( or suspend fun name(
      if (/\bfun\s+(?:\w+\.)?(\w+)\s*\(/.test(trimmed)) {
        functionCount++;
      }
    }

    return {
      cyclomatic,
      cognitive,
      loc: codeLines.length,
      functionCount,
      maxNestingDepth,
    };
  }
}
