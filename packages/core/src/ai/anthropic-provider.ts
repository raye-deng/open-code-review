/**
 * Anthropic AI Provider
 *
 * Remote AI provider using Anthropic's Messages API for code analysis.
 * Uses native fetch (no SDK dependency).
 *
 * @since 0.3.0
 */

import type { AIProvider, AIAnalysisRequest, AIAnalysisResponse, AIRawIssue } from './types.js';
import type { UnifiedIssue } from '../types.js';
import { AIDefectCategory } from '../types.js';
import { buildAnalysisPrompt, mapRawCategory, mapRawSeverity } from './prompts.js';

// ─── Anthropic Provider ────────────────────────────────────────────

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
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
    this.apiKey = options?.apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.model = options?.model || 'claude-3-5-haiku-latest';
    this.endpoint = options?.endpoint || 'https://api.anthropic.com';
    this.timeoutMs = options?.timeoutMs || 60_000;
  }

  /**
   * Check if an API key is configured.
   */
  async isAvailable(): Promise<boolean> {
    return !!this.apiKey;
  }

  /**
   * Analyze code using Anthropic Messages API.
   */
  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is not configured');
    }

    const startTime = Date.now();
    const prompt = buildAnalysisPrompt(request.files, request.mode);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(`${this.endpoint}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4096,
          temperature: 0.1,
          system:
            'You are an expert code reviewer. Always respond with valid JSON matching the requested format. Output ONLY JSON, no explanations.',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => 'unknown error');
        throw new Error(`Anthropic API error ${res.status}: ${errText}`);
      }

      const data = (await res.json()) as {
        content: Array<{ type: string; text: string }>;
        usage?: {
          input_tokens: number;
          output_tokens: number;
        };
      };

      const textContent = data.content?.find((c) => c.type === 'text');
      const content = textContent?.text || '{}';
      const issues = this.parseResponse(content, request);
      const durationMs = Date.now() - startTime;

      return {
        issues,
        model: this.model,
        tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
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
   * Parse the Anthropic response into UnifiedIssue array.
   * Anthropic may wrap JSON in markdown code blocks.
   */
  private parseResponse(content: string, request: AIAnalysisRequest): UnifiedIssue[] {
    // Try direct JSON parse first
    let rawContent = content.trim();

    // Strip markdown code block if present
    const jsonMatch = rawContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      rawContent = jsonMatch[1].trim();
    }

    try {
      const parsed = JSON.parse(rawContent) as { issues?: AIRawIssue[] };
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
      id: `ai-anthropic:${index}`,
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
