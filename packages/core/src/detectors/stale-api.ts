/**
 * Stale API Detector (V3)
 *
 * Detects AI-generated code using deprecated/removed APIs.
 * AI models trained on older data frequently suggest outdated APIs
 * (e.g., new Buffer(), fs.exists(), React.createClass()).
 *
 * Uses an embedded JSON database of deprecated APIs for fast regex-based scanning.
 *
 * Implements the unified Detector interface.
 *
 * @since 0.3.0
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Detector, UnifiedIssue, FileAnalysis, Severity } from '../types.js';
import { AIDefectCategory } from '../types.js';

// ─── Deprecated API Database Types ───

export interface DeprecatedAPIEntry {
  api: string;
  pattern: string;
  replacement: string;
  deprecated_since: string;
  severity: string;
  references: string[];
}

// ─── Load Embedded Database ───

function resolveDataPath(): string {
  // Try multiple strategies to find the data file
  const candidates: string[] = [];

  // Strategy 1: Relative to this source file (works in ESM)
  try {
    const thisFile = fileURLToPath(import.meta.url);
    candidates.push(join(dirname(thisFile), '..', 'data', 'deprecated-apis-js.json'));
  } catch {
    // import.meta.url not available (e.g., vitest transforms)
  }

  // Strategy 2: Relative to CWD (packages/core)
  candidates.push(join(process.cwd(), 'src', 'data', 'deprecated-apis-js.json'));

  // Strategy 3: Relative to CWD (project root)
  candidates.push(join(process.cwd(), 'packages', 'core', 'src', 'data', 'deprecated-apis-js.json'));

  for (const candidate of candidates) {
    try {
      readFileSync(candidate, 'utf-8');
      return candidate;
    } catch {
      continue;
    }
  }

  return candidates[0]; // fallback, will fail gracefully
}

function loadDeprecatedAPIs(): DeprecatedAPIEntry[] {
  try {
    const dataPath = resolveDataPath();
    const raw = readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw) as DeprecatedAPIEntry[];
  } catch {
    return [];
  }
}

// ─── Helpers ───

function mapSeverity(sev: string): Severity {
  switch (sev) {
    case 'critical': return 'critical';
    case 'high': return 'high';
    case 'medium': return 'medium';
    case 'low': return 'low';
    case 'info': return 'info';
    default: return 'high';
  }
}

// ─── Main Detector ───

/**
 * StaleAPIDetector — detects deprecated/outdated API usage in AI-generated code.
 *
 * Scans source code using regex patterns from an embedded deprecated API database.
 * Reports matches as UnifiedIssue with category STALE_KNOWLEDGE.
 */
export class StaleAPIDetector implements Detector {
  readonly name = 'stale-api';
  readonly version = '1.0.0';
  readonly tier = 1 as const;

  private entries: DeprecatedAPIEntry[];
  private compiledPatterns: Array<{ entry: DeprecatedAPIEntry; regex: RegExp }>;

  constructor() {
    this.entries = loadDeprecatedAPIs();
    this.compiledPatterns = this.entries.map(entry => ({
      entry,
      regex: new RegExp(entry.pattern, 'g'),
    }));
  }

  /**
   * Allow injecting custom entries (useful for testing).
   */
  static withEntries(entries: DeprecatedAPIEntry[]): StaleAPIDetector {
    const detector = new StaleAPIDetector();
    detector.entries = entries;
    detector.compiledPatterns = entries.map(entry => ({
      entry,
      regex: new RegExp(entry.pattern, 'g'),
    }));
    return detector;
  }

  // ─── V3 Unified Interface ───

  async detect(files: FileAnalysis[]): Promise<UnifiedIssue[]> {
    const allIssues: UnifiedIssue[] = [];
    let globalIndex = 0;

    for (const file of files) {
      const issues = this.analyzeFile(file.path, file.content);
      for (const issue of issues) {
        issue.id = `stale-api:${globalIndex++}`;
        allIssues.push(issue);
      }
    }

    return allIssues;
  }

  // ─── Internal Analysis ───

  private analyzeFile(filePath: string, source: string): UnifiedIssue[] {
    const issues: UnifiedIssue[] = [];
    const lines = source.split('\n');

    for (const { entry, regex } of this.compiledPatterns) {
      // Reset regex lastIndex for each file
      regex.lastIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
          continue;
        }

        // Skip suppressed lines
        const prevLine = i > 0 ? lines[i - 1] : '';
        if (prevLine.includes('// ai-validator-ignore') || prevLine.includes('// ai-validator-disable')) {
          continue;
        }

        // Reset regex for each line
        regex.lastIndex = 0;
        const match = regex.exec(line);
        if (match) {
          issues.push({
            id: '', // will be set in detect()
            detector: this.name,
            type: 'deprecated-api',
            category: AIDefectCategory.STALE_KNOWLEDGE,
            severity: mapSeverity(entry.severity),
            message: `Deprecated API usage: '${entry.api}' (deprecated since ${entry.deprecated_since})`,
            file: filePath,
            line: i + 1,
            column: match.index + 1,
            suggestion: `Replace with: ${entry.replacement}`,
            fix: {
              description: `Replace '${entry.api}' with ${entry.replacement}`,
              autoFixable: false,
            },
            references: entry.references,
            confidence: 0.9,
            detectionSource: 'static',
          });
        }
      }
    }

    return issues;
  }
}

export default StaleAPIDetector;
