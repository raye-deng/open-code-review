#!/usr/bin/env node

/**
 * AI Code Validator CLI
 *
 * Usage:
 *   npx ai-code-validator scan ./src
 *   npx ai-code-validator scan ./src --threshold 80 --format json
 *   npx ai-code-validator scan ./src --format markdown --output report.md
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { glob } from 'glob';
import {
  HallucinationDetector,
  LogicGapDetector,
  DuplicationDetector,
  ContextBreakDetector,
  ScoringEngine,
  ReportGenerator,
  PromptBuilder,
} from '@ai-code-validator/core';
import type { ReportFormat, FileScore } from '@ai-code-validator/core';

/** CLI argument parsing (minimal, no dependency) */
function parseArgs(argv: string[]): {
  command: string;
  paths: string[];
  threshold: number;
  format: ReportFormat;
  output?: string;
  healPrompt: boolean;
} {
  const args = argv.slice(2);
  const command = args[0] || 'help';
  const paths: string[] = [];
  let threshold = 70;
  let format: ReportFormat = 'terminal';
  let output: string | undefined;
  let healPrompt = false;

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--threshold':
        threshold = parseInt(args[++i], 10);
        break;
      case '--format':
        format = args[++i] as ReportFormat;
        break;
      case '--output':
        output = args[++i];
        break;
      case '--heal':
        healPrompt = true;
        break;
      default:
        if (!args[i].startsWith('--')) {
          paths.push(args[i]);
        }
    }
  }

  if (paths.length === 0) {
    paths.push('src/**/*.ts', 'src/**/*.js', 'src/**/*.tsx', 'src/**/*.jsx');
  }

  return { command, paths, threshold, format, output, healPrompt };
}

/** Resolve glob patterns to file paths */
async function resolveFiles(patterns: string[]): Promise<string[]> {
  const files: string[] = [];
  for (const pattern of patterns) {
    const matched = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts', '**/*.test.*', '**/*.spec.*'],
    });
    files.push(...matched);
  }
  return [...new Set(files)];
}

/** Main scan command */
async function scan(
  paths: string[],
  threshold: number,
  format: ReportFormat,
  output?: string,
  healPrompt?: boolean,
): Promise<boolean> {
  const projectRoot = resolve('.');
  const files = await resolveFiles(paths);

  if (files.length === 0) {
    console.error('No files found matching the specified patterns.');
    process.exit(1);
  }

  console.error(`Scanning ${files.length} file(s)...`);

  // Initialize detectors
  const hallucinationDetector = new HallucinationDetector({ projectRoot });
  const logicGapDetector = new LogicGapDetector();
  const duplicationDetector = new DuplicationDetector();
  const contextBreakDetector = new ContextBreakDetector();
  const scoringEngine = new ScoringEngine(threshold);

  // Analyze each file
  const fileScores: FileScore[] = [];

  for (const file of files) {
    const source = readFileSync(file, 'utf-8');
    const relPath = relative(projectRoot, resolve(file));

    const halResult = hallucinationDetector.analyze(file, source);
    const logicResult = logicGapDetector.analyze(file, source);
    const dupResult = duplicationDetector.analyze(file, source);
    const ctxResult = contextBreakDetector.analyze(file, source);

    const score = scoringEngine.scoreFile(relPath, halResult, logicResult, dupResult, ctxResult);
    fileScores.push(score);
  }

  // Generate aggregate report
  const aggregate = scoringEngine.aggregate(fileScores);
  const reporter = new ReportGenerator();
  const report = reporter.generate(aggregate, format);

  // Output
  if (output) {
    writeFileSync(output, report, 'utf-8');
    console.error(`Report written to: ${output}`);
  } else {
    console.log(report);
  }

  // AI heal prompt
  if (healPrompt) {
    const builder = new PromptBuilder();
    const prompt = builder.buildCombinedPrompt(aggregate);
    const healPath = output ? output.replace(/\.\w+$/, '.heal.md') : 'ai-heal-prompt.md';
    writeFileSync(healPath, prompt, 'utf-8');
    console.error(`AI heal prompt written to: ${healPath}`);
  }

  return aggregate.passed;
}

/** Print help */
function printHelp(): void {
  console.log(`
AI Code Validator — Quality gate for AI-generated code

USAGE:
  ai-code-validator scan [paths...] [options]

COMMANDS:
  scan          Scan files for AI code quality issues
  help          Show this help message

OPTIONS:
  --threshold <n>     Minimum score to pass (default: 70)
  --format <fmt>      Output format: terminal, json, markdown, gitlab-report
  --output <path>     Write report to file instead of stdout
  --heal              Generate AI self-heal prompt file

EXAMPLES:
  ai-code-validator scan ./src
  ai-code-validator scan "src/**/*.ts" --threshold 80
  ai-code-validator scan ./src --format json --output report.json
  ai-code-validator scan ./src --heal
`);
}

/** Entry point */
async function main(): Promise<void> {
  const { command, paths, threshold, format, output, healPrompt } = parseArgs(process.argv);

  switch (command) {
    case 'scan': {
      const passed = await scan(paths, threshold, format, output, healPrompt);
      process.exit(passed ? 0 : 1);
      break;
    }
    case 'help':
    default:
      printHelp();
      process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(2);
});
