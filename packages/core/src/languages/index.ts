/**
 * Multi-Language Support — Exports
 *
 * @since 0.3.0
 */

// Types
export type {
  LanguageAdapter,
  ASTNode,
  ImportInfo,
  CallInfo,
  PackageVerifyResult,
  DeprecatedInfo,
  ComplexityMetrics,
} from './types.js';

// Registry
export { LanguageRegistry } from './registry.js';

// Adapters
export { TypeScriptAdapter } from './typescript/index.js';
