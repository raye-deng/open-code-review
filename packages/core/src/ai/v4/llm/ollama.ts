/**
 * Ollama LLM Provider
 *
 * Provides local LLM inference via Ollama API.
 * Used for L2 SLA level where local models are preferred.
 *
 * @since 0.4.0
 */

import type { LLMProvider, LLMOptions, LLMResponse } from '../types.js';

/**
 * Ollama provider for local LLM inference.
 *
 * Requires Ollama to be running locally with the specified model pulled.
 *
 * @example
 * ```ts
 * const provider = new OllamaProvider('codellama:13b');
 * if (await provider.isAvailable()) {
 *   const response = await provider.complete('Explain this code:', { maxTokens: 500 });
 * }
 * ```
 */
export class OllamaLLMProvider implements LLMProvider {
  readonly name = 'ollama';

  constructor(
    private model: string = 'codellama:13b',
    private baseUrl: string = 'http://localhost:11434',
  ) {}

  /**
   * Send a completion request to Ollama.
   *
   * Uses the /api/generate endpoint with streaming disabled.
   */
  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    const url = `${this.baseUrl}/api/generate`;
    const startTime = Date.now();

    const body: Record<string, unknown> = {
      model: this.model,
      prompt,
      stream: false,
    };

    if (options?.system) {
      body.system = options.system;
    }

    if (options?.maxTokens) {
      body.options = { ...(body.options as object), num_predict: options.maxTokens };
    }

    if (options?.temperature !== undefined) {
      body.options = { ...(body.options as object), temperature: options.temperature };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000), // 2 minute timeout for local LLM
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown error');
      throw new Error(`Ollama API error (${response.status}): ${errorBody}`);
    }

    const data = (await response.json()) as {
      response: string;
      eval_count?: number;
      prompt_eval_count?: number;
    };

    const latencyMs = Date.now() - startTime;

    return {
      content: data.response,
      usage: {
        prompt: data.prompt_eval_count ?? 0,
        completion: data.eval_count ?? 0,
        total: (data.prompt_eval_count ?? 0) + (data.eval_count ?? 0),
      },
      latencyMs,
    };
  }

  /**
   * Check if Ollama is running and the model is available.
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5_000),
      });

      if (!response.ok) return false;

      const data = (await response.json()) as {
        models?: Array<{ name: string }>;
      };

      // Check if our model exists (exact match or without tag)
      const modelName = this.model.split(':')[0];
      return (data.models ?? []).some(
        m => m.name === this.model || m.name.startsWith(`${modelName}:`),
      );
    } catch {
      return false;
    }
  }
}
