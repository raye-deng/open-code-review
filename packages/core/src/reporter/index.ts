/**
 * Reporter Module — Unified Report Generation
 *
 * Supports multiple output formats:
 * - terminal: Human-readable terminal output
 * - json: Machine-readable JSON
 * - html: Self-contained HTML report
 * - markdown: Rich Markdown for PR comments
 * - sarif: SARIF 2.1.0 for CI tool integration
 *
 * @since 0.3.0
 */

export type { ReportFormat, ReportOptions, ReportData } from './types.js';
export { generateHTML } from './html-reporter.js';
export { generateV4HTML } from './v4-html.js';
export { generateSARIF } from './sarif-reporter.js';
export { generateMarkdown } from './markdown-reporter.js';
export { generateTerminal } from './terminal-reporter.js';

import type { ReportData, ReportOptions } from './types.js';
import { generateHTML } from './html-reporter.js';
import { generateSARIF } from './sarif-reporter.js';
import { generateMarkdown } from './markdown-reporter.js';
import { generateTerminal } from './terminal-reporter.js';

/**
 * Generate a report in the specified format.
 *
 * @param data Report data (scores, issues, SLA metrics)
 * @param options Report format and display options
 * @returns Formatted report string
 */
export function generateReport(data: ReportData, options: ReportOptions): string {
  switch (options.format) {
    case 'html':
      return generateHTML(data, options);
    case 'sarif':
      return JSON.stringify(generateSARIF(data), null, 2);
    case 'markdown':
      return generateMarkdown(data, options);
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'terminal':
      return generateTerminal(data, options);
    default: {
      // Exhaustive check
      const _never: never = options.format;
      return JSON.stringify(data, null, 2);
    }
  }
}
