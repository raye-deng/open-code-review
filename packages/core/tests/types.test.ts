/**
 * V3 Unified Type System Tests
 *
 * Tests the core type definitions, enums, and constants.
 */

import { describe, it, expect } from 'vitest';
import {
  AIDefectCategory,
  SEVERITY_DEDUCTIONS,
  SCORING_WEIGHTS,
  CATEGORY_DIMENSION_MAP,
} from '../src/types.js';

describe('AIDefectCategory', () => {
  it('should have 10 categories', () => {
    const values = Object.values(AIDefectCategory);
    expect(values.length).toBe(10);
  });

  it('should have correct enum values', () => {
    expect(AIDefectCategory.HALLUCINATION).toBe('hallucination');
    expect(AIDefectCategory.STALE_KNOWLEDGE).toBe('stale-knowledge');
    expect(AIDefectCategory.CONTEXT_LOSS).toBe('context-loss');
    expect(AIDefectCategory.SECURITY_ANTIPATTERN).toBe('security');
    expect(AIDefectCategory.OVER_ENGINEERING).toBe('over-engineering');
    expect(AIDefectCategory.INCOMPLETE_IMPL).toBe('incomplete');
    expect(AIDefectCategory.TYPE_SAFETY).toBe('type-safety');
    expect(AIDefectCategory.ERROR_HANDLING).toBe('error-handling');
    expect(AIDefectCategory.DUPLICATION).toBe('duplication');
    expect(AIDefectCategory.TRAINING_LEAK).toBe('training-leak');
  });
});

describe('SEVERITY_DEDUCTIONS', () => {
  it('should have 5 severity levels', () => {
    expect(Object.keys(SEVERITY_DEDUCTIONS).length).toBe(5);
  });

  it('should have correct deduction values', () => {
    expect(SEVERITY_DEDUCTIONS.critical).toBe(15);
    expect(SEVERITY_DEDUCTIONS.high).toBe(10);
    expect(SEVERITY_DEDUCTIONS.medium).toBe(5);
    expect(SEVERITY_DEDUCTIONS.low).toBe(2);
    expect(SEVERITY_DEDUCTIONS.info).toBe(0);
  });

  it('should have decreasing deductions from critical to info', () => {
    expect(SEVERITY_DEDUCTIONS.critical).toBeGreaterThan(SEVERITY_DEDUCTIONS.high);
    expect(SEVERITY_DEDUCTIONS.high).toBeGreaterThan(SEVERITY_DEDUCTIONS.medium);
    expect(SEVERITY_DEDUCTIONS.medium).toBeGreaterThan(SEVERITY_DEDUCTIONS.low);
    expect(SEVERITY_DEDUCTIONS.low).toBeGreaterThan(SEVERITY_DEDUCTIONS.info);
  });
});

describe('SCORING_WEIGHTS', () => {
  it('should sum to 100', () => {
    const sum = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('should have correct weights per dimension', () => {
    expect(SCORING_WEIGHTS.faithfulness).toBe(35);
    expect(SCORING_WEIGHTS.freshness).toBe(25);
    expect(SCORING_WEIGHTS.coherence).toBe(20);
    expect(SCORING_WEIGHTS.quality).toBe(20);
  });
});

describe('CATEGORY_DIMENSION_MAP', () => {
  it('should map all 10 categories', () => {
    const mappedCategories = Object.keys(CATEGORY_DIMENSION_MAP);
    const allCategories = Object.values(AIDefectCategory);
    expect(mappedCategories.length).toBe(allCategories.length);
  });

  it('should map hallucination to faithfulness', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.HALLUCINATION]).toBe('faithfulness');
  });

  it('should map stale knowledge to freshness', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.STALE_KNOWLEDGE]).toBe('freshness');
  });

  it('should map context loss to coherence', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.CONTEXT_LOSS]).toBe('coherence');
  });

  it('should map implementation categories to quality', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.INCOMPLETE_IMPL]).toBe('quality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.DUPLICATION]).toBe('quality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.ERROR_HANDLING]).toBe('quality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.TYPE_SAFETY]).toBe('quality');
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.OVER_ENGINEERING]).toBe('quality');
  });

  it('should map security to faithfulness', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.SECURITY_ANTIPATTERN]).toBe('faithfulness');
  });

  it('should map training leak to faithfulness', () => {
    expect(CATEGORY_DIMENSION_MAP[AIDefectCategory.TRAINING_LEAK]).toBe('faithfulness');
  });
});
