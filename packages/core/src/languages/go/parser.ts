/**
 * Go Language Adapter
 *
 * Regex-based parser for Go source code. No native AST dependencies needed.
 *
 * Supports:
 * - Import extraction (single, grouped, aliased, standard lib, third-party)
 * - Function/method call extraction
 * - Complexity metrics (cyclomatic, cognitive, nesting via braces)
 * - Deprecated API detection (via deprecated-apis-go.json)
 * - Package verification (Go stdlib + common module whitelists)
 *
 * @since 0.3.0
 */

import { createRequire } from 'node:module';
import type { SupportedLanguage } from '../../types.js';
import type {
  LanguageAdapter,
  ASTNode,
  ImportInfo,
  CallInfo,
  PackageVerifyResult,
  DeprecatedInfo,
  ComplexityMetrics,
} from '../types.js';

// ─── Go Standard Library Packages ───

/**
 * Go standard library packages (Go 1.21+).
 * Includes top-level packages and commonly used sub-packages.
 */
export const GO_STDLIB_PACKAGES = new Set([
  // Core
  'fmt', 'os', 'io', 'bufio', 'bytes', 'strings', 'strconv',
  'unicode', 'regexp', 'sort', 'slices', 'maps', 'cmp',
  'math', 'rand', 'time', 'errors', 'log', 'flag', 'context',
  'sync', 'atomic', 'reflect', 'unsafe', 'runtime', 'testing',
  // Network
  'net', 'net/http', 'net/url', 'net/rpc', 'net/smtp',
  'net/http/httptest', 'net/http/httputil', 'net/http/pprof',
  // Encoding
  'encoding/json', 'encoding/xml', 'encoding/csv',
  'encoding/base64', 'encoding/binary', 'encoding/hex',
  'encoding/gob', 'encoding/pem', 'encoding/ascii85',
  // Crypto
  'crypto', 'crypto/sha256', 'crypto/sha512',
  'crypto/md5', 'crypto/rand', 'crypto/tls',
  'crypto/aes', 'crypto/rsa', 'crypto/ecdsa',
  'crypto/ed25519', 'crypto/elliptic', 'crypto/hmac',
  'crypto/cipher', 'crypto/x509',
  // Hash
  'hash', 'hash/crc32', 'hash/fnv',
  // Compression & Archive
  'compress/gzip', 'compress/zlib', 'compress/flate', 'compress/bzip2',
  'archive/zip', 'archive/tar',
  // Database
  'database/sql', 'database/sql/driver',
  // HTML & Template
  'html', 'html/template', 'text/template', 'text/template/parse',
  // Path
  'path', 'path/filepath',
  // OS subpackages
  'os/exec', 'os/signal', 'os/user',
  // IO subpackages
  'io/ioutil', 'io/fs',
  // Sync subpackages
  'sync/atomic',
  // Runtime subpackages
  'runtime/debug', 'runtime/pprof',
  // Testing subpackages
  'testing/iotest', 'testing/fstest',
  // Log subpackages
  'log/slog',
  // Misc
  'embed', 'plugin', 'expvar',
  'debug/buildinfo', 'debug/elf', 'debug/dwarf', 'debug/gosym',
  'go/ast', 'go/parser', 'go/token', 'go/types', 'go/format',
  'go/build', 'go/doc', 'go/printer', 'go/scanner',
  'image', 'image/png', 'image/jpeg', 'image/gif', 'image/color',
  'math/big', 'math/bits', 'math/cmplx', 'math/rand',
  'mime', 'mime/multipart',
  'text/scanner', 'text/tabwriter',
  'unicode/utf8', 'unicode/utf16',
  'syscall',
]);

// ─── Common Third-Party Modules ───

/**
 * Well-known Go third-party modules from the Go ecosystem.
 * Covers web frameworks, testing, logging, databases, cloud, etc.
 */
export const GO_COMMON_MODULES = new Set([
  // Web frameworks
  'github.com/gin-gonic/gin',
  'github.com/gorilla/mux',
  'github.com/gorilla/websocket',
  'github.com/go-chi/chi',
  'github.com/labstack/echo',
  'github.com/gofiber/fiber',
  'github.com/julienschmidt/httprouter',
  // Testing
  'github.com/stretchr/testify',
  'github.com/onsi/ginkgo',
  'github.com/onsi/gomega',
  // Logging
  'github.com/sirupsen/logrus',
  'go.uber.org/zap',
  'github.com/rs/zerolog',
  // CLI
  'github.com/spf13/cobra',
  'github.com/spf13/viper',
  'github.com/urfave/cli',
  // ORM / Database
  'gorm.io/gorm',
  'gorm.io/driver/mysql',
  'gorm.io/driver/postgres',
  'github.com/jmoiron/sqlx',
  'github.com/jackc/pgx',
  'github.com/go-sql-driver/mysql',
  'github.com/mattn/go-sqlite3',
  // Redis
  'github.com/go-redis/redis',
  'github.com/redis/go-redis',
  // Messaging
  'github.com/nats-io/nats.go',
  'github.com/segmentio/kafka-go',
  'github.com/confluentinc/confluent-kafka-go',
  // gRPC / Protobuf
  'google.golang.org/grpc',
  'google.golang.org/protobuf',
  'google.golang.org/api',
  // Auth
  'github.com/golang-jwt/jwt',
  'github.com/dgrijalva/jwt-go',
  // Metrics / Monitoring
  'github.com/prometheus/client_golang',
  'go.opentelemetry.io/otel',
  // Cloud
  'github.com/aws/aws-sdk-go-v2',
  'github.com/aws/aws-sdk-go',
  // Docker & Kubernetes
  'github.com/docker/docker',
  'k8s.io/client-go',
  'k8s.io/api',
  'k8s.io/apimachinery',
  'sigs.k8s.io/controller-runtime',
  // HashiCorp
  'github.com/hashicorp/consul',
  'github.com/hashicorp/vault',
  'github.com/hashicorp/terraform',
  // Validation
  'github.com/go-playground/validator',
  // API docs
  'github.com/swaggo/swag',
  // MongoDB
  'go.mongodb.org/mongo-driver',
  // Minio / Object storage
  'github.com/minio/minio-go',
  // Elasticsearch
  'github.com/elastic/go-elasticsearch',
  'github.com/olivere/elastic',
  // Misc popular
  'github.com/google/uuid',
  'github.com/google/go-cmp',
  'github.com/pkg/errors',
  'golang.org/x/sync',
  'golang.org/x/text',
  'golang.org/x/net',
  'golang.org/x/crypto',
  'golang.org/x/sys',
  'golang.org/x/tools',
]);

// ─── Deprecated API Database ───

interface DeprecatedAPIEntry {
  api: string;
  pattern: string;
  replacement: string;
  deprecated_since: string;
  severity: string;
  reason: string;
}

/** Load deprecated APIs from JSON data file */
function loadDeprecatedAPIs(): DeprecatedAPIEntry[] {
  try {
    const require = createRequire(import.meta.url);
    return require('../../data/deprecated-apis-go.json') as DeprecatedAPIEntry[];
  } catch {
    return [];
  }
}

const GO_DEPRECATED_DB = loadDeprecatedAPIs();

// ─── Helpers ───

/**
 * Check if a Go import path is a standard library package.
 * Standard library packages don't contain dots in their path.
 * e.g. "fmt", "net/http", "encoding/json" are stdlib.
 *      "github.com/gin-gonic/gin" is third-party.
 */
function isStdlib(importPath: string): boolean {
  // Standard library packages don't have dots (no domain name)
  // Exception: golang.org/x/* which are "extended stdlib" but technically third-party
  const firstSegment = importPath.split('/')[0];
  return !firstSegment.includes('.');
}

// ─── Go Adapter ───

/**
 * GoAdapter — LanguageAdapter implementation for Go.
 *
 * Covers: .go
 *
 * Uses regex-based parsing. Go's explicit import syntax and brace-delimited
 * blocks are well-suited for regex extraction.
 */
export class GoAdapter implements LanguageAdapter {
  readonly id: SupportedLanguage = 'go';
  readonly extensions = ['.go'];

  /**
   * Parse Go source code.
   * Returns a lightweight AST-like structure with lines and source.
   */
  async parse(source: string, _filePath: string): Promise<ASTNode> {
    return {
      type: 'GoSourceFile',
      lines: source.split('\n'),
      source,
    };
  }

  /**
   * Extract import statements from Go source.
   *
   * Matches:
   * - import "fmt"
   * - import "os/exec"
   * - import (
   *     "fmt"
   *     "os"
   *   )
   * - import alias "github.com/pkg/name"
   * - import . "github.com/onsi/gomega"
   * - import _ "github.com/lib/pq"
   */
  extractImports(source: string, _ast?: ASTNode): ImportInfo[] {
    const imports: ImportInfo[] = [];

    // Pattern 1: Single-line import: import "fmt" or import alias "path"
    const singleImportPattern = /^[ \t]*import\s+(?:(\w+|\.)\s+)?"([^"]+)"/gm;
    let match: RegExpExecArray | null;

    while ((match = singleImportPattern.exec(source)) !== null) {
      const alias = match[1] || '';
      const importPath = match[2];

      // Get line number
      const lineNum = source.substring(0, match.index).split('\n').length;

      // Get the package name (last segment of path)
      const pkgName = importPath.split('/').pop() || importPath;
      const bindings: string[] = alias && alias !== '.'
        ? [alias]
        : [pkgName];

      const isStdlibPkg = isStdlib(importPath);

      imports.push({
        module: importPath,
        bindings,
        line: lineNum,
        isRelative: false,
        isBuiltin: isStdlibPkg,
      });
    }

    // Pattern 2: Grouped import block: import ( ... )
    const groupPattern = /^[ \t]*import\s*\(([\s\S]*?)\)/gm;

    while ((match = groupPattern.exec(source)) !== null) {
      const blockContent = match[1];
      const blockStartLine = source.substring(0, match.index).split('\n').length;

      // Parse each line in the import block
      const blockLines = blockContent.split('\n');
      for (let i = 0; i < blockLines.length; i++) {
        const blockLine = blockLines[i].trim();
        if (!blockLine || blockLine.startsWith('//')) continue;

        // Match: alias "path" or "path"
        const lineMatch = blockLine.match(/^(?:(\w+|\.)\s+)?"([^"]+)"/);
        if (lineMatch) {
          const alias = lineMatch[1] || '';
          const importPath = lineMatch[2];
          const pkgName = importPath.split('/').pop() || importPath;
          const bindings: string[] = alias && alias !== '.'
            ? [alias]
            : [pkgName];

          const isStdlibPkg = isStdlib(importPath);

          imports.push({
            module: importPath,
            bindings,
            line: blockStartLine + i,
            isRelative: false,
            isBuiltin: isStdlibPkg,
          });
        }
      }
    }

    // Deduplicate: grouped import blocks also get caught by single-line pattern
    // if they happen to appear on the same lines. Keep unique by module+line.
    const seen = new Set<string>();
    const deduplicated: ImportInfo[] = [];
    for (const imp of imports) {
      const key = `${imp.module}:${imp.line}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(imp);
      }
    }

    return deduplicated;
  }

  /**
   * Extract function/method calls from Go source.
   *
   * Matches patterns like:
   * - fmt.Println(...)
   * - http.Get(...)
   * - json.Marshal(...)
   * - localFunc(...)
   * - obj.Method(...)
   */
  extractCalls(source: string, _ast?: ASTNode): CallInfo[] {
    const lines = source.split('\n');
    const calls: CallInfo[] = [];

    // Go keywords that look like function calls but aren't
    const goKeywords = new Set([
      'if', 'else', 'for', 'switch', 'select', 'case', 'default',
      'break', 'continue', 'return', 'go', 'defer', 'chan',
      'func', 'type', 'struct', 'interface', 'map', 'range',
      'import', 'package', 'const', 'var', 'fallthrough', 'goto',
    ]);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineNum = i + 1;

      // Skip comments
      if (trimmed.startsWith('//')) continue;

      // Skip import/package declarations
      if (trimmed.startsWith('import ') || trimmed.startsWith('package ')) continue;

      // Match method/package calls: word.word(
      const methodCallPattern = /(\w+(?:\.\w+)+)\s*\(/g;
      let match: RegExpExecArray | null;
      while ((match = methodCallPattern.exec(line)) !== null) {
        const name = match[1];
        // Skip type assertions like .(type)
        if (name.startsWith('.')) continue;

        calls.push({
          name,
          line: lineNum,
          column: match.index + 1,
          isMethodCall: true,
        });
      }

      // Match standalone function calls: name(
      const funcCallPattern = /(?<!\.)(?<!\w)([a-zA-Z_]\w*)\s*\(/g;
      while ((match = funcCallPattern.exec(line)) !== null) {
        const name = match[1];
        // Skip keywords
        if (goKeywords.has(name)) continue;

        calls.push({
          name,
          line: lineNum,
          column: match.index + 1,
          isMethodCall: false,
        });
      }
    }

    return calls;
  }

  /**
   * Verify if a Go package exists.
   *
   * Checks against Go standard library and common third-party module whitelists.
   * Full pkg.go.dev verification can be added in a later phase.
   */
  async verifyPackage(name: string): Promise<PackageVerifyResult> {
    // Check standard library
    if (GO_STDLIB_PACKAGES.has(name)) {
      return {
        name,
        exists: true,
        checkedAt: Date.now(),
      };
    }

    // For stdlib sub-packages, check if the base path matches
    // e.g. "net/http/httptest" → check "net/http" is in stdlib
    if (isStdlib(name)) {
      // It doesn't have dots, so it's a potential stdlib path
      // Check if any prefix matches
      const parts = name.split('/');
      for (let len = parts.length; len >= 1; len--) {
        const candidate = parts.slice(0, len).join('/');
        if (GO_STDLIB_PACKAGES.has(candidate)) {
          return {
            name,
            exists: true,
            checkedAt: Date.now(),
          };
        }
      }
    }

    // Check common third-party modules
    if (GO_COMMON_MODULES.has(name)) {
      return {
        name,
        exists: true,
        checkedAt: Date.now(),
      };
    }

    // Check if it's a sub-package of a known module
    // e.g. "github.com/gin-gonic/gin/binding" → check "github.com/gin-gonic/gin"
    for (const mod of GO_COMMON_MODULES) {
      if (name.startsWith(mod + '/') || name === mod) {
        return {
          name,
          exists: true,
          checkedAt: Date.now(),
        };
      }
    }

    return {
      name,
      exists: false,
      checkedAt: Date.now(),
    };
  }

  /**
   * Check if an API is deprecated.
   * Searches the deprecated-apis-go.json database.
   */
  checkDeprecated(api: string): DeprecatedInfo | null {
    for (const entry of GO_DEPRECATED_DB) {
      const regex = new RegExp(entry.pattern);
      if (regex.test(api)) {
        return {
          api: entry.api,
          reason: entry.reason,
          replacement: entry.replacement,
          since: entry.deprecated_since,
        };
      }
    }
    return null;
  }

  /**
   * Compute complexity metrics for Go source code.
   *
   * Uses brace-based nesting detection and regex matching for decision points.
   * Go has unique constructs like `select`, `go`, and `defer`.
   */
  computeComplexity(source: string, _ast?: ASTNode): ComplexityMetrics {
    const lines = source.split('\n');

    let cyclomatic = 1; // base complexity
    let cognitive = 0;
    let maxNestingDepth = 0;
    let currentDepth = 0;
    let functionCount = 0;
    let inBlockComment = false;

    // Track non-empty, non-comment code lines
    const codeLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Handle block comments
      if (inBlockComment) {
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
        continue;
      }
      if (trimmed.startsWith('/*')) {
        inBlockComment = true;
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
        continue;
      }

      // Skip single-line comments and empty lines
      if (!trimmed || trimmed.startsWith('//')) continue;

      // Count as code line
      codeLines.push(trimmed);

      // Decision points → cyclomatic complexity
      const ifMatches = (trimmed.match(/\bif\b/g) || []).length;
      cyclomatic += ifMatches;

      const forMatches = (trimmed.match(/\bfor\b/g) || []).length;
      cyclomatic += forMatches;

      const caseMatches = (trimmed.match(/\bcase\b/g) || []).length;
      cyclomatic += caseMatches;

      // select is like switch for channels
      const selectMatches = (trimmed.match(/\bselect\s*\{/g) || []).length;
      cyclomatic += selectMatches;

      // Logical operators
      const logicalOps = (trimmed.match(/&&|\|\|/g) || []).length;
      cyclomatic += logicalOps;

      // Track nesting depth via braces
      const opens = (trimmed.match(/\{/g) || []).length;
      const closes = (trimmed.match(/\}/g) || []).length;
      currentDepth += opens - closes;
      if (currentDepth > maxNestingDepth) {
        maxNestingDepth = currentDepth;
      }

      // Cognitive complexity: nested conditions add more
      if (/\b(if|for|switch|select)\b/.test(trimmed)) {
        cognitive += 1 + Math.max(0, currentDepth - 1);
      }

      // Logical operators add cognitive load
      cognitive += logicalOps;

      // Count functions
      // Matches: func name( ... ) { or func (receiver) name( ... ) {
      if (/\bfunc\s+(?:\([^)]*\)\s*)?\w+\s*\(/.test(trimmed)) {
        functionCount++;
      }
      // Also count anonymous functions: func(
      if (/\bfunc\s*\(/.test(trimmed) && !/\bfunc\s+(?:\([^)]*\)\s*)?\w+/.test(trimmed)) {
        functionCount++;
      }
    }

    return {
      cyclomatic,
      cognitive,
      loc: codeLines.length,
      functionCount,
      maxNestingDepth,
    };
  }
}
