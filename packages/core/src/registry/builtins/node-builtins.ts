/**
 * Node.js built-in modules that don't need registry verification.
 *
 * These are core modules shipped with Node.js and should never be
 * flagged as hallucinated packages.
 *
 * @since 0.4.0 (V4)
 */

export const NODE_BUILTINS = new Set([
  // Core modules
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'http2',
  'https', 'inspector', 'module', 'net', 'os', 'path', 'perf_hooks',
  'process', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'sys', 'timers', 'tls', 'trace_events', 'tty',
  'url', 'util', 'v8', 'vm', 'wasi', 'worker_threads', 'zlib',

  // Newer modules
  'async_hooks', 'diagnostics_channel', 'test',

  // Subpath exports
  'fs/promises', 'stream/promises', 'timers/promises',
  'dns/promises', 'readline/promises',

  // Node.js prefix imports (node: protocol)
  'node:assert', 'node:buffer', 'node:child_process', 'node:cluster',
  'node:console', 'node:constants', 'node:crypto', 'node:dgram',
  'node:dns', 'node:domain', 'node:events', 'node:fs', 'node:http',
  'node:http2', 'node:https', 'node:inspector', 'node:module',
  'node:net', 'node:os', 'node:path', 'node:perf_hooks', 'node:process',
  'node:punycode', 'node:querystring', 'node:readline', 'node:repl',
  'node:stream', 'node:string_decoder', 'node:sys', 'node:timers',
  'node:tls', 'node:trace_events', 'node:tty', 'node:url', 'node:util',
  'node:v8', 'node:vm', 'node:wasi', 'node:worker_threads', 'node:zlib',
  'node:async_hooks', 'node:diagnostics_channel', 'node:test',
  'node:fs/promises', 'node:stream/promises', 'node:timers/promises',
  'node:dns/promises', 'node:readline/promises',
]);
