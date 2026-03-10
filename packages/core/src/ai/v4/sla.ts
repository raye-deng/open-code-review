/**
 * SLA Router — Maps SLA levels to pipeline configuration.
 *
 * SLA (Service Level Agreement) levels control the depth and cost
 * of the AI scan pipeline:
 *
 * - L1 Fast: Structural detectors only (no AI) — ~10s/100 files
 * - L2 Standard: + Embedding recall + Local LLM — ~30s/100 files
 * - L3 Deep: + Remote LLM — ~120s/100 files
 *
 * @since 0.4.0
 */

import type { AIConfig, SLALevel } from './types.js';
import { AIScanPipeline } from './pipeline.js';

// ─── SLA Descriptions ──────────────────────────────────────────────

/**
 * Human-readable descriptions for each SLA level.
 */
export const SLA_DESCRIPTIONS: Record<
  SLALevel,
  { name: string; maxTime: string; ai: string }
> = {
  L1: {
    name: 'Fast',
    maxTime: '10s/100 files',
    ai: 'None (structural only)',
  },
  L2: {
    name: 'Standard',
    maxTime: '30s/100 files',
    ai: 'Embedding + Local LLM',
  },
  L3: {
    name: 'Deep',
    maxTime: '120s/100 files',
    ai: 'Embedding + Remote LLM',
  },
};

// ─── Default Configs by SLA ────────────────────────────────────────

/**
 * Default configurations for each SLA level.
 * These can be overridden by user configuration.
 */
export const DEFAULT_SLA_CONFIGS: Record<SLALevel, Partial<AIConfig>> = {
  L1: {
    sla: 'L1',
    maxLLMBlocks: 0,
    similarityThreshold: 0,
  },
  L2: {
    sla: 'L2',
    embedding: { provider: 'local' },
    local: { provider: 'ollama', model: 'codellama:13b' },
    maxLLMBlocks: 20,
    similarityThreshold: 0.7,
  },
  L3: {
    sla: 'L3',
    embedding: { provider: 'openai' },
    remote: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: '',
    },
    maxLLMBlocks: 30,
    similarityThreshold: 0.65, // Lower threshold for L3 since LLM will verify
  },
};

// ─── Factory Functions ─────────────────────────────────────────────

/**
 * Create an AI scan pipeline for the specified SLA level.
 *
 * @param sla SLA level (L1, L2, or L3)
 * @param configOverride Override configuration (merged with defaults)
 * @returns Configured AIScanPipeline instance
 *
 * @example
 * ```ts
 * const pipeline = createPipelineForSLA('L2', {
 *   local: { provider: 'ollama', model: 'deepseek-coder:6.7b' }
 * });
 * const result = await pipeline.scan(units, structuralResults);
 * ```
 */
export function createPipelineForSLA(
  sla: SLALevel,
  configOverride?: Partial<AIConfig>,
): AIScanPipeline {
  const defaultConfig = DEFAULT_SLA_CONFIGS[sla];

  // Merge defaults with overrides
  const config: AIConfig = {
    ...defaultConfig,
    ...configOverride,
    sla, // Always use the specified SLA level
  } as AIConfig;

  return new AIScanPipeline(config);
}

/**
 * Get recommended SLA level based on available resources.
 *
 * Returns:
 * - L3 if remote API key is configured
 * - L2 if Ollama is available
 * - L1 otherwise
 */
export function getRecommendedSLA(config?: Partial<AIConfig>): SLALevel {
  // If remote API is configured, prefer L3
  if (config?.remote?.apiKey) {
    return 'L3';
  }

  // If local LLM is configured, use L2
  if (config?.local) {
    return 'L2';
  }

  // Default to L1 (fast, no AI required)
  return 'L1';
}

/**
 * Validate that a configuration is valid for the specified SLA level.
 *
 * @returns Object with valid flag and any error messages
 */
export function validateSLAConfig(
  sla: SLALevel,
  config?: Partial<AIConfig>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (sla === 'L2') {
    if (!config?.local?.model) {
      errors.push('L2 requires local.model to be specified');
    }
  }

  if (sla === 'L3') {
    if (!config?.remote?.apiKey) {
      errors.push('L3 requires remote.apiKey to be specified');
    }
    if (!config?.remote?.model) {
      errors.push('L3 requires remote.model to be specified');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
