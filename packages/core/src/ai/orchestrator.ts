/**
 * AI Orchestrator
 *
 * Manages multiple AI providers and executes analysis according to
 * the configured strategy (local-first, remote-first, etc.).
 *
 * Also provides result fusion — merging static analysis issues
 * with AI-detected issues, deduplicating by file+line+category.
 *
 * @since 0.3.0
 */

import type {
  AIProvider,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIStrategy,
} from './types.js';
import type { UnifiedIssue, Severity } from '../types.js';
import type { AIConfig } from '../config/types.js';
import { OllamaProvider } from './ollama-provider.js';
import { OpenAIProvider } from './openai-provider.js';
import { AnthropicProvider } from './anthropic-provider.js';

// ─── Severity ordering for comparison ──────────────────────────────

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

// ─── AI Orchestrator ───────────────────────────────────────────────

export class AIOrchestrator {
  private providers: AIProvider[] = [];
  private strategy: AIStrategy;

  constructor(config?: AIConfig, strategy?: AIStrategy) {
    this.strategy = strategy || config?.strategy || 'local-first';
    this.initProviders(config);
  }

  /**
   * Initialize providers based on configuration.
   */
  private initProviders(config?: AIConfig): void {
    // Local provider (Ollama)
    if (config?.local?.enabled !== false) {
      this.providers.push(
        new OllamaProvider({
          endpoint: config?.local?.endpoint,
          model: config?.local?.model,
        }),
      );
    }

    // Remote provider (OpenAI or Anthropic)
    if (config?.remote?.enabled) {
      const provider = config.remote.provider || 'openai';

      if (provider === 'anthropic') {
        this.providers.push(
          new AnthropicProvider({
            apiKey: config.remote.apiKey,
            model: config.remote.model,
          }),
        );
      } else {
        // Default to OpenAI-compatible
        this.providers.push(
          new OpenAIProvider({
            apiKey: config.remote.apiKey,
            model: config.remote.model,
          }),
        );
      }
    }
  }

  /**
   * Get the list of configured providers (for testing/inspection).
   */
  getProviders(): readonly AIProvider[] {
    return this.providers;
  }

  /**
   * Get the current strategy.
   */
  getStrategy(): AIStrategy {
    return this.strategy;
  }

  /**
   * Execute AI analysis according to the configured strategy.
   *
   * @returns Analysis response, or null if no provider could complete
   */
  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse | null> {
    switch (this.strategy) {
      case 'local-first':
        return this.tryWithFallback(request, 'local', 'remote');

      case 'remote-first':
        return this.tryWithFallback(request, 'remote', 'local');

      case 'local-only':
        return this.tryProvidersByType(request, 'local');

      case 'remote-only':
        return this.tryProvidersByType(request, 'remote');

      default:
        return this.tryWithFallback(request, 'local', 'remote');
    }
  }

  /**
   * Try providers of the primary type first, falling back to secondary type.
   */
  private async tryWithFallback(
    request: AIAnalysisRequest,
    primaryType: 'local' | 'remote',
    fallbackType: 'local' | 'remote',
  ): Promise<AIAnalysisResponse | null> {
    // Try primary type
    const primaryResult = await this.tryProvidersByType(request, primaryType);
    if (primaryResult) return primaryResult;

    // Fallback to secondary type
    return this.tryProvidersByType(request, fallbackType);
  }

  /**
   * Try all providers of a given type until one succeeds.
   */
  private async tryProvidersByType(
    request: AIAnalysisRequest,
    type: 'local' | 'remote',
  ): Promise<AIAnalysisResponse | null> {
    const candidates = this.providers.filter((p) => p.type === type);

    for (const provider of candidates) {
      try {
        const available = await provider.isAvailable();
        if (!available) continue;

        return await provider.analyze(request);
      } catch {
        // Provider failed, try next
        continue;
      }
    }

    return null;
  }

  // ─── Result Fusion (Static Method) ──────────────────────────────

  /**
   * Merge static analysis issues with AI-detected issues.
   *
   * Deduplication rules:
   * - Same file + line (±3) + category → keep the one with higher severity
   * - Static issues get detectionSource: 'static'
   * - AI issues get detectionSource: 'ai'
   * - Duplicates confirmed by both get detectionSource: 'both'
   *
   * @param staticIssues - Issues from static detectors (Tier 1/2)
   * @param aiIssues - Issues from AI analysis (Tier 3)
   * @returns Merged and deduplicated issue list
   */
  static mergeResults(
    staticIssues: UnifiedIssue[],
    aiIssues: UnifiedIssue[],
  ): UnifiedIssue[] {
    // Mark sources
    const markedStatic = staticIssues.map((issue) => ({
      ...issue,
      detectionSource: (issue.detectionSource || 'static') as 'static' | 'ai' | 'both',
    }));

    const markedAI = aiIssues.map((issue) => ({
      ...issue,
      detectionSource: (issue.detectionSource || 'ai') as 'static' | 'ai' | 'both',
    }));

    const result: UnifiedIssue[] = [...markedStatic];
    const usedStaticIndices = new Set<number>();

    for (const aiIssue of markedAI) {
      // Check for duplicates in static issues
      const duplicateIndex = result.findIndex(
        (staticIssue, idx) =>
          !usedStaticIndices.has(idx) &&
          staticIssue.file === aiIssue.file &&
          Math.abs(staticIssue.line - aiIssue.line) <= 3 &&
          staticIssue.category === aiIssue.category,
      );

      if (duplicateIndex >= 0) {
        // Merge: keep the one with higher severity, mark as 'both'
        usedStaticIndices.add(duplicateIndex);
        const existing = result[duplicateIndex];
        const existingSev = SEVERITY_ORDER[existing.severity] || 0;
        const aiSev = SEVERITY_ORDER[aiIssue.severity] || 0;

        if (aiSev > existingSev) {
          // AI found higher severity — use AI issue but mark as both
          result[duplicateIndex] = {
            ...aiIssue,
            detectionSource: 'both',
            confidence: Math.min(1.0, (existing.confidence || 0.9) * 1.05),
          };
        } else {
          // Static found equal or higher — keep static but mark as both
          result[duplicateIndex] = {
            ...existing,
            detectionSource: 'both',
            confidence: Math.min(1.0, (existing.confidence || 0.9) * 1.05),
          };
        }
      } else {
        // New issue from AI — apply confidence discount
        result.push({
          ...aiIssue,
          confidence: (aiIssue.confidence || 0.7) * 0.8,
        });
      }
    }

    // Filter out very low confidence issues
    return result.filter((issue) => (issue.confidence || 1.0) >= 0.3);
  }
}
