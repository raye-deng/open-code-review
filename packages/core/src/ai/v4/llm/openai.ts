/**
 * OpenAI LLM Provider
 *
 * Provides LLM inference via OpenAI Chat Completions API.
 * Used for L3 SLA level where remote high-quality models are needed.
 *
 * @since 0.4.0
 */

import type { LLMProvider, LLMOptions, LLMResponse } from '../types.js';

/**
 * OpenAI provider for remote LLM inference.
 *
 * Requires an API key. Supports all OpenAI chat models.
 *
 * @example
 * ```ts
 * const provider = new OpenAIProvider(process.env.OPENAI_API_KEY, 'gpt-4o-mini');
 * if (await provider.isAvailable()) {
 *   const response = await provider.complete('Review this code:', { maxTokens: 1000 });
 * }
 * ```
 */
export class OpenAILLMProvider implements LLMProvider {
  readonly name = 'openai';

  constructor(
    private apiKey: string,
    private model: string = 'gpt-4o-mini',
    private baseUrl: string = 'https://api.openai.com/v1',
  ) {}

  /**
   * Send a completion request to OpenAI Chat Completions API.
   */
  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const url = `${this.baseUrl}/chat/completions`;
    const startTime = Date.now();

    const messages: Array<{ role: string; content: string }> = [];

    if (options?.system) {
      messages.push({ role: 'system', content: options.system });
    }

    messages.push({ role: 'user', content: prompt });

    const body: Record<string, unknown> = {
      model: this.model,
      messages,
    };

    if (options?.maxTokens) {
      body.max_tokens = options.maxTokens;
    }

    if (options?.temperature !== undefined) {
      body.temperature = options.temperature;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown error');
      throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
      usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    };

    const latencyMs = Date.now() - startTime;
    const content = data.choices[0]?.message?.content ?? '';

    return {
      content,
      usage: data.usage
        ? {
            prompt: data.usage.prompt_tokens,
            completion: data.usage.completion_tokens,
            total: data.usage.total_tokens,
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
