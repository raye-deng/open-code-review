/**
 * Cross-File Context Window Tests
 *
 * Tests the L3 cross-file analysis capability for detecting
 * AI-generated contradictions across multiple files.
 *
 * @since 0.5.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CrossFileContextAnalyzer } from '../../ai/v4/cross-file-context.js';
import { createCodeUnit } from '../../ir/types.js';
import type { CodeUnit } from '../../ir/types.js';

describe('Cross-File Context Analyzer', () => {
  let analyzer: CrossFileContextAnalyzer;

  beforeEach(() => {
    analyzer = new CrossFileContextAnalyzer({
      maxFilesPerGroup: 5,
      minGroupSize: 2,
    });
  });

  describe('File Relationship Analysis', () => {
    it('should categorize files correctly', () => {
      const units: CodeUnit[] = [
        createFileUnit('src/main.ts', 'typescript', 'console.log("main");'),
        createFileUnit('src/utils/helper.ts', 'typescript', 'export function help() {}'),
        createFileUnit('tests/main.test.ts', 'typescript', 'test("main", () => {});'),
        createFileUnit('config/app.config.ts', 'typescript', 'export const config = {}'),
      ];

      const relationships = analyzer.analyzeFileRelationships(units);

      expect(relationships).toHaveLength(4);
      
      const mainRel = relationships.find(r => r.file === 'src/main.ts');
      expect(mainRel?.category).toBe('entry');
      
      const helperRel = relationships.find(r => r.file === 'src/utils/helper.ts');
      expect(helperRel?.category).toBe('library');
      
      const testRel = relationships.find(r => r.file === 'tests/main.test.ts');
      expect(testRel?.category).toBe('test');
      
      const configRel = relationships.find(r => r.file === 'config/app.config.ts');
      expect(configRel?.category).toBe('config');
    });

    it('should detect import relationships', () => {
      const units: CodeUnit[] = [
        createFileUnit('src/app.ts', 'typescript', `
          import { UserService } from './user-service';
          import { Logger } from './utils/logger';
          
          const service = new UserService();
          Logger.info('App started');
        `),
        createFileUnit('src/user-service.ts', 'typescript', `
          import { Logger } from '../utils/logger';
          
          export class UserService {
            constructor() {
              Logger.debug('Service created');
            }
          }
        `),
        createFileUnit('src/utils/logger.ts', 'typescript', `
          export class Logger {
            static info(msg: string) { console.log(msg); }
            static debug(msg: string) { console.log(msg); }
          }
        `),
      ];

      const relationships = analyzer.analyzeFileRelationships(units);

      const appRel = relationships.find(r => r.file === 'src/app.ts');
      const serviceRel = relationships.find(r => r.file === 'src/user-service.ts');
      const loggerRel = relationships.find(r => r.file === 'src/utils/logger.ts');

      expect(appRel?.imports).toContain('user-service');
      expect(appRel?.imports).toContain('utils/logger');
      expect(serviceRel?.imports).toContain('../utils/logger');
      expect(loggerRel?.importedBy).toContain('src/app.ts');
      expect(loggerRel?.importedBy).toContain('src/user-service.ts');
    });
  });

  describe('File Grouping', () => {
    it('should group related files by import chains', () => {
      const units: CodeUnit[] = [
        createFileUnit('src/app.ts', 'typescript', `
          import { UserService } from './user-service';
          import { AuthService } from './auth-service';
          
          const userSvc = new UserService();
          const authSvc = new AuthService();
        `),
        createFileUnit('src/user-service.ts', 'typescript', `
          import { Database } from '../database';
          
          export class UserService {
            constructor() {
              new Database();
            }
          }
        `),
        createFileUnit('src/auth-service.ts', 'typescript', `
          import { Database } from '../database';
          import { Cache } from '../cache';
          
          export class AuthService {
            constructor() {
              new Database();
              new Cache();
            }
          }
        `),
        createFileUnit('src/database.ts', 'typescript', `
          export class Database {
            constructor() {}
          }
        `),
        createFileUnit('src/cache.ts', 'typescript', `
          export class Cache {
            constructor() {}
          }
        `),
      ];

      const relationships = analyzer.analyzeFileRelationships(units);
      const groups = analyzer.groupFilesForAnalysis(units, relationships);

      // Should have at least one group with multiple files
      const multiFileGroups = groups.filter(g => g.files.length > 1);
      expect(multiFileGroups.length).toBeGreaterThan(0);

      // Check that related files are grouped together
      const appGroup = groups.find(g => g.primaryFile.file === 'src/app.ts');
      expect(appGroup?.files.length).toBeGreaterThan(1);
      expect(appGroup?.relationship).toBe('import-chain');
    });

    it('should handle single-file groups appropriately', () => {
      const units: CodeUnit[] = [
        createFileUnit('src/standalone.ts', 'typescript', 'console.log("standalone");'),
      ];

      const relationships = analyzer.analyzeFileRelationships(units);
      const groups = analyzer.groupFilesForAnalysis(units, relationships);

      expect(groups).toHaveLength(1);
      expect(groups[0].files).toHaveLength(1);
      expect(groups[0].relationship).toBe('cohesive-module');
    });
  });

  describe('Cross-File Issue Detection', () => {
    it('should extract cross-file issues from LLM response', () => {
      const fileGroup = {
        id: 'test-group',
        files: [createFileUnit('test.ts', 'typescript', '')],
        relationship: 'import-chain' as const,
        primaryFile: createFileUnit('test.ts', 'typescript', ''),
      };

      const llmResponse = JSON.stringify({
        issues: [
          {
            line: 1,
            severity: 'error' as const,
            message: 'Type definition inconsistency for User interface',
            category: 'type-mismatch',
            crossFile: true,
            files: ['user-service.ts', 'user-controller.ts'],
            symbols: ['User', 'id'],
          },
        ],
      });

      const issues = analyzer.extractCrossFileIssues(llmResponse, fileGroup);

      expect(issues).toHaveLength(1);
      expect(issues[0].detectorId).toBe('cross-file-context');
      expect(issues[0].severity).toBe('error');
      expect(issues[0].category).toBe('cross-file-contradiction');
      expect(issues[0].metadata?.crossFile).toBe(true);
      expect(issues[0].metadata?.files).toEqual(['user-service.ts', 'user-controller.ts']);
    });

    it('should handle malformed LLM responses gracefully', () => {
      const fileGroup = {
        id: 'test-group',
        files: [createFileUnit('test.ts', 'typescript', '')],
        relationship: 'import-chain' as const,
        primaryFile: createFileUnit('test.ts', 'typescript', ''),
      };

      const malformedResponse = 'This is not valid JSON';
      const issues = analyzer.extractCrossFileIssues(malformedResponse, fileGroup);

      expect(issues).toHaveLength(0); // Should not crash, should return empty array
    });

    it('should skip non-cross-file issues', () => {
      const fileGroup = {
        id: 'test-group',
        files: [createFileUnit('test.ts', 'typescript', '')],
        relationship: 'import-chain' as const,
        primaryFile: createFileUnit('test.ts', 'typescript', ''),
      };

      const llmResponse = JSON.stringify({
        issues: [
          {
            line: 1,
            severity: 'error' as const,
            message: 'Single file issue',
            category: 'security-pattern',
            crossFile: false, // Not a cross-file issue
            files: ['single-file.ts'],
            symbols: ['User'],
          },
        ],
      });

      const issues = analyzer.extractCrossFileIssues(llmResponse, fileGroup);

      expect(issues).toHaveLength(0); // Should only extract cross-file issues
    });
  });

  describe('Multi-File Prompt Generation', () => {
    it('should build comprehensive multi-file prompt', () => {
      const files: CodeUnit[] = [
        createFileUnit('src/service.ts', 'typescript', `
          export interface User {
            id: number;
            name: string;
          }
        `),
        createFileUnit('src/controller.ts', 'typescript', `
          import { User } from './service';
          
          interface User {
            id: string; // Type mismatch!
            name: string;
          }
        `),
      ];

      const fileGroup = {
        id: 'test-group',
        files,
        relationship: 'import-chain' as const,
        primaryFile: files[0],
      };

      const prompt = analyzer.buildMultiFilePrompt(fileGroup);

      expect(prompt).toContain('Cross-File Analysis Tasks');
      expect(prompt).toContain('Type Inconsistencies');
      expect(prompt).toContain('Files Analyzed');
      expect(prompt).toContain('src/service.ts');
      expect(prompt).toContain('src/controller.ts');
      expect(prompt).toContain('Focus on AI-Specific Issues');
      expect(prompt).toContain('Respond in JSON format');
    });
  });
});

// Helper function to create test CodeUnits
function createFileUnit(file: string, language: string, source: string): CodeUnit {
  return createCodeUnit({
    id: `file:${file}`,
    file,
    language: language as any,
    kind: 'file',
    location: {
      startLine: 0,
      startColumn: 0,
      endLine: source.split('\n').length - 1,
      endColumn: source.split('\n')[source.split('\n').length - 1].length,
    },
    source,
    imports: [],
    calls: [],
    complexity: {
      cyclomaticComplexity: 1,
      cognitiveComplexity: 1,
      maxNestingDepth: 1,
      linesOfCode: source.split('\n').length,
    },
    definitions: [],
    references: [],
    childIds: [],
  });
}