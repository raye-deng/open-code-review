/**
 * AI Prompt Templates
 *
 * Structured prompts for AI-powered code analysis.
 * Designed to elicit consistent JSON output from LLMs.
 *
 * @since 0.3.0
 */

import type { AIAnalysisRequest } from './types.js';

// ─── Main Analysis Prompt ──────────────────────────────────────────

/**
 * Build the analysis prompt for AI code review.
 *
 * @param files - Files to include in the prompt
 * @param mode - 'quick' for L2 (critical/high only), 'deep' for L3 (all severities)
 * @returns Formatted prompt string
 */
export function buildAnalysisPrompt(
  files: AIAnalysisRequest['files'],
  mode: 'quick' | 'deep',
): string {
  const fileBlocks = files
    .map(
      (f) => `### ${f.path} (${f.language})
\`\`\`${f.language}
${f.content}
\`\`\``,
    )
    .join('\n\n');

  const depthInstruction =
    mode === 'deep'
      ? 'Perform a DEEP analysis. Check every import, every API call, every type annotation.'
      : 'Perform a QUICK analysis. Focus on critical and high severity issues only.';

  return `You are an expert code reviewer specializing in detecting AI-generated code defects.

Analyze the following code files for AI-specific issues:

${fileBlocks}

Focus on these AI-specific defect categories:
1. HALLUCINATION - References to non-existent packages, APIs, or methods
2. STALE_KNOWLEDGE - Usage of deprecated or outdated APIs
3. CONTEXT_LOSS - Logical inconsistencies across the code
4. SECURITY - AI-generated security anti-patterns (hardcoded secrets, eval, etc.)
5. OVER_ENGINEERING - Unnecessary abstraction or complexity
6. INCOMPLETE - TODO/FIXME/placeholder code, empty catch blocks
7. TYPE_SAFETY - Excessive use of 'any', missing types

${depthInstruction}

Respond in JSON format:
{
  "issues": [
    {
      "file": "path/to/file.ts",
      "line": 42,
      "category": "HALLUCINATION",
      "severity": "critical",
      "message": "Package 'non-existent-pkg' does not exist on npm",
      "fix": "Remove this import or replace with a real package"
    }
  ]
}

Only report genuine AI-specific issues. Do NOT report:
- Code formatting issues (handled by ESLint/Prettier)
- Simple naming conventions (handled by linters)
- Basic TypeScript type errors (handled by tsc)
- Import ordering (handled by import sorters)`;
}

// ─── Category Mapping ──────────────────────────────────────────────

/**
 * Map AI raw category string to AIDefectCategory enum value.
 * Handles various naming conventions from LLM output.
 */
export function mapRawCategory(raw: string): string {
  const normalized = raw.toUpperCase().replace(/[-_ ]/g, '_');

  const mapping: Record<string, string> = {
    HALLUCINATION: 'hallucination',
    STALE_KNOWLEDGE: 'stale-knowledge',
    STALE_API: 'stale-knowledge',
    DEPRECATED: 'stale-knowledge',
    CONTEXT_LOSS: 'context-loss',
    CONTEXT_BREAK: 'context-loss',
    SECURITY: 'security',
    SECURITY_ANTIPATTERN: 'security',
    OVER_ENGINEERING: 'over-engineering',
    OVERENGINEERING: 'over-engineering',
    INCOMPLETE: 'incomplete',
    INCOMPLETE_IMPL: 'incomplete',
    TYPE_SAFETY: 'type-safety',
    TYPESAFETY: 'type-safety',
    ERROR_HANDLING: 'error-handling',
    DUPLICATION: 'duplication',
    TRAINING_LEAK: 'training-leak',
  };

  return mapping[normalized] || 'hallucination';
}

/**
 * Map raw severity string to a valid Severity type.
 */
export function mapRawSeverity(raw: string): 'critical' | 'high' | 'medium' | 'low' | 'info' {
  const normalized = raw.toLowerCase().trim();
  switch (normalized) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    case 'info':
      return 'info';
    default:
      return 'medium';
  }
}
