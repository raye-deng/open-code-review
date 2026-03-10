/**
 * AI Code Validator V3 — Unified Type Definitions
 *
 * Core types shared across all modules: detectors, scoring engine,
 * SLA framework, config system, and language adapters.
 *
 * @since 0.3.0
 */

// ─── AI Defect Categories ──────────────────────────────────────────

/**
 * Classification of AI-specific defect patterns.
 * These categories represent issues unique to AI-generated code
 * that traditional linters typically don't cover.
 */
export enum AIDefectCategory {
  /** AI references non-existent packages, APIs, or methods */
  HALLUCINATION = 'hallucination',
  /** AI uses outdated/deprecated APIs from training data */
  STALE_KNOWLEDGE = 'stale-knowledge',
  /** AI loses context across long outputs, causing inconsistencies */
  CONTEXT_LOSS = 'context-loss',
  /** AI generates code with security vulnerabilities */
  SECURITY_ANTIPATTERN = 'security',
  /** AI over-engineers solutions with unnecessary complexity */
  OVER_ENGINEERING = 'over-engineering',
  /** AI leaves incomplete implementations (TODO, stubs, empty catch) */
  INCOMPLETE_IMPL = 'incomplete',
  /** AI generates type-unsafe code (excessive any, unsafe casts) */
  TYPE_SAFETY = 'type-safety',
  /** AI generates code with missing/incorrect error handling */
  ERROR_HANDLING = 'error-handling',
  /** AI duplicates logic that should be extracted */
  DUPLICATION = 'duplication',
  /** AI leaks training data patterns (license headers, example code) */
  TRAINING_LEAK = 'training-leak',
}

// ─── Severity ──────────────────────────────────────────────────────

/** Severity levels for detected issues, from most to least critical */
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/** Deduction points per severity level */
export const SEVERITY_DEDUCTIONS: Record<Severity, number> = {
  critical: 15,
  high: 10,
  medium: 5,
  low: 2,
  info: 0,
} as const;

// ─── Unified Issue ─────────────────────────────────────────────────

/**
 * Unified Issue format — standard output for ALL detectors.
 * Every detected problem is represented as a UnifiedIssue.
 */
export interface UnifiedIssue {
  /** Unique issue ID (e.g. "hallucination:1") */
  id: string;
  /** Name of the detector that found this issue */
  detector: string;
  /** Issue sub-type (e.g. "phantom-package", "empty-catch") */
  type?: string;
  /** AI defect category */
  category: AIDefectCategory;
  /** Severity level */
  severity: Severity;
  /** Human-readable description */
  message: string;
  /** File path */
  file: string;
  /** Line number (1-based) */
  line: number;
  /** Column number (1-based, optional) */
  column?: number;
  /** End line (optional, for range) */
  endLine?: number;
  /** End column (optional, for range) */
  endColumn?: number;
  /** Source code snippet around the issue */
  source?: string;
  /** Suggested fix description */
  suggestion?: string;
  /** Structured fix info */
  fix?: {
    description: string;
    autoFixable: boolean;
  };
  /** Attribution: root cause and frequency */
  attribution?: {
    rootCause: string;
    frequency: 'common' | 'occasional' | 'rare';
  };
  /** Reference links */
  references?: string[] | { urls: string[]; cweId?: string };
  /** Whether auto-fixable */
  autoFixable?: boolean;
  /** Effort to fix */
  fixEffort?: 'trivial' | 'small' | 'medium' | 'large';
  /** Detection confidence (0.0-1.0) */
  confidence?: number;
  /** Detection source */
  detectionSource?: 'static' | 'ai' | 'both';
}

// ─── Detector Interface ────────────────────────────────────────────

/** Result of a detector run on a single file */
export interface DetectorResult {
  detector: string;
  file: string;
  issues: UnifiedIssue[];
  durationMs: number;
}

/** Context passed to detectors during analysis */
export interface AnalysisContext {
  projectRoot: string;
  config: import('./config/types.js').AICVConfig;
  astCache: Map<string, unknown>;
  registryCache: Map<string, { exists: boolean; checkedAt: number }>;
}

/**
 * Unified Detector interface — all V3 detectors implement this.
 *
 * Tiers:
 *   1 = Fast (regex/AST, <0.5s/100 files) — always enabled
 *   2 = Deep (type-aware, <5s/100 files) — default enabled
 *   3 = AI (LLM analysis) — opt-in with --ai flag
 *
 * Detectors may implement either or both:
 *   - detect(files): simplified batch interface (Worker A pattern)
 *   - analyze(filePath, source, ctx): per-file with context (Architecture doc pattern)
 */
export interface Detector {
  /** Detector identifier */
  readonly name: string;
  /** Semantic version */
  readonly version: string;
  /** Execution tier: 1=fast, 2=deep, 3=AI */
  readonly tier: 1 | 2 | 3;

  /**
   * Batch detection on multiple files.
   * @param files Array of file analysis inputs
   * @returns Array of unified issues found
   */
  detect(files: FileAnalysis[]): Promise<UnifiedIssue[]>;
}

// ─── File Analysis Input ───────────────────────────────────────────

/** Supported language identifiers */
export type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'java' | 'go' | 'kotlin';

/**
 * Input for detector analysis — represents a single file to be analyzed.
 * The `ast` field is optional and populated by the LanguageAdapter if available.
 */
export interface FileAnalysis {
  /** Absolute or relative file path */
  path: string;
  /** Full file content */
  content: string;
  /** Programming language identifier */
  language: SupportedLanguage | string;
  /** Parsed AST (language-specific, populated by LanguageAdapter) */
  ast?: unknown;
}

// ─── Scoring Types ─────────────────────────────────────────────────

/** Grade levels for V3 scoring */
export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

/** Scoring dimension identifier */
export type ScoringDimensionId =
  | 'aiFaithfulness'
  | 'codeFreshness'
  | 'contextCoherence'
  | 'implementationQuality';

/** V3 scoring dimension names (short form) */
export type ScoringDimension = 'faithfulness' | 'freshness' | 'coherence' | 'quality';

/** Scoring dimension configuration */
export interface ScoringDimensionConfig {
  weight: number;
  name: string;
}

/** V3 scoring dimension weights (must sum to 100) */
export const SCORING_WEIGHTS: Record<ScoringDimension, number> = {
  faithfulness: 35,
  freshness: 25,
  coherence: 20,
  quality: 20,
} as const;

/**
 * Maps each AIDefectCategory to its primary scoring dimension.
 * Used by the scoring engine to route issues to the correct dimension.
 */
export const CATEGORY_DIMENSION_MAP: Record<AIDefectCategory, ScoringDimension> = {
  [AIDefectCategory.HALLUCINATION]: 'faithfulness',
  [AIDefectCategory.STALE_KNOWLEDGE]: 'freshness',
  [AIDefectCategory.CONTEXT_LOSS]: 'coherence',
  [AIDefectCategory.SECURITY_ANTIPATTERN]: 'faithfulness',
  [AIDefectCategory.OVER_ENGINEERING]: 'quality',
  [AIDefectCategory.INCOMPLETE_IMPL]: 'quality',
  [AIDefectCategory.TYPE_SAFETY]: 'quality',
  [AIDefectCategory.ERROR_HANDLING]: 'quality',
  [AIDefectCategory.DUPLICATION]: 'quality',
  [AIDefectCategory.TRAINING_LEAK]: 'faithfulness',
} as const;
