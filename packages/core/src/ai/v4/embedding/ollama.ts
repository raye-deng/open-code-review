/**
 * Ollama Embedding Provider
 *
 * Uses Ollama's /api/embed batch API for local embedding generation.
 * Designed for L2 SLA level where a local Ollama server is available.
 *
 * Recommended model: nomic-embed-text (0.3GB, 768 dims, ~0.14s/5 texts batch)
 *
 * @since 0.4.1
 */

import type { EmbeddingProvider } from '../types.js';

/** Maximum texts per batch to avoid timeouts */
const MAX_BATCH_SIZE = 10;

/**
 * Ollama embedding provider using the /api/embed batch API.
 *
 * Requires a running Ollama server with an embedding model pulled.
 * Uses batch API (input as array) for efficient embedding generation.
 *
 * @example
 * ```ts
 * const provider = new OllamaEmbeddingProvider('nomic-embed-text', 'http://localhost:11434');
 * const embeddings = await provider.embed(['hello world', 'foo bar']);
 * ```
 */
export class OllamaEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'ollama';
  private _dimension = 0;

  /**
   * @param model Ollama embedding model name (default: nomic-embed-text)
   * @param baseUrl Ollama server base URL (default: http://localhost:11434)
   */
  constructor(
    private model: string = 'nomic-embed-text',
    private baseUrl: string = 'http://localhost:11434',
  ) {}

  /**
   * Embedding vector dimension.
   * Inferred from the first successful API response.
   * Returns 0 before the first embed() call.
   */
  get dimension(): number {
    return this._dimension;
  }

  /**
   * Generate embeddings for a batch of texts via Ollama API.
   *
   * Uses the batch /api/embed endpoint with input as an array.
   * Automatically splits into sub-batches of MAX_BATCH_SIZE to avoid timeouts.
   *
   * @param texts Array of text strings to embed
   * @returns Array of embedding vectors (one per text)
   */
  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const results: number[][] = [];

    // Process in batches of MAX_BATCH_SIZE
    for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
      const batch = texts.slice(i, i + MAX_BATCH_SIZE);
      const batchResults = await this.embedBatch(batch);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Send a single batch to the Ollama /api/embed endpoint.
   *
   * Uses the batch API: input is an array of strings,
   * response contains embeddings array matching input order.
   */
  private async embedBatch(texts: string[]): Promise<number[][]> {
    const url = `${this.baseUrl.replace(/\/+$/, '')}/api/embed`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown error');
      throw new Error(
        `Ollama embed API error (${response.status}): ${errorBody}`,
      );
    }

    const data = (await response.json()) as {
      embeddings: number[][];
    };

    if (!data.embeddings || !Array.isArray(data.embeddings)) {
      throw new Error(
        'Ollama embed API returned unexpected format: missing embeddings array',
      );
    }

    // Infer dimension from first result
    if (this._dimension === 0 && data.embeddings.length > 0 && data.embeddings[0]) {
      this._dimension = data.embeddings[0].length;
    }

    return data.embeddings;
  }
}
