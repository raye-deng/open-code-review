/**
 * Ollama AI Provider
 *
 * Local AI provider using Ollama for code analysis.
 * Communicates via Ollama's HTTP API (default: http://localhost:11434).
 *
 * @since 0.3.0
 */

import type { AIProvider, AIAnalysisRequest, AIAnalysisResponse, AIRawIssue } from './types.js';
import type { UnifiedIssue } from '../types.js';
import { AIDefectCategory } from '../types.js';
import { buildAnalysisPrompt, mapRawCategory, mapRawSeverity } from './prompts.js';

// ─── Ollama Provider ───────────────────────────────────────────────

export class OllamaProvider implements AIProvider {
  readonly name = 'ollama';
  readonly type = 'local' as const;

  private endpoint: string;
  private model: string;
  private timeoutMs: number;

  constructor(options?: { endpoint?: string; model?: string; timeoutMs?: number }) {
    this.endpoint = options?.endpoint || 'http://localhost:11434';
    this.model = options?.model || 'codellama:13b';
    this.timeoutMs = options?.timeoutMs || 120_000;
  }

  /**
   * Check if Ollama is running and the specified model is available.
   * GET {endpoint}/api/tags → look for a model matching our configured model.
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${this.endpoint}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) return false;

      const data = (await res.json()) as { models?: Array<{ name: string }> };
      return data.models?.some((m) => m.name.startsWith(this.model)) ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Analyze code using Ollama's generate API.
   * POST {endpoint}/api/generate with the analysis prompt.
   */
  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now();
    const prompt = buildAnalysisPrompt(request.files, request.mode);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(`${this.endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.1,
            num_predict: 4096,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => 'unknown error');
        throw new Error(`Ollama API error ${res.status}: ${errText}`);
      }

      const data = (await res.json()) as {
        response: string;
        eval_count?: number;
        prompt_eval_count?: number;
      };

      const issues = this.parseResponse(data.response, request);
      const durationMs = Date.now() - startTime;

      return {
        issues,
        model: this.model,
        tokensUsed: (data.eval_count || 0) + (data.prompt_eval_count || 0),
        durationMs,
        provider: this.name,
      };
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  // ─── Response Parsing ────────────────────────────────────────────

  /**
   * Parse the Ollama JSON response into UnifiedIssue array.
   * Handles malformed JSON gracefully.
   */
  private parseResponse(response: string, request: AIAnalysisRequest): UnifiedIssue[] {
    try {
      const parsed = JSON.parse(response) as { issues?: AIRawIssue[] };
      if (!parsed.issues || !Array.isArray(parsed.issues)) {
        return [];
      }

      // Build a set of valid file paths from the request
      const validFiles = new Set(request.files.map((f) => f.path));

      return parsed.issues
        .filter(
          (raw) =>
            raw.file &&
            raw.line &&
            raw.message &&
            raw.category &&
            raw.severity &&
            validFiles.has(raw.file),
        )
        .map((raw, index) => this.rawToUnifiedIssue(raw, index));
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]) as { issues?: AIRawIssue[] };
          if (parsed.issues && Array.isArray(parsed.issues)) {
            return parsed.issues.map((raw, index) => this.rawToUnifiedIssue(raw, index));
          }
        } catch {
          // Give up
        }
      }
      return [];
    }
  }

  /**
   * Convert a raw AI issue to a UnifiedIssue.
   */
  private rawToUnifiedIssue(raw: AIRawIssue, index: number): UnifiedIssue {
    const category = mapRawCategory(raw.category) as AIDefectCategory;
    const severity = mapRawSeverity(raw.severity);

    return {
      id: `ai-ollama:${index}`,
      detector: 'ai-analysis',
      type: `ai-${category}`,
      category,
      severity,
      message: raw.message,
      file: raw.file,
      line: raw.line,
      suggestion: raw.fix,
      confidence: 0.7,
      detectionSource: 'ai',
    };
  }
}
