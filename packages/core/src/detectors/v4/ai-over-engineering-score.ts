/**
 * AIOverEngineeringScoreDetector — Composite detector that quantifies
 * how "AI-like" the over-engineering in a codebase is.
 *
 * AI models produce distinctive over-engineering patterns that differ from
 * human over-engineering: excessive design-pattern vocabulary, unnecessary
 * abstraction layers, trivial single-implementation interfaces, and deep
 * generic type hierarchies. This detector collects metrics across the
 * codebase and produces a per-file and overall "AI Over-engineering Score"
 * from 0 (clean) to 100 (severely over-engineered).
 *
 * Metrics collected per file:
 * 1. Pattern Name Density — fraction of classes ending in Factory/Builder/Provider/etc.
 * 2. Single-Implementation Ratio — interfaces/abstract classes with only one impl
 * 3. Abstraction Depth — nesting depth of config/type hierarchies
 * 4. Generic Complexity — count of multi-parameter generic declarations
 * 5. Decorator Density — average decorators per declaration
 * 6. Interface-to-Implementation Ratio — more interfaces than implementations
 *
 * Output:
 * - Per-file scores (info-level results with detailed breakdown)
 * - Project-wide summary if multiple files score above threshold
 *
 * Marketing differentiator: "Quantify your AI code — over-engineering score 0–100"
 *
 * @since 0.7.0
 */

import type { CodeUnit, SupportedLanguage } from '../../ir/types.js';
import type { V4Detector, DetectorResult, DetectorCategory, DetectorContext } from './types.js';

// ─── Configuration ─────────────────────────────────────────────────

export interface AIOverEngineeringConfig {
  /** Score threshold above which to report a file (0-100, default 40) */
  fileReportThreshold: number;
  /** Score threshold above which to generate a project-wide summary (0-100, default 50) */
  projectSummaryThreshold: number;
  /** Maximum number of files to report individually (default 10) */
  maxFileReports: number;
}

const DEFAULT_CONFIG: AIOverEngineeringConfig = {
  fileReportThreshold: 40,
  projectSummaryThreshold: 50,
  maxFileReports: 10,
};

// ─── Score Metrics ─────────────────────────────────────────────────

/** Per-file metrics breakdown */
export interface FileMetrics {
  file: string;
  totalClasses: number;
  patternNameCount: number;
  patternNameDensity: number; // 0-1
  singleImplCount: number;
  singleImplRatio: number; // 0-1
  maxAbstractionDepth: number;
  genericParamTotal: number;
  genericComplexityScore: number; // 0-1
  decoratorTotal: number;
  decoratorDeclCount: number;
  decoratorDensity: number; // 0-1
  interfaceCount: number;
  implementationCount: number;
  interfaceImplRatio: number; // 0-1
  score: number; // 0-100
}

/** Project-wide summary */
export interface ProjectSummary {
  totalFiles: number;
  scoredFiles: number;
  averageScore: number;
  maxScore: number;
  worstFile: string;
  metrics: {
    totalPatternNames: number;
    totalSingleImpls: number;
    totalGenericParams: number;
    totalDecorators: number;
    totalInterfaces: number;
    totalImplementations: number;
  };
}

// ─── Pattern Name Suffixes ─────────────────────────────────────────

const PATTERN_SUFFIXES = [
  'Factory', 'Builder', 'Provider', 'Manager', 'Handler', 'Processor',
  'Resolver', 'Strategy', 'Adapter', 'Decorator', 'Observer', 'Singleton',
  'Facade', 'Controller', 'Service', 'Repository', 'Middleware',
  'Dispatcher', 'Supervisor', 'Coordinator', 'Registry', 'Wrapper',
  'Helper', 'Util', 'Utility', 'Engine',
];

// ─── Detector ──────────────────────────────────────────────────────

export class AIOverEngineeringScoreDetector implements V4Detector {
  readonly id = 'ai-over-engineering-score';
  readonly name = 'AI Over-engineering Score Detector';
  readonly category: DetectorCategory = 'implementation';
  readonly supportedLanguages: SupportedLanguage[] = [];

  private readonly config: AIOverEngineeringConfig;

  constructor(config?: Partial<AIOverEngineeringConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async detect(units: CodeUnit[], context: DetectorContext): Promise<DetectorResult[]> {
    const results: DetectorResult[] = [];
    const config = this.getEffectiveConfig(context);

    // Collect file-level units
    const fileUnits = units.filter(u => u.kind === 'file' && u.source);

    if (fileUnits.length === 0) return results;

    // Compute per-file metrics
    const fileMetrics: FileMetrics[] = [];
    for (const unit of fileUnits) {
      const metrics = this.computeFileMetrics(unit, units);
      fileMetrics.push(metrics);
    }

    // Sort by score descending
    fileMetrics.sort((a, b) => b.score - a.score);

    // Report high-scoring files
    let reported = 0;
    for (const metrics of fileMetrics) {
      if (metrics.score < config.fileReportThreshold) break;
      if (reported >= config.maxFileReports) break;

      results.push({
        detectorId: this.id,
        severity: metrics.score >= 70 ? 'warning' : 'info',
        category: this.category,
        messageKey: 'ai-over-engineering-score.file-score',
        message: this.formatFileReport(metrics),
        file: metrics.file,
        line: 1,
        confidence: 0.7,
        metadata: {
          analysisType: 'ai-over-engineering-score',
          score: metrics.score,
          metrics: {
            patternNameDensity: metrics.patternNameDensity,
            singleImplRatio: metrics.singleImplRatio,
            genericComplexity: metrics.genericComplexityScore,
            decoratorDensity: metrics.decoratorDensity,
            interfaceImplRatio: metrics.interfaceImplRatio,
          },
        },
      });
      reported++;
    }

    // Generate project-wide summary if enough files score high
    const projectSummary = this.computeProjectSummary(fileMetrics);
    if (projectSummary.averageScore >= config.projectSummaryThreshold) {
      results.push({
        detectorId: this.id,
        severity: projectSummary.averageScore >= 60 ? 'warning' : 'info',
        category: this.category,
        messageKey: 'ai-over-engineering-score.project-summary',
        message: this.formatProjectReport(projectSummary),
        file: projectSummary.worstFile,
        line: 1,
        confidence: 0.75,
        metadata: {
          analysisType: 'ai-over-engineering-score-summary',
          projectScore: projectSummary.averageScore,
          summary: projectSummary,
        },
      });
    }

    return results;
  }

  // ─── Per-file Metrics Computation ──────────────────────────────

  private computeFileMetrics(fileUnit: CodeUnit, allUnits: CodeUnit[]): FileMetrics {
    const source = fileUnit.source!;

    // 1. Pattern Name Density
    const classDeclarations = this.extractClassDeclarations(source);
    const totalClasses = classDeclarations.length;
    const patternNameCount = classDeclarations.filter(c =>
      PATTERN_SUFFIXES.some(suffix => c.name.endsWith(suffix)),
    ).length;
    const patternNameDensity = totalClasses > 0 ? patternNameCount / totalClasses : 0;

    // 2. Single-Implementation Ratio
    const { abstracts, impls } = this.collectAbstractionInfo(source);
    const singleImplCount = this.countSingleImplementations(abstracts, impls);
    const singleImplRatio = abstracts.length > 0 ? singleImplCount / abstracts.length : 0;

    // 3. Abstraction Depth (config type nesting)
    const maxAbstractionDepth = this.measureMaxConfigNestingDepth(source);

    // 4. Generic Complexity
    const genericParamTotal = this.countGenericParameters(source);
    const genericComplexityScore = Math.min(1, genericParamTotal / 20);

    // 5. Decorator Density
    const { decoratorTotal, decoratorDeclCount } = this.countDecorators(source);
    const decoratorDensity = decoratorDeclCount > 0
      ? Math.min(1, decoratorTotal / decoratorDeclCount / 5)
      : 0;

    // 6. Interface-to-Implementation Ratio
    const interfaceCount = this.countInterfaces(source);
    const implementationCount = this.countImplementations(source);
    const interfaceImplRatio = implementationCount > 0
      ? Math.min(1, interfaceCount / implementationCount)
      : (interfaceCount > 0 ? 1 : 0);

    // Compute composite score
    const score = this.computeCompositeScore({
      patternNameDensity,
      singleImplRatio,
      maxAbstractionDepth,
      genericComplexityScore,
      decoratorDensity,
      interfaceImplRatio,
    });

    return {
      file: fileUnit.file,
      totalClasses,
      patternNameCount,
      patternNameDensity,
      singleImplCount,
      singleImplRatio,
      maxAbstractionDepth,
      genericParamTotal,
      genericComplexityScore,
      decoratorTotal,
      decoratorDeclCount,
      decoratorDensity,
      interfaceCount,
      implementationCount,
      interfaceImplRatio,
      score,
    };
  }

  // ─── Composite Score Calculation ───────────────────────────────

  /**
   * Weighted composite score: each metric contributes to the total.
   * Weights reflect how distinctive each pattern is of AI-generated code.
   *
   * - Pattern Name Density: 25% (strong AI signal)
   * - Single-Impl Ratio: 20% (AI loves unnecessary interfaces)
   * - Generic Complexity: 20% (AI loves multi-parameter generics)
   * - Interface-Impl Ratio: 15% (AI creates interfaces without need)
   * - Decorator Density: 10% (AI stacks decorators)
   * - Abstraction Depth: 10% (AI nests config types)
   */
  private computeCompositeScore(metrics: {
    patternNameDensity: number;
    singleImplRatio: number;
    maxAbstractionDepth: number;
    genericComplexityScore: number;
    decoratorDensity: number;
    interfaceImplRatio: number;
  }): number {
    // Normalize abstraction depth (0 depth = 0, depth 3+ = 1)
    const abstractionDepthNorm = Math.min(1, metrics.maxAbstractionDepth / 3);

    const raw =
      metrics.patternNameDensity * 0.25 +
      metrics.singleImplRatio * 0.20 +
      metrics.genericComplexityScore * 0.20 +
      metrics.interfaceImplRatio * 0.15 +
      metrics.decoratorDensity * 0.10 +
      abstractionDepthNorm * 0.10;

    // Scale to 0-100
    return Math.round(raw * 100);
  }

  // ─── Source Analysis Helpers ───────────────────────────────────

  private extractClassDeclarations(source: string): Array<{ name: string; line: number }> {
    const results: Array<{ name: string; line: number }> = [];
    const regex = /(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      const line = source.substring(0, match.index).split('\n').length;
      results.push({ name: match[1], line });
    }
    return results;
  }

  private collectAbstractionInfo(source: string): {
    abstracts: Array<{ name: string; line: number }>;
    impls: Map<string, Array<{ implName: string; line: number }>>;
  } {
    const abstracts: Array<{ name: string; line: number }> = [];
    const impls = new Map<string, Array<{ implName: string; line: number }>>();

    // Abstract classes
    const abstractRegex = /abstract\s+class\s+(\w+)/g;
    let match: RegExpExecArray | null;
    while ((match = abstractRegex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      const line = source.substring(0, match.index).split('\n').length;
      abstracts.push({ name: match[1], line });
    }

    // Interfaces
    const interfaceRegex = /interface\s+(\w+)\s*(?:extends\s+[\w,\s]+\s*)?\{/g;
    while ((match = interfaceRegex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      const line = source.substring(0, match.index).split('\n').length;
      abstracts.push({ name: match[1], line });
    }

    // extends/implements
    const extendsRegex = /class\s+(\w+)\s+(?:extends|implements)\s+(\w+)/g;
    while ((match = extendsRegex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      const implName = match[1];
      const parentName = match[2];
      const line = source.substring(0, match.index).split('\n').length;
      if (!impls.has(parentName)) impls.set(parentName, []);
      impls.get(parentName)!.push({ implName, line });
    }

    // implements (separate from extends)
    const implementsRegex = /class\s+(\w+)\s+\w+\s+implements\s+(\w+)/g;
    while ((match = implementsRegex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      const implName = match[1];
      const ifaceName = match[2];
      const line = source.substring(0, match.index).split('\n').length;
      if (!impls.has(ifaceName)) impls.set(ifaceName, []);
      impls.get(ifaceName)!.push({ implName, line });
    }

    return { abstracts, impls };
  }

  private countSingleImplementations(
    abstracts: Array<{ name: string; line: number }>,
    impls: Map<string, Array<{ implName: string; line: number }>>,
  ): number {
    let count = 0;
    for (const abs of abstracts) {
      const implList = impls.get(abs.name);
      if (!implList || implList.length === 1) count++;
    }
    return count;
  }

  private measureMaxConfigNestingDepth(source: string): number {
    const CONFIG_PATTERN = /(?:Config|Configuration|Options|Settings|Params|Props)$/i;
    const defRegex = /(?:interface|type)\s+(\w+(?:Config|Configuration|Options|Settings|Params|Props)\w*)\s*(?:=\s*)?(?:extends\s+(\w+)\s*)?\{([^}]*)\}/gi;

    const configTypes = new Map<string, string[]>();
    let match: RegExpExecArray | null;

    while ((match = defRegex.exec(source)) !== null) {
      const typeName = match[1];
      const body = match[3];
      const referencedTypes: string[] = [];

      const propTypeRegex = /:\s*(\w+(?:Config|Configuration|Options|Settings|Params|Props)\w*)/gi;
      let propMatch: RegExpExecArray | null;
      while ((propMatch = propTypeRegex.exec(body)) !== null) {
        referencedTypes.push(propMatch[1]);
      }

      configTypes.set(typeName, referencedTypes);
    }

    let maxDepth = 0;
    const depthCache = new Map<string, number>();

    const getDepth = (name: string, visited: Set<string>): number => {
      if (depthCache.has(name)) return depthCache.get(name)!;
      if (visited.has(name)) return 0;
      visited.add(name);

      const refs = configTypes.get(name);
      if (!refs || refs.length === 0) {
        depthCache.set(name, 0);
        return 0;
      }

      let max = 0;
      for (const ref of refs) {
        max = Math.max(max, getDepth(ref, visited) + 1);
      }
      depthCache.set(name, max);
      return max;
    };

    for (const [name] of configTypes) {
      maxDepth = Math.max(maxDepth, getDepth(name, new Set()));
    }

    return maxDepth;
  }

  private countGenericParameters(source: string): number {
    let total = 0;
    const regex = /(?:function|class|interface|type)\s+\w+\s*<([^>]+)>/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      total += this.countParams(match[1]);
    }

    return total;
  }

  private countParams(genericsStr: string): number {
    let depth = 0;
    let count = 1;
    for (const ch of genericsStr) {
      if (ch === '<' || ch === '(') depth++;
      else if (ch === '>' || ch === ')') depth--;
      else if (ch === ',' && depth === 0) count++;
    }
    return count;
  }

  private countDecorators(source: string): { decoratorTotal: number; decoratorDeclCount: number } {
    const lines = source.split('\n');
    let decoratorTotal = 0;
    let decoratorDeclCount = 0;
    let currentChain = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      const isDecorator = /^@\w+/.test(trimmed) &&
        !/^@(?:param|returns?|type|typedef|template|see|throws|deprecated|example|override)\b/.test(trimmed);

      if (isDecorator) {
        currentChain++;
      } else if (trimmed.length > 0) {
        if (currentChain > 0) {
          decoratorTotal += currentChain;
          decoratorDeclCount++;
        }
        currentChain = 0;
      }
    }
    // Handle trailing chain
    if (currentChain > 0) {
      decoratorTotal += currentChain;
      decoratorDeclCount++;
    }

    return { decoratorTotal, decoratorDeclCount };
  }

  private countInterfaces(source: string): number {
    let count = 0;
    const regex = /(?:export\s+)?interface\s+(\w+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      count++;
    }
    return count;
  }

  private countImplementations(source: string): number {
    let count = 0;
    const regex = /class\s+\w+\s+(?:extends\s+\w+\s+)?implements\s+/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      count++;
    }
    // Also count extends
    const extendsRegex = /class\s+\w+\s+extends\s+/g;
    while ((match = extendsRegex.exec(source)) !== null) {
      if (this.isInComment(source, match.index)) continue;
      count++;
    }
    return count;
  }

  private isInComment(source: string, position: number): boolean {
    const lineStart = source.lastIndexOf('\n', position - 1) + 1;
    const linePrefix = source.substring(lineStart, position).trim();
    return linePrefix.startsWith('//') || linePrefix.startsWith('#') || linePrefix.startsWith('*');
  }

  // ─── Report Formatting ─────────────────────────────────────────

  private formatFileReport(m: FileMetrics): string {
    const parts: string[] = [
      `AI Over-engineering Score: ${m.score}/100 for ${m.file}`,
    ];

    if (m.patternNameCount > 0) {
      parts.push(`Design pattern name density: ${(m.patternNameDensity * 100).toFixed(0)}% (${m.patternNameCount}/${m.totalClasses} classes)`);
    }
    if (m.singleImplCount > 0) {
      parts.push(`Single-implementation abstractions: ${m.singleImplCount}`);
    }
    if (m.genericParamTotal > 0) {
      parts.push(`Generic type parameters: ${m.genericParamTotal}`);
    }
    if (m.decoratorTotal > 0) {
      parts.push(`Decorators: ${m.decoratorTotal} on ${m.decoratorDeclCount} declarations`);
    }
    if (m.interfaceCount > 0) {
      parts.push(`Interfaces: ${m.interfaceCount}, Implementations: ${m.implementationCount}`);
    }
    if (m.maxAbstractionDepth > 0) {
      parts.push(`Config nesting depth: ${m.maxAbstractionDepth}`);
    }

    parts.push('AI-generated code tends to create unnecessary abstractions, design pattern classes, and deep type hierarchies.');

    return parts.join('. ');
  }

  private formatProjectReport(summary: ProjectSummary): string {
    const parts = [
      `Project AI Over-engineering Score: ${summary.averageScore}/100 (avg across ${summary.scoredFiles} files)`,
      `Worst file: ${summary.worstFile} (${summary.maxScore}/100)`,
      `Total: ${summary.metrics.totalPatternNames} pattern-named classes, ${summary.metrics.totalSingleImpls} single-impl abstractions, ${summary.metrics.totalGenericParams} generic params, ${summary.metrics.totalInterfaces} interfaces/${summary.metrics.totalImplementations} implementations`,
      'Consider simplifying abstractions and removing unnecessary design pattern indirection.',
    ];
    return parts.join('. ');
  }

  // ─── Project Summary ──────────────────────────────────────────

  private computeProjectSummary(fileMetrics: FileMetrics[]): ProjectSummary {
    const scored = fileMetrics.filter(m => m.totalClasses > 0 || m.interfaceCount > 0);
    const scores = scored.map(m => m.score);

    return {
      totalFiles: fileMetrics.length,
      scoredFiles: scored.length,
      averageScore: scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
      worstFile: scored.length > 0
        ? scored.reduce((a, b) => a.score > b.score ? a : b).file
        : '',
      metrics: {
        totalPatternNames: fileMetrics.reduce((a, m) => a + m.patternNameCount, 0),
        totalSingleImpls: fileMetrics.reduce((a, m) => a + m.singleImplCount, 0),
        totalGenericParams: fileMetrics.reduce((a, m) => a + m.genericParamTotal, 0),
        totalDecorators: fileMetrics.reduce((a, m) => a + m.decoratorTotal, 0),
        totalInterfaces: fileMetrics.reduce((a, m) => a + m.interfaceCount, 0),
        totalImplementations: fileMetrics.reduce((a, m) => a + m.implementationCount, 0),
      },
    };
  }

  // ─── Config Helpers ───────────────────────────────────────────

  private getEffectiveConfig(context: DetectorContext): AIOverEngineeringConfig {
    const config = context.config?.['ai-over-engineering-score'] as Partial<AIOverEngineeringConfig> | undefined;
    if (!config) return this.config;
    return { ...this.config, ...config };
  }
}
