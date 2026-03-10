/**
 * Registry module — Dynamic package verification.
 *
 * @since 0.4.0 (V4)
 */

// Types
export type {
  PackageRegistry,
  PackageVerifyResult,
  DeprecationInfo,
  RegistryConfig,
  RegistryOptions,
  CacheEntry,
} from './types.js';

// Cache
export { RegistryCache } from './cache.js';

// Registry implementations
export { NpmRegistry } from './npm-registry.js';
export { PyPIRegistry } from './pypi-registry.js';
export { MavenRegistry } from './maven-registry.js';
export { GoProxyRegistry } from './go-registry.js';

// Manager
export { RegistryManager } from './registry-manager.js';

// Built-in module lists
export { NODE_BUILTINS } from './builtins/node-builtins.js';
export { PYTHON_BUILTINS } from './builtins/python-builtins.js';
export { JAVA_BUILTINS } from './builtins/java-builtins.js';
export { GO_BUILTINS } from './builtins/go-builtins.js';
export { KOTLIN_BUILTINS } from './builtins/kotlin-builtins.js';
