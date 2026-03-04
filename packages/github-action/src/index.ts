/**
 * AI Code Validator — GitHub Action
 *
 * Runs AI code validation as part of GitHub Actions CI/CD.
 * Posts results as PR comments and sets quality gate status.
 */

import * as core from '@actions/core';
import * as github from '@actions/github';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { glob } from 'glob';
import {
  HallucinationDetector,
  LogicGapDetector,
  DuplicationDetector,
  ContextBreakDetector,
  ScoringEngine,
  ReportGenerator,
} from '@ai-code-validator/core';
import type { FileScore } from '@ai-code-validator/core';

async function run(): Promise<void> {
  try {
    // Read inputs
    const threshold = parseInt(core.getInput('threshold') || '70', 10);
    const pathsInput = core.getInput('paths') || 'src/**/*.ts,src/**/*.js';
    const failOnLow = core.getInput('fail-on-low-score') !== 'false';
    const token = core.getInput('github-token');

    const patterns = pathsInput.split(',').map(p => p.trim());

    // Resolve files
    const files: string[] = [];
    for (const pattern of patterns) {
      const matched = await glob(pattern, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
      });
      files.push(...matched);
    }

    const uniqueFiles = [...new Set(files)];
    core.info(`Scanning ${uniqueFiles.length} file(s)...`);

    if (uniqueFiles.length === 0) {
      core.warning('No files found matching the specified patterns.');
      core.setOutput('score', '100');
      return;
    }

    // Initialize detectors
    const projectRoot = resolve('.');
    const halDetector = new HallucinationDetector({ projectRoot });
    const logicDetector = new LogicGapDetector();
    const dupDetector = new DuplicationDetector();
    const ctxDetector = new ContextBreakDetector();
    const engine = new ScoringEngine(threshold);

    // Analyze
    const fileScores: FileScore[] = [];
    for (const file of uniqueFiles) {
      const source = readFileSync(file, 'utf-8');
      const relPath = relative(projectRoot, resolve(file));

      const hal = halDetector.analyze(file, source);
      const logic = logicDetector.analyze(file, source);
      const dup = dupDetector.analyze(file, source);
      const ctx = ctxDetector.analyze(file, source);

      fileScores.push(engine.scoreFile(relPath, hal, logic, dup, ctx));
    }

    const aggregate = engine.aggregate(fileScores);

    // Set outputs
    core.setOutput('score', aggregate.overallScore.toString());

    // Write JSON report
    const reportPath = 'ai-validator-report.json';
    const reporter = new ReportGenerator();
    writeFileSync(reportPath, reporter.generate(aggregate, 'json'));
    core.setOutput('report', reportPath);

    // Post PR comment if in PR context
    const context = github.context;
    if (token && context.payload.pull_request) {
      const octokit = github.getOctokit(token);
      const markdown = reporter.generate(aggregate, 'markdown');

      await octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.payload.pull_request.number,
        body: markdown,
      });

      core.info('Posted validation report as PR comment.');
    }

    // Log summary
    core.info(`Score: ${aggregate.overallScore}/100 (Grade: ${aggregate.grade})`);
    core.info(`Status: ${aggregate.passed ? 'PASSED' : 'FAILED'}`);

    // Fail if below threshold
    if (!aggregate.passed && failOnLow) {
      core.setFailed(
        `AI Code Validator: Score ${aggregate.overallScore}/100 is below threshold ${threshold}`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
