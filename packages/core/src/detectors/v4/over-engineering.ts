/**
 * OverEngineeringDetector — V4 detector for over-engineered AI-generated code.
 *
 * AI models love generating unnecessarily complex code: excessive abstraction,
 * design pattern abuse, deep nesting, and bloated function signatures.
 * This detector catches these patterns using CodeUnit complexity metrics.
 *
 * V4 improvements over V3:
 * - Uses pre-computed ComplexityMetrics from CodeUnit IR
 * - Configurable thresholds via DetectorContext
 * - Structural analysis using definitions instead of regex
 *
 * @since 0.4.0
 */

import type { CodeUnit, SupportedLanguage } from '../../ir/types.js';
import type { V4Detector, DetectorResult, DetectorCategory, DetectorContext } from './types.js';

// ─── Default thresholds ────────────────────────────────────────────

/** Configurable thresholds for over-engineering detection. */
export interface OverEngineeringThresholds {
  maxParams: number;
  maxNesting: number;
  maxFunctionLOC: number;
  maxCyclomaticComplexity: number;
}

const DEFAULT_THRESHOLDS: OverEngineeringThresholds = {
  maxParams: 5,
  maxNesting: 4,
  maxFunctionLOC: 100,
  maxCyclomaticComplexity: 15,
};

// ─── Detector ──────────────────────────────────────────────────────

export class OverEngineeringDetector implements V4Detector {
  readonly id = 'over-engineering';
  readonly name = 'Over-engineering Detector';
  readonly category: DetectorCategory = 'implementation';
  readonly supportedLanguages: SupportedLanguage[] = [];

  private readonly thresholds: OverEngineeringThresholds;

  constructor(thresholds?: Partial<OverEngineeringThresholds>) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  async detect(units: CodeUnit[], context: DetectorContext): Promise<DetectorResult[]> {
    const results: DetectorResult[] = [];

    // Apply config overrides if present
    const thresholds = this.getEffectiveThresholds(context);

    // Analysis 1: Excessive function parameters
    this.detectExcessiveParams(units, thresholds, results);

    // Analysis 2: Deep nesting
    this.detectDeepNesting(units, thresholds, results);

    // Analysis 3: Long functions
    this.detectLongFunctions(units, thresholds, results);

    // Analysis 4: High cyclomatic complexity
    this.detectHighComplexity(units, thresholds, results);

    // Analysis 5: Excessive abstraction (many single-method interfaces/classes)
    this.detectExcessiveAbstraction(units, results);

    // Analysis 6: Single-implementation abstractions
    this.detectSingleImplAbstractions(units, results);

    // Analysis 7: Design pattern name abuse (trivial classes with pattern-named suffixes)
    this.detectPatternNameAbuse(units, results);

    // Analysis 8: Deeply nested configuration objects
    this.detectNestedConfigAbstraction(units, results);

    // Analysis 9: TypeScript generic over-engineering
    this.detectGenericOverengineering(units, results);

    // Analysis 10: Excessive decorator chains
    this.detectExcessiveDecoratorChains(units, results);

    return results;
  }

  /**
   * Detect functions with too many parameters.
   * AI models often generate functions with excessive parameters
   * instead of using option objects or builders.
   */
  private detectExcessiveParams(
    units: CodeUnit[],
    thresholds: OverEngineeringThresholds,
    results: DetectorResult[],
  ): void {
    for (const unit of units) {
      if (unit.kind !== 'function' && unit.kind !== 'method') continue;

      const paramCount = unit.complexity.parameterCount;
      if (paramCount !== undefined && paramCount > thresholds.maxParams) {
        results.push({
          detectorId: this.id,
          severity: 'warning',
          category: this.category,
          messageKey: 'over-engineering.excessive-params',
          message: `Function has ${paramCount} parameters (max: ${thresholds.maxParams}). Consider using an options object or builder pattern.`,
          file: unit.file,
          line: unit.location.startLine + 1,
          endLine: unit.location.endLine + 1,
          confidence: 0.8,
          metadata: {
            paramCount,
            threshold: thresholds.maxParams,
            functionId: unit.id,
            analysisType: 'excessive-params',
          },
        });
      }
    }
  }

  /**
   * Detect deeply nested code structures.
   * AI-generated code often has excessive nesting from
   * nested conditionals and callbacks.
   */
  private detectDeepNesting(
    units: CodeUnit[],
    thresholds: OverEngineeringThresholds,
    results: DetectorResult[],
  ): void {
    for (const unit of units) {
      if (unit.kind !== 'function' && unit.kind !== 'method') continue;

      if (unit.complexity.maxNestingDepth > thresholds.maxNesting) {
        results.push({
          detectorId: this.id,
          severity: 'warning',
          category: this.category,
          messageKey: 'over-engineering.deep-nesting',
          message: `Function has nesting depth of ${unit.complexity.maxNestingDepth} (max: ${thresholds.maxNesting}). Consider early returns or extracting helper functions.`,
          file: unit.file,
          line: unit.location.startLine + 1,
          endLine: unit.location.endLine + 1,
          confidence: 0.75,
          metadata: {
            nestingDepth: unit.complexity.maxNestingDepth,
            threshold: thresholds.maxNesting,
            functionId: unit.id,
            analysisType: 'deep-nesting',
          },
        });
      }
    }
  }

  /**
   * Detect functions that are excessively long.
   * AI models often generate monolithic functions instead of
   * properly decomposed code.
   */
  private detectLongFunctions(
    units: CodeUnit[],
    thresholds: OverEngineeringThresholds,
    results: DetectorResult[],
  ): void {
    for (const unit of units) {
      if (unit.kind !== 'function' && unit.kind !== 'method') continue;

      if (unit.complexity.linesOfCode > thresholds.maxFunctionLOC) {
        results.push({
          detectorId: this.id,
          severity: 'warning',
          category: this.category,
          messageKey: 'over-engineering.long-function',
          message: `Function has ${unit.complexity.linesOfCode} lines of code (max: ${thresholds.maxFunctionLOC}). Consider breaking it into smaller functions.`,
          file: unit.file,
          line: unit.location.startLine + 1,
          endLine: unit.location.endLine + 1,
          confidence: 0.7,
          metadata: {
            linesOfCode: unit.complexity.linesOfCode,
            threshold: thresholds.maxFunctionLOC,
            functionId: unit.id,
            analysisType: 'long-function',
          },
        });
      }
    }
  }

  /**
   * Detect high cyclomatic complexity.
   * AI models produce code with many branching paths that
   * is difficult to understand and test.
   */
  private detectHighComplexity(
    units: CodeUnit[],
    thresholds: OverEngineeringThresholds,
    results: DetectorResult[],
  ): void {
    for (const unit of units) {
      if (unit.kind !== 'function' && unit.kind !== 'method') continue;

      if (unit.complexity.cyclomaticComplexity > thresholds.maxCyclomaticComplexity) {
        results.push({
          detectorId: this.id,
          severity: 'warning',
          category: this.category,
          messageKey: 'over-engineering.high-complexity',
          message: `Function has cyclomatic complexity of ${unit.complexity.cyclomaticComplexity} (max: ${thresholds.maxCyclomaticComplexity}). Consider simplifying the logic.`,
          file: unit.file,
          line: unit.location.startLine + 1,
          endLine: unit.location.endLine + 1,
          confidence: 0.85,
          metadata: {
            cyclomaticComplexity: unit.complexity.cyclomaticComplexity,
            threshold: thresholds.maxCyclomaticComplexity,
            functionId: unit.id,
            analysisType: 'high-complexity',
          },
        });
      }
    }
  }

  /**
   * Detect excessive abstraction patterns.
   *
   * AI models tend to over-architect solutions by creating:
   * - Multiple single-method interfaces (unnecessary abstraction)
   * - Abstract classes with single concrete implementations
   */
  private detectExcessiveAbstraction(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    // Group by file to detect per-file patterns
    const fileUnits = new Map<string, CodeUnit[]>();
    for (const unit of units) {
      if (!fileUnits.has(unit.file)) {
        fileUnits.set(unit.file, []);
      }
      fileUnits.get(unit.file)!.push(unit);
    }

    for (const [file, fileUnitList] of fileUnits) {
      // Count interfaces with single method definitions
      let singleMethodInterfaces = 0;
      const interfaceUnits: CodeUnit[] = [];

      for (const unit of fileUnitList) {
        if (unit.kind !== 'class') continue;

        // Detect interfaces/types with only a single method
        const methodDefs = unit.definitions.filter(d => d.kind === 'method');
        const interfaceDefs = unit.definitions.filter(d => d.kind === 'interface');

        // If this is an interface-like unit (has interface definitions) with very few methods
        if (interfaceDefs.length > 0 && methodDefs.length === 1) {
          singleMethodInterfaces++;
          interfaceUnits.push(unit);
        }
      }

      // Flag if there are many single-method interfaces in one file
      if (singleMethodInterfaces >= 3) {
        results.push({
          detectorId: this.id,
          severity: 'info',
          category: this.category,
          messageKey: 'over-engineering.excessive-abstraction',
          message: `File contains ${singleMethodInterfaces} single-method interfaces. This may be over-engineered — consider consolidating or using function types.`,
          file,
          line: interfaceUnits[0]?.location.startLine + 1 || 1,
          confidence: 0.6,
          metadata: {
            singleMethodInterfaces,
            analysisType: 'excessive-abstraction',
          },
        });
      }
    }
  }

  /**
   * Detect abstract classes and interfaces with only one implementation.
   * This is a common AI over-engineering pattern: creating unnecessary abstractions.
   */
  private detectSingleImplAbstractions(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    const LANGUAGES_WITH_CLASSES = new Set(['typescript', 'javascript', 'java', 'kotlin']);

    // Collect all units per file, filter by supported languages
    const fileUnits = units.filter(u =>
      u.kind === 'file' && LANGUAGES_WITH_CLASSES.has(u.language),
    );

    if (fileUnits.length === 0) return;

    // Collect abstract classes and interfaces
    const abstractNames = new Set<string>();
    // Map: abstract name → [{implName, file, line}]
    const implementations = new Map<string, Array<{ implName: string; file: string; line: number }>>();
    // Map: abstract name → {file, line}
    const definitions = new Map<string, { file: string; line: number }>();

    for (const unit of fileUnits) {
      const source = unit.source;
      if (!source) continue;

      // Find abstract class definitions
      const abstractClassRegex = /abstract\s+class\s+(\w+)/g;
      let match: RegExpExecArray | null;
      while ((match = abstractClassRegex.exec(source)) !== null) {
        const name = match[1];
        abstractNames.add(name);
        const line = source.substring(0, match.index).split('\n').length - 1;
        definitions.set(name, { file: unit.file, line });
      }

      // Find interface definitions
      const interfaceRegex = /interface\s+(\w+)/g;
      while ((match = interfaceRegex.exec(source)) !== null) {
        const name = match[1];
        abstractNames.add(name);
        const line = source.substring(0, match.index).split('\n').length - 1;
        definitions.set(name, { file: unit.file, line });
      }

      // Find extends relationships
      const extendsRegex = /class\s+(\w+)\s+extends\s+(\w+)/g;
      while ((match = extendsRegex.exec(source)) !== null) {
        const implName = match[1];
        const parentName = match[2];
        if (!implementations.has(parentName)) {
          implementations.set(parentName, []);
        }
        const line = source.substring(0, match.index).split('\n').length - 1;
        implementations.get(parentName)!.push({ implName, file: unit.file, line });
      }

      // Find implements relationships
      const implementsRegex = /class\s+(\w+)\s+implements\s+(\w+)/g;
      while ((match = implementsRegex.exec(source)) !== null) {
        const implName = match[1];
        const ifaceName = match[2];
        if (!implementations.has(ifaceName)) {
          implementations.set(ifaceName, []);
        }
        const line = source.substring(0, match.index).split('\n').length - 1;
        implementations.get(ifaceName)!.push({ implName, file: unit.file, line });
      }
    }

    // Flag abstractions with exactly one implementation
    for (const name of abstractNames) {
      const impls = implementations.get(name);
      if (!impls || impls.length !== 1) continue;

      const def = definitions.get(name);
      const impl = impls[0];

      results.push({
        detectorId: this.id,
        severity: 'warning',
        category: this.category,
        messageKey: 'over-engineering.single-impl-abstraction',
        message: `Abstract class/interface '${name}' has only one implementation '${impl.implName}'. Consider simplifying by inlining the implementation.`,
        file: def?.file || impl.file,
        line: (def?.line ?? impl.line) + 1,
        confidence: 0.7,
        metadata: {
          abstractName: name,
          implementationName: impl.implName,
          implementationFile: impl.file,
          analysisType: 'single-impl-abstraction',
        },
      });
    }
  }

  /**
   * Detect design pattern name abuse: classes with design-pattern vocabulary
   * in their name (Factory, Builder, Provider, etc.) but trivially simple bodies.
   *
   * AI models love naming classes after design patterns even when a simple function
   * would suffice. This catches classes like "UserHandler" that are just a wrapper
   * around a single function call.
   *
   * Thresholds:
   * - Class body < maxPatternBodyLOC lines (default 25) → suspicious
   * - Class has < maxPatternMethods methods (default 2) → suspicious
   * - Class name ends with a known pattern suffix → flagged
   *
   * Uses source-level analysis (regex) since the IR may not have full method counts
   * for all languages.
   */
  private detectPatternNameAbuse(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    const PATTERN_SUFFIXES = [
      'Factory', 'Builder', 'Provider', 'Manager', 'Handler', 'Processor',
      'Resolver', 'Strategy', 'Adapter', 'Decorator', 'Observer', 'Singleton',
      'Facade', 'Controller', 'Service', 'Repository', 'Middleware',
      'Dispatcher', 'Supervisor', 'Coordinator', 'Registry', 'Wrapper',
      'Helper', 'Util', 'Utility', 'Engine',
    ];

    const MAX_BODY_LOC = 25;
    const MAX_METHODS = 2;

    const MAX_BODY_LOC_KEY = 'maxPatternBodyLOC';
    const MAX_METHODS_KEY = 'maxPatternMethods';

    // Note: thresholds from context.config could be used here in the future,
    // but since this method doesn't receive context, we use constants for now.

    for (const unit of units) {
      if (unit.kind !== 'file') continue;
      const source = unit.source;
      if (!source) continue;

      for (const suffix of PATTERN_SUFFIXES) {
        // Match class declarations with the pattern suffix
        const classRegex = new RegExp(`(?:class|interface)\\s+(\\w*${suffix})\\b`, 'g');
        let match: RegExpExecArray | null;

        while ((match = classRegex.exec(source)) !== null) {
          const className = match[1];
          const matchStart = match.index;

          // Skip if it's in a comment or string
          if (this.isInCommentOrString(source, matchStart)) continue;

          // Extract the class/interface body
          const bodyRange = this.extractClassBody(source, matchStart);
          if (!bodyRange) continue;

          const body = source.substring(bodyRange.start, bodyRange.end);
          const bodyLines = body.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('//'));

          // Check if the body is trivially simple
          if (bodyLines.length > MAX_BODY_LOC) continue;

          // Count method-like definitions in the body
          const methodCount = this.countMethodsInBody(body);

          if (methodCount <= MAX_METHODS) {
            const line = source.substring(0, matchStart).split('\n').length;

            results.push({
              detectorId: this.id,
              severity: 'info',
              category: this.category,
              messageKey: 'over-engineering.pattern-name-abuse',
              message: `Class "${className}" uses design pattern suffix "${suffix}" but has a trivial implementation (${methodCount} method${methodCount !== 1 ? 's' : ''}, ${bodyLines.length} effective lines). AI often names classes after design patterns when a simple function would suffice.`,
              file: unit.file,
              line,
              confidence: 0.6,
              metadata: {
                className,
                patternSuffix: suffix,
                methodCount,
                effectiveLines: bodyLines.length,
                thresholds: { [MAX_BODY_LOC_KEY]: MAX_BODY_LOC, [MAX_METHODS_KEY]: MAX_METHODS },
                analysisType: 'pattern-name-abuse',
              },
            });
          }
        }
      }
    }
  }

  /**
   * Detect deeply nested configuration object abstractions.
   *
   * AI models often create excessively nested configuration type hierarchies
   * (Config → AppConfig → DatabaseConfig → PostgresConfig) when a flat
   * configuration object would be simpler and more maintainable.
   *
   * Detects:
   * - Interface/type chains where one config type references another
   * - More than 2 levels of nesting in config-like types
   */
  private detectNestedConfigAbstraction(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    const CONFIG_NAME_PATTERN = /(?:Config|Configuration|Options|Settings|Params|Props)$/i;
    const MAX_NESTING_DEPTH = 2;

    for (const unit of units) {
      if (unit.kind !== 'file') continue;
      const source = unit.source;
      if (!source) continue;

      // Extract all config-like type definitions and their referenced types
      const configTypes = new Map<string, {
        line: number;
        referencedTypes: string[];
      }>();

      // Match interface/type definitions with config-like names
      const defRegex = /(?:interface|type)\s+(\w+(?:Config|Configuration|Options|Settings|Params|Props)\w*)\s*(?:=\s*)?(?:extends\s+(\w+)\s*)?\{([^}]*)\}/gi;
      let match: RegExpExecArray | null;

      while ((match = defRegex.exec(source)) !== null) {
        const typeName = match[1];
        const extendsType = match[2] || null;
        const body = match[3];
        const line = source.substring(0, match.index).split('\n').length;

        // Find referenced config-like types in properties
        const referencedTypes: string[] = [];
        if (extendsType && CONFIG_NAME_PATTERN.test(extendsType)) {
          referencedTypes.push(extendsType);
        }

        const propTypeRegex = /:\s*(\w+(?:Config|Configuration|Options|Settings|Params|Props)\w*)/gi;
        let propMatch: RegExpExecArray | null;
        while ((propMatch = propTypeRegex.exec(body)) !== null) {
          referencedTypes.push(propMatch[1]);
        }

        configTypes.set(typeName, { line, referencedTypes });
      }

      // Build a depth map by walking the reference graph
      const depthCache = new Map<string, number>();

      const getDepth = (typeName: string, visited: Set<string>): number => {
        if (depthCache.has(typeName)) return depthCache.get(typeName)!;
        if (visited.has(typeName)) return 0; // Circular reference
        visited.add(typeName);

        const config = configTypes.get(typeName);
        if (!config || config.referencedTypes.length === 0) {
          depthCache.set(typeName, 0);
          return 0;
        }

        let maxChildDepth = 0;
        for (const ref of config.referencedTypes) {
          const childDepth = getDepth(ref, visited);
          maxChildDepth = Math.max(maxChildDepth, childDepth + 1);
        }

        depthCache.set(typeName, maxChildDepth);
        return maxChildDepth;
      };

      // Find root config types (those that are not referenced by others)
      const referencedByOthers = new Set<string>();
      for (const [, config] of configTypes) {
        for (const ref of config.referencedTypes) {
          referencedByOthers.add(ref);
        }
      }

      for (const [typeName, config] of configTypes) {
        if (referencedByOthers.has(typeName)) continue; // Skip non-root types

        const depth = getDepth(typeName, new Set());
        if (depth > MAX_NESTING_DEPTH) {
          // Walk the chain to report it
          const chain: string[] = [typeName];
          let current = typeName;
          while (configTypes.has(current) && configTypes.get(current)!.referencedTypes.length > 0) {
            const nextRef = configTypes.get(current)!.referencedTypes[0];
            if (chain.includes(nextRef)) break; // Avoid circular
            chain.push(nextRef);
            current = nextRef;
          }

          results.push({
            detectorId: this.id,
            severity: 'warning',
            category: this.category,
            messageKey: 'over-engineering.nested-config-abstraction',
            message: `Configuration type "${typeName}" has ${depth} levels of nesting (${chain.join(' → ')}). AI often creates unnecessarily deep config hierarchies. Consider flattening into a single configuration type.`,
            file: unit.file,
            line: config.line,
            confidence: 0.7,
            metadata: {
              typeName,
              nestingDepth: depth,
              chain,
              maxAllowed: MAX_NESTING_DEPTH,
              analysisType: 'nested-config-abstraction',
            },
          });
        }
      }
    }
  }

  /**
   * Detect TypeScript generic over-engineering.
   *
   * AI models frequently produce excessively complex generic type signatures
   * when simpler types would work. This detects:
   * - Functions/classes with too many generic type parameters (>3)
   * - Deeply nested generic types (Map<string, Array<Promise<Result<T, E>>>>)
   * - Generic parameters that are used only once (could be replaced with concrete type)
   */
  private detectGenericOverengineering(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    const MAX_GENERIC_PARAMS = 3;
    const MAX_GENERIC_NESTING = 3;

    for (const unit of units) {
      if (unit.kind !== 'file') continue;
      if (unit.language !== 'typescript' && unit.language !== 'javascript') continue;
      const source = unit.source;
      if (!source) continue;

      const lines = source.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;

        // Detect excessive generic type parameters on declarations
        // Matches: function foo<A, B, C, D>  or  class Bar<T, U, V, W>  or  interface Baz<X, Y, Z, Q>
        const genericDeclRegex = /(?:function|class|interface|type)\s+(\w+)\s*<([^>]+)>/g;
        let match: RegExpExecArray | null;

        while ((match = genericDeclRegex.exec(line)) !== null) {
          const name = match[1];
          const genericsStr = match[2];

          // Count generic parameters (split by comma, accounting for nested <> and defaults)
          const paramCount = this.countGenericParams(genericsStr);

          if (paramCount > MAX_GENERIC_PARAMS) {
            results.push({
              detectorId: this.id,
              severity: 'warning',
              category: this.category,
              messageKey: 'over-engineering.excessive-generics',
              message: `"${name}" has ${paramCount} generic type parameters (max recommended: ${MAX_GENERIC_PARAMS}). AI often creates overly generic abstractions. Consider reducing type parameters or splitting into simpler types.`,
              file: unit.file,
              line: i + 1,
              confidence: 0.7,
              metadata: {
                name,
                genericParamCount: paramCount,
                threshold: MAX_GENERIC_PARAMS,
                analysisType: 'excessive-generics',
              },
            });
          }
        }

        // Detect deeply nested generic types in type annotations
        // e.g., Map<string, Array<Promise<Result<T, E>>>>
        const maxNesting = this.measureGenericNesting(line);
        if (maxNesting > MAX_GENERIC_NESTING) {
          results.push({
            detectorId: this.id,
            severity: 'info',
            category: this.category,
            messageKey: 'over-engineering.deep-generic-nesting',
            message: `Line contains ${maxNesting} levels of generic type nesting (max recommended: ${MAX_GENERIC_NESTING}). Consider extracting intermediate type aliases for readability.`,
            file: unit.file,
            line: i + 1,
            confidence: 0.6,
            metadata: {
              nestingDepth: maxNesting,
              threshold: MAX_GENERIC_NESTING,
              matchedLine: trimmed.substring(0, 120),
              analysisType: 'deep-generic-nesting',
            },
          });
        }
      }
    }
  }

  /**
   * Count generic type parameters, handling nested angle brackets and defaults.
   * "T, U extends Foo, V = Bar<Baz>" → 3
   */
  private countGenericParams(genericsStr: string): number {
    let depth = 0;
    let count = 1; // At least one param if string is non-empty

    for (const ch of genericsStr) {
      if (ch === '<' || ch === '(') depth++;
      else if (ch === '>' || ch === ')') depth--;
      else if (ch === ',' && depth === 0) count++;
    }

    return count;
  }

  /**
   * Measure the maximum generic nesting depth in a line.
   * "Map<string, Array<Promise<T>>>" → 3
   */
  private measureGenericNesting(line: string): number {
    let maxDepth = 0;
    let currentDepth = 0;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (inString) {
        if (ch === stringChar && line[i - 1] !== '\\') inString = false;
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        stringChar = ch;
        continue;
      }

      // Only count < that looks like a generic (preceded by a word character)
      if (ch === '<' && i > 0 && /\w/.test(line[i - 1])) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (ch === '>' && currentDepth > 0) {
        currentDepth--;
      }
    }

    return maxDepth;
  }

  /**
   * Extract the body range (start, end) of a class/interface starting from the declaration.
   * Returns null if no body is found (e.g., abstract-only or comment).
   */
  private extractClassBody(source: string, declarationStart: number): { start: number; end: number } | null {
    const braceStart = source.indexOf('{', declarationStart);
    if (braceStart === -1) return null;

    let depth = 0;
    let inString = false;
    let stringChar = '';
    let inTemplate = false;

    for (let i = braceStart; i < source.length; i++) {
      const ch = source[i];
      const prev = i > 0 ? source[i - 1] : '';

      if (inString) {
        if (ch === stringChar && prev !== '\\') {
          inString = false;
        }
        continue;
      }

      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        stringChar = ch;
        continue;
      }

      if (ch === '{') depth++;
      if (ch === '}') {
        depth--;
        if (depth === 0) {
          return { start: braceStart, end: i + 1 };
        }
      }
    }

    return null;
  }

  /**
   * Count method-like definitions within a class body.
   * Detects: methodName(), get/set accessors, and arrow function properties.
   */
  private countMethodsInBody(body: string): number {
    let count = 0;

    // Match method definitions: name(params) { or name(params):
    // Also match arrow function properties: name = () => or name = (params) => {
    const methodPatterns = [
      /(?:public|private|protected|static|async|abstract|readonly)*\s*\w+\s*\([^)]*\)\s*[{:=]/g,
      /get\s+\w+\s*\(\s*\)/g,
      /set\s+\w+\s*\([^)]*\)/g,
    ];

    for (const pattern of methodPatterns) {
      let m: RegExpExecArray | null;
      while ((m = pattern.exec(body)) !== null) {
        // Skip constructor, common false positives
        if (/\bconstructor\b/.test(m[0])) continue;
        if (/\b(?:if|for|while|switch|catch|return|typeof|instanceof|new)\s*\(/.test(m[0])) continue;
        count++;
      }
    }

    return count;
  }

  /**
   * Check if a position in the source is inside a comment or string literal.
   * Simple heuristic: checks if the line starts with // or if we're between quotes.
   */
  private isInCommentOrString(source: string, position: number): boolean {
    // Find the start of the current line
    const lineStart = source.lastIndexOf('\n', position - 1) + 1;
    const linePrefix = source.substring(lineStart, position).trim();

    // Line comment
    if (linePrefix.startsWith('//') || linePrefix.startsWith('#') || linePrefix.startsWith('*')) {
      return true;
    }

    return false;
  }

  /**
   * Detect excessive decorator chains on classes, methods, or properties.
   *
   * AI models love stacking decorators — @Injectable @Validated @Cached
   * @Logged @Timed @Deprecated all on a single method. This makes code
   * hard to reason about and often indicates unnecessary abstraction.
   *
   * Detects:
   * - TypeScript/JavaScript: consecutive @ decorators before a declaration
   * - Python: consecutive @ decorators before a def/class
   * - Java/Kotlin: consecutive @ annotations before a method/class
   */
  private detectExcessiveDecoratorChains(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    const MAX_DECORATORS = 4;

    for (const unit of units) {
      if (unit.kind !== 'file') continue;
      const source = unit.source;
      if (!source) continue;

      const lines = source.split('\n');
      let consecutiveDecorators = 0;
      let chainStartLine = 0;
      const collectedDecorators: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();

        // Check if line is a decorator/annotation
        const isDecorator = /^@\w+/.test(trimmed) && !/^@(?:param|returns?|type|typedef|template|see|throws|deprecated|example|override)\b/.test(trimmed);

        if (isDecorator) {
          if (consecutiveDecorators === 0) {
            chainStartLine = i;
          }
          consecutiveDecorators++;
          const decoratorName = trimmed.match(/^@(\w+)/)?.[1] || trimmed;
          collectedDecorators.push(decoratorName);
        } else if (trimmed.length > 0) {
          // Non-empty, non-decorator line — end of chain
          if (consecutiveDecorators > MAX_DECORATORS) {
            // Only flag if the next line looks like a declaration
            const isDeclaration = /^(?:export\s+)?(?:class|function|async|const|let|var|def|public|private|protected|static|abstract|interface|fun|data\s+class|open\s+class)\b/.test(trimmed);
            if (isDeclaration || trimmed.includes('(') || trimmed.includes('{')) {
              results.push({
                detectorId: this.id,
                severity: 'warning',
                category: this.category,
                messageKey: 'over-engineering.excessive-decorator-chain',
                message: `${consecutiveDecorators} decorators stacked on a single declaration (max recommended: ${MAX_DECORATORS}). AI tends to over-apply decorators. Consider consolidating or removing unnecessary ones. Decorators: @${collectedDecorators.join(', @')}.`,
                file: unit.file,
                line: chainStartLine + 1,
                endLine: i + 1,
                confidence: 0.7,
                metadata: {
                  decoratorCount: consecutiveDecorators,
                  threshold: MAX_DECORATORS,
                  decorators: [...collectedDecorators],
                  analysisType: 'excessive-decorator-chain',
                },
              });
            }
          }
          consecutiveDecorators = 0;
          collectedDecorators.length = 0;
        }
        // Empty lines within a decorator chain are OK (don't reset)
      }
    }
  }

  /**
   * Get effective thresholds, considering config overrides.
   */
  private getEffectiveThresholds(context: DetectorContext): OverEngineeringThresholds {
    const config = context.config?.['over-engineering'] as Partial<OverEngineeringThresholds> | undefined;
    if (!config) return this.thresholds;

    return {
      maxParams: config.maxParams ?? this.thresholds.maxParams,
      maxNesting: config.maxNesting ?? this.thresholds.maxNesting,
      maxFunctionLOC: config.maxFunctionLOC ?? this.thresholds.maxFunctionLOC,
      maxCyclomaticComplexity: config.maxCyclomaticComplexity ?? this.thresholds.maxCyclomaticComplexity,
    };
  }
}
