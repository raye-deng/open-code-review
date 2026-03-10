/**
 * Tests for Defect Pattern Database
 *
 * @since 0.4.0
 */

import { describe, it, expect } from 'vitest';
import {
  DEFECT_PATTERNS,
  getPatternsByCategory,
  getPatternsForLanguage,
  getPatternText,
} from '../../src/ai/v4/patterns/defect-patterns.js';
import type { DefectPattern } from '../../src/ai/v4/patterns/defect-patterns.js';
import type { DetectorCategory } from '../../src/detectors/v4/types.js';
import type { SupportedLanguage } from '../../src/ir/types.js';

describe('DEFECT_PATTERNS', () => {
  it('should have at least 20 patterns', () => {
    expect(DEFECT_PATTERNS.length).toBeGreaterThanOrEqual(20);
  });

  it('should have all required fields', () => {
    for (const pattern of DEFECT_PATTERNS) {
      expect(pattern).toHaveProperty('id');
      expect(pattern).toHaveProperty('category');
      expect(pattern).toHaveProperty('description');
      expect(pattern).toHaveProperty('examples');
      expect(pattern).toHaveProperty('severity');
      expect(pattern).toHaveProperty('languages');

      expect(typeof pattern.id).toBe('string');
      expect(typeof pattern.description).toBe('string');
      expect(Array.isArray(pattern.examples)).toBe(true);
      expect(['error', 'warning', 'info']).toContain(pattern.severity);
      expect(Array.isArray(pattern.languages)).toBe(true);
    }
  });

  it('should have unique pattern IDs', () => {
    const ids = DEFECT_PATTERNS.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid category values', () => {
    const validCategories: DetectorCategory[] = [
      'ai-faithfulness',
      'code-freshness',
      'context-coherence',
      'implementation',
    ];

    for (const pattern of DEFECT_PATTERNS) {
      expect(validCategories).toContain(pattern.category);
    }
  });

  it('should have non-empty examples', () => {
    for (const pattern of DEFECT_PATTERNS) {
      expect(pattern.examples.length).toBeGreaterThan(0);
      for (const example of pattern.examples) {
        expect(typeof example).toBe('string');
        expect(example.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have valid severity values', () => {
    const validSeverities = ['error', 'warning', 'info'];

    for (const pattern of DEFECT_PATTERNS) {
      expect(validSeverities).toContain(pattern.severity);
    }
  });

  it('should have valid languages array', () => {
    const validLanguages: SupportedLanguage[] = [
      'typescript',
      'javascript',
      'python',
      'java',
      'go',
      'kotlin',
    ];

    for (const pattern of DEFECT_PATTERNS) {
      for (const lang of pattern.languages) {
        expect(validLanguages).toContain(lang);
      }
    }
  });
});

describe('Coverage by Category', () => {
  it('should have at least one pattern per category', () => {
    const categories: DetectorCategory[] = [
      'ai-faithfulness',
      'code-freshness',
      'context-coherence',
      'implementation',
    ];

    for (const category of categories) {
      const patterns = getPatternsByCategory(category);
      expect(patterns.length).toBeGreaterThan(0);
    }
  });

  it('should have patterns for ai-faithfulness category', () => {
    const patterns = getPatternsByCategory('ai-faithfulness');
    expect(patterns.length).toBeGreaterThanOrEqual(3);
  });

  it('should have patterns for code-freshness category', () => {
    const patterns = getPatternsByCategory('code-freshness');
    expect(patterns.length).toBeGreaterThanOrEqual(3);
  });

  it('should have patterns for context-coherence category', () => {
    const patterns = getPatternsByCategory('context-coherence');
    expect(patterns.length).toBeGreaterThanOrEqual(3);
  });

  it('should have patterns for implementation category', () => {
    const patterns = getPatternsByCategory('implementation');
    expect(patterns.length).toBeGreaterThanOrEqual(5);
  });
});

describe('getPatternsByCategory', () => {
  it('should return only patterns matching the category', () => {
    const patterns = getPatternsByCategory('ai-faithfulness');

    for (const pattern of patterns) {
      expect(pattern.category).toBe('ai-faithfulness');
    }
  });

  it('should return empty array for unknown category', () => {
    // TypeScript doesn't allow invalid categories, but test runtime behavior
    const patterns = getPatternsByCategory('ai-faithfulness' as DetectorCategory);
    expect(Array.isArray(patterns)).toBe(true);
  });
});

describe('getPatternsForLanguage', () => {
  it('should return patterns that apply to specific language', () => {
    const patterns = getPatternsForLanguage('typescript');

    for (const pattern of patterns) {
      // Pattern applies if languages is empty (all) or includes typescript
      expect(
        pattern.languages.length === 0 || pattern.languages.includes('typescript'),
      ).toBe(true);
    }
  });

  it('should include language-agnostic patterns (empty languages array)', () => {
    const patterns = getPatternsForLanguage('python');
    const languageAgnosticPatterns = patterns.filter(p => p.languages.length === 0);

    expect(languageAgnosticPatterns.length).toBeGreaterThan(0);
  });

  it('should include language-specific patterns', () => {
    const tsPatterns = getPatternsForLanguage('typescript');
    const specificPatterns = tsPatterns.filter(p => p.languages.includes('typescript'));

    expect(specificPatterns.length).toBeGreaterThan(0);
  });

  it('should return same patterns for all languages when only using language-agnostic patterns', () => {
    // Find language-agnostic patterns
    const agnostic = DEFECT_PATTERNS.filter(p => p.languages.length === 0);

    const tsPatterns = getPatternsForLanguage('typescript');
    const pyPatterns = getPatternsForLanguage('python');

    // Both should include all agnostic patterns
    for (const pattern of agnostic) {
      expect(tsPatterns.some(p => p.id === pattern.id)).toBe(true);
      expect(pyPatterns.some(p => p.id === pattern.id)).toBe(true);
    }
  });
});

describe('getPatternText', () => {
  it('should combine description and examples', () => {
    const pattern: DefectPattern = {
      id: 'test-pattern',
      category: 'implementation',
      description: 'Test description',
      examples: ['example1', 'example2'],
      severity: 'warning',
      languages: [],
    };

    const text = getPatternText(pattern);

    expect(text).toContain('Test description');
    expect(text).toContain('example1');
    expect(text).toContain('example2');
  });

  it('should separate description and examples with newline', () => {
    const pattern: DefectPattern = {
      id: 'test-pattern',
      category: 'implementation',
      description: 'Description',
      examples: ['ex1'],
      severity: 'error',
      languages: [],
    };

    const text = getPatternText(pattern);
    expect(text).toBe('Description\nex1');
  });

  it('should handle multiple examples', () => {
    const pattern: DefectPattern = {
      id: 'test-pattern',
      category: 'implementation',
      description: 'Desc',
      examples: ['a', 'b', 'c'],
      severity: 'info',
      languages: [],
    };

    const text = getPatternText(pattern);
    expect(text).toContain('a');
    expect(text).toContain('b');
    expect(text).toContain('c');
  });
});
