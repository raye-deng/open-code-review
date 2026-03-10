/**
 * Cosine Similarity Utilities
 *
 * Vector similarity functions for the embedding recall stage.
 * Used to compare code block embeddings against defect pattern embeddings.
 *
 * @since 0.4.0
 */

/**
 * Compute cosine similarity between two vectors.
 * Returns a value in [-1, 1] where 1 = identical direction, 0 = orthogonal.
 *
 * For TF-IDF vectors (non-negative), range is [0, 1].
 *
 * @param a First vector
 * @param b Second vector
 * @returns Cosine similarity score
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

/**
 * Find the top-K most similar candidates to a query vector.
 *
 * Returns candidates that exceed the similarity threshold, sorted by
 * descending similarity score, limited to topK results.
 *
 * @param query Query embedding vector
 * @param candidates Array of candidate embedding vectors
 * @param topK Maximum number of results to return
 * @param threshold Minimum similarity score to include (0-1)
 * @returns Array of { index, score } sorted by descending score
 */
export function findTopMatches(
  query: number[],
  candidates: number[][],
  topK: number,
  threshold: number,
): { index: number; score: number }[] {
  const matches: { index: number; score: number }[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const score = cosineSimilarity(query, candidates[i]);
    if (score >= threshold) {
      matches.push({ index: i, score });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  // Return top-K
  return matches.slice(0, topK);
}
