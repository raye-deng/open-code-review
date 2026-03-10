/**
 * AI Provider Type Definitions
 *
 * Defines the abstraction layer for AI-powered code analysis.
 * Supports both local (Ollama) and remote (OpenAI, Anthropic) providers.
 *
 * @since 0.3.0
 */

import type { UnifiedIssue } from '../types.js';

// ─── AI Provider Interface ────────────────────────────────────────

/**
 * Abstract AI provider interface.
 * All AI backends (Ollama, OpenAI, Anthropic) implement this.
 */
export interface AIProvider {
  /** Provider identifier (e.g. 'ollama', 'openai', 'anthropic') */
  readonly name: string;

  /** Provider type: local runs on user's machine, remote calls cloud API */
  readonly type: 'local' | 'remote';

  /** Check if this provider is available and ready to use */
  isAvailable(): Promise<boolean>;

  /** Analyze code files and return detected issues */
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
}

// ─── Request / Response ────────────────────────────────────────────

/**
 * Input for AI analysis — a set of files to review.
 */
export interface AIAnalysisRequest {
  /** Files to analyze */
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;

  /** Extra context (e.g. package.json content, tsconfig) */
  context?: string;

  /** Analysis mode: quick for L2, deep for L3 */
  mode: 'quick' | 'deep';
}

/**
 * Output from AI analysis.
 */
export interface AIAnalysisResponse {
  /** Detected issues in UnifiedIssue format */
  issues: UnifiedIssue[];

  /** Model used for analysis (e.g. 'codellama:13b', 'gpt-4o-mini') */
  model: string;

  /** Approximate tokens consumed */
  tokensUsed: number;

  /** Wall-clock duration in milliseconds */
  durationMs: number;

  /** Provider name */
  provider: string;
}

// ─── Strategy ──────────────────────────────────────────────────────

/**
 * Strategy for selecting which AI provider(s) to use.
 *
 * - local-first: try local provider, fallback to remote on failure
 * - remote-first: try remote provider, fallback to local on failure
 * - local-only: only use local provider, no fallback
 * - remote-only: only use remote provider, no fallback
 */
export type AIStrategy = 'local-first' | 'remote-first' | 'local-only' | 'remote-only';

// ─── AI Raw Issue (from LLM JSON output) ──────────────────────────

/**
 * Raw issue structure returned by LLM in JSON output.
 * Parsed from the AI response and converted to UnifiedIssue.
 */
export interface AIRawIssue {
  file: string;
  line: number;
  category: string;
  severity: string;
  message: string;
  fix?: string;
}
