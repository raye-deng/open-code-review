/**
 * Open Code Review V4 — AI Pipeline Types
 *
 * Type definitions for the two-stage AI scan pipeline:
 * - Stage 1 (Embedding): Fast similarity-based defect detection
 * - Stage 2 (LLM): Deep analysis of suspicious code blocks
 *
 * SLA levels control which stages run:
 * - L1 Fast: Structural detectors only (no AI)
 * - L2 Standard: + Embedding recall + Local LLM (Ollama)
 * - L3 Deep: + Remote LLM (OpenAI/Claude)
 *
 * @since 0.4.0
 */

import type { DetectorResult } from '../../detectors/v4/types.js';

// ─── SLA Level ─────────────────────────────────────────────────────

/** Service Level Agreement — controls pipeline depth and cost */
export type SLALevel = 'L1' | 'L2' | 'L3';

// ─── Embedding Provider ────────────────────────────────────────────

/**
 * Embedding provider interface.
 * Generates vector embeddings from text for similarity comparison.
 */
export interface EmbeddingProvider {
  /** Provider name (e.g. 'local-tfidf', 'openai') */
  readonly name: string;

  /** Embedding vector dimension */
  readonly dimension: number;

  /** Generate embeddings for a batch of text chunks */
  embed(texts: string[]): Promise<number[][]>;
}

// ─── LLM Provider ──────────────────────────────────────────────────

/**
 * LLM provider interface.
 * Sends prompts to a language model and returns structured responses.
 */
export interface LLMProvider {
  /** Provider name (e.g. 'ollama', 'openai', 'anthropic') */
  readonly name: string;

  /** Send a prompt and get a completion */
  complete(prompt: string, options?: LLMOptions): Promise<LLMResponse>;

  /** Check if this provider is available and configured */
  isAvailable(): Promise<boolean>;
}

/** Options for LLM completion requests */
export interface LLMOptions {
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Sampling temperature (0 = deterministic, 1 = creative) */
  temperature?: number;
  /** System prompt for the model */
  system?: string;
}

/** Response from an LLM completion request */
export interface LLMResponse {
  /** Generated text content */
  content: string;
  /** Token usage statistics */
  usage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  /** Response latency in milliseconds */
  latencyMs: number;
}

// ─── AI Config ─────────────────────────────────────────────────────

/**
 * Configuration for the AI scan pipeline.
 * Controls which stages run and how they're configured.
 */
export interface AIConfig {
  /** SLA level determines which stages run */
  sla: SLALevel;

  /** Embedding provider configuration */
  embedding?: {
    provider: 'local' | 'openai' | 'ollama';
    model?: string;
    baseUrl?: string;
  };

  /** Local LLM configuration (Ollama) */
  local?: {
    provider: 'ollama';
    model: string;
    baseUrl?: string; // default: http://localhost:11434
  };

  /** Remote LLM configuration (OpenAI / Anthropic) */
  remote?: {
    provider: 'openai' | 'anthropic';
    model: string;
    apiKey: string;
    baseUrl?: string;
  };

  /** Maximum code blocks to send to LLM stage (default: 20) */
  maxLLMBlocks?: number;

  /** Embedding similarity threshold for flagging blocks (default: 0.7) */
  similarityThreshold?: number;
}

// ─── Scan Stage Result ─────────────────────────────────────────────

/** Result from a single scan stage */
export interface ScanStageResult {
  /** Which stage produced these results */
  stage: 'structural' | 'embedding' | 'llm';
  /** Issues detected in this stage */
  issues: DetectorResult[];
  /** Time taken in milliseconds */
  durationMs: number;
  /** Tokens consumed (LLM stages only) */
  tokensUsed?: number;
}

// ─── AI Pipeline Result ────────────────────────────────────────────

/** Aggregate result from all pipeline stages */
export interface AIPipelineResult {
  /** Results from each stage that ran */
  stages: ScanStageResult[];
  /** Total issues across all stages */
  totalIssues: number;
  /** Total time across all stages in milliseconds */
  totalDurationMs: number;
  /** SLA level that was used */
  slaLevel: SLALevel;
}
