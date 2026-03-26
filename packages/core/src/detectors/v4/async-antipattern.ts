/**
 * AsyncAntipatternDetector — V4 detector for async/Promise anti-patterns in AI-generated code.
 *
 * AI models frequently generate async code with subtle bugs that compile and
 * pass basic tests but fail in production:
 * - Floating promises (async calls without await, losing errors silently)
 * - async callbacks in Array.forEach (does NOT actually await — a classic AI mistake)
 * - Promise constructor anti-pattern (wrapping async in new Promise)
 * - .then() chains without .catch() (unhandled rejections)
 * - Sequential awaits that could be parallelized (performance anti-pattern)
 *
 * Traditional linters catch some of these (e.g., @typescript-eslint/no-floating-promises)
 * but AI-generated code often lacks ESLint configs entirely. More importantly, AI produces
 * these patterns at a much higher rate than human code because it mimics common patterns
 * from training data without understanding async semantics.
 *
 * @since 0.7.0
 */

import type { CodeUnit, SupportedLanguage } from '../../ir/types.js';
import type { V4Detector, DetectorResult, DetectorCategory, DetectorContext } from './types.js';

// ─── Async Anti-Pattern Definitions ────────────────────────────────

interface AsyncPattern {
  id: string;
  pattern: RegExp;
  severity: 'error' | 'warning' | 'info';
  confidence: number;
  message: string;
  languages: SupportedLanguage[];
  /** Context patterns that suppress the finding (e.g., proper error handling nearby) */
  excludeContextPatterns?: RegExp[];
  /** Whether the pattern needs multi-line context for accuracy */
  multilineWindow?: number;
}

const ASYNC_PATTERNS: AsyncPattern[] = [
  // ── Async forEach (classic AI mistake) ─────────────────────────
  // Array.forEach with async callback does NOT await. AI generates this
  // constantly because it looks correct. The callback fires but the
  // forEach returns immediately without waiting.

  {
    id: 'async-foreach',
    pattern: /\.forEach\s*\(\s*async\s/,
    severity: 'error',
    confidence: 0.95,
    message: 'async callback in Array.forEach() — forEach does NOT await async callbacks. Use for...of loop or Promise.all(arr.map(async ...)) instead.',
    languages: ['typescript', 'javascript'],
  },

  // ── Async map without Promise.all ──────────────────────────────
  // AI often writes arr.map(async fn) but forgets to wrap in Promise.all,
  // creating an array of unawaited promises.

  {
    id: 'async-map-no-promise-all',
    pattern: /(?:(?:const|let|var)\s+\w+\s*=\s*)(?!\s*await\s)(?!\s*Promise\.all)\s*\w+\.map\s*\(\s*async\s/,
    severity: 'warning',
    confidence: 0.8,
    message: 'Array.map() with async callback assigned without Promise.all(). The result is an array of unresolved promises. Use `await Promise.all(arr.map(async ...))`.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/Promise\.all/],
  },

  // ── Promise constructor anti-pattern ───────────────────────────
  // AI wraps existing async operations in new Promise() constructors.
  // This is unnecessary and often loses error handling.

  {
    id: 'promise-constructor-async',
    pattern: /new\s+Promise\s*\(\s*async\s/,
    severity: 'warning',
    confidence: 0.9,
    message: 'Promise constructor with async executor. This is an anti-pattern — errors thrown inside an async Promise executor are silently lost. Just use the async function directly.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'promise-constructor-wrapping-await',
    pattern: /new\s+Promise\s*\(\s*(?:\([^)]*\)|[^=])\s*=>\s*\{[\s\S]*?\bawait\b/,
    severity: 'warning',
    confidence: 0.75,
    message: 'Promise constructor wrapping an await expression. This is usually unnecessary — use the async function directly instead of wrapping in new Promise().',
    languages: ['typescript', 'javascript'],
    multilineWindow: 5,
  },

  // ── .then() without .catch() ───────────────────────────────────
  // AI chains .then() handlers but forgets .catch(), leading to
  // unhandled promise rejections that crash Node.js processes.

  {
    id: 'then-without-catch',
    pattern: /\.then\s*\([^)]*\)\s*(?:;|\n|$)/,
    severity: 'warning',
    confidence: 0.6,
    message: 'Promise .then() chain without .catch() handler. Unhandled promise rejections will crash Node.js in production. Add .catch() or use async/await with try/catch.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/\.catch\s*\(/, /\.finally\s*\(/],
    multilineWindow: 3,
  },

  // ── Fire-and-forget async calls ────────────────────────────────
  // AI calls async functions without awaiting, meaning errors are
  // silently swallowed and execution order is unpredictable.

  {
    id: 'fire-and-forget-async-call',
    pattern: /^\s+(?!return\b)(?!await\b)(?!const\b)(?!let\b)(?!var\b)(?!if\b)(?!for\b)(?!while\b)(?!switch\b)(?!throw\b)(?!yield\b)(?!export\b)(?!import\b)(?!\/\/)(\w+(?:\.\w+)*)\s*\(\s*(?:await\b)?[^)]*\)\s*;?\s*$/m,
    severity: 'info',
    confidence: 0.3,
    message: 'Possible fire-and-forget async call. If this function is async, errors will be silently lost. Use `await` or add `.catch()` for intentional fire-and-forget.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [
      /void\s+/, // Explicit void indicates intentional fire-and-forget
      /\/\/\s*(?:no-?await|fire.?and.?forget|intentional|background)/i,
    ],
  },

  // ── Sequential awaits that could be parallel ───────────────────
  // AI generates sequential awaits for independent operations that
  // could run in parallel with Promise.all.

  {
    id: 'sequential-independent-awaits',
    pattern: /(?:const|let|var)\s+\w+\s*=\s*await\s+\w+[^;\n]*;?\s*\n\s*(?:const|let|var)\s+\w+\s*=\s*await\s+\w+/,
    severity: 'info',
    confidence: 0.5,
    message: 'Consecutive await statements may be independent and could run in parallel with Promise.all() for better performance.',
    languages: ['typescript', 'javascript'],
    multilineWindow: 2,
  },

  // ── Missing await on async function call in return ─────────────
  // AI returns async function calls without await, returning a Promise
  // instead of the resolved value.

  {
    id: 'return-async-without-await',
    pattern: /return\s+(?!await\b)(\w+(?:\.\w+)*)\s*\(\s*(?:await\b)?[^)]*\)\s*;\s*$/m,
    severity: 'info',
    confidence: 0.3,
    message: 'Returning an async function call without await. If the callee is async, this returns a Promise instead of the resolved value. Consider using `return await` for proper error stack traces.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [
      /Promise\.resolve/, /Promise\.reject/, /Promise\.all/,
      /new\s+Promise/,
    ],
  },

  // ── Python async anti-patterns ─────────────────────────────────

  {
    id: 'python-sync-in-async',
    pattern: /\b(?:time\.sleep|requests\.(?:get|post|put|delete|patch))\s*\(/,
    severity: 'warning',
    confidence: 0.6,
    message: 'Synchronous blocking call detected. If used inside async functions, this blocks the event loop. Use asyncio.sleep(), aiohttp, or asyncio equivalents.',
    languages: ['python'],
  },
  {
    id: 'python-asyncio-run-in-async',
    pattern: /asyncio\.run\s*\(/,
    severity: 'warning',
    confidence: 0.7,
    message: 'asyncio.run() detected. If called inside an async function, this will raise RuntimeError because an event loop is already running. Use `await` directly instead.',
    languages: ['python'],
  },

  // ── Go async anti-patterns ─────────────────────────────────────

  {
    id: 'go-goroutine-no-error-handling',
    pattern: /go\s+func\s*\(\s*\)\s*\{[^}]*\}(?!\s*\(\s*\))/,
    severity: 'info',
    confidence: 0.5,
    message: 'Goroutine launched without error propagation mechanism. AI often spawns goroutines that silently swallow panics. Consider using errgroup or a recover() handler.',
    languages: ['go'],
    excludeContextPatterns: [/errgroup/, /recover\(\)/, /chan\s/, /sync\.WaitGroup/],
  },
];

// ─── Detector ──────────────────────────────────────────────────────

export class AsyncAntipatternDetector implements V4Detector {
  readonly id = 'async-antipattern';
  readonly name = 'Async Anti-pattern Detector';
  readonly category: DetectorCategory = 'implementation';
  readonly supportedLanguages: SupportedLanguage[] = [];

  async detect(units: CodeUnit[], context: DetectorContext): Promise<DetectorResult[]> {
    const results: DetectorResult[] = [];

    for (const unit of units) {
      if (!unit.source || unit.source.trim().length === 0) continue;

      const applicablePatterns = ASYNC_PATTERNS.filter(
        p => p.languages.length === 0 || p.languages.includes(unit.language),
      );

      const lines = unit.source.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) continue;

        for (const pattern of applicablePatterns) {
          pattern.pattern.lastIndex = 0;

          // For multi-line patterns, build a window of surrounding lines
          let textToMatch = line;
          if (pattern.multilineWindow) {
            const windowStart = Math.max(0, i);
            const windowEnd = Math.min(lines.length, i + pattern.multilineWindow + 1);
            textToMatch = lines.slice(windowStart, windowEnd).join('\n');
          }

          if (pattern.pattern.test(textToMatch)) {
            // Check exclude context patterns
            if (pattern.excludeContextPatterns) {
              // Check a wider context window for exclusions
              const contextStart = Math.max(0, i - 2);
              const contextEnd = Math.min(lines.length, i + 4);
              const contextText = lines.slice(contextStart, contextEnd).join('\n');

              const excluded = pattern.excludeContextPatterns.some(ep => {
                ep.lastIndex = 0;
                return ep.test(contextText);
              });
              if (excluded) continue;
            }

            const absoluteLine = unit.location.startLine + i;

            results.push({
              detectorId: this.id,
              severity: pattern.severity,
              category: this.category,
              messageKey: `async-antipattern.${pattern.id}`,
              message: pattern.message,
              file: unit.file,
              line: absoluteLine + 1,
              confidence: pattern.confidence,
              metadata: {
                patternId: pattern.id,
                language: unit.language,
                matchedLine: trimmed.substring(0, 100),
              },
            });
          }
        }
      }
    }

    return results;
  }
}
