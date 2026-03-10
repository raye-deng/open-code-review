/**
 * @open-code-review/core
 *
 * Core detection engine for AI-generated code quality validation.
 *
 * V3: Unified type system, multi-language support, all detectors implement
 * the Detector interface with standardized UnifiedIssue output.
 *
 * @example
 * ```ts
 * import {
 *   HallucinationDetector,
 *   LogicGapDetector,
 *   DuplicationDetector,
 *   ContextBreakDetector,
 *   ScoringEngine,
 *   LanguageRegistry,
 *   TypeScriptAdapter,
 *   type UnifiedIssue,
 *   type Detector,
 *   type FileAnalysis,
 *   AIDefectCategory,
 * } from '@open-code-review/core';
 *
 * // Register language adapter
 * const registry = LanguageRegistry.getInstance();
 * registry.register(new TypeScriptAdapter());
 *
 * // Create detectors (all implement Detector interface)
 * const detectors: Detector[] = [
 *   new HallucinationDetector({ projectRoot: '.' }),
 *   new LogicGapDetector(),
 *   new DuplicationDetector(),
 *   new ContextBreakDetector(),
 * ];
 *
 * // Prepare files
 * const files: FileAnalysis[] = [{
 *   path: './src/app.ts',
 *   content: source,
 *   language: 'typescript',
 * }];
 *
 * // Run all detectors
 * const allIssues: UnifiedIssue[] = [];
 * for (const detector of detectors) {
 *   allIssues.push(...await detector.detect(files));
 * }
 *
 * // Score
 * const engine = new ScoringEngine(70);
 * const score = engine.scoreFile('./src/app.ts', null, null, null, null);
 * ```
 */

// ─── V3 Unified Types ───

export {
  AIDefectCategory,
  SEVERITY_DEDUCTIONS,
  SCORING_WEIGHTS,
  CATEGORY_DIMENSION_MAP,
} from './types.js';

export type {
  Severity,
  UnifiedIssue,
  Detector,
  FileAnalysis,
  SupportedLanguage,
  Grade,
  ScoringDimension,
} from './types.js';

// ─── Multi-Language Support ───

export { LanguageRegistry } from './languages/index.js';
export { TypeScriptAdapter } from './languages/index.js';
export { KotlinAdapter, KOTLIN_STDLIB_PACKAGES, KOTLIN_COMMON_PACKAGES } from './languages/index.js';
export type {
  LanguageAdapter,
  ASTNode,
  ImportInfo,
  CallInfo,
  PackageVerifyResult,
  DeprecatedInfo,
  ComplexityMetrics,
} from './languages/index.js';

// ─── Detectors ───

export { HallucinationDetector } from './detectors/hallucination.js';
/** @deprecated Use UnifiedIssue instead */
export type { HallucinationIssue, HallucinationResult, HallucinationDetectorOptions } from './detectors/hallucination.js';

export { LogicGapDetector } from './detectors/logic-gap.js';
/** @deprecated Use UnifiedIssue instead */
export type { LogicGapIssue, LogicGapResult } from './detectors/logic-gap.js';

export { DuplicationDetector } from './detectors/duplication.js';
/** @deprecated Use UnifiedIssue instead */
export type { DuplicationIssue, DuplicationResult } from './detectors/duplication.js';

export { ContextBreakDetector } from './detectors/context-break.js';
/** @deprecated Use UnifiedIssue instead */
export type { ContextBreakIssue, ContextBreakResult } from './detectors/context-break.js';

// ─── Scorer ───

export { ScoringEngine } from './scorer/scoring-engine.js';
export type { FileScore, AggregateScore, DimensionScore } from './scorer/scoring-engine.js';

// ─── Report (legacy) ───

export { ReportGenerator } from './scorer/report.js';
export type { ReportFormat } from './scorer/report.js';

// ─── Reporter (V3) ───

export { generateReport, generateHTML, generateSARIF, generateMarkdown, generateTerminal } from './reporter/index.js';
export type { ReportFormat as ReportFormatV3, ReportOptions, ReportData } from './reporter/index.js';

// ─── AI Analysis (Tier 3) ───

export {
  AIOrchestrator,
  OllamaProvider,
  OpenAIProvider,
  AnthropicProvider,
  buildAnalysisPrompt,
  mapRawCategory,
  mapRawSeverity,
} from './ai/index.js';

export type {
  AIProvider,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIStrategy,
  AIRawIssue,
} from './ai/index.js';

export { AIDetector } from './detectors/ai-detector.js';

// ─── AI Healer ───

export { PromptBuilder } from './ai-healer/prompt-builder.js';
export type { FixPrompt } from './ai-healer/prompt-builder.js';

// ─── Registry (V4) ───

export {
  RegistryCache,
  NpmRegistry,
  PyPIRegistry,
  MavenRegistry,
  GoProxyRegistry,
  RegistryManager,
  NODE_BUILTINS,
  PYTHON_BUILTINS,
  JAVA_BUILTINS,
  GO_BUILTINS,
  KOTLIN_BUILTINS,
} from './registry/index.js';

export type {
  PackageRegistry,
  PackageVerifyResult as RegistryVerifyResult,
  DeprecationInfo,
  RegistryConfig,
  RegistryOptions,
  CacheEntry,
} from './registry/index.js';

// ─── License ───

export { generateLicenseKey, isValidLicenseFormat, LicenseValidator } from './license/index.js';
export type {
  LicenseInfo,
  LicenseValidationResult,
  LicenseCacheEntry,
  LicenseResolveOptions,
  LicenseValidatorOptions,
} from './license/index.js';

// ─── V4: Unified IR ───

export type {
  CodeUnit,
  CodeUnitKind,
  SupportedLanguageV4,
  SourceLocation,
  ImportInfoV4,
  CallInfoV4,
  ComplexityMetricsV4,
  SymbolDef,
  SymbolRef,
} from './ir/index.js';

export { createCodeUnit, emptyComplexity } from './ir/index.js';

// ─── V4: Parser ───

export { ParserManager } from './parser/index.js';
export type { LanguageExtractor } from './parser/index.js';
export { TypeScriptExtractor } from './parser/index.js';
export { PythonExtractor } from './parser/index.js';
export { JavaExtractor } from './parser/index.js';
export { GoExtractor } from './parser/index.js';
export { KotlinExtractor } from './parser/index.js';

// ─── V4: Detectors ───

export {
  HallucinatedImportDetector,
  StaleAPIDetector,
  ContextCoherenceDetector,
  OverEngineeringDetector,
  SecurityPatternDetector,
  createV4Detectors,
} from './detectors/v4/index.js';

export type {
  V4Detector,
  V4DetectorResult,
  DetectorCategory,
  DetectorContext,
} from './detectors/v4/index.js';
