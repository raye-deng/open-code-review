/**
 * Python standard library modules that don't need registry verification.
 *
 * These are modules shipped with CPython and should never be
 * flagged as hallucinated packages.
 *
 * @since 0.4.0 (V4)
 */

export const PYTHON_BUILTINS = new Set([
  // Core
  'os', 'sys', 're', 'json', 'math', 'random', 'datetime', 'time',
  'pathlib', 'typing', 'collections', 'functools', 'itertools', 'io',

  // System
  'subprocess', 'shutil', 'tempfile', 'logging', 'unittest', 'argparse',
  'signal', 'ctypes', 'platform',

  // Crypto / encoding
  'hashlib', 'hmac', 'secrets', 'base64',

  // Network
  'urllib', 'http', 'socket', 'ssl', 'email',

  // Data formats
  'csv', 'sqlite3', 'xml', 'html', 'configparser',

  // OOP / patterns
  'abc', 'enum', 'dataclasses', 'contextlib',

  // Concurrency
  'asyncio', 'concurrent', 'multiprocessing', 'threading', 'queue',

  // Data manipulation
  'struct', 'pickle', 'copy', 'pprint',

  // Introspection / meta
  'warnings', 'traceback', 'inspect', 'ast', 'importlib',

  // Archive / compression
  'zipfile', 'tarfile', 'gzip',

  // Text
  'string', 'textwrap',

  // Compiler / parser
  'dis', 'token', 'tokenize',

  // Additional common stdlib modules
  'types', 'array', 'bisect', 'heapq', 'operator', 'decimal',
  'fractions', 'statistics', 'cmath', 'glob', 'fnmatch', 'linecache',
  'codecs', 'unicodedata', 'locale', 'gettext', 'difflib',
  'weakref', 'shelve', 'dbm', 'lzma', 'bz2', 'zlib',
  'select', 'selectors', 'mmap', 'atexit', 'sched',
]);
