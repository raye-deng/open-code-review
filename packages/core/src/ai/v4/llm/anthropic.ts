/**
 * Anthropic LLM Provider
 *
 * Provides LLM inference via Anthropic Messages API.
 * Used for L3 SLA level as an alternative to OpenAI.
 *
 * @since 0.4.0
 */

import type { LLMProvider, LLMOptions, LLMResponse } from '../types.js';

/**
 * Anthropic provider for remote LLM inference using Claude models.
 *
 * Requires an API key. Supports Claude 3.5 and newer models.
 *
 * @example
 * ```ts
 * const provider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY, 'claude-3-5-haiku-20241022');
 * if (await provider.isAvailable()) {
 *   const response = await provider.complete('Review this code:', { maxTokens: 1000 });
 * }
 * ```
 */
export class AnthropicLLMProvider implements LLMProvider {
  readonly name = 'anthropic';

  constructor(
    private apiKey: string,
    private model: string = 'claude-3-5-haiku-20241022',
    private baseUrl: string = 'https://api.anthropic.com/v1',
  ) {}

  /**
   * Send a completion request to Anthropic Messages API.
   */
  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const url = `${this.baseUrl}/messages`;
    const startTime = Date.now();

    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: options?.maxTokens ?? 4096,
      messages: [{ role: 'user', content: prompt }],
    };

    if (options?.system) {
      body.system = options.system;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown error');
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text?: string }>;
      usage?: {
        input_tokens: number;
        output_tokens: number;
      };
    };

    const latencyMs = Date.now() - startTime;

    // Extract text from content blocks
    const content = data.content
      .filter(block => block.type === 'text')
      .map(block => block.text ?? '')
      .join('');

    return {
      content,
      usage: data.usage
        ? {
            prompt: data.usage.input_tokens,
            completion: data.usage.output_tokens,
            total: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
      latencyMs,
    };
  }

  /**
   * Check if the provider is available (has API key configured).
   */
  async isAvailable(): Promise<boolean> {
    return !!this.apiKey && this.apiKey.length > 0;
  }
}
