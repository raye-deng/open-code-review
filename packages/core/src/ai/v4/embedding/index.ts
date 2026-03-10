/**
 * Embedding providers for the V4 AI pipeline Stage 1.
 *
 * @since 0.4.0
 */

export { LocalEmbeddingProvider, tokenize, cosineSimilarity } from './local.js';
export { findTopMatches } from './similarity.js';
export { OpenAIEmbeddingProvider } from './openai.js';
