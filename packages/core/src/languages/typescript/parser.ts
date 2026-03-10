/**
 * TypeScript / JavaScript Language Adapter
 *
 * Uses oxc-parser for fast AST parsing (Tier 1).
 * Provides import/call extraction, complexity metrics, and built-in module detection.
 *
 * @since 0.3.0
 */

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

// ─── Node.js Built-in Modules ───

const NODE_BUILTINS = new Set([
  'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console',
  'constants', 'crypto', 'dgram', 'diagnostics_channel', 'dns', 'domain',
  'events', 'fs', 'http', 'http2', 'https', 'inspector', 'module', 'net',
  'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring',
  'readline', 'repl', 'stream', 'string_decoder', 'test', 'timers',
  'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm',
  'wasi', 'worker_threads', 'zlib',
  // Subpath imports
  'fs/promises', 'stream/promises', 'timers/promises',
  'dns/promises', 'readline/promises',
]);

/**
 * Check if a module specifier refers to a Node.js built-in.
 */
function isNodeBuiltin(specifier: string): boolean {
  if (specifier.startsWith('node:')) {
    return true;
  }
  return NODE_BUILTINS.has(specifier);
}

/**
 * Check if an import specifier is a relative path.
 */
function isRelativeImport(specifier: string): boolean {
  return specifier.startsWith('.') || specifier.startsWith('/');
}

/**
 * TypeScriptAdapter — LanguageAdapter implementation for TypeScript and JavaScript.
 *
 * Covers: .ts, .tsx, .js, .jsx, .mts, .cts, .mjs, .cjs
 */
export class TypeScriptAdapter implements LanguageAdapter {
  readonly id: SupportedLanguage = 'typescript';
  readonly extensions = ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs'];

  /**
   * Parse source code using oxc-parser.
   */
  async parse(source: string, filePath: string): Promise<ASTNode> {
    const { parseSync } = await import('oxc-parser');
    const result = parseSync(filePath, source);
    if (result.errors && result.errors.length > 0) {
      // Non-fatal: return program even with parse errors
      // Detectors can check for errors separately
    }
    return result.program as unknown as ASTNode;
  }

  /**
   * Extract import/require statements using regex (fast, works without AST).
   * This is a robust regex-based approach that matches the existing detector logic.
   */
  extractImports(source: string, _ast?: ASTNode): ImportInfo[] {
    const imports: ImportInfo[] = [];
    const lines = source.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // ES import: import { a, b } from 'module'
      // ES import: import name from 'module'
      // ES import: import * as name from 'module'
      const esMatch = line.match(
        /import\s+(?:(?:\{([^}]*)\}|(\w+)|\*\s+as\s+(\w+))(?:\s*,\s*(?:\{([^}]*)\}|(\w+)|\*\s+as\s+(\w+)))?\s+from\s+)?['"]([^'"]+)['"]/
      );
      if (esMatch) {
        const mod = esMatch[7];
        const bindings: string[] = [];

        // Named imports: { a, b as c }
        for (const group of [esMatch[1], esMatch[4]]) {
          if (group) {
            group.split(',').forEach(s => {
              const name = s.trim().split(/\s+as\s+/).pop()?.trim();
              if (name) bindings.push(name);
            });
          }
        }
        // Default import
        if (esMatch[2]) bindings.push(esMatch[2]);
        if (esMatch[5]) bindings.push(esMatch[5]);
        // Namespace import
        if (esMatch[3]) bindings.push(esMatch[3]);
        if (esMatch[6]) bindings.push(esMatch[6]);

        imports.push({
          module: mod,
          bindings,
          line: lineNum,
          isRelative: isRelativeImport(mod),
          isBuiltin: isNodeBuiltin(mod),
        });
        continue;
      }

      // Side-effect import: import 'module'
      const sideEffectMatch = line.match(/import\s+['"]([^'"]+)['"]/);
      if (sideEffectMatch) {
        imports.push({
          module: sideEffectMatch[1],
          bindings: [],
          line: lineNum,
          isRelative: isRelativeImport(sideEffectMatch[1]),
          isBuiltin: isNodeBuiltin(sideEffectMatch[1]),
        });
        continue;
      }

      // Dynamic import: import('module')
      const dynamicMatch = line.match(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      if (dynamicMatch) {
        imports.push({
          module: dynamicMatch[1],
          bindings: [],
          line: lineNum,
          isRelative: isRelativeImport(dynamicMatch[1]),
          isBuiltin: isNodeBuiltin(dynamicMatch[1]),
        });
        continue;
      }

      // CommonJS: const { a, b } = require('module')
      const cjsDestructMatch = line.match(
        /(?:const|let|var)\s+\{([^}]*)\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/
      );
      if (cjsDestructMatch) {
        const bindings = cjsDestructMatch[1]
          .split(',')
          .map(s => s.trim().split(/\s+as\s+/).pop()?.trim())
          .filter(Boolean) as string[];
        imports.push({
          module: cjsDestructMatch[2],
          bindings,
          line: lineNum,
          isRelative: isRelativeImport(cjsDestructMatch[2]),
          isBuiltin: isNodeBuiltin(cjsDestructMatch[2]),
        });
        continue;
      }

      // CommonJS: const name = require('module')
      const cjsMatch = line.match(
        /(?:const|let|var)\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/
      );
      if (cjsMatch) {
        imports.push({
          module: cjsMatch[2],
          bindings: [cjsMatch[1]],
          line: lineNum,
          isRelative: isRelativeImport(cjsMatch[2]),
          isBuiltin: isNodeBuiltin(cjsMatch[2]),
        });
        continue;
      }

      // Bare require: require('module')
      const bareRequireMatch = line.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
      if (bareRequireMatch && !cjsDestructMatch && !cjsMatch) {
        imports.push({
          module: bareRequireMatch[1],
          bindings: [],
          line: lineNum,
          isRelative: isRelativeImport(bareRequireMatch[1]),
          isBuiltin: isNodeBuiltin(bareRequireMatch[1]),
        });
      }
    }

    return imports;
  }

  /**
   * Extract function/method calls using regex.
   * This is a lightweight extraction — AST-based extraction can be added later.
   */
  extractCalls(source: string, _ast?: ASTNode): CallInfo[] {
    const calls: CallInfo[] = [];
    const lines = source.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // Skip comments
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        continue;
      }

      // Match method calls: obj.method(...)
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

      // Match standalone function calls: func(...)
      const funcCallPattern = /(?<!\.)(?<!\w)([a-zA-Z_$]\w*)\s*\(/g;
      while ((match = funcCallPattern.exec(line)) !== null) {
        const name = match[1];
        // Skip keywords
        if (['if', 'for', 'while', 'switch', 'catch', 'return', 'throw', 'new',
          'typeof', 'instanceof', 'void', 'delete', 'await', 'yield', 'function',
          'class', 'const', 'let', 'var', 'import', 'export', 'async', 'from',
          'case', 'type', 'interface', 'enum'].includes(name)) {
          continue;
        }
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
   * Verify if an npm package exists.
   * Uses HEAD request to registry.npmjs.org.
   * Note: This is a placeholder — actual HTTP verification will be done
   * in DeepHallucinationDetector (Phase 2).
   */
  async verifyPackage(name: string): Promise<PackageVerifyResult> {
    // Placeholder: return exists=true for now
    // Real implementation in Phase 2 (DeepHallucinationDetector)
    return {
      name,
      exists: true,
      checkedAt: Date.now(),
    };
  }

  /**
   * Check if an API is deprecated.
   * Placeholder — real deprecated-apis.json will be added in Phase 2 (StaleAPIDetector).
   */
  checkDeprecated(_api: string): DeprecatedInfo | null {
    return null;
  }

  /**
   * Compute complexity metrics for a TypeScript/JavaScript file.
   * Uses simple heuristic counting — AST-based metrics in Phase 2.
   */
  computeComplexity(source: string, _ast?: ASTNode): ComplexityMetrics {
    const lines = source.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0);

    let cyclomatic = 1; // base
    let cognitive = 0;
    let maxNestingDepth = 0;
    let currentDepth = 0;
    let functionCount = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Count decision points for cyclomatic complexity
      const decisions = (trimmed.match(/\b(if|else\s+if|for|while|case|catch|\?\?|&&|\|\|)\b/g) || []).length;
      cyclomatic += decisions;

      // Count ternary operators
      const ternaries = (trimmed.match(/\?[^?:]*:/g) || []).length;
      cyclomatic += ternaries;

      // Track nesting depth
      const opens = (trimmed.match(/\{/g) || []).length;
      const closes = (trimmed.match(/\}/g) || []).length;
      currentDepth += opens - closes;
      if (currentDepth > maxNestingDepth) {
        maxNestingDepth = currentDepth;
      }

      // Cognitive complexity: nested conditions add more
      if (/\b(if|for|while|catch)\b/.test(trimmed)) {
        cognitive += 1 + Math.max(0, currentDepth - 1);
      }

      // Count functions
      if (/\b(function|=>)\b/.test(trimmed) || /\b(async\s+)?\w+\s*\(/.test(trimmed)) {
        // Very rough function counter
        if (/(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s*)?\(|(?:async\s+)?(?:get|set)?\s*\w+\s*\([^)]*\)\s*(?::\s*\w+)?\s*\{)/.test(trimmed)) {
          functionCount++;
        }
      }
    }

    return {
      cyclomatic,
      cognitive,
      loc: nonEmptyLines.length,
      functionCount,
      maxNestingDepth,
    };
  }
}
