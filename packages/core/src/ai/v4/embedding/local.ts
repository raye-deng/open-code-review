/**
 * Local Embedding Provider — TF-IDF Based
 *
 * For V4 MVP, we use a simple but effective approach:
 * - TF-IDF vectorization of code blocks
 * - Cosine similarity against defect pattern vectors
 * - No external model dependency (zero binary deps)
 *
 * This can be upgraded to ONNX-based embedding (e.g. all-MiniLM-L6-v2)
 * in the future without changing the EmbeddingProvider interface.
 *
 * @since 0.4.0
 */

import type { EmbeddingProvider } from '../types.js';

// ─── Tokenization ──────────────────────────────────────────────────

/**
 * Tokenize source code into meaningful tokens.
 *
 * Handles:
 * - camelCase splitting: "readFile" → ["read", "file"]
 * - snake_case splitting: "read_file" → ["read", "file"]
 * - Punctuation removal
 * - Number handling
 * - Lowercasing
 */
export function tokenize(text: string): string[] {
  // Split camelCase and PascalCase
  const camelSplit = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Split snake_case
  const snakeSplit = camelSplit.replace(/_/g, ' ');
  // Split on non-alphanumeric characters, lowercase, filter empty
  const tokens = snakeSplit
    .split(/[^a-zA-Z0-9]+/)
    .map(t => t.toLowerCase())
    .filter(t => t.length > 1); // Filter single characters
  return tokens;
}

// ─── Cosine Similarity ─────────────────────────────────────────────

/**
 * Compute cosine similarity between two vectors.
 * Returns a value in [0, 1] where 1 = identical direction.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

// ─── Local TF-IDF Embedding Provider ───────────────────────────────

export class LocalEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'local-tfidf';
  readonly dimension: number;

  private vocabulary: Map<string, number> = new Map();
  private idfScores: Map<string, number> = new Map();
  private vocabularyBuilt = false;

  /**
   * @param maxDimension Maximum vocabulary size (vector dimension).
   *   Defaults to 512. Vocabulary is truncated to this size by IDF rank.
   */
  constructor(private maxDimension: number = 512) {
    this.dimension = maxDimension;
  }

  /**
   * Build vocabulary and IDF scores from a corpus of texts.
   * Must be called before embed() to produce meaningful vectors.
   *
   * @param texts Corpus of text documents to build vocabulary from
   */
  buildVocabulary(texts: string[]): void {
    if (texts.length === 0) {
      this.vocabularyBuilt = true;
      return;
    }

    // Tokenize all documents
    const docTokenSets: Set<string>[] = texts.map(text => new Set(tokenize(text)));

    // Count document frequency for each token
    const docFreq = new Map<string, number>();
    for (const tokenSet of docTokenSets) {
      for (const token of tokenSet) {
        docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
      }
    }

    // Compute IDF: log(N / df)
    const N = texts.length;
    const idfEntries: Array<[string, number]> = [];
    for (const [token, df] of docFreq.entries()) {
      const idf = Math.log((N + 1) / (df + 1)) + 1; // smoothed IDF
      idfEntries.push([token, idf]);
    }

    // Sort by IDF descending (most discriminative first), take top maxDimension
    idfEntries.sort((a, b) => b[1] - a[1]);
    const selected = idfEntries.slice(0, this.maxDimension);

    // Build vocabulary mapping: token → index
    this.vocabulary.clear();
    this.idfScores.clear();
    for (let i = 0; i < selected.length; i++) {
      const [token, idf] = selected[i];
      this.vocabulary.set(token, i);
      this.idfScores.set(token, idf);
    }

    this.vocabularyBuilt = true;
  }

  /**
   * Generate TF-IDF embedding vectors for the given texts.
   *
   * If vocabulary hasn't been built, it will be auto-built from the input texts.
   *
   * @param texts Array of text documents to embed
   * @returns Array of normalized TF-IDF vectors (one per text)
   */
  async embed(texts: string[]): Promise<number[][]> {
    if (!this.vocabularyBuilt) {
      this.buildVocabulary(texts);
    }

    return texts.map(text => this.embedSingle(text));
  }

  /**
   * Generate a normalized TF-IDF vector for a single text.
   */
  private embedSingle(text: string): number[] {
    const tokens = tokenize(text);
    const vector = new Array(this.dimension).fill(0);

    if (tokens.length === 0) return vector;

    // Count term frequencies
    const tf = new Map<string, number>();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) ?? 0) + 1);
    }

    // Build TF-IDF vector
    for (const [token, count] of tf.entries()) {
      const idx = this.vocabulary.get(token);
      if (idx !== undefined) {
        const termFreq = count / tokens.length; // normalized TF
        const idf = this.idfScores.get(token) ?? 1;
        vector[idx] = termFreq * idf;
      }
    }

    // L2 normalize
    return this.normalize(vector);
  }

  /**
   * L2-normalize a vector (unit length).
   */
  private normalize(vector: number[]): number[] {
    let norm = 0;
    for (const v of vector) {
      norm += v * v;
    }
    norm = Math.sqrt(norm);

    if (norm === 0) return vector;

    return vector.map(v => v / norm);
  }
}
