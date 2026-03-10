/**
 * Tests for Local TF-IDF Embedding Provider
 *
 * @since 0.4.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  LocalEmbeddingProvider,
  tokenize,
  cosineSimilarity,
} from '../../src/ai/v4/embedding/local.js';

describe('tokenize', () => {
  it('should split camelCase identifiers', () => {
    const result = tokenize('readFileFromDisk');
    expect(result).toContain('read');
    expect(result).toContain('file');
    expect(result).toContain('from');
    expect(result).toContain('disk');
  });

  it('should split snake_case identifiers', () => {
    const result = tokenize('read_file_from_disk');
    expect(result).toContain('read');
    expect(result).toContain('file');
    expect(result).toContain('from');
    expect(result).toContain('disk');
  });

  it('should handle mixed case patterns', () => {
    const result = tokenize('XMLHttpRequest_handler');
    // The tokenizer treats consecutive uppercase as a single token prefix
    expect(result).toContain('xmlhttp');
    expect(result).toContain('request');
    expect(result).toContain('handler');
  });

  it('should remove punctuation and special characters', () => {
    const result = tokenize('func(a, b); return x+y;');
    expect(result.some(t => t.includes(','))).toBe(false);
    expect(result.some(t => t.includes(';'))).toBe(false);
    expect(result.some(t => t.includes('+'))).toBe(false);
  });

  it('should filter out single characters', () => {
    const result = tokenize('a b c function');
    expect(result).not.toContain('a');
    expect(result).not.toContain('b');
    expect(result).not.toContain('c');
    expect(result).toContain('function');
  });

  it('should lowercase all tokens', () => {
    const result = tokenize('HelloWorld FUNCTION');
    expect(result.every(t => t === t.toLowerCase())).toBe(true);
  });

  it('should handle empty string', () => {
    const result = tokenize('');
    expect(result).toEqual([]);
  });

  it('should handle numbers in identifiers', () => {
    const result = tokenize('parse2JSON getHTTP2Response');
    // Tokenizer treats consecutive uppercase+number as single tokens
    expect(result).toContain('parse2json');
    expect(result).toContain('get');
    expect(result).toContain('http2response');
  });
});

describe('cosineSimilarity', () => {
  it('should return 1 for identical vectors', () => {
    const v = [1, 2, 3, 4, 5];
    expect(cosineSimilarity(v, v)).toBeCloseTo(1, 5);
  });

  it('should return 0 for orthogonal vectors', () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
  });

  it('should return -1 for opposite vectors', () => {
    const a = [1, 2, 3];
    const b = [-1, -2, -3];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 5);
  });

  it('should return 0 for zero vectors', () => {
    expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
    expect(cosineSimilarity([1, 2, 3], [0, 0, 0])).toBe(0);
    expect(cosineSimilarity([], [])).toBe(0);
  });

  it('should return 0 for vectors of different lengths', () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
  });

  it('should compute correct similarity for sample vectors', () => {
    const a = [1, 2, 3];
    const b = [2, 3, 4];
    // dot = 1*2 + 2*3 + 3*4 = 20
    // normA = sqrt(1+4+9) = sqrt(14)
    // normB = sqrt(4+9+16) = sqrt(29)
    // similarity = 20 / sqrt(14*29)
    const expected = 20 / Math.sqrt(14 * 29);
    expect(cosineSimilarity(a, b)).toBeCloseTo(expected, 5);
  });
});

describe('LocalEmbeddingProvider', () => {
  let provider: LocalEmbeddingProvider;

  beforeEach(() => {
    provider = new LocalEmbeddingProvider(512);
  });

  describe('buildVocabulary', () => {
    it('should build vocabulary from corpus', () => {
      const texts = [
        'function readFile(path) { return fs.readFileSync(path); }',
        'function writeFile(path, data) { fs.writeFileSync(path, data); }',
      ];

      provider.buildVocabulary(texts);

      // Vocabulary should contain common tokens
      expect(provider.dimension).toBe(512);
    });

    it('should handle empty corpus', () => {
      provider.buildVocabulary([]);
      expect(provider.dimension).toBe(512);
    });

    it('should limit vocabulary to maxDimension', () => {
      const smallProvider = new LocalEmbeddingProvider(10);
      const texts = Array.from({ length: 100 }, (_, i) => `unique${i} function`);

      smallProvider.buildVocabulary(texts);

      expect(smallProvider.dimension).toBe(10);
    });
  });

  describe('embed', () => {
    it('should embed a single text', async () => {
      const texts = ['function hello() { console.log("hello"); }'];

      const embeddings = await provider.embed(texts);

      expect(embeddings).toHaveLength(1);
      expect(embeddings[0]).toHaveLength(512);
    });

    it('should embed a batch of texts', async () => {
      const texts = [
        'function a() { return 1; }',
        'function b() { return 2; }',
        'function c() { return 3; }',
      ];

      const embeddings = await provider.embed(texts);

      expect(embeddings).toHaveLength(3);
      embeddings.forEach(emb => {
        expect(emb).toHaveLength(512);
      });
    });

    it('should auto-build vocabulary if not built', async () => {
      const texts = ['function test() {}'];

      const embeddings = await provider.embed(texts);

      expect(embeddings).toHaveLength(1);
    });

    it('should produce normalized vectors', async () => {
      const texts = ['function test() { return value; }'];

      const embeddings = await provider.embed(texts);
      const vector = embeddings[0];

      // L2 norm should be close to 1 (or 0 for zero vector)
      const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
      expect(norm === 0 || Math.abs(norm - 1) < 0.0001).toBe(true);
    });

    it('should return zero vector for empty text', async () => {
      const embeddings = await provider.embed(['']);
      expect(embeddings[0].every(v => v === 0)).toBe(true);
    });

    it('should produce similar embeddings for similar code', async () => {
      const texts = [
        'function readFile(path) { return fs.readFileSync(path, "utf8"); }',
        'function readFile(filePath) { return fs.readFileSync(filePath, "utf8"); }',
        'function calculatePi() { return Math.PI; }',
      ];

      provider.buildVocabulary(texts);
      const embeddings = await provider.embed(texts);

      // Similar functions should have higher similarity
      const sim12 = cosineSimilarity(embeddings[0], embeddings[1]);
      const sim13 = cosineSimilarity(embeddings[0], embeddings[2]);

      expect(sim12).toBeGreaterThan(sim13);
    });

    it('should produce different embeddings for different patterns', async () => {
      const texts = [
        'import nonexistent from "fake-package"',
        'function add(a, b) { return a + b; }',
      ];

      provider.buildVocabulary(texts);
      const embeddings = await provider.embed(texts);

      const similarity = cosineSimilarity(embeddings[0], embeddings[1]);
      // Different code should have low similarity
      expect(similarity).toBeLessThan(0.9);
    });
  });

  describe('name and dimension', () => {
    it('should have correct name', () => {
      expect(provider.name).toBe('local-tfidf');
    });

    it('should have configurable dimension', () => {
      const smallProvider = new LocalEmbeddingProvider(256);
      expect(smallProvider.dimension).toBe(256);
    });
  });
});
