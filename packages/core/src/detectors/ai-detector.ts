/**
 * AI Detector (Tier 3)
 *
 * A special detector that delegates code analysis to AI providers
 * (Ollama, OpenAI, Anthropic) via the AIOrchestrator.
 *
 * This detector is opt-in (activated with --ai flag) and runs after
 * static analysis (Tier 1/2) is complete.
 *
 * Implements the unified Detector interface.
 *
 * @since 0.3.0
 */

import type { Detector, UnifiedIssue, FileAnalysis } from '../types.js';
import type { AIConfig } from '../config/types.js';
import type { AIAnalysisRequest } from '../ai/types.js';
import { AIOrchestrator } from '../ai/orchestrator.js';

// ─── AI Detector ───────────────────────────────────────────────────

export class AIDetector implements Detector {
  readonly name = 'ai-analysis';
  readonly version = '1.0.0';
  readonly tier = 3 as const;

  private orchestrator: AIOrchestrator;

  constructor(config?: AIConfig) {
    this.orchestrator = new AIOrchestrator(config);
  }

  /**
   * Detect AI-specific code issues using LLM analysis.
   *
   * Converts FileAnalysis inputs to AIAnalysisRequest format,
   * runs the orchestrator, and returns UnifiedIssue results.
   *
   * @param files - Files to analyze
   * @returns Array of issues found by AI, or empty if provider unavailable
   */
  async detect(files: FileAnalysis[]): Promise<UnifiedIssue[]> {
    if (files.length === 0) return [];

    const request: AIAnalysisRequest = {
      files: files.map((f) => ({
        path: f.path,
        content: f.content,
        language: f.language,
      })),
      mode: 'deep',
    };

    try {
      const response = await this.orchestrator.analyze(request);
      if (!response) return [];

      return response.issues;
    } catch {
      // AI analysis failure should not break the pipeline
      return [];
    }
  }

  /**
   * Get the underlying orchestrator (for testing/inspection).
   */
  getOrchestrator(): AIOrchestrator {
    return this.orchestrator;
  }
}
