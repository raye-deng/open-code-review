/**
 * AI Provider Tests
 *
 * Tests for the AI analysis module: providers, orchestrator, prompts,
 * and result fusion. All tests use mocks — no real API calls.
 *
 * @since 0.3.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OllamaProvider } from '../src/ai/ollama-provider.js';
import { OpenAIProvider } from '../src/ai/openai-provider.js';
import { AnthropicProvider } from '../src/ai/anthropic-provider.js';
import { AIOrchestrator } from '../src/ai/orchestrator.js';
import { buildAnalysisPrompt, mapRawCategory, mapRawSeverity } from '../src/ai/prompts.js';
import { AIDetector } from '../src/detectors/ai-detector.js';
import type { AIAnalysisRequest, AIProvider, AIAnalysisResponse } from '../src/ai/types.js';
import type { UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';

// ─── Test Data ─────────────────────────────────────────────────────

const sampleRequest: AIAnalysisRequest = {
  files: [
    {
      path: 'src/app.ts',
      content: 'import { foo } from "nonexistent-pkg";\nconsole.log(foo());',
      language: 'typescript',
    },
  ],
  mode: 'deep',
};

const sampleAIResponse = {
  issues: [
    {
      file: 'src/app.ts',
      line: 1,
      category: 'HALLUCINATION',
      severity: 'critical',
      message: "Package 'nonexistent-pkg' does not exist on npm",
      fix: 'Remove this import or replace with a real package',
    },
  ],
};

function makeIssue(overrides: Partial<UnifiedIssue> = {}): UnifiedIssue {
  return {
    id: 'test:0',
    detector: 'test-detector',
    category: AIDefectCategory.HALLUCINATION,
    severity: 'high',
    message: 'Test issue',
    file: 'src/app.ts',
    line: 10,
    detectionSource: 'static',
    confidence: 0.9,
    ...overrides,
  };
}

// ─── Mock fetch ────────────────────────────────────────────────────

const originalFetch = globalThis.fetch;

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  globalThis.fetch = vi.fn(handler as any) as any;
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

// ─── OllamaProvider Tests ──────────────────────────────────────────

describe('OllamaProvider', () => {
  afterEach(() => restoreFetch());

  it('should have correct name and type', () => {
    const provider = new OllamaProvider();
    expect(provider.name).toBe('ollama');
    expect(provider.type).toBe('local');
  });

  it('should use default endpoint and model', () => {
    const provider = new OllamaProvider();
    expect(provider.name).toBe('ollama');
    // Defaults are internal but we can verify behavior via isAvailable
  });

  it('should accept custom endpoint and model', () => {
    const provider = new OllamaProvider({
      endpoint: 'http://custom:8080',
      model: 'deepseek-coder:7b',
    });
    expect(provider.name).toBe('ollama');
  });

  it('isAvailable returns true when model is listed', async () => {
    mockFetch(async () =>
      new Response(
        JSON.stringify({ models: [{ name: 'codellama:13b' }, { name: 'llama2:7b' }] }),
        { status: 200 },
      ),
    );

    const provider = new OllamaProvider({ model: 'codellama:13b' });
    const result = await provider.isAvailable();
    expect(result).toBe(true);
  });

  it('isAvailable returns false when model is not listed', async () => {
    mockFetch(async () =>
      new Response(JSON.stringify({ models: [{ name: 'llama2:7b' }] }), { status: 200 }),
    );

    const provider = new OllamaProvider({ model: 'codellama:13b' });
    const result = await provider.isAvailable();
    expect(result).toBe(false);
  });

  it('isAvailable returns false when Ollama is not running', async () => {
    mockFetch(async () => {
      throw new Error('Connection refused');
    });

    const provider = new OllamaProvider();
    const result = await provider.isAvailable();
    expect(result).toBe(false);
  });

  it('analyze returns issues from valid JSON response', async () => {
    mockFetch(async (_url: string) => {
      const urlStr = String(_url);
      if (urlStr.includes('/api/tags')) {
        return new Response(
          JSON.stringify({ models: [{ name: 'codellama:13b' }] }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({
          response: JSON.stringify(sampleAIResponse),
          eval_count: 100,
          prompt_eval_count: 200,
        }),
        { status: 200 },
      );
    });

    const provider = new OllamaProvider({ model: 'codellama:13b' });
    const result = await provider.analyze(sampleRequest);

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].category).toBe(AIDefectCategory.HALLUCINATION);
    expect(result.issues[0].severity).toBe('critical');
    expect(result.issues[0].detector).toBe('ai-analysis');
    expect(result.issues[0].detectionSource).toBe('ai');
    expect(result.provider).toBe('ollama');
    expect(result.tokensUsed).toBe(300);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('analyze returns empty array for malformed JSON', async () => {
    mockFetch(async () =>
      new Response(
        JSON.stringify({
          response: 'This is not JSON at all',
          eval_count: 50,
        }),
        { status: 200 },
      ),
    );

    const provider = new OllamaProvider();
    const result = await provider.analyze(sampleRequest);
    expect(result.issues).toHaveLength(0);
  });

  it('analyze throws on API error', async () => {
    mockFetch(async () => new Response('Internal Server Error', { status: 500 }));

    const provider = new OllamaProvider();
    await expect(provider.analyze(sampleRequest)).rejects.toThrow('Ollama API error 500');
  });

  it('analyze filters issues referencing unknown files', async () => {
    const responseWithBadFile = {
      issues: [
        {
          file: 'src/app.ts',
          line: 1,
          category: 'HALLUCINATION',
          severity: 'critical',
          message: 'Real issue',
        },
        {
          file: 'src/nonexistent.ts',
          line: 5,
          category: 'SECURITY',
          severity: 'high',
          message: 'Issue in unknown file',
        },
      ],
    };

    mockFetch(async () =>
      new Response(
        JSON.stringify({ response: JSON.stringify(responseWithBadFile), eval_count: 50 }),
        { status: 200 },
      ),
    );

    const provider = new OllamaProvider();
    const result = await provider.analyze(sampleRequest);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].file).toBe('src/app.ts');
  });
});

// ─── OpenAIProvider Tests ──────────────────────────────────────────

describe('OpenAIProvider', () => {
  afterEach(() => restoreFetch());

  it('should have correct name and type', () => {
    const provider = new OpenAIProvider({ apiKey: 'test-key' });
    expect(provider.name).toBe('openai');
    expect(provider.type).toBe('remote');
  });

  it('isAvailable returns true when API key is set', async () => {
    const provider = new OpenAIProvider({ apiKey: 'sk-test-key' });
    expect(await provider.isAvailable()).toBe(true);
  });

  it('isAvailable returns false when API key is empty', async () => {
    // Ensure env var is not set
    const original = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const provider = new OpenAIProvider({ apiKey: '' });
    expect(await provider.isAvailable()).toBe(false);

    if (original) process.env.OPENAI_API_KEY = original;
  });

  it('analyze returns issues from chat completion response', async () => {
    mockFetch(async () =>
      new Response(
        JSON.stringify({
          choices: [
            {
              message: { content: JSON.stringify(sampleAIResponse) },
            },
          ],
          usage: { total_tokens: 500, prompt_tokens: 400, completion_tokens: 100 },
        }),
        { status: 200 },
      ),
    );

    const provider = new OpenAIProvider({ apiKey: 'sk-test' });
    const result = await provider.analyze(sampleRequest);

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].id).toBe('ai-openai:0');
    expect(result.issues[0].category).toBe(AIDefectCategory.HALLUCINATION);
    expect(result.provider).toBe('openai');
    expect(result.tokensUsed).toBe(500);
  });

  it('analyze throws when no API key', async () => {
    const original = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const provider = new OpenAIProvider({ apiKey: '' });
    await expect(provider.analyze(sampleRequest)).rejects.toThrow('API key is not configured');

    if (original) process.env.OPENAI_API_KEY = original;
  });
});

// ─── AnthropicProvider Tests ───────────────────────────────────────

describe('AnthropicProvider', () => {
  afterEach(() => restoreFetch());

  it('should have correct name and type', () => {
    const provider = new AnthropicProvider({ apiKey: 'test-key' });
    expect(provider.name).toBe('anthropic');
    expect(provider.type).toBe('remote');
  });

  it('isAvailable returns true when API key is set', async () => {
    const provider = new AnthropicProvider({ apiKey: 'sk-ant-test' });
    expect(await provider.isAvailable()).toBe(true);
  });

  it('analyze returns issues from Messages API response', async () => {
    mockFetch(async () =>
      new Response(
        JSON.stringify({
          content: [
            {
              type: 'text',
              text: JSON.stringify(sampleAIResponse),
            },
          ],
          usage: { input_tokens: 400, output_tokens: 100 },
        }),
        { status: 200 },
      ),
    );

    const provider = new AnthropicProvider({ apiKey: 'sk-ant-test' });
    const result = await provider.analyze(sampleRequest);

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].id).toBe('ai-anthropic:0');
    expect(result.provider).toBe('anthropic');
    expect(result.tokensUsed).toBe(500);
  });

  it('analyze handles markdown-wrapped JSON from Anthropic', async () => {
    const wrappedResponse = '```json\n' + JSON.stringify(sampleAIResponse) + '\n```';

    mockFetch(async () =>
      new Response(
        JSON.stringify({
          content: [{ type: 'text', text: wrappedResponse }],
          usage: { input_tokens: 300, output_tokens: 80 },
        }),
        { status: 200 },
      ),
    );

    const provider = new AnthropicProvider({ apiKey: 'sk-ant-test' });
    const result = await provider.analyze(sampleRequest);

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].category).toBe(AIDefectCategory.HALLUCINATION);
  });
});

// ─── AIOrchestrator Tests ──────────────────────────────────────────

describe('AIOrchestrator', () => {
  afterEach(() => restoreFetch());

  it('initializes with default local-first strategy', () => {
    const orchestrator = new AIOrchestrator();
    expect(orchestrator.getStrategy()).toBe('local-first');
  });

  it('initializes providers from config', () => {
    const orchestrator = new AIOrchestrator({
      local: {
        enabled: true,
        provider: 'ollama',
        model: 'codellama:13b',
        endpoint: 'http://localhost:11434',
      },
      remote: {
        enabled: true,
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
      },
      strategy: 'remote-first',
    });

    expect(orchestrator.getProviders()).toHaveLength(2);
    expect(orchestrator.getStrategy()).toBe('remote-first');
  });

  it('local-first strategy tries local then remote', async () => {
    // Both providers fail → should return null
    mockFetch(async () => {
      throw new Error('Connection refused');
    });

    const orchestrator = new AIOrchestrator(
      {
        local: {
          enabled: true,
          provider: 'ollama',
          model: 'codellama:13b',
          endpoint: 'http://localhost:11434',
        },
        remote: {
          enabled: true,
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: '',  // empty key → not available
        },
        strategy: 'local-first',
      },
      'local-first',
    );

    const result = await orchestrator.analyze(sampleRequest);
    expect(result).toBeNull();
  });

  it('local-only strategy does not fall back to remote', async () => {
    mockFetch(async () => {
      throw new Error('Connection refused');
    });

    const orchestrator = new AIOrchestrator(
      {
        local: {
          enabled: true,
          provider: 'ollama',
          model: 'codellama:13b',
          endpoint: 'http://localhost:11434',
        },
        remote: {
          enabled: true,
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'sk-test',
        },
        strategy: 'local-only',
      },
      'local-only',
    );

    const result = await orchestrator.analyze(sampleRequest);
    // Even with a valid remote key, local-only should not use it
    expect(result).toBeNull();
  });

  it('remote-only strategy does not fall back to local', async () => {
    const original = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const orchestrator = new AIOrchestrator(
      {
        local: {
          enabled: true,
          provider: 'ollama',
          model: 'codellama:13b',
          endpoint: 'http://localhost:11434',
        },
        remote: {
          enabled: true,
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: '',  // not available
        },
        strategy: 'remote-only',
      },
      'remote-only',
    );

    const result = await orchestrator.analyze(sampleRequest);
    expect(result).toBeNull();

    if (original) process.env.OPENAI_API_KEY = original;
  });

  it('configures anthropic provider when specified', () => {
    const orchestrator = new AIOrchestrator({
      local: {
        enabled: false,
        provider: 'ollama',
        model: 'codellama:13b',
        endpoint: 'http://localhost:11434',
      },
      remote: {
        enabled: true,
        provider: 'anthropic',
        model: 'claude-3-5-haiku-latest',
        apiKey: 'sk-ant-test',
      },
      strategy: 'remote-only',
    });

    const providers = orchestrator.getProviders();
    expect(providers).toHaveLength(1);
    expect(providers[0].name).toBe('anthropic');
  });
});

// ─── mergeResults Tests ────────────────────────────────────────────

describe('AIOrchestrator.mergeResults', () => {
  it('returns static issues when no AI issues', () => {
    const staticIssues = [makeIssue({ id: 's:0' }), makeIssue({ id: 's:1', line: 20 })];
    const result = AIOrchestrator.mergeResults(staticIssues, []);

    expect(result).toHaveLength(2);
    expect(result[0].detectionSource).toBe('static');
  });

  it('returns AI issues when no static issues', () => {
    const aiIssues = [
      makeIssue({ id: 'ai:0', detectionSource: 'ai', confidence: 0.7 }),
    ];
    const result = AIOrchestrator.mergeResults([], aiIssues);

    expect(result).toHaveLength(1);
    // AI-only issues get confidence discount (0.7 * 0.8 = 0.56)
    expect(result[0].confidence).toBeCloseTo(0.56, 1);
  });

  it('deduplicates same file+line+category, keeps higher severity', () => {
    const staticIssues = [
      makeIssue({
        id: 's:0',
        file: 'src/app.ts',
        line: 10,
        category: AIDefectCategory.HALLUCINATION,
        severity: 'high',
        detectionSource: 'static',
      }),
    ];

    const aiIssues = [
      makeIssue({
        id: 'ai:0',
        file: 'src/app.ts',
        line: 10,
        category: AIDefectCategory.HALLUCINATION,
        severity: 'critical',
        detectionSource: 'ai',
      }),
    ];

    const result = AIOrchestrator.mergeResults(staticIssues, aiIssues);

    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('critical');  // AI had higher severity
    expect(result[0].detectionSource).toBe('both');
  });

  it('deduplicates within ±3 line tolerance', () => {
    const staticIssues = [
      makeIssue({
        id: 's:0',
        file: 'src/app.ts',
        line: 10,
        category: AIDefectCategory.SECURITY_ANTIPATTERN,
        severity: 'high',
      }),
    ];

    const aiIssues = [
      makeIssue({
        id: 'ai:0',
        file: 'src/app.ts',
        line: 12,  // within ±3
        category: AIDefectCategory.SECURITY_ANTIPATTERN,
        severity: 'medium',
        detectionSource: 'ai',
      }),
    ];

    const result = AIOrchestrator.mergeResults(staticIssues, aiIssues);

    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('high');  // static was higher
    expect(result[0].detectionSource).toBe('both');
  });

  it('does not deduplicate when line difference > 3', () => {
    const staticIssues = [
      makeIssue({ id: 's:0', line: 10, category: AIDefectCategory.HALLUCINATION }),
    ];

    const aiIssues = [
      makeIssue({
        id: 'ai:0',
        line: 50,  // too far
        category: AIDefectCategory.HALLUCINATION,
        detectionSource: 'ai',
        confidence: 0.7,
      }),
    ];

    const result = AIOrchestrator.mergeResults(staticIssues, aiIssues);
    expect(result).toHaveLength(2);
  });

  it('does not deduplicate different categories', () => {
    const staticIssues = [
      makeIssue({ id: 's:0', line: 10, category: AIDefectCategory.HALLUCINATION }),
    ];

    const aiIssues = [
      makeIssue({
        id: 'ai:0',
        line: 10,
        category: AIDefectCategory.SECURITY_ANTIPATTERN,  // different category
        detectionSource: 'ai',
        confidence: 0.7,
      }),
    ];

    const result = AIOrchestrator.mergeResults(staticIssues, aiIssues);
    expect(result).toHaveLength(2);
  });

  it('filters issues with very low confidence', () => {
    const aiIssues = [
      makeIssue({ id: 'ai:0', detectionSource: 'ai', confidence: 0.2 }),  // 0.2 * 0.8 = 0.16 < 0.3
    ];

    const result = AIOrchestrator.mergeResults([], aiIssues);
    expect(result).toHaveLength(0);
  });
});

// ─── Prompt Tests ──────────────────────────────────────────────────

describe('buildAnalysisPrompt', () => {
  it('includes file content and path', () => {
    const prompt = buildAnalysisPrompt(sampleRequest.files, 'deep');

    expect(prompt).toContain('src/app.ts');
    expect(prompt).toContain('nonexistent-pkg');
    expect(prompt).toContain('typescript');
  });

  it('includes deep analysis instruction for deep mode', () => {
    const prompt = buildAnalysisPrompt(sampleRequest.files, 'deep');
    expect(prompt).toContain('DEEP analysis');
  });

  it('includes quick analysis instruction for quick mode', () => {
    const prompt = buildAnalysisPrompt(sampleRequest.files, 'quick');
    expect(prompt).toContain('QUICK analysis');
    expect(prompt).toContain('critical and high severity');
  });

  it('includes all defect categories', () => {
    const prompt = buildAnalysisPrompt(sampleRequest.files, 'deep');
    expect(prompt).toContain('HALLUCINATION');
    expect(prompt).toContain('STALE_KNOWLEDGE');
    expect(prompt).toContain('CONTEXT_LOSS');
    expect(prompt).toContain('SECURITY');
    expect(prompt).toContain('OVER_ENGINEERING');
    expect(prompt).toContain('INCOMPLETE');
    expect(prompt).toContain('TYPE_SAFETY');
  });

  it('includes JSON response format example', () => {
    const prompt = buildAnalysisPrompt(sampleRequest.files, 'deep');
    expect(prompt).toContain('"issues"');
    expect(prompt).toContain('"file"');
    expect(prompt).toContain('"line"');
    expect(prompt).toContain('"category"');
    expect(prompt).toContain('"severity"');
  });

  it('handles multiple files', () => {
    const files = [
      { path: 'a.ts', content: 'const a = 1;', language: 'typescript' },
      { path: 'b.py', content: 'a = 1', language: 'python' },
    ];

    const prompt = buildAnalysisPrompt(files, 'deep');
    expect(prompt).toContain('a.ts');
    expect(prompt).toContain('b.py');
    expect(prompt).toContain('const a = 1;');
    expect(prompt).toContain('a = 1');
  });
});

// ─── Category/Severity Mapping Tests ──────────────────────────────

describe('mapRawCategory', () => {
  it('maps standard categories', () => {
    expect(mapRawCategory('HALLUCINATION')).toBe('hallucination');
    expect(mapRawCategory('STALE_KNOWLEDGE')).toBe('stale-knowledge');
    expect(mapRawCategory('CONTEXT_LOSS')).toBe('context-loss');
    expect(mapRawCategory('SECURITY')).toBe('security');
    expect(mapRawCategory('OVER_ENGINEERING')).toBe('over-engineering');
    expect(mapRawCategory('INCOMPLETE')).toBe('incomplete');
    expect(mapRawCategory('TYPE_SAFETY')).toBe('type-safety');
  });

  it('maps alternative category names', () => {
    expect(mapRawCategory('STALE_API')).toBe('stale-knowledge');
    expect(mapRawCategory('DEPRECATED')).toBe('stale-knowledge');
    expect(mapRawCategory('CONTEXT_BREAK')).toBe('context-loss');
    expect(mapRawCategory('SECURITY_ANTIPATTERN')).toBe('security');
    expect(mapRawCategory('OVERENGINEERING')).toBe('over-engineering');
    expect(mapRawCategory('INCOMPLETE_IMPL')).toBe('incomplete');
  });

  it('defaults to hallucination for unknown categories', () => {
    expect(mapRawCategory('UNKNOWN_THING')).toBe('hallucination');
  });
});

describe('mapRawSeverity', () => {
  it('maps valid severity strings', () => {
    expect(mapRawSeverity('critical')).toBe('critical');
    expect(mapRawSeverity('high')).toBe('high');
    expect(mapRawSeverity('medium')).toBe('medium');
    expect(mapRawSeverity('low')).toBe('low');
    expect(mapRawSeverity('info')).toBe('info');
  });

  it('defaults to medium for unknown severity', () => {
    expect(mapRawSeverity('unknown')).toBe('medium');
    expect(mapRawSeverity('CRITICAL')).toBe('critical'); // case insensitive
  });
});

// ─── AIDetector Tests ──────────────────────────────────────────────

describe('AIDetector', () => {
  it('has correct name, version, and tier', () => {
    const detector = new AIDetector();
    expect(detector.name).toBe('ai-analysis');
    expect(detector.version).toBe('1.0.0');
    expect(detector.tier).toBe(3);
  });

  it('returns empty array for empty file list', async () => {
    const detector = new AIDetector();
    const result = await detector.detect([]);
    expect(result).toEqual([]);
  });

  it('returns empty array when no provider is available', async () => {
    mockFetch(async () => {
      throw new Error('Connection refused');
    });

    const original = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const detector = new AIDetector({
      local: {
        enabled: true,
        provider: 'ollama',
        model: 'codellama:13b',
        endpoint: 'http://localhost:11434',
      },
      strategy: 'local-only',
    });

    const result = await detector.detect([
      { path: 'test.ts', content: 'const x = 1;', language: 'typescript' },
    ]);

    expect(result).toEqual([]);

    if (original) process.env.OPENAI_API_KEY = original;
    restoreFetch();
  });

  it('gracefully handles provider errors', async () => {
    mockFetch(async () => new Response('Server Error', { status: 500 }));

    const detector = new AIDetector({
      local: {
        enabled: true,
        provider: 'ollama',
        model: 'codellama:13b',
        endpoint: 'http://localhost:11434',
      },
      strategy: 'local-only',
    });

    // The isAvailable check would also fail with a 500
    const result = await detector.detect([
      { path: 'test.ts', content: 'const x = 1;', language: 'typescript' },
    ]);

    expect(result).toEqual([]);
    restoreFetch();
  });
});
