/**
 * AI Healer — Prompt Builder
 *
 * Converts validation results into structured prompts that can be fed
 * back to AI coding assistants (Copilot, Cursor, Claude) to fix issues.
 */

import type { AggregateScore, FileScore } from '../scorer/scoring-engine.js';

/** Generated fix prompt */
export interface FixPrompt {
  file: string;
  prompt: string;
  priority: number;
  categories: string[];
}

/**
 * Build fix prompts from validation results
 */
export class PromptBuilder {
  /**
   * Generate fix prompts for all files with issues
   */
  buildPrompts(report: AggregateScore): FixPrompt[] {
    const prompts: FixPrompt[] = [];

    for (const file of report.files) {
      if (file.totalScore >= 95) continue;

      const prompt = this.buildFilePrompt(file);
      if (prompt) prompts.push(prompt);
    }

    return prompts.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Build a fix prompt for a single file
   */
  private buildFilePrompt(file: FileScore): FixPrompt | null {
    const sections: string[] = [];
    const categories: string[] = [];

    sections.push(`## Fix Request: ${file.file}`);
    sections.push(`Current Score: ${file.totalScore}/100 (Grade: ${file.grade})`);
    sections.push('');
    sections.push('Please fix the following issues in this file:');
    sections.push('');

    const dims = [
      { key: 'completeness', label: 'Hallucination Issues (Code Completeness)', dim: file.dimensions.completeness },
      { key: 'coherence', label: 'Logic Gaps (Coherence)', dim: file.dimensions.coherence },
      { key: 'consistency', label: 'Style Inconsistencies (Architecture Consistency)', dim: file.dimensions.consistency },
      { key: 'conciseness', label: 'Duplication (Code Conciseness)', dim: file.dimensions.conciseness },
    ];

    for (const { key, label, dim } of dims) {
      if (dim.issueCount > 0) {
        categories.push(key);
        sections.push(`### ${label}`);
        for (const detail of dim.details) {
          sections.push(`- ${detail}`);
        }
        sections.push('');
      }
    }

    if (categories.length === 0) return null;

    sections.push('### Guidelines');
    sections.push('- Fix each issue while preserving existing functionality');
    sections.push('- Add proper error handling where missing');
    sections.push('- Remove hallucinated imports/variables');
    sections.push('- Standardize coding style to match the project conventions');
    sections.push('- Do NOT introduce new dependencies unless absolutely necessary');

    const priority = 100 - file.totalScore;

    return {
      file: file.file,
      prompt: sections.join('\n'),
      priority,
      categories,
    };
  }

  /**
   * Generate a combined prompt for all files (useful for batch fixes)
   */
  buildCombinedPrompt(report: AggregateScore): string {
    const prompts = this.buildPrompts(report);
    if (prompts.length === 0) {
      return 'All files passed validation. No fixes needed.';
    }

    const header = [
      '# Open Code Review — Fix Request',
      '',
      `Overall Score: ${report.overallScore}/100`,
      `Files needing fixes: ${prompts.length}`,
      '',
      '---',
      '',
    ].join('\n');

    return header + prompts.map(p => p.prompt).join('\n---\n\n');
  }
}

export default PromptBuilder;
