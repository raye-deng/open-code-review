#!/usr/bin/env node

/**
 * Open Code Review CLI — V3
 *
 * Usage:
 *   npx open-code-review scan ./src
 *   npx open-code-review scan ./src --threshold 80 --format json
 *   npx open-code-review scan ./src --license AICV-XXXX-XXXX-XXXX-XXXX
 *   npx open-code-review login
 *   npx open-code-review config show
 *   npx open-code-review config set license AICV-XXXX
 *
 * @since 0.3.0
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';
import { glob } from 'glob';
import {
  HallucinationDetector,
  LogicGapDetector,
  DuplicationDetector,
  ContextBreakDetector,
  ScoringEngine,
  ReportGenerator,
  PromptBuilder,
  LicenseValidator,
  isValidLicenseFormat,
} from '@open-code-review/core';
import type { ReportFormat, FileScore } from '@open-code-review/core';

// ─── CLI Argument Parsing ──────────────────────────────────────────

interface ParsedArgs {
  command: string;
  subcommand?: string;
  paths: string[];
  threshold: number;
  format: ReportFormat;
  output?: string;
  healPrompt: boolean;
  license?: string;
  configKey?: string;
  configValue?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const command = args[0] || 'help';
  const paths: string[] = [];
  let threshold = 70;
  let format: ReportFormat = 'terminal';
  let output: string | undefined;
  let healPrompt = false;
  let license: string | undefined;
  let subcommand: string | undefined;
  let configKey: string | undefined;
  let configValue: string | undefined;

  // Handle config subcommand
  if (command === 'config') {
    subcommand = args[1]; // 'show' or 'set'
    if (subcommand === 'set') {
      configKey = args[2];
      configValue = args[3];
    }
    return { command, subcommand, paths, threshold, format, output, healPrompt, license, configKey, configValue };
  }

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
      case '--license':
        license = args[++i];
        break;
      default:
        if (!args[i].startsWith('--')) {
          paths.push(args[i]);
        }
    }
  }

  if (command === 'scan' && paths.length === 0) {
    paths.push('src/**/*.ts', 'src/**/*.js', 'src/**/*.tsx', 'src/**/*.jsx');
  }

  // Convert directory paths to glob patterns
  const expandedPaths: string[] = [];
  for (const p of paths) {
    try {
      if (existsSync(p) && statSync(p).isDirectory()) {
        expandedPaths.push(
          `${p}/**/*.ts`,
          `${p}/**/*.js`,
          `${p}/**/*.tsx`,
          `${p}/**/*.jsx`,
        );
      } else {
        expandedPaths.push(p);
      }
    } catch {
      expandedPaths.push(p);
    }
  }

  return {
    command,
    subcommand,
    paths: expandedPaths,
    threshold,
    format,
    output,
    healPrompt,
    license,
    configKey,
    configValue,
  };
}

// ─── File Discovery ────────────────────────────────────────────────

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

// ─── License Validation ────────────────────────────────────────────

async function validateLicense(cliLicense?: string): Promise<{ key: string | null; status: string }> {
  // Resolve license key from all sources
  const licenseKey = LicenseValidator.resolveLicenseKey({
    cli: cliLicense,
  });

  if (!licenseKey) {
    return {
      key: null,
      status: '⚠ No license key found. Run `open-code-review login` to get one.',
    };
  }

  // Validate the license
  const validator = new LicenseValidator();
  const result = await validator.validate(licenseKey);

  if (result.valid) {
    const maskedKey = licenseKey.replace(/^(AICV-.{4}).+(.{4})$/, '$1-****-****-$2');
    if (result.degraded) {
      return { key: licenseKey, status: `⚠ License: ${maskedKey} (offline mode)` };
    }
    if (result.cached) {
      return { key: licenseKey, status: `✓ License: ${maskedKey} (cached)` };
    }
    return { key: licenseKey, status: `✓ License: ${maskedKey} (verified)` };
  }

  return {
    key: licenseKey,
    status: `⚠ License invalid: ${result.error ?? 'unknown error'}. Continuing anyway (free product).`,
  };
}

// ─── Commands ──────────────────────────────────────────────────────

/** Main scan command */
async function commandScan(
  paths: string[],
  threshold: number,
  format: ReportFormat,
  output?: string,
  healPrompt?: boolean,
  cliLicense?: string,
): Promise<boolean> {
  const projectRoot = resolve('.');

  // Step 1: Validate license
  const { status: licenseStatus } = await validateLicense(cliLicense);
  console.error(licenseStatus);
  console.error('');

  // Step 2: Resolve files
  const files = await resolveFiles(paths);

  if (files.length === 0) {
    console.error('No files found matching the specified patterns.');
    process.exit(1);
  }

  console.error(`Scanning ${files.length} file(s)...`);

  // Step 3: Initialize detectors
  const hallucinationDetector = new HallucinationDetector({ projectRoot });
  const logicGapDetector = new LogicGapDetector();
  const duplicationDetector = new DuplicationDetector();
  const contextBreakDetector = new ContextBreakDetector();
  const scoringEngine = new ScoringEngine(threshold);

  // Step 4: Analyze each file
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

  // Step 5: Generate aggregate report
  const aggregate = scoringEngine.aggregate(fileScores);
  const reporter = new ReportGenerator();
  const report = reporter.generate(aggregate, format);

  // Step 6: Output
  if (output) {
    writeFileSync(output, report, 'utf-8');
    console.error(`Report written to: ${output}`);
  } else {
    console.log(report);
  }

  // Step 7: AI heal prompt
  if (healPrompt) {
    const builder = new PromptBuilder();
    const prompt = builder.buildCombinedPrompt(aggregate);
    const healPath = output ? output.replace(/\.\w+$/, '.heal.md') : 'ai-heal-prompt.md';
    writeFileSync(healPath, prompt, 'utf-8');
    console.error(`AI heal prompt written to: ${healPath}`);
  }

  return aggregate.passed;
}

/** Login command — get a license key */
async function commandLogin(): Promise<void> {
  console.log('');
  console.log('  ┌──────────────────────────────────────────┐');
  console.log('  │   Open Code Review — License Setup       │');
  console.log('  └──────────────────────────────────────────┘');
  console.log('');

  // Check if already logged in
  const existingKey = LicenseValidator.resolveLicenseKey();
  if (existingKey && isValidLicenseFormat(existingKey)) {
    const maskedKey = existingKey.replace(/^(AICV-.{4}).+(.{4})$/, '$1-****-****-$2');
    console.log(`  You already have a license key: ${maskedKey}`);
    console.log('');

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>((resolve) => {
      rl.question('  Replace with a new key? (y/N): ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('  Keeping existing license key.');
      return;
    }
    console.log('');
  }

  // Portal registration URL
  const portalUrl = 'https://codes.evallab.ai/register';
  console.log('  To get a license key:');
  console.log('');
  console.log(`  1. Visit: ${portalUrl}`);
  console.log('  2. Sign up with GitHub or email');
  console.log('  3. Copy your license key from the dashboard');
  console.log('');

  // Try to open browser
  try {
    const { exec: execCb } = await import('node:child_process');
    const openCmd = process.platform === 'darwin' ? 'open' :
                    process.platform === 'win32' ? 'start' : 'xdg-open';
    execCb(`${openCmd} ${portalUrl}`, () => {});
    console.log('  (Opening browser...)');
    console.log('');
  } catch {
    // Browser opening failed — that's fine
  }

  // Prompt for license key
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const licenseKey = await new Promise<string>((resolve) => {
    rl.question('  Paste your license key: ', resolve);
  });
  rl.close();

  const trimmedKey = licenseKey.trim().toUpperCase();

  if (!trimmedKey) {
    console.log('');
    console.log('  No key entered. You can set it later with:');
    console.log('    open-code-review config set license YOUR-KEY');
    console.log('    # or set AICV_LICENSE environment variable');
    return;
  }

  if (!isValidLicenseFormat(trimmedKey)) {
    console.error('');
    console.error(`  ✗ Invalid license key format: ${trimmedKey}`);
    console.error('    Expected format: AICV-XXXX-XXXX-XXXX-XXXX');
    process.exit(1);
  }

  // Validate the key
  console.log('');
  console.log('  Validating...');
  const validator = new LicenseValidator();
  const result = await validator.validate(trimmedKey);

  if (result.valid) {
    // Save the key
    LicenseValidator.saveLicenseKey(trimmedKey);
    console.log(`  ✓ License key saved to ~/.aicv/license`);
    console.log('');
    console.log('  You\'re all set! Run `open-code-review scan .` to get started.');
  } else {
    console.error(`  ⚠ Validation warning: ${result.error ?? 'could not verify'}`);
    console.log('  Saving anyway (free product — you can use the tool without verification).');
    LicenseValidator.saveLicenseKey(trimmedKey);
    console.log(`  ✓ License key saved to ~/.aicv/license`);
  }
}

/** Config command */
async function commandConfig(subcommand?: string, key?: string, value?: string): Promise<void> {
  const aicvDir = join(homedir(), '.aicv');

  switch (subcommand) {
    case 'show': {
      console.log('');
      console.log('  Open Code Review — Configuration');
      console.log('  ─────────────────────────────────');

      // License
      const licenseKey = LicenseValidator.resolveLicenseKey();
      if (licenseKey) {
        const maskedKey = licenseKey.replace(/^(AICV-.{4}).+(.{4})$/, '$1-****-****-$2');
        console.log(`  License:     ${maskedKey}`);
      } else {
        console.log('  License:     (not set)');
      }

      // Config file
      const configFiles = ['.ocrrc.yml', '.ocrrc.yaml', '.aicv.yml', '.aicv.yaml'];
      let foundConfig = false;
      for (const cf of configFiles) {
        if (existsSync(cf)) {
          console.log(`  Config file: ${resolve(cf)}`);
          foundConfig = true;
          break;
        }
      }
      if (!foundConfig) {
        console.log('  Config file: (none found in current directory)');
      }

      // Global config
      const globalConfig = join(aicvDir, 'config.yml');
      if (existsSync(globalConfig)) {
        console.log(`  Global:      ${globalConfig}`);
      } else {
        console.log(`  Global:      (not set)`);
      }

      // Cache
      const cachePath = join(aicvDir, 'license-cache.json');
      if (existsSync(cachePath)) {
        try {
          const cache = JSON.parse(readFileSync(cachePath, 'utf-8'));
          const age = Date.now() - cache.timestamp;
          const hoursAgo = Math.round(age / (60 * 60 * 1000));
          console.log(`  Cache:       valid (${hoursAgo}h old)`);
        } catch {
          console.log('  Cache:       (corrupt)');
        }
      } else {
        console.log('  Cache:       (empty)');
      }

      console.log('');
      break;
    }

    case 'set': {
      if (!key) {
        console.error('Usage: open-code-review config set <key> <value>');
        console.error('');
        console.error('Available keys:');
        console.error('  license   Set the license key');
        process.exit(1);
      }

      switch (key) {
        case 'license': {
          if (!value) {
            console.error('Usage: open-code-review config set license AICV-XXXX-XXXX-XXXX-XXXX');
            process.exit(1);
          }
          const trimmed = value.trim().toUpperCase();
          if (!isValidLicenseFormat(trimmed)) {
            console.error(`Invalid license key format: ${trimmed}`);
            console.error('Expected format: AICV-XXXX-XXXX-XXXX-XXXX');
            process.exit(1);
          }
          LicenseValidator.saveLicenseKey(trimmed);
          console.log(`✓ License key saved to ~/.aicv/license`);
          break;
        }
        default:
          console.error(`Unknown config key: ${key}`);
          console.error('Available keys: license');
          process.exit(1);
      }
      break;
    }

    default: {
      // Default to 'show' if no subcommand
      await commandConfig('show');
      break;
    }
  }
}

// ─── Help ──────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`
Open Code Review — Quality gate for AI-generated code

USAGE:
  open-code-review <command> [options]

COMMANDS:
  scan [paths...]       Scan files for AI code quality issues
  login                 Set up license key (opens Portal)
  config [show|set]     View or update configuration
  help                  Show this help message

SCAN OPTIONS:
  --threshold <n>       Minimum score to pass (default: 70)
  --format <fmt>        Output format: terminal, json, markdown, gitlab-report
  --output <path>       Write report to file instead of stdout
  --license <key>       License key (AICV-XXXX-XXXX-XXXX-XXXX)
  --heal                Generate AI self-heal prompt file

CONFIG COMMANDS:
  config show           Show current configuration
  config set license <key>  Set license key

EXAMPLES:
  open-code-review scan ./src
  open-code-review scan "src/**/*.ts" --threshold 80
  open-code-review scan ./src --license AICV-8F3A-K9D2-P7XN-Q4M6
  open-code-review scan ./src --format json --output report.json
  open-code-review login
  open-code-review config show
  open-code-review config set license AICV-8F3A-K9D2-P7XN-Q4M6
`);
}

// ─── Entry Point ───────────────────────────────────────────────────

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv);

  switch (parsed.command) {
    case 'scan': {
      const passed = await commandScan(
        parsed.paths,
        parsed.threshold,
        parsed.format,
        parsed.output,
        parsed.healPrompt,
        parsed.license,
      );
      process.exit(passed ? 0 : 1);
      break;
    }

    case 'login': {
      await commandLogin();
      process.exit(0);
      break;
    }

    case 'config': {
      await commandConfig(parsed.subcommand, parsed.configKey, parsed.configValue);
      process.exit(0);
      break;
    }

    case 'help':
    case '--help':
    case '-h':
      printHelp();
      process.exit(0);
      break;

    case '--version':
    case '-v': {
      console.log('0.3.0');
      process.exit(0);
      break;
    }

    default:
      console.error(`Unknown command: ${parsed.command}`);
      console.error('Run `open-code-review help` for usage.');
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(2);
});
