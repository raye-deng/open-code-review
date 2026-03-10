/**
 * OpenAI Embedding Provider
 *
 * Uses OpenAI's text-embedding API for high-quality vector embeddings.
 * Designed for L3 SLA level where remote API calls are acceptable.
 *
 * @since 0.4.0
 */

import type { EmbeddingProvider } from '../types.js';

/** Maximum texts per batch request to OpenAI embeddings API */
const MAX_BATCH_SIZE = 2048;

/**
 * OpenAI embedding provider using the text-embedding-3-small model.
 *
 * Requires an API key. Batches requests to stay within API limits.
 */
export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'openai';
  readonly dimension: number;

  constructor(
    private apiKey: string,
    private model: string = 'text-embedding-3-small',
    private baseUrl: string = 'https://api.openai.com/v1',
  ) {
    // text-embedding-3-small = 1536, text-embedding-3-large = 3072
    this.dimension = model.includes('large') ? 3072 : 1536;
  }

  /**
   * Generate embeddings for a batch of texts via OpenAI API.
   *
   * Automatically splits into sub-batches if texts exceed MAX_BATCH_SIZE.
   *
   * @param texts Array of text strings to embed
   * @returns Array of embedding vectors (one per text)
   */
  async embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const results: number[][] = [];

    // Process in batches
    for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
      const batch = texts.slice(i, i + MAX_BATCH_SIZE);
      const batchResults = await this.embedBatch(batch);
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Send a single batch to the OpenAI embeddings API.
   */
  private async embedBatch(texts: string[]): Promise<number[][]> {
    const url = `${this.baseUrl}/embeddings`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown error');
      throw new Error(
        `OpenAI embeddings API error (${response.status}): ${errorBody}`,
      );
    }

    const data = (await response.json()) as {
      data: Array<{ embedding: number[]; index: number }>;
    };

    // Sort by index to ensure order matches input
    const sorted = data.data.sort((a, b) => a.index - b.index);
    return sorted.map(d => d.embedding);
  }
}
