/**
 * Language Registry
 *
 * Manages registered LanguageAdapters and auto-selects the appropriate
 * adapter based on file extension.
 *
 * @since 0.3.0
 */

import type { SupportedLanguage } from '../types.js';
import type { LanguageAdapter } from './types.js';

/**
 * LanguageRegistry — singleton that maps file extensions to language adapters.
 *
 * Usage:
 *   const registry = LanguageRegistry.getInstance();
 *   registry.register(new TypeScriptAdapter());
 *   const adapter = registry.getByExtension('.ts');
 */
export class LanguageRegistry {
  private static instance: LanguageRegistry | null = null;

  /** Adapter map by language ID */
  private adapters = new Map<string, LanguageAdapter>();

  /** Extension → language ID lookup */
  private extensionMap = new Map<string, string>();

  private constructor() {}

  /** Get the singleton instance */
  static getInstance(): LanguageRegistry {
    if (!LanguageRegistry.instance) {
      LanguageRegistry.instance = new LanguageRegistry();
    }
    return LanguageRegistry.instance;
  }

  /**
   * Reset the singleton (for testing).
   */
  static resetInstance(): void {
    LanguageRegistry.instance = null;
  }

  /**
   * Register a language adapter.
   * @param adapter The language adapter to register
   * @throws If an adapter with the same ID is already registered
   */
  register(adapter: LanguageAdapter): void {
    if (this.adapters.has(adapter.id)) {
      throw new Error(`Language adapter '${adapter.id}' is already registered`);
    }
    this.adapters.set(adapter.id, adapter);
    for (const ext of adapter.extensions) {
      this.extensionMap.set(ext.toLowerCase(), adapter.id);
    }
  }

  /**
   * Unregister a language adapter by ID.
   * @param id Language identifier
   */
  unregister(id: string): void {
    const adapter = this.adapters.get(id);
    if (adapter) {
      for (const ext of adapter.extensions) {
        this.extensionMap.delete(ext.toLowerCase());
      }
      this.adapters.delete(id);
    }
  }

  /**
   * Get a language adapter by language ID.
   * @param id Language identifier (e.g. 'typescript')
   * @returns The adapter, or undefined if not registered
   */
  getById(id: string): LanguageAdapter | undefined {
    return this.adapters.get(id);
  }

  /**
   * Get a language adapter by file extension.
   * @param ext File extension including dot (e.g. '.ts')
   * @returns The adapter, or undefined if no adapter matches
   */
  getByExtension(ext: string): LanguageAdapter | undefined {
    const langId = this.extensionMap.get(ext.toLowerCase());
    if (langId) {
      return this.adapters.get(langId);
    }
    return undefined;
  }

  /**
   * Get a language adapter for a file path.
   * Extracts the extension and looks up the adapter.
   * @param filePath File path
   * @returns The adapter, or undefined if no adapter matches
   */
  getByFilePath(filePath: string): LanguageAdapter | undefined {
    const ext = extractExtension(filePath);
    if (ext) {
      return this.getByExtension(ext);
    }
    return undefined;
  }

  /**
   * Detect the language for a file path.
   * @param filePath File path
   * @returns The language identifier, or undefined
   */
  detectLanguage(filePath: string): SupportedLanguage | undefined {
    const ext = extractExtension(filePath);
    if (ext) {
      const langId = this.extensionMap.get(ext.toLowerCase());
      return langId as SupportedLanguage | undefined;
    }
    return undefined;
  }

  /**
   * Get all registered language IDs.
   */
  getRegisteredLanguages(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Get all supported extensions.
   */
  getSupportedExtensions(): string[] {
    return Array.from(this.extensionMap.keys());
  }

  /**
   * Check if a file extension is supported.
   */
  isSupported(extOrPath: string): boolean {
    if (extOrPath.startsWith('.')) {
      return this.extensionMap.has(extOrPath.toLowerCase());
    }
    const ext = extractExtension(extOrPath);
    return ext ? this.extensionMap.has(ext.toLowerCase()) : false;
  }
}

/**
 * Extract file extension from a path (including the dot).
 * Handles compound extensions like .d.ts, .test.ts etc.
 */
function extractExtension(filePath: string): string | undefined {
  const basename = filePath.split(/[/\\]/).pop();
  if (!basename) return undefined;

  // Handle .d.ts, .d.mts, .d.cts
  if (/\.d\.[mc]?ts$/.test(basename)) {
    return basename.match(/\.d\.[mc]?ts$/)?.[0];
  }

  const dotIndex = basename.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex === 0) return undefined;
  return basename.slice(dotIndex);
}
