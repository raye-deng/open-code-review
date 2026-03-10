/**
 * OpenAI AI Provider
 *
 * Remote AI provider using OpenAI-compatible API for code analysis.
 * Uses native fetch (no SDK dependency).
 *
 * Supports any OpenAI-compatible endpoint (OpenAI, Azure, local proxies).
 *
 * @since 0.3.0
 */

import type { AIProvider, AIAnalysisRequest, AIAnalysisResponse, AIRawIssue } from './types.js';
import type { UnifiedIssue } from '../types.js';
import { AIDefectCategory } from '../types.js';
import { buildAnalysisPrompt, mapRawCategory, mapRawSeverity } from './prompts.js';

// ─── OpenAI Provider ───────────────────────────────────────────────

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  readonly type = 'remote' as const;

  private apiKey: string;
  private model: string;
  private endpoint: string;
  private timeoutMs: number;

  constructor(options?: {
    apiKey?: string;
    model?: string;
    endpoint?: string;
    timeoutMs?: number;
  }) {
    this.apiKey = options?.apiKey || process.env.OPENAI_API_KEY || '';
    this.model = options?.model || 'gpt-4o-mini';
    this.endpoint = options?.endpoint || 'https://api.openai.com/v1';
    this.timeoutMs = options?.timeoutMs || 60_000;
  }

  /**
   * Check if an API key is configured.
   * Does not make a network call — just verifies the key is present.
   */
  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  /**
   * Analyze code using OpenAI Chat Completions API.
   * Uses JSON mode for structured output.
   */
  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const startTime = Date.now();
    const prompt = buildAnalysisPrompt(request.files, request.mode);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(`${this.endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert code reviewer. Always respond with valid JSON matching the requested format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 4096,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => 'unknown error');
        throw new Error(`OpenAI API error ${res.status}: ${errText}`);
      }

      const data = (await res.json()) as {
        choices: Array<{
          message: { content: string };
        }>;
        usage?: {
          total_tokens: number;
          prompt_tokens: number;
          completion_tokens: number;
        };
      };

      const content = data.choices?.[0]?.message?.content || '{}';
      const issues = this.parseResponse(content, request);
      const durationMs = Date.now() - startTime;

      return {
        issues,
        model: this.model,
        tokensUsed: data.usage?.total_tokens || 0,
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
   * Parse the OpenAI JSON response into UnifiedIssue array.
   */
  private parseResponse(content: string, request: AIAnalysisRequest): UnifiedIssue[] {
    try {
      const parsed = JSON.parse(content) as { issues?: AIRawIssue[] };
      if (!parsed.issues || !Array.isArray(parsed.issues)) {
        return [];
      }

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
      id: `ai-openai:${index}`,
      detector: 'ai-analysis',
      type: `ai-${category}`,
      category,
      severity,
      message: raw.message,
      file: raw.file,
      line: raw.line,
      suggestion: raw.fix,
      confidence: 0.75,
      detectionSource: 'ai',
    };
  }
}
