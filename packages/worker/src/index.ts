/**
 * AI Code Validator — Telegram Bot (Cloudflare Worker)
 *
 * Webhook handler for Telegram bot that scans public GitHub repos
 * for AI-generated code quality issues.
 *
 * Commands:
 *   /scan <github-repo-url>  — Scan a public repo
 *   /start                   — Welcome message
 *   /help                    — Usage instructions
 */

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
}

// ---------------------------------------------------------------------------
// Telegram types (minimal subset)
// ---------------------------------------------------------------------------

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { first_name?: string };
  };
}

// ---------------------------------------------------------------------------
// Detectors — lightweight, string-based (no fs access in CF Workers)
// ---------------------------------------------------------------------------

interface Issue {
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Hallucination Detector
 * Checks for imports of known non-existent or commonly hallucinated packages.
 */
function detectHallucinations(file: string, source: string): Issue[] {
  const issues: Issue[] = [];
  const lines = source.split('\n');

  // Known hallucinated / non-existent npm packages AI models often generate
  const suspiciousPackages = [
    'react-native-vector-icons/Ionicons',
    '@google/generative-ai-node',
    'openai-edge',
    'langchain/core',
    'firebase-admin/firestore',
    '@tensorflow/tfjs-node-gpu',
    'mongoose-auto-increment',
    'express-async-handler',
  ];

  // Patterns indicating hallucinated APIs
  const suspiciousAPIs = [
    /\bfs\.readFileAsync\b/,
    /\bPromise\.allResolved\b/,
    /\bArray\.flatDeep\b/,
    /\bObject\.deepClone\b/,
    /\bString\.prototype\.replaceAll\b.*polyfill/i,
    /\bconsole\.log\.bind\b/,
    /\bprocess\.env\.NODE_ENV\s*===\s*['"]test['"]\s*\?\s*require/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check suspicious imports
    for (const pkg of suspiciousPackages) {
      if (line.includes(`'${pkg}'`) || line.includes(`"${pkg}"`)) {
        issues.push({
          file,
          line: i + 1,
          message: `Potentially hallucinated package: "${pkg}"`,
          severity: 'warning',
        });
      }
    }

    // Check suspicious API patterns
    for (const pattern of suspiciousAPIs) {
      if (pattern.test(line)) {
        issues.push({
          file,
          line: i + 1,
          message: `Suspicious API call that may not exist: ${line.trim().slice(0, 60)}`,
          severity: 'warning',
        });
      }
    }

    // Detect imports from paths that look fabricated (e.g. deeply nested non-standard paths)
    const importMatch = line.match(
      /(?:import|require)\s*\(?\s*['"](@[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+)['"]/
    );
    if (importMatch) {
      issues.push({
        file,
        line: i + 1,
        message: `Deeply nested import path may be hallucinated: "${importMatch[1]}"`,
        severity: 'info',
      });
    }
  }

  return issues;
}

/**
 * Logic Gap Detector
 * Finds empty catch blocks, TODO/FIXME markers, console.log, and unreachable patterns.
 */
function detectLogicGaps(file: string, source: string): Issue[] {
  const issues: Issue[] = [];
  const lines = source.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty catch blocks
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(line)) {
      issues.push({
        file,
        line: i + 1,
        message: 'Empty catch block — errors are silently swallowed',
        severity: 'error',
      });
    }

    // Also detect catch with only a comment
    if (/catch\s*\([^)]*\)\s*\{/.test(line)) {
      const nextLine = lines[i + 1]?.trim();
      if (nextLine === '}' || nextLine?.startsWith('//')) {
        const afterNext = lines[i + 2]?.trim();
        if (nextLine.startsWith('//') && afterNext === '}') {
          issues.push({
            file,
            line: i + 1,
            message: 'Catch block only contains a comment — error not handled',
            severity: 'warning',
          });
        }
      }
    }

    // TODO / FIXME / HACK markers
    if (/\b(TODO|FIXME|HACK|XXX)\b/.test(trimmed) && trimmed.startsWith('//')) {
      issues.push({
        file,
        line: i + 1,
        message: `Unresolved marker: ${trimmed.slice(0, 80)}`,
        severity: 'warning',
      });
    }

    // console.log left in production code
    if (/\bconsole\.(log|debug|info)\s*\(/.test(line) && !file.includes('test')) {
      issues.push({
        file,
        line: i + 1,
        message: 'console.log/debug/info left in code',
        severity: 'info',
      });
    }

    // Return after return (simple unreachable code)
    if (/^\s*return\b/.test(line) && i + 1 < lines.length) {
      const next = lines[i + 1]?.trim();
      if (next && !next.startsWith('}') && !next.startsWith('//') && !next.startsWith('/*') && next !== '') {
        issues.push({
          file,
          line: i + 2,
          message: 'Potentially unreachable code after return statement',
          severity: 'warning',
        });
      }
    }
  }

  return issues;
}

/**
 * Duplication Detector
 * Finds near-identical code blocks by comparing normalized line sequences.
 */
function detectDuplication(file: string, source: string): Issue[] {
  const issues: Issue[] = [];
  const lines = source.split('\n');
  const BLOCK_SIZE = 4;
  const MIN_LINE_LENGTH = 10;

  const seen = new Map<string, number>();

  for (let i = 0; i <= lines.length - BLOCK_SIZE; i++) {
    const block = lines
      .slice(i, i + BLOCK_SIZE)
      .map((l) => l.trim().replace(/\s+/g, ' '))
      .filter((l) => l.length >= MIN_LINE_LENGTH);

    if (block.length < BLOCK_SIZE - 1) continue;

    const key = block.join('\n');
    const prev = seen.get(key);

    if (prev !== undefined && Math.abs(i - prev) >= BLOCK_SIZE) {
      issues.push({
        file,
        line: i + 1,
        message: `Duplicated code block (${BLOCK_SIZE} lines, same as line ${prev + 1})`,
        severity: 'warning',
      });
    } else if (prev === undefined) {
      seen.set(key, i);
    }
  }

  return issues;
}

/**
 * Style Break Detector
 * Checks for mixed naming conventions, inconsistent quotes, mixed module systems.
 */
function detectStyleBreaks(file: string, source: string): Issue[] {
  const issues: Issue[] = [];
  const lines = source.split('\n');

  let camelCount = 0;
  let snakeCount = 0;
  let hasRequire = false;
  let hasImport = false;
  let singleQuoteCount = 0;
  let doubleQuoteCount = 0;

  for (const line of lines) {
    // Count naming conventions (variable declarations)
    const varMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (varMatch) {
      const name = varMatch[1];
      if (/_[a-z]/.test(name)) snakeCount++;
      else if (/[a-z][A-Z]/.test(name)) camelCount++;
    }

    // Module system
    if (/\brequire\s*\(/.test(line)) hasRequire = true;
    if (/\bimport\s+/.test(line) || /\bimport\s*\{/.test(line)) hasImport = true;

    // Quote style (in import/require strings)
    const stringMatches = line.match(/['"][^'"]*['"]/g);
    if (stringMatches) {
      for (const s of stringMatches) {
        if (s.startsWith("'")) singleQuoteCount++;
        else doubleQuoteCount++;
      }
    }
  }

  // Mixed naming conventions
  if (camelCount > 2 && snakeCount > 2) {
    issues.push({
      file,
      line: 1,
      message: `Mixed naming: ${camelCount} camelCase vs ${snakeCount} snake_case variables`,
      severity: 'warning',
    });
  }

  // Mixed module systems
  if (hasRequire && hasImport) {
    issues.push({
      file,
      line: 1,
      message: 'Mixed module systems: both require() and import used',
      severity: 'warning',
    });
  }

  // Inconsistent quote style (only flag if heavily mixed)
  const total = singleQuoteCount + doubleQuoteCount;
  if (total > 5) {
    const ratio = Math.min(singleQuoteCount, doubleQuoteCount) / total;
    if (ratio > 0.3) {
      issues.push({
        file,
        line: 1,
        message: `Inconsistent quotes: ${singleQuoteCount} single vs ${doubleQuoteCount} double`,
        severity: 'info',
      });
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

interface ScanResult {
  files: number;
  totalIssues: number;
  score: number;
  grade: string;
  issues: Issue[];
}

function calculateScore(issues: Issue[]): { score: number; grade: string } {
  let penalty = 0;
  for (const issue of issues) {
    if (issue.severity === 'error') penalty += 15;
    else if (issue.severity === 'warning') penalty += 5;
    else penalty += 1;
  }
  const score = Math.max(0, Math.min(100, 100 - penalty));
  const grade =
    score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  return { score, grade };
}

// ---------------------------------------------------------------------------
// GitHub API — fetch repo files
// ---------------------------------------------------------------------------

interface GitHubTreeItem {
  path: string;
  type: string;
  url: string;
  size?: number;
}

async function fetchRepoFiles(
  owner: string,
  repo: string
): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const EXTENSIONS = ['.ts', '.js', '.tsx', '.jsx', '.py', '.go', '.rs'];
  const MAX_FILES = 30;
  const MAX_FILE_SIZE = 50_000; // 50KB

  // Fetch the tree recursively
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers: { 'User-Agent': 'ai-code-validator-bot', Accept: 'application/vnd.github.v3+json' } }
  );

  if (!treeRes.ok) {
    throw new Error(
      treeRes.status === 404
        ? `Repository not found: ${owner}/${repo}`
        : `GitHub API error: ${treeRes.status}`
    );
  }

  const tree = (await treeRes.json()) as { tree: GitHubTreeItem[] };

  // Filter to source files
  const sourceFiles = tree.tree.filter(
    (item) =>
      item.type === 'blob' &&
      EXTENSIONS.some((ext) => item.path.endsWith(ext)) &&
      !item.path.includes('node_modules') &&
      !item.path.includes('dist/') &&
      !item.path.includes('.min.') &&
      !item.path.includes('vendor/') &&
      (item.size ?? 0) < MAX_FILE_SIZE
  );

  // Limit file count
  const filesToFetch = sourceFiles.slice(0, MAX_FILES);

  // Fetch file contents in parallel (batched)
  const BATCH_SIZE = 10;
  for (let i = 0; i < filesToFetch.length; i += BATCH_SIZE) {
    const batch = filesToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (item) => {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${item.path}`;
        const res = await fetch(rawUrl, { headers: { 'User-Agent': 'ai-code-validator-bot' } });
        if (res.ok) {
          files.set(item.path, await res.text());
        }
      })
    );
    // Ignore individual failures
    void results;
  }

  return files;
}

// ---------------------------------------------------------------------------
// Scan orchestrator
// ---------------------------------------------------------------------------

function scanFiles(files: Map<string, string>): ScanResult {
  const allIssues: Issue[] = [];

  for (const [path, source] of files) {
    allIssues.push(
      ...detectHallucinations(path, source),
      ...detectLogicGaps(path, source),
      ...detectDuplication(path, source),
      ...detectStyleBreaks(path, source)
    );
  }

  const { score, grade } = calculateScore(allIssues);

  return {
    files: files.size,
    totalIssues: allIssues.length,
    score,
    grade,
    issues: allIssues,
  };
}

// ---------------------------------------------------------------------------
// Telegram message formatting
// ---------------------------------------------------------------------------

function formatResult(owner: string, repo: string, result: ScanResult): string {
  const emoji = result.score >= 80 ? '✅' : result.score >= 60 ? '⚠️' : '❌';
  const gradeEmoji: Record<string, string> = {
    A: '🏆',
    B: '👍',
    C: '🤔',
    D: '😬',
    F: '💀',
  };

  let msg = `${emoji} <b>AI Code Validator Report</b>\n`;
  msg += `📦 <code>${owner}/${repo}</code>\n\n`;
  msg += `${gradeEmoji[result.grade] || ''} Score: <b>${result.score}/100</b> (Grade: ${result.grade})\n`;
  msg += `📄 Files scanned: ${result.files}\n`;
  msg += `🔍 Issues found: ${result.totalIssues}\n`;

  if (result.issues.length > 0) {
    // Group by severity
    const errors = result.issues.filter((i) => i.severity === 'error');
    const warnings = result.issues.filter((i) => i.severity === 'warning');
    const infos = result.issues.filter((i) => i.severity === 'info');

    msg += '\n<b>Issues breakdown:</b>\n';
    if (errors.length > 0) msg += `🔴 Errors: ${errors.length}\n`;
    if (warnings.length > 0) msg += `🟡 Warnings: ${warnings.length}\n`;
    if (infos.length > 0) msg += `🔵 Info: ${infos.length}\n`;

    // Show top 10 issues
    msg += '\n<b>Top issues:</b>\n';
    const topIssues = result.issues.slice(0, 10);
    for (const issue of topIssues) {
      const icon = issue.severity === 'error' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵';
      msg += `${icon} <code>${issue.file}:${issue.line}</code>\n   ${issue.message}\n`;
    }

    if (result.issues.length > 10) {
      msg += `\n... and ${result.issues.length - 10} more issues`;
    }
  } else {
    msg += '\n✨ No issues found — clean code!';
  }

  return msg;
}

// ---------------------------------------------------------------------------
// Telegram API helpers
// ---------------------------------------------------------------------------

async function sendMessage(
  token: string,
  chatId: number,
  text: string,
  parseMode = 'HTML'
): Promise<void> {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  });
}

// ---------------------------------------------------------------------------
// Command handlers
// ---------------------------------------------------------------------------

async function handleScan(
  token: string,
  chatId: number,
  args: string
): Promise<void> {
  if (!args) {
    await sendMessage(token, chatId, '❌ Usage: <code>/scan owner/repo</code> or <code>/scan https://github.com/owner/repo</code>');
    return;
  }

  // Parse GitHub URL or owner/repo
  let owner: string;
  let repo: string;

  const urlMatch = args.match(/github\.com\/([^/\s]+)\/([^/\s]+)/);
  const shortMatch = args.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (urlMatch) {
    owner = urlMatch[1];
    repo = urlMatch[2].replace(/\.git$/, '');
  } else if (shortMatch) {
    owner = shortMatch[1];
    repo = shortMatch[2];
  } else {
    await sendMessage(
      token,
      chatId,
      '❌ Invalid format. Use:\n<code>/scan owner/repo</code>\n<code>/scan https://github.com/owner/repo</code>'
    );
    return;
  }

  await sendMessage(token, chatId, `🔍 Scanning <code>${owner}/${repo}</code>...\nThis may take a moment.`);

  try {
    const files = await fetchRepoFiles(owner, repo);

    if (files.size === 0) {
      await sendMessage(token, chatId, `⚠️ No source files found in <code>${owner}/${repo}</code>.`);
      return;
    }

    const result = scanFiles(files);
    await sendMessage(token, chatId, formatResult(owner, repo, result));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    await sendMessage(token, chatId, `❌ Scan failed: ${message}`);
  }
}

async function handleStart(token: string, chatId: number, firstName?: string): Promise<void> {
  const name = firstName ? ` ${firstName}` : '';
  const msg =
    `👋 Hi${name}! I'm the <b>AI Code Validator</b> bot.\n\n` +
    `I scan public GitHub repositories for common AI-generated code issues:\n` +
    `🔍 Hallucinated packages/APIs\n` +
    `🧩 Logic gaps (empty catch, TODOs)\n` +
    `📋 Code duplication\n` +
    `🎨 Style inconsistencies\n\n` +
    `<b>Try it:</b>\n<code>/scan owner/repo</code>\n\n` +
    `Example:\n<code>/scan facebook/react</code>`;
  await sendMessage(token, chatId, msg);
}

async function handleHelp(token: string, chatId: number): Promise<void> {
  const msg =
    `<b>Commands:</b>\n\n` +
    `<code>/scan &lt;repo&gt;</code> — Scan a public GitHub repo\n` +
    `  Examples:\n` +
    `  <code>/scan owner/repo</code>\n` +
    `  <code>/scan https://github.com/owner/repo</code>\n\n` +
    `<code>/start</code> — Welcome message\n` +
    `<code>/help</code> — This help text\n\n` +
    `<b>What I detect:</b>\n` +
    `• Hallucinated imports & APIs\n` +
    `• Empty catch blocks, TODOs, console.log\n` +
    `• Duplicated code blocks\n` +
    `• Mixed naming/module conventions\n\n` +
    `🌐 <a href="https://codes.evallab.ai">codes.evallab.ai</a>`;
  await sendMessage(token, chatId, msg);
}

// ---------------------------------------------------------------------------
// Worker entry point
// ---------------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // Health check
    if (url.pathname === '/health' && method === 'GET') {
      return new Response(
        JSON.stringify({ status: 'ok', service: 'aicv-telegram-bot' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Webhook endpoint for Telegram
    if (url.pathname === `/webhook/${env.TELEGRAM_BOT_TOKEN}` && method === 'POST') {
      try {
        const update = (await request.json()) as TelegramUpdate;
        const message = update.message;

        if (!message?.text) {
          return new Response('ok');
        }

        const chatId = message.chat.id;
        const text = message.text.trim();
        const token = env.TELEGRAM_BOT_TOKEN;

        if (text.startsWith('/scan')) {
          await handleScan(token, chatId, text.slice(5).trim());
        } else if (text === '/start') {
          await handleStart(token, chatId, message.from?.first_name);
        } else if (text === '/help') {
          await handleHelp(token, chatId);
        }
        // Ignore unknown messages silently

        return new Response('ok');
      } catch (err) {
        console.error('Webhook error:', err);
        return new Response('error', { status: 500 });
      }
    }

    // Setup endpoint — call once to register webhook
    if (url.pathname === '/setup' && method === 'GET') {
      const webhookUrl = `${url.origin}/webhook/${env.TELEGRAM_BOT_TOKEN}`;
      const res = await fetch(
        `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: webhookUrl }),
        }
      );
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('AI Code Validator Telegram Bot', { status: 200 });
  },
};
