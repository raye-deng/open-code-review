/**
 * Tests for LLM Providers (Ollama, OpenAI, Anthropic)
 *
 * All HTTP calls are mocked - no real API calls.
 *
 * @since 0.4.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OllamaLLMProvider } from '../../src/ai/v4/llm/ollama.js';
import { OpenAILLMProvider } from '../../src/ai/v4/llm/openai.js';
import { AnthropicLLMProvider } from '../../src/ai/v4/llm/anthropic.js';

// Store original fetch
const originalFetch = global.fetch;

// Helper to mock fetch
function mockFetch(responses: Record<string, { ok: boolean; status: number; json?: unknown; text?: string }>) {
  global.fetch = vi.fn(async (url: string) => {
    const urlStr = url.toString();
    for (const [pattern, response] of Object.entries(responses)) {
      if (urlStr.includes(pattern)) {
        return {
          ok: response.ok,
          status: response.status,
          json: async () => response.json,
          text: async () => response.text ?? JSON.stringify(response.json),
        } as Response;
      }
    }
    return { ok: false, status: 404, json: async () => ({}), text: async () => 'Not found' } as Response;
  });
}

describe('OllamaLLMProvider', () => {
  let provider: OllamaLLMProvider;

  beforeEach(() => {
    provider = new OllamaLLMProvider('codellama:13b', 'http://localhost:11434');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('complete', () => {
    it('should send POST to /api/generate and return response', async () => {
      mockFetch({
        '/api/generate': {
          ok: true,
          status: 200,
          json: {
            response: 'This is the LLM response',
            eval_count: 50,
            prompt_eval_count: 20,
          },
        },
      });

      const result = await provider.complete('Hello, world!');

      expect(result.content).toBe('This is the LLM response');
      expect(result.usage?.prompt).toBe(20);
      expect(result.usage?.completion).toBe(50);
      expect(result.usage?.total).toBe(70);
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('should include system prompt in request body', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ response: 'ok' }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { system: 'You are a code reviewer' });

      expect(capturedBody).toHaveProperty('system', 'You are a code reviewer');
    });

    it('should include maxTokens as num_predict', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ response: 'ok' }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { maxTokens: 500 });

      expect(capturedBody).toHaveProperty('options');
      expect((capturedBody as { options: { num_predict: number } }).options.num_predict).toBe(500);
    });

    it('should include temperature in options', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ response: 'ok' }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { temperature: 0.5 });

      expect(capturedBody).toHaveProperty('options');
      expect((capturedBody as { options: { temperature: number } }).options.temperature).toBe(0.5);
    });

    it('should throw on non-OK response', async () => {
      mockFetch({
        '/api/generate': {
          ok: false,
          status: 500,
          text: 'Internal Server Error',
        },
      });

      await expect(provider.complete('Hello')).rejects.toThrow('Ollama API error (500)');
    });
  });

  describe('isAvailable', () => {
    it('should return true when model exists', async () => {
      mockFetch({
        '/api/tags': {
          ok: true,
          status: 200,
          json: {
            models: [{ name: 'codellama:13b' }, { name: 'llama2:7b' }],
          },
        },
      });

      const available = await provider.isAvailable();
      expect(available).toBe(true);
    });

    it('should return true when model exists with different tag', async () => {
      mockFetch({
        '/api/tags': {
          ok: true,
          status: 200,
          json: {
            models: [{ name: 'codellama:latest' }],
          },
        },
      });

      const available = await provider.isAvailable();
      expect(available).toBe(true);
    });

    it('should return false when model does not exist', async () => {
      mockFetch({
        '/api/tags': {
          ok: true,
          status: 200,
          json: {
            models: [{ name: 'llama2:7b' }],
          },
        },
      });

      const available = await provider.isAvailable();
      expect(available).toBe(false);
    });

    it('should return false on HTTP error', async () => {
      mockFetch({
        '/api/tags': {
          ok: false,
          status: 500,
          json: {},
        },
      });

      const available = await provider.isAvailable();
      expect(available).toBe(false);
    });

    it('should return false on network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const available = await provider.isAvailable();
      expect(available).toBe(false);
    });
  });
});

describe('OpenAILLMProvider', () => {
  let provider: OpenAILLMProvider;

  beforeEach(() => {
    provider = new OpenAILLMProvider('test-api-key', 'gpt-4o-mini', 'https://api.openai.com/v1');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('complete', () => {
    it('should send POST to /chat/completions and return response', async () => {
      mockFetch({
        '/chat/completions': {
          ok: true,
          status: 200,
          json: {
            choices: [{ message: { content: 'This is the response' } }],
            usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          },
        },
      });

      const result = await provider.complete('Hello');

      expect(result.content).toBe('This is the response');
      expect(result.usage?.prompt).toBe(10);
      expect(result.usage?.completion).toBe(20);
      expect(result.usage?.total).toBe(30);
    });

    it('should send Authorization header with API key', async () => {
      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedHeaders = options?.headers;
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello');

      expect(capturedHeaders).toHaveProperty('Authorization', 'Bearer test-api-key');
    });

    it('should include system message in request', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { system: 'You are helpful' });

      expect(capturedBody).toHaveProperty('messages');
      const messages = (capturedBody as { messages: Array<{ role: string; content: string }> }).messages;
      expect(messages[0]).toEqual({ role: 'system', content: 'You are helpful' });
    });

    it('should include max_tokens in request body', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { maxTokens: 1000 });

      expect(capturedBody).toHaveProperty('max_tokens', 1000);
    });

    it('should include temperature in request body', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { temperature: 0.3 });

      expect(capturedBody).toHaveProperty('temperature', 0.3);
    });

    it('should throw on non-OK response', async () => {
      mockFetch({
        '/chat/completions': {
          ok: false,
          status: 401,
          text: 'Unauthorized',
        },
      });

      await expect(provider.complete('Hello')).rejects.toThrow('OpenAI API error (401)');
    });
  });

  describe('isAvailable', () => {
    it('should return true when API key is set', async () => {
      const available = await provider.isAvailable();
      expect(available).toBe(true);
    });

    it('should return false when API key is empty', async () => {
      const noKeyProvider = new OpenAILLMProvider('', 'gpt-4o-mini');
      const available = await noKeyProvider.isAvailable();
      expect(available).toBe(false);
    });
  });

  describe('name', () => {
    it('should return openai', () => {
      expect(provider.name).toBe('openai');
    });
  });
});

describe('AnthropicLLMProvider', () => {
  let provider: AnthropicLLMProvider;

  beforeEach(() => {
    provider = new AnthropicLLMProvider('test-api-key', 'claude-3-5-haiku-20241022', 'https://api.anthropic.com/v1');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('complete', () => {
    it('should send POST to /messages and return response', async () => {
      mockFetch({
        '/messages': {
          ok: true,
          status: 200,
          json: {
            content: [{ type: 'text', text: 'This is the response' }],
            usage: { input_tokens: 15, output_tokens: 25 },
          },
        },
      });

      const result = await provider.complete('Hello');

      expect(result.content).toBe('This is the response');
      expect(result.usage?.prompt).toBe(15);
      expect(result.usage?.completion).toBe(25);
      expect(result.usage?.total).toBe(40);
    });

    it('should send x-api-key header', async () => {
      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedHeaders = options?.headers;
        return {
          ok: true,
          status: 200,
          json: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello');

      expect(capturedHeaders).toHaveProperty('x-api-key', 'test-api-key');
    });

    it('should send anthropic-version header', async () => {
      let capturedHeaders: HeadersInit | undefined;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedHeaders = options?.headers;
        return {
          ok: true,
          status: 200,
          json: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello');

      expect(capturedHeaders).toHaveProperty('anthropic-version', '2023-06-01');
    });

    it('should include system in request body', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { system: 'Be concise' });

      expect(capturedBody).toHaveProperty('system', 'Be concise');
    });

    it('should include max_tokens in request body', async () => {
      let capturedBody: unknown;
      global.fetch = vi.fn(async (_url: string, options?: RequestInit) => {
        capturedBody = options?.body ? JSON.parse(options.body as string) : null;
        return {
          ok: true,
          status: 200,
          json: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
          text: async () => 'ok',
        } as Response;
      });

      await provider.complete('Hello', { maxTokens: 2000 });

      expect(capturedBody).toHaveProperty('max_tokens', 2000);
    });

    it('should handle multiple content blocks', async () => {
      mockFetch({
        '/messages': {
          ok: true,
          status: 200,
          json: {
            content: [
              { type: 'text', text: 'First part. ' },
              { type: 'text', text: 'Second part.' },
            ],
            usage: { input_tokens: 10, output_tokens: 20 },
          },
        },
      });

      const result = await provider.complete('Hello');
      expect(result.content).toBe('First part. Second part.');
    });

    it('should throw on non-OK response', async () => {
      mockFetch({
        '/messages': {
          ok: false,
          status: 400,
          text: 'Bad Request',
        },
      });

      await expect(provider.complete('Hello')).rejects.toThrow('Anthropic API error (400)');
    });
  });

  describe('isAvailable', () => {
    it('should return true when API key is set', async () => {
      const available = await provider.isAvailable();
      expect(available).toBe(true);
    });

    it('should return false when API key is empty', async () => {
      const noKeyProvider = new AnthropicLLMProvider('', 'claude-3-5-haiku-20241022');
      const available = await noKeyProvider.isAvailable();
      expect(available).toBe(false);
    });
  });

  describe('name', () => {
    it('should return anthropic', () => {
      expect(provider.name).toBe('anthropic');
    });
  });
});
