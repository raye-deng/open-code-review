/**
 * Go standard library packages (no proxy needed).
 *
 * These are packages shipped with the Go toolchain and don't go through
 * the Go module proxy. They should never be flagged as hallucinated.
 *
 * Only top-level packages are listed. Sub-packages (e.g., "net/http",
 * "encoding/json") are matched by prefix against this set.
 *
 * @since 0.4.0 (V4)
 */

export const GO_BUILTINS = new Set([
  // Core
  'fmt', 'os', 'io', 'bufio', 'bytes', 'strings', 'strconv',
  'unicode', 'regexp', 'sort', 'slices',

  // Math / time
  'math', 'time',

  // Error handling
  'errors', 'log',

  // CLI
  'flag',

  // Concurrency / context
  'context', 'sync',

  // Reflection / runtime
  'reflect', 'unsafe', 'runtime',

  // Testing
  'testing',

  // Network
  'net',

  // Encoding
  'encoding',

  // Crypto
  'crypto', 'hash',

  // Compression / archive
  'compress', 'archive',

  // Database
  'database',

  // Web / markup
  'html', 'text',

  // Path
  'path', 'filepath',

  // Debugging
  'debug',

  // Go tooling
  'go',

  // Embedding
  'embed',

  // Plugin system
  'plugin',

  // System calls
  'syscall',

  // Image
  'image',

  // MIME
  'mime',

  // Expvar
  'expvar',

  // Index
  'index',

  // Container
  'container',
]);
