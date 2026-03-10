/**
 * Type Safety Detector (V3)
 *
 * TypeScript-specific type safety analysis:
 * 1. Excessive `any` usage (`: any`, `as any`, `<any>`)
 * 2. Missing return types on exported functions
 * 3. Unsafe type assertions (`as unknown as X`)
 * 4. Non-null assertion operator abuse (`!.`)
 *
 * AI models frequently generate TypeScript code with excessive `any` usage,
 * unsafe assertions, and missing type annotations.
 *
 * Only operates on .ts/.tsx files.
 *
 * Implements the unified Detector interface.
 *
 * @since 0.3.0
 */

import type { Detector, UnifiedIssue, FileAnalysis, Severity } from '../types.js';
import { AIDefectCategory } from '../types.js';

// ─── Helpers ───

function isTypeScriptFile(filePath: string): boolean {
  return /\.(ts|tsx)$/.test(filePath);
}

// ─── Main Detector ───

/**
 * TypeSafetyDetector — detects type safety issues in AI-generated TypeScript code.
 *
 * Analyzes:
 * - `any` abuse (: any, as any, <any>)
 * - Missing return type annotations on exported functions
 * - Unsafe type assertions (as unknown as X)
 * - Excessive non-null assertion (!) usage
 */
export class TypeSafetyDetector implements Detector {
  readonly name = 'type-safety';
  readonly version = '1.0.0';
  readonly tier = 1 as const;

  // ─── V3 Unified Interface ───

  async detect(files: FileAnalysis[]): Promise<UnifiedIssue[]> {
    const allIssues: UnifiedIssue[] = [];
    let globalIndex = 0;

    for (const file of files) {
      // Only analyze TypeScript files
      if (!isTypeScriptFile(file.path)) continue;

      const issues = this.analyzeFile(file.path, file.content);
      for (const issue of issues) {
        issue.id = `type-safety:${globalIndex++}`;
        allIssues.push(issue);
      }
    }

    return allIssues;
  }

  // ─── Internal Analysis ───

  private analyzeFile(filePath: string, source: string): UnifiedIssue[] {
    const issues: UnifiedIssue[] = [];
    const lines = source.split('\n');

    // 1. Detect `any` usage
    this.detectAnyUsage(filePath, lines, issues);

    // 2. Detect missing return types on exported functions
    this.detectMissingReturnTypes(filePath, lines, issues);

    // 3. Detect unsafe type assertions
    this.detectUnsafeAssertions(filePath, lines, issues);

    // 4. Detect non-null assertion abuse
    this.detectNonNullAssertions(filePath, lines, issues);

    return issues;
  }

  // ─── 1. Any Usage Detection ───

  private detectAnyUsage(filePath: string, lines: string[], issues: UnifiedIssue[]): void {
    const anyLocations: Array<{ line: number; kind: string }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

      // Skip suppressed lines
      const prevLine = i > 0 ? lines[i - 1] : '';
      if (prevLine.includes('// ai-validator-ignore') || prevLine.includes('// ai-validator-disable')) continue;

      // Detect `: any` (type annotation)
      const colonAny = line.match(/:\s*any\b/g);
      if (colonAny) {
        for (const _m of colonAny) {
          anyLocations.push({ line: i + 1, kind: ': any' });
        }
      }

      // Detect `as any` (type assertion)
      const asAny = line.match(/\bas\s+any\b/g);
      if (asAny) {
        for (const _m of asAny) {
          anyLocations.push({ line: i + 1, kind: 'as any' });
        }
      }

      // Detect `<any>` (type parameter / old-style assertion)
      const angleBracketAny = line.match(/<any>/g);
      if (angleBracketAny) {
        for (const _m of angleBracketAny) {
          anyLocations.push({ line: i + 1, kind: '<any>' });
        }
      }
    }

    const anyCount = anyLocations.length;
    if (anyCount === 0) return;

    // Determine severity based on count
    let severity: Severity;
    if (anyCount > 8) {
      severity = 'medium';
    } else if (anyCount >= 4) {
      severity = 'low';
    } else {
      severity = 'info';
    }

    // Report per-location for the first few, then summary
    if (anyCount <= 5) {
      for (const loc of anyLocations) {
        issues.push({
          id: '',
          detector: this.name,
          type: 'any-usage',
          category: AIDefectCategory.TYPE_SAFETY,
          severity,
          message: `Unsafe '${loc.kind}' usage — weakens TypeScript type checking`,
          file: filePath,
          line: loc.line,
          suggestion: 'Replace `any` with a specific type, `unknown`, or a generic type parameter.',
          fix: {
            description: 'Replace `any` with proper type annotation',
            autoFixable: false,
          },
          confidence: 0.9,
          detectionSource: 'static',
        });
      }
    } else {
      // Report first 3 locations individually
      for (const loc of anyLocations.slice(0, 3)) {
        issues.push({
          id: '',
          detector: this.name,
          type: 'any-usage',
          category: AIDefectCategory.TYPE_SAFETY,
          severity,
          message: `Unsafe '${loc.kind}' usage — weakens TypeScript type checking`,
          file: filePath,
          line: loc.line,
          suggestion: 'Replace `any` with a specific type, `unknown`, or a generic type parameter.',
          fix: {
            description: 'Replace `any` with proper type annotation',
            autoFixable: false,
          },
          confidence: 0.9,
          detectionSource: 'static',
        });
      }

      // Summary issue
      issues.push({
        id: '',
        detector: this.name,
        type: 'any-abuse',
        category: AIDefectCategory.TYPE_SAFETY,
        severity,
        message: `Excessive 'any' usage: ${anyCount} occurrences found in file. AI-generated code often over-uses 'any' to bypass type errors.`,
        file: filePath,
        line: 1,
        suggestion: `Review and replace 'any' types with proper type annotations. Consider using \`unknown\` with type guards.`,
        fix: {
          description: `Replace ${anyCount} 'any' usages with proper types`,
          autoFixable: false,
        },
        confidence: 0.9,
        detectionSource: 'static',
      });
    }
  }

  // ─── 2. Missing Return Types ───

  private detectMissingReturnTypes(filePath: string, lines: string[], issues: UnifiedIssue[]): void {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

      // Skip suppressed lines
      const prevLine = i > 0 ? lines[i - 1] : '';
      if (prevLine.includes('// ai-validator-ignore') || prevLine.includes('// ai-validator-disable')) continue;

      // Match exported function declarations
      const exportFuncMatch = trimmed.match(
        /^export\s+(?:default\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*\{/,
      );

      if (exportFuncMatch) {
        const funcName = exportFuncMatch[1];
        // Check if there's a return type annotation between ) and {
        const fullLine = line;
        const closeParen = fullLine.lastIndexOf(')');
        const openBrace = fullLine.indexOf('{', closeParen);
        if (closeParen >= 0 && openBrace >= 0) {
          const between = fullLine.substring(closeParen + 1, openBrace).trim();
          // Should have `: SomeType` between ) and {
          if (!between.startsWith(':')) {
            issues.push({
              id: '',
              detector: this.name,
              type: 'missing-return-type',
              category: AIDefectCategory.TYPE_SAFETY,
              severity: 'low',
              message: `Exported function '${funcName}' is missing a return type annotation`,
              file: filePath,
              line: i + 1,
              suggestion: `Add an explicit return type: function ${funcName}(...): ReturnType { ... }`,
              fix: {
                description: `Add return type annotation to '${funcName}'`,
                autoFixable: false,
              },
              confidence: 0.85,
              detectionSource: 'static',
            });
          }
        }
      }
    }
  }

  // ─── 3. Unsafe Type Assertions ───

  private detectUnsafeAssertions(filePath: string, lines: string[], issues: UnifiedIssue[]): void {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

      // Skip suppressed lines
      const prevLine = i > 0 ? lines[i - 1] : '';
      if (prevLine.includes('// ai-validator-ignore') || prevLine.includes('// ai-validator-disable')) continue;

      // Detect `as unknown as X` pattern
      if (/\bas\s+unknown\s+as\s+\w/.test(line)) {
        issues.push({
          id: '',
          detector: this.name,
          type: 'unsafe-assertion',
          category: AIDefectCategory.TYPE_SAFETY,
          severity: 'medium',
          message: `Unsafe double assertion 'as unknown as X' bypasses type checking entirely`,
          file: filePath,
          line: i + 1,
          suggestion: 'Avoid double assertions. Use proper type narrowing (type guards) or fix the underlying type mismatch.',
          fix: {
            description: 'Replace double assertion with proper type narrowing',
            autoFixable: false,
          },
          confidence: 0.95,
          detectionSource: 'static',
        });
      }
    }
  }

  // ─── 4. Non-null Assertion Abuse ───

  private detectNonNullAssertions(filePath: string, lines: string[], issues: UnifiedIssue[]): void {
    const nonNullLocations: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

      // Skip suppressed lines
      const prevLine = i > 0 ? lines[i - 1] : '';
      if (prevLine.includes('// ai-validator-ignore') || prevLine.includes('// ai-validator-disable')) continue;

      // Detect `!.` and `!;` and `!)` — non-null assertion operator
      // Be careful not to match !== or != or regular !boolean
      const nonNullMatches = line.match(/\w+!\./g) || [];
      const nonNullEnd = line.match(/\w+!(?:[;,)\]\s]|$)/g) || [];
      // Filter out != and !==
      const filtered = [...nonNullMatches, ...nonNullEnd].filter(m => !m.includes('!='));
      if (filtered.length > 0) {
        nonNullLocations.push(i + 1);
      }
    }

    // Only flag if there are many non-null assertions (>3 per file = noteworthy)
    if (nonNullLocations.length > 5) {
      issues.push({
        id: '',
        detector: this.name,
        type: 'non-null-assertion-abuse',
        category: AIDefectCategory.TYPE_SAFETY,
        severity: 'low',
        message: `Excessive non-null assertion (!) usage: ${nonNullLocations.length} occurrences. AI often uses '!' to suppress null checks instead of proper handling.`,
        file: filePath,
        line: nonNullLocations[0],
        suggestion: 'Use optional chaining (?.), nullish coalescing (??), or proper null checks instead of non-null assertions.',
        fix: {
          description: 'Replace non-null assertions with safe null handling',
          autoFixable: false,
        },
        confidence: 0.75,
        detectionSource: 'static',
      });
    }
  }
}

export default TypeSafetyDetector;
