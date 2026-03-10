/**
 * Open Code Review V4 — Tree-sitter Parser Manager
 *
 * Manages tree-sitter WASM initialization, grammar loading, and parsing.
 * Uses `web-tree-sitter` with pre-built WASM grammars from `tree-sitter-wasms`.
 *
 * @since 0.4.0
 */

import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type TreeSitterModule from 'web-tree-sitter';
import type { SupportedLanguage } from '../ir/types.js';

// We use createRequire to get the real Parser class because vitest's
// ESM module proxy doesn't propagate static property changes after
// Parser.init() modifies the class (e.g., Parser.Language).
const _require = createRequire(import.meta.url);
const Parser: typeof TreeSitterModule = _require('web-tree-sitter');

// ─── Grammar File Resolution ───────────────────────────────────────

/**
 * Map from SupportedLanguage to the WASM grammar filename.
 * TypeScript and JavaScript share grammars with TSX/JSX variants.
 */
const GRAMMAR_FILES: Record<SupportedLanguage, string> = {
  typescript: 'tree-sitter-typescript.wasm',
  javascript: 'tree-sitter-javascript.wasm',
  python: 'tree-sitter-python.wasm',
  java: 'tree-sitter-java.wasm',
  go: 'tree-sitter-go.wasm',
  kotlin: 'tree-sitter-kotlin.wasm',
};

/**
 * Resolve the path to a WASM grammar file.
 * Searches for grammars in the `tree-sitter-wasms` package.
 */
function resolveGrammarPath(grammarFile: string): string {
  // Try to find tree-sitter-wasms in node_modules
  // Strategy: walk up from this file's directory looking for node_modules
  const candidates: string[] = [];

  // Use import.meta.url to find our location
  try {
    const thisDir = dirname(fileURLToPath(import.meta.url));
    // Walk up looking for node_modules/tree-sitter-wasms
    let dir = thisDir;
    for (let i = 0; i < 10; i++) {
      candidates.push(resolve(dir, 'node_modules', 'tree-sitter-wasms', 'out', grammarFile));
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch {
    // import.meta.url not available in some environments
  }

  // Also try relative to CWD
  candidates.push(resolve(process.cwd(), 'node_modules', 'tree-sitter-wasms', 'out', grammarFile));

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Grammar file not found: ${grammarFile}. ` +
    `Ensure 'tree-sitter-wasms' is installed. Searched:\n` +
    candidates.map(c => `  - ${c}`).join('\n')
  );
}

// ─── ParserManager ─────────────────────────────────────────────────

/**
 * Manages tree-sitter parser initialization and grammar loading.
 *
 * Usage:
 * ```typescript
 * const manager = new ParserManager();
 * await manager.init();
 * const tree = manager.parse('const x = 1;', 'typescript');
 * ```
 */
export class ParserManager {
  private languages: Map<SupportedLanguage, TreeSitterModule.Language> = new Map();
  private _initialized = false;

  /** Whether the parser has been initialized */
  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * Initialize tree-sitter WASM runtime and load all supported grammars.
   * Must be called before any parse() calls.
   * Safe to call multiple times (idempotent).
   */
  async init(): Promise<void> {
    if (this._initialized) return;

    // Resolve the tree-sitter WASM binary path.
    // web-tree-sitter needs its own .wasm file to initialize the runtime.
    // In bundled environments (vitest, webpack), the auto-detection may fail,
    // so we provide an explicit locateFile function.
    let treeSitterWasmDir: string;
    try {
      const req = createRequire(import.meta.url);
      const treeSitterMainPath = req.resolve('web-tree-sitter');
      treeSitterWasmDir = dirname(treeSitterMainPath);
    } catch {
      treeSitterWasmDir = '';
    }

    await Parser.init({
      locateFile: (scriptName: string) => {
        if (treeSitterWasmDir && scriptName.endsWith('.wasm')) {
          const candidate = join(treeSitterWasmDir, scriptName);
          if (existsSync(candidate)) return candidate;
        }
        return scriptName;
      },
    });

    // Load grammars for all supported languages
    const languages = Object.keys(GRAMMAR_FILES) as SupportedLanguage[];
    const loadPromises = languages.map(async (lang) => {
      const grammarFile = GRAMMAR_FILES[lang];
      const grammarPath = resolveGrammarPath(grammarFile);
      const language = await Parser.Language.load(grammarPath);
      this.languages.set(lang, language);
    });

    await Promise.all(loadPromises);
    this._initialized = true;
  }

  /**
   * Parse source code into a tree-sitter CST.
   *
   * @param source - Source code string
   * @param language - Programming language
   * @returns Parsed tree-sitter tree
   * @throws Error if not initialized or language not supported
   */
  parse(source: string, language: SupportedLanguage): TreeSitterModule.Tree {
    if (!this._initialized) {
      throw new Error('ParserManager not initialized. Call init() first.');
    }

    const lang = this.languages.get(language);
    if (!lang) {
      throw new Error(`No grammar loaded for language: ${language}`);
    }

    const parser = new Parser();
    parser.setLanguage(lang);
    return parser.parse(source);
  }

  /**
   * Get list of languages that have been loaded.
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return [...this.languages.keys()];
  }

  /**
   * Check if a specific language grammar is loaded.
   */
  hasLanguage(language: SupportedLanguage): boolean {
    return this.languages.has(language);
  }
}
