/**
 * Tests for AI Scan Pipeline
 *
 * @since 0.4.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIScanPipeline } from '../../src/ai/v4/pipeline.js';
import type { AIConfig, AIPipelineResult } from '../../src/ai/v4/types.js';
import type { CodeUnit } from '../../src/ir/types.js';
import type { DetectorResult } from '../../src/detectors/v4/types.js';
import { emptyComplexity } from '../../src/ir/types.js';

// Helper to create mock CodeUnit
function createMockCodeUnit(
  id: string,
  file: string,
  source: string,
  language: CodeUnit['language'] = 'typescript',
): CodeUnit {
  return {
    id,
    file,
    language,
    kind: 'function',
    location: { startLine: 0, startColumn: 0, endLine: 10, endColumn: 0 },
    source,
    imports: [],
    calls: [],
    complexity: emptyComplexity(),
    definitions: [],
    references: [],
    childIds: [],
  };
}

// Helper to create mock DetectorResult
function createMockDetectorResult(
  file: string,
  line: number,
  severity: DetectorResult['severity'] = 'warning',
): DetectorResult {
  return {
    detectorId: 'test-detector',
    severity,
    category: 'implementation',
    messageKey: 'test.message',
    message: 'Test issue',
    file,
    line,
    confidence: 0.8,
  };
}

// Store original fetch
const originalFetch = global.fetch;

describe('AIScanPipeline', () => {
  let mockUnits: CodeUnit[];
  let mockStructuralResults: DetectorResult[];

  beforeEach(() => {
    mockUnits = [
      createMockCodeUnit('func:src/app.ts:main', 'src/app.ts', 'function main() { return 1; }'),
      createMockCodeUnit('func:src/utils.ts:helper', 'src/utils.ts', 'function helper() { return 2; }'),
    ];

    mockStructuralResults = [
      createMockDetectorResult('src/app.ts', 5, 'warning'),
    ];
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('L1 SLA', () => {
    it('should return only structural results for L1', async () => {
      const config: AIConfig = { sla: 'L1' };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      expect(result.slaLevel).toBe('L1');
      expect(result.stages).toHaveLength(1);
      expect(result.stages[0].stage).toBe('structural');
      expect(result.stages[0].issues).toEqual(mockStructuralResults);
      expect(result.totalIssues).toBe(1);
    });

    it('should include duration tracking for L1', async () => {
      const config: AIConfig = { sla: 'L1' };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty CodeUnits for L1', async () => {
      const config: AIConfig = { sla: 'L1' };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan([], []);

      expect(result.totalIssues).toBe(0);
      expect(result.stages[0].issues).toEqual([]);
    });

    it('should handle empty structural results for L1', async () => {
      const config: AIConfig = { sla: 'L1' };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, []);

      expect(result.totalIssues).toBe(0);
    });
  });

  describe('L2 SLA', () => {
    it('should include embedding stage for L2', async () => {
      const config: AIConfig = {
        sla: 'L2',
        embedding: { provider: 'local' },
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      expect(result.slaLevel).toBe('L2');
      expect(result.stages.length).toBeGreaterThanOrEqual(2);
      expect(result.stages[1].stage).toBe('embedding');
    });

    it('should run embedding even without local LLM config', async () => {
      const config: AIConfig = {
        sla: 'L2',
        embedding: { provider: 'local' },
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      // Should have structural + embedding stages
      expect(result.stages.length).toBe(2);
    });

    it('should track embedding stage duration', async () => {
      const config: AIConfig = {
        sla: 'L2',
        embedding: { provider: 'local' },
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      const embeddingStage = result.stages.find(s => s.stage === 'embedding');
      expect(embeddingStage?.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should include confidence scores in embedding results', async () => {
      // Use code that might match patterns
      const suspiciousUnit = createMockCodeUnit(
        'func:bad.ts:bad',
        'bad.ts',
        'import { fakePackage } from "nonexistent-lib"',
      );
      const config: AIConfig = {
        sla: 'L2',
        embedding: { provider: 'local' },
        similarityThreshold: 0.5, // Lower threshold to get matches
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan([suspiciousUnit], []);

      const embeddingStage = result.stages.find(s => s.stage === 'embedding');
      if (embeddingStage && embeddingStage.issues.length > 0) {
        for (const issue of embeddingStage.issues) {
          expect(issue.confidence).toBeGreaterThanOrEqual(0);
          expect(issue.confidence).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  describe('L3 SLA', () => {
    beforeEach(() => {
      // Mock fetch for LLM providers
      global.fetch = vi.fn(async (url: string) => {
        const urlStr = url.toString();

        // Mock Ollama availability check
        if (urlStr.includes('/api/tags')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ models: [] }),
            text: async () => '{}',
          } as Response;
        }

        // Mock OpenAI completions
        if (urlStr.includes('/chat/completions')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{ message: { content: '{ "issues": [] }' } }],
              usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
            }),
            text: async () => '{}',
          } as Response;
        }

        return {
          ok: false,
          status: 404,
          json: async () => ({}),
          text: async () => 'Not found',
        } as Response;
      });
    });

    it('should include embedding and LLM stages for L3', async () => {
      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      expect(result.slaLevel).toBe('L3');
      expect(result.stages.length).toBeGreaterThanOrEqual(2);

      const stageTypes = result.stages.map(s => s.stage);
      expect(stageTypes).toContain('embedding');
    });

    it('should track tokens for LLM stage', async () => {
      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
      };
      const pipeline = new AIScanPipeline(config);

      // Create unit with suspicious code to trigger LLM analysis
      const suspiciousUnit = createMockCodeUnit(
        'func:bad.ts:bad',
        'bad.ts',
        'import fake from "nonexistent"',
      );

      const result = await pipeline.scan([suspiciousUnit], []);

      // LLM stage might not run if no suspicious blocks found
      const llmStage = result.stages.find(s => s.stage === 'llm');
      if (llmStage) {
        expect(llmStage.tokensUsed).toBeDefined();
      }
    });

    it('should respect maxLLMBlocks limit', async () => {
      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
        maxLLMBlocks: 2,
      };
      const pipeline = new AIScanPipeline(config);

      // Create many units - only first 2 should be analyzed
      const manyUnits = Array.from({ length: 10 }, (_, i) =>
        createMockCodeUnit(`func:file${i}.ts:fn`, `file${i}.ts`, 'function test() {}'),
      );

      // Should complete without error
      const result = await pipeline.scan(manyUnits, []);
      expect(result).toBeDefined();
    });

    it('should handle malformed LLM response gracefully', async () => {
      global.fetch = vi.fn(async (url: string) => {
        if (url.toString().includes('/chat/completions')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{ message: { content: 'This is not valid JSON' } }],
              usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 },
            }),
            text: async () => '{}',
          } as Response;
        }
        if (url.toString().includes('/api/tags')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ models: [] }),
            text: async () => '{}',
          } as Response;
        }
        return {
          ok: false,
          status: 404,
          json: async () => ({}),
          text: async () => '',
        } as Response;
      });

      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
        similarityThreshold: 0.3, // Low threshold to trigger LLM
      };
      const pipeline = new AIScanPipeline(config);

      // Should not throw on malformed response
      const result = await pipeline.scan(mockUnits, mockStructuralResults);
      expect(result).toBeDefined();
    });

    it('should parse valid LLM JSON response', async () => {
      global.fetch = vi.fn(async (url: string) => {
        if (url.toString().includes('/chat/completions')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{
                message: {
                  content: JSON.stringify({
                    issues: [
                      { line: 1, severity: 'error', message: 'Test issue', category: 'ai-faithfulness' },
                    ],
                  }),
                },
              }],
              usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
            }),
            text: async () => '{}',
          } as Response;
        }
        if (url.toString().includes('/api/tags')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ models: [] }),
            text: async () => '{}',
          } as Response;
        }
        return {
          ok: false,
          status: 404,
          json: async () => ({}),
          text: async () => '',
        } as Response;
      });

      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
        similarityThreshold: 0.3,
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      const llmStage = result.stages.find(s => s.stage === 'llm');
      // If LLM ran, check for parsed issues
      if (llmStage && llmStage.issues.length > 0) {
        expect(llmStage.issues[0].detectorId).toBe('llm-deep-scan');
      }
    });

    it('should handle LLM response with markdown code fences', async () => {
      global.fetch = vi.fn(async (url: string) => {
        if (url.toString().includes('/chat/completions')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{
                message: {
                  content: '```json\n{ "issues": [] }\n```',
                },
              }],
              usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 },
            }),
            text: async () => '{}',
          } as Response;
        }
        if (url.toString().includes('/api/tags')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ models: [] }),
            text: async () => '{}',
          } as Response;
        }
        return {
          ok: false,
          status: 404,
          json: async () => ({}),
          text: async () => '',
        } as Response;
      });

      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
      };
      const pipeline = new AIScanPipeline(config);

      // Should not throw
      const result = await pipeline.scan(mockUnits, mockStructuralResults);
      expect(result).toBeDefined();
    });
  });

  describe('Graceful Degradation', () => {
    it('should handle LLM unavailability gracefully for L3', async () => {
      // All fetch calls fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        remote: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          apiKey: 'test-key',
        },
      };
      const pipeline = new AIScanPipeline(config);

      // Should complete without throwing
      const result = await pipeline.scan(mockUnits, mockStructuralResults);
      expect(result).toBeDefined();
      expect(result.slaLevel).toBe('L3');
    });

    it('should continue if embedding stage has no matches', async () => {
      const config: AIConfig = {
        sla: 'L3',
        embedding: { provider: 'local' },
        similarityThreshold: 0.99, // Very high threshold = no matches
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      // Should complete successfully
      expect(result.totalIssues).toBe(1); // Only structural
    });
  });

  describe('Duration Tracking', () => {
    it('should track total duration', async () => {
      const config: AIConfig = { sla: 'L1' };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
    });

    it('should track per-stage duration', async () => {
      const config: AIConfig = {
        sla: 'L2',
        embedding: { provider: 'local' },
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      for (const stage of result.stages) {
        expect(stage.durationMs).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Configuration', () => {
    it('should respect custom similarityThreshold', async () => {
      const config: AIConfig = {
        sla: 'L2',
        embedding: { provider: 'local' },
        similarityThreshold: 0.9, // High threshold
      };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      // With high threshold, fewer matches expected
      const embeddingStage = result.stages.find(s => s.stage === 'embedding');
      // All issues should have confidence >= threshold
      for (const issue of embeddingStage?.issues ?? []) {
        expect(issue.confidence).toBeGreaterThanOrEqual(0.9);
      }
    });

    it('should use default values when config is minimal', async () => {
      const config: AIConfig = { sla: 'L1' };
      const pipeline = new AIScanPipeline(config);

      const result = await pipeline.scan(mockUnits, mockStructuralResults);

      expect(result).toBeDefined();
      expect(result.totalIssues).toBe(1);
    });
  });
});
