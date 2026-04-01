/**
 * SecurityPatternDetector — V4 detector for security anti-patterns in AI-generated code.
 *
 * NOT a replacement for dedicated security scanners (Snyk, Semgrep).
 * Focuses specifically on patterns AI commonly produces from training data:
 * - Hardcoded secrets/tokens (example values from docs left in code)
 * - Insecure defaults (HTTP instead of HTTPS, no TLS verification)
 * - SQL injection from string concatenation
 * - eval()/exec() usage
 * - Weak cryptography (MD5, SHA1 for security purposes)
 * - Hardcoded credentials
 *
 * V4 improvements over V3:
 * - Operates on CodeUnit IR with language-aware patterns
 * - Better context analysis (knows which calls are security-relevant)
 * - Reduced false positives through source context analysis
 *
 * @since 0.4.0
 */

import type { CodeUnit, SupportedLanguage } from '../../ir/types.js';
import type { V4Detector, DetectorResult, DetectorCategory, DetectorContext } from './types.js';

// ─── Security Pattern Definition ───────────────────────────────────

/** Security pattern definition for detecting vulnerabilities in code. */
export interface SecurityPattern {
  /** Unique ID for the pattern */
  id: string;
  /** Regex to match in source code */
  pattern: RegExp;
  /** Severity of the finding */
  severity: 'error' | 'warning' | 'info';
  /** Confidence level */
  confidence: number;
  /** Human-readable message */
  message: string;
  /** Languages this pattern applies to (empty = all) */
  languages: SupportedLanguage[];
  /** Additional context patterns that should NOT be present to trigger this finding */
  excludeContextPatterns?: RegExp[];
  /** Whether this pattern should scan comment lines (default: false). Used for TODO/FIXME security bypass patterns. */
  scanComments?: boolean;
}

// ─── Security Patterns ─────────────────────────────────────────────

const SECURITY_PATTERNS: SecurityPattern[] = [
  // ── Hardcoded Secrets ──────────────────────────────────────────

  {
    id: 'hardcoded-api-key',
    pattern: /(?:api[_-]?key|apikey|api[_-]?secret|api[_-]?token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Possible hardcoded API key detected. Use environment variables or a secrets manager instead.',
    languages: [],
  },
  {
    id: 'hardcoded-password',
    pattern: /(?:password|passwd|pwd|secret)\s*[:=]\s*['"][^'"]{4,}['"]/i,
    severity: 'error',
    confidence: 0.8,
    message: 'Possible hardcoded password detected. Use environment variables or a secrets manager instead.',
    languages: [],
    excludeContextPatterns: [
      /(?:example|sample|test|mock|dummy|placeholder|todo|fixme|xxx)/i,
    ],
  },
  {
    id: 'hardcoded-token',
    pattern: /(?:auth[_-]?token|access[_-]?token|bearer[_-]?token|jwt[_-]?secret)\s*[:=]\s*['"][A-Za-z0-9_.\-]{16,}['"]/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Possible hardcoded authentication token detected. Use environment variables instead.',
    languages: [],
  },
  {
    id: 'aws-access-key',
    pattern: /(?:AKIA|ABIA|ACCA|ASIA)[A-Z0-9]{16}/,
    severity: 'error',
    confidence: 0.95,
    message: 'Possible AWS access key ID detected. Rotate immediately and use IAM roles or environment variables.',
    languages: [],
  },
  {
    id: 'private-key',
    pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/,
    severity: 'error',
    confidence: 0.95,
    message: 'Private key embedded in source code. Store in a secure vault or secrets manager.',
    languages: [],
  },

  // ── Dangerous Functions ────────────────────────────────────────

  {
    id: 'eval-usage-js',
    pattern: /\beval\s*\(/,
    severity: 'error',
    confidence: 0.9,
    message: 'eval() usage detected. This enables code injection attacks. Use safer alternatives like JSON.parse() or a sandboxed evaluator.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'eval-usage-python',
    pattern: /\beval\s*\(/,
    severity: 'error',
    confidence: 0.9,
    message: 'eval() usage detected. This enables code injection attacks. Use ast.literal_eval() or safer alternatives.',
    languages: ['python'],
  },
  {
    id: 'exec-usage-python',
    pattern: /\bexec\s*\(/,
    severity: 'error',
    confidence: 0.85,
    message: 'exec() usage detected. This enables arbitrary code execution. Consider safer alternatives.',
    languages: ['python'],
  },
  {
    id: 'new-function-js',
    pattern: /\bnew\s+Function\s*\(/,
    severity: 'warning',
    confidence: 0.85,
    message: 'new Function() is similar to eval() and can enable code injection. Use safer alternatives.',
    languages: ['typescript', 'javascript'],
  },

  // ── SQL Injection ──────────────────────────────────────────────

  {
    id: 'sql-string-concat',
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE|DROP)\s+.*?\+\s*(?:req\.|request\.|params\.|query\.|body\.|input|user)/i,
    severity: 'error',
    confidence: 0.8,
    message: 'SQL query with string concatenation from user input detected. Use parameterized queries to prevent SQL injection.',
    languages: ['typescript', 'javascript', 'java', 'kotlin', 'python'],
  },
  {
    id: 'sql-template-literal',
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE|DROP)\s+.*?\$\{.*?(?:req|request|params|query|body|input|user)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'SQL query using template literals with user input detected. Use parameterized queries to prevent SQL injection.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'sql-f-string-python',
    pattern: /f['"](?:SELECT|INSERT|UPDATE|DELETE|DROP)\s+.*?\{.*?(?:request|params|query|body|input|user)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'SQL query using f-string with user input detected. Use parameterized queries to prevent SQL injection.',
    languages: ['python'],
  },

  // ── Weak Cryptography ──────────────────────────────────────────

  {
    id: 'weak-hash-md5',
    pattern: /\b(?:md5|MD5|createHash\s*\(\s*['"]md5['"]|hashlib\.md5|MessageDigest\.getInstance\s*\(\s*['"]MD5['"])\b/,
    severity: 'warning',
    confidence: 0.75,
    message: 'MD5 is cryptographically broken. Use SHA-256 or better for security purposes. (OK for checksums/non-security uses.)',
    languages: [],
  },
  {
    id: 'weak-hash-sha1',
    pattern: /\b(?:sha1|SHA1|createHash\s*\(\s*['"]sha1['"]|hashlib\.sha1|MessageDigest\.getInstance\s*\(\s*['"]SHA-?1['"])\b/,
    severity: 'warning',
    confidence: 0.7,
    message: 'SHA-1 is cryptographically weak. Use SHA-256 or better for security purposes. (OK for checksums/non-security uses.)',
    languages: [],
  },
  {
    id: 'weak-random',
    pattern: /\bMath\.random\s*\(\)/,
    severity: 'warning',
    confidence: 0.7,
    message: 'Math.random() is not cryptographically secure. Use crypto.randomUUID() or crypto.getRandomValues() for security-sensitive operations.',
    languages: ['typescript', 'javascript'],
  },

  // ── Insecure Defaults ──────────────────────────────────────────

  {
    id: 'tls-verify-disabled',
    pattern: /(?:rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0|verify\s*=\s*False|InsecureSkipVerify\s*:\s*true)/i,
    severity: 'error',
    confidence: 0.9,
    message: 'TLS certificate verification is disabled. This enables man-in-the-middle attacks.',
    languages: [],
  },
  {
    id: 'cors-wildcard',
    pattern: /(?:Access-Control-Allow-Origin['"]\s*[:=]\s*['"]\*|cors\(\s*\)|allowedOrigins\s*\(\s*['"]\*['"])/i,
    severity: 'warning',
    confidence: 0.7,
    message: 'CORS is configured with wildcard origin. Restrict to specific trusted domains.',
    languages: [],
  },
  {
    id: 'http-no-tls',
    pattern: /['"]http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)/,
    severity: 'info',
    confidence: 0.5,
    message: 'HTTP URL detected (not HTTPS). Consider using HTTPS for production endpoints.',
    languages: [],
  },

  // ── AI-Specific Security Anti-Patterns ────────────────────────
  // These patterns are commonly produced by AI from training data
  // and represent AI-specific security risks that traditional tools miss.

  {
    id: 'example-api-key',
    pattern: /sk-(?:proj-|svcacct-)[a-zA-Z0-9]+-[a-zA-Z0-9]*example[a-zA-Z0-9]*/i,
    severity: 'error',
    confidence: 0.95,
    message: 'Possible example OpenAI API key detected. AI often copies documentation examples with placeholder values. Use environment variables instead.',
    languages: [],
    excludeContextPatterns: [/process\.env/i, /import\.meta\.env/i, /\bgetenv\b/i],
  },
  {
    id: 'example-openai-key',
    pattern: /sk-(?:proj-|svcacct-)[a-zA-Z0-9]{4,24}(-[a-zA-Z0-9]{4,24}){1,3}/,
    severity: 'error',
    confidence: 0.8,
    message: 'Possible OpenAI API key from documentation/example code. Verify this is not a real key and use environment variables.',
    languages: [],
    excludeContextPatterns: [/process\.env/i, /import\.meta\.env/i, /\bgetenv\b/i],
  },
  {
    id: 'placeholder-secret-value',
    pattern: /(?:password|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"]*(?:example|sample|demo|placeholder|changeme|your[_-]?(?:api[_-]?)?(?:key[_-]?)?here|xxx+|FIXME|TODO)[^'"]*['"]/i,
    severity: 'warning',
    confidence: 0.7,
    message: 'Placeholder secret value detected. AI often copies example values from documentation. Replace with proper secret management.',
    languages: [],
  },
  {
    id: 'placeholder-secret-basic',
    pattern: /(?:password|secret)\s*[:=]\s*['"][^'"]*(?:example|test|demo|sample)[^'"]*['"]/i,
    severity: 'warning',
    confidence: 0.8,
    message: 'Placeholder secret detected. AI commonly uses obvious placeholder values like "example" or "test" for secrets. Use environment variables instead.',
    languages: [],
  },
  {
    id: 'dynamic-cors-origin-reflection',
    pattern: /Access-Control-Allow-Origin.*?(?:req|request|headers\.origin|\$\{.*?origin)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Dynamic CORS origin reflection detected. Echoing the request Origin header back in Access-Control-Allow-Origin enables cross-site attacks. Use an explicit allowlist instead.',
    languages: [],
  },
  {
    id: 'dynamic-cors-origin-variable',
    pattern: /(?:allowOrigin|cors\.origin|Access-Control-Allow-Origin).*?origin/i,
    severity: 'warning',
    confidence: 0.6,
    message: 'CORS configuration may dynamically reflect the request origin. This can enable cross-site attacks if not validated. Use an explicit allowlist.',
    languages: [],
    excludeContextPatterns: [/\[?['"][\w\-\.\/:*]+['"]\]?/, /allowedOrigins\s*[:=]\s*\[/],
  },
  {
    id: 'sensitive-data-logging',
    pattern: /console\.\w+\s*\(\s*(?:.*?(?:password|passwd|pwd|secret|token|api[_-]?key|authorization|cookie|session|credential))/i,
    severity: 'warning',
    confidence: 0.65,
    message: 'Possible sensitive data in console.log statement. AI commonly leaves debug logging that exposes secrets in production.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'python-sensitive-logging',
    pattern: /(?:print|logging|logger)(?:\.\w+)?\s*\(\s*(?:.*?(?:password|secret|token|api[_-]?key|authorization|credential))/i,
    severity: 'warning',
    confidence: 0.6,
    message: 'Possible sensitive data in log output. AI commonly leaves debug logging that exposes secrets in production.',
    languages: ['python'],
  },
  {
    id: 'jwt-empty-secret',
    pattern: /jwt\.(?:verify|sign)\s*\([^,]+,\s*['"][^'"]{0,2}['"]/,
    severity: 'error',
    confidence: 0.85,
    message: 'JWT verification/signing with empty or near-empty secret. This provides no security. Use a strong, properly stored secret key.',
    languages: [],
  },
  {
    id: 'jwt-hardcoded-secret',
    pattern: /jwt\.(?:verify|sign)\s*\([^,]+,\s*['"][A-Za-z0-9]{8,}['"]/,
    severity: 'error',
    confidence: 0.8,
    message: 'JWT verification/signing with hardcoded secret. Use environment variables or a secrets manager for the signing key.',
    languages: [],
    excludeContextPatterns: [/process\.env/i, /import\.meta\.env/i, /\bgetenv\b/i, /\bos\.getenv\b/i],
  },
  {
    id: 'unsafe-json-parse-user-input',
    pattern: /JSON\.(?:parse|stringify)\s*\(\s*(?:req|request|body|params|query|input|user|event)\b/i,
    severity: 'warning',
    confidence: 0.5,
    message: 'JSON.parse() on user input without schema validation. AI often omits input validation. Consider using a schema validator (zod, joi, yup) to validate the parsed object.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/zod|joi|yup|ajv|schema|validate|parseBody|safeParse/i],
  },

  // ── TODO/FIXME Security Bypass ──────────────────────────────────
  // AI commonly generates placeholder comments where security checks
  // should be, then never implements them. These are invisible to
  // traditional scanners because the code "works" — it just has no
  // security.

  {
    id: 'todo-auth-bypass',
    pattern: /\/\/\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:auth|authenti|authoriz|permission|access.?control|rbac|acl|login.?check)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'TODO/FIXME comment indicates missing authentication or authorization check. AI generated a placeholder instead of implementing the security logic.',
    languages: [],
    scanComments: true,
  },
  {
    id: 'todo-validation-bypass',
    pattern: /\/\/\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:validat|sanitiz|escape|input.?check|verify.?input|check.?input)/i,
    severity: 'warning',
    confidence: 0.8,
    message: 'TODO/FIXME comment indicates missing input validation or sanitization. AI left a placeholder instead of implementing proper validation.',
    languages: [],
    scanComments: true,
  },
  {
    id: 'todo-encryption-bypass',
    pattern: /\/\/\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:encrypt|decrypt|hash|sign|verify.?signature|tls|ssl|cert)/i,
    severity: 'error',
    confidence: 0.8,
    message: 'TODO/FIXME comment indicates missing encryption or cryptographic operation. AI skipped implementing the security-critical logic.',
    languages: [],
    scanComments: true,
  },
  {
    id: 'todo-rate-limit-bypass',
    pattern: /\/\/\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:rate.?limit|throttl|brute.?force|dos|ddos)/i,
    severity: 'warning',
    confidence: 0.75,
    message: 'TODO/FIXME comment indicates missing rate limiting or abuse prevention. AI left a placeholder instead of implementing the protection.',
    languages: [],
    scanComments: true,
  },
  {
    id: 'todo-security-generic',
    pattern: /\/\/\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:security|secure|protect|csrf|xss|injection|vulnerab)/i,
    severity: 'warning',
    confidence: 0.75,
    message: 'TODO/FIXME comment references a security concern that was not implemented. AI acknowledged the risk but did not address it.',
    languages: [],
    scanComments: true,
  },
  {
    id: 'python-todo-security',
    pattern: /#\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:auth|validat|sanitiz|encrypt|security|permission|rate.?limit)/i,
    severity: 'warning',
    confidence: 0.75,
    message: 'TODO/FIXME comment references a security concern that was not implemented. AI acknowledged the risk but did not address it.',
    languages: ['python'],
    scanComments: true,
  },

  // ── Shell Template Literal Injection ────────────────────────────
  // AI commonly generates child_process calls with template strings
  // or string concatenation, creating command injection vectors that
  // bypass simple eval() detection.

  {
    id: 'shell-template-literal-injection',
    pattern: /\b(?:execSync|exec|spawnSync|spawn)\s*\(\s*`[^`]*\$\{/,
    severity: 'error',
    confidence: 0.85,
    message: 'Shell command with template literal interpolation detected. AI often generates child_process calls with unsanitized variables. Use spawn() with an argument array instead.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'shell-string-concat-exec',
    pattern: /\b(?:execSync|exec)\s*\(\s*(?:['"][^'"]*['"]\s*\+|\w+\s*\+\s*['"])/,
    severity: 'error',
    confidence: 0.8,
    message: 'Shell command with string concatenation detected. This enables command injection. Use spawn() or execFile() with an explicit argument array.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'python-shell-f-string',
    pattern: /\b(?:os\.system|subprocess\.(?:call|run|Popen|check_output|check_call))\s*\(\s*f['"]/,
    severity: 'error',
    confidence: 0.85,
    message: 'Shell command with f-string interpolation detected. AI often generates subprocess calls with unsanitized variables. Use subprocess.run() with a list of arguments instead.',
    languages: ['python'],
  },
  {
    id: 'python-shell-format-string',
    pattern: /\b(?:os\.system|subprocess\.(?:call|run|Popen|check_output|check_call))\s*\(\s*['"][^'"]*['"]\.format\s*\(/,
    severity: 'error',
    confidence: 0.85,
    message: 'Shell command with .format() string interpolation detected. Use subprocess.run() with a list of arguments to prevent command injection.',
    languages: ['python'],
  },

  // ── Sensitive Data in Error Responses ──────────────────────────
  // AI commonly generates error handlers that leak internal details
  // (stack traces, database errors, file paths) to API consumers.

  {
    id: 'error-stack-in-response',
    pattern: /\b(?:res\.(?:json|send|status\s*\([^)]*\)\.json|status\s*\([^)]*\)\.send))\s*\(\s*\{[^}]*(?:stack|stackTrace|trace)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Stack trace leaked in API error response. AI commonly exposes err.stack to API consumers, revealing internal paths and code structure. Return a generic error message instead.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'error-details-in-response',
    pattern: /\bcatch\s*\([^)]*\)\s*\{[^}]*(?:res\.(?:json|send))\s*\(\s*(?:err|error|e)\b/,
    severity: 'warning',
    confidence: 0.65,
    message: 'Raw error object sent in API response. AI often passes entire error objects to response handlers, potentially leaking internal details. Return only safe, user-facing error messages.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'python-traceback-in-response',
    pattern: /(?:(?:return|jsonify|Response).*?traceback\.(?:format_exc|print_exc)|traceback\.(?:format_exc|print_exc).*?(?:return|jsonify|Response))/i,
    severity: 'error',
    confidence: 0.8,
    message: 'Python traceback leaked in API response. AI commonly sends traceback.format_exc() output to clients, exposing internal paths and code. Return a generic error message instead.',
    languages: ['python'],
  },

  // ── Hardcoded Cloud/Service Keys ──────────────────────────────
  // AI copies these from documentation and training data examples.

  {
    id: 'example-stripe-key',
    pattern: /\b(?:pk|sk)_(?:test|live)_[a-zA-Z0-9]{20,}(?:example)?/i,
    severity: 'error',
    confidence: 0.9,
    message: 'Possible Stripe API key detected. AI often copies example keys from Stripe documentation. Use environment variables or a secrets manager.',
    languages: [],
  },
  {
    id: 'example-github-pat',
    pattern: /\bghp_[a-zA-Z0-9]{4,}example\b/i,
    severity: 'error',
    confidence: 0.95,
    message: 'Possible example GitHub Personal Access Token detected. AI often copies documentation examples with "example" suffix. Use environment variables instead.',
    languages: [],
  },
  {
    id: 'github-pat-general',
    pattern: /\bghp_[a-zA-Z0-9]{36}\b/,
    severity: 'error',
    confidence: 0.8,
    message: 'Possible GitHub Personal Access Token detected. Verify this is not a real token and use environment variables.',
    languages: [],
  },
  {
    id: 'example-slack-token',
    pattern: /\bxox[bpras]-[a-zA-Z0-9\-]{10,}/,
    severity: 'error',
    confidence: 0.85,
    message: 'Possible Slack API token detected. AI commonly copies example tokens from Slack documentation. Use environment variables.',
    languages: [],
  },

  // ── Environment Variable Fallback with Hardcoded Secrets ──────
  // AI models frequently generate code that loads secrets from env vars
  // but falls back to a hardcoded default. This "works" in development
  // but silently ships the default secret to production.

  {
    id: 'env-var-fallback-secret-js',
    pattern: /process\.env\.(?:\w*(?:SECRET|KEY|TOKEN|PASSWORD|PASSWD|PWD|CREDENTIALS?|AUTH)\w*)\s*\|\|\s*['"][^'"]{4,}['"]/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Environment variable with hardcoded fallback secret detected. AI often generates `process.env.SECRET || "default"` which silently ships the default to production. Remove the fallback or throw an error when the env var is missing.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/(?:test|spec|mock|fixture|example)/i],
  },
  {
    id: 'env-var-fallback-secret-nullish-js',
    pattern: /process\.env\.(?:\w*(?:SECRET|KEY|TOKEN|PASSWORD|PASSWD|PWD|CREDENTIALS?|AUTH)\w*)\s*\?\?\s*['"][^'"]{4,}['"]/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Environment variable with hardcoded fallback secret detected (nullish coalescing). AI often generates `process.env.SECRET ?? "default"` which silently ships the default to production. Throw an error when the env var is missing instead.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/(?:test|spec|mock|fixture|example)/i],
  },
  {
    id: 'python-env-var-fallback-secret',
    pattern: /os\.(?:getenv|environ\.get)\s*\(\s*['"](?:\w*(?:SECRET|KEY|TOKEN|PASSWORD|PASSWD|CREDENTIALS?|AUTH)\w*)['"](?:\s*,\s*['"][^'"]{4,}['"])/i,
    severity: 'error',
    confidence: 0.85,
    message: 'os.getenv() with hardcoded fallback secret detected. AI often generates `os.getenv("SECRET", "default")` which silently ships the default to production. Use os.environ["SECRET"] (which raises KeyError) or validate explicitly.',
    languages: ['python'],
    excludeContextPatterns: [/(?:test|spec|mock|fixture|example)/i],
  },

  // ── Additional AI-Specific Example Key Patterns ───────────────
  // These patterns specifically target the examples mentioned in the audit report
  // that are commonly generated by AI from training data

  {
    id: 'example-openai-key-comprehensive',
    pattern: /sk-(?:proj-|svcacct-)[a-zA-Z0-9]{4,24}(-[a-zA-Z0-9]{4,24}){1,3}/,
    severity: 'error',
    confidence: 0.8,
    message: 'Possible OpenAI API key from documentation/example code. Verify this is not a real key and use environment variables.',
    languages: [],
    excludeContextPatterns: [/process\.env/i, /import\.meta\.env/i, /\bgetenv\b/i, /\bos\.getenv\b/i],
  },
  {
    id: 'example-openai-key-with-suffix',
    pattern: /sk-(?:proj-|svcacct-)[a-zA-Z0-9]+-[a-zA-Z0-9]*example[a-zA-Z0-9]*/i,
    severity: 'error',
    confidence: 0.95,
    message: 'Example OpenAI API key with "example" suffix detected. AI often copies documentation examples with placeholder values.',
    languages: [],
  },
  {
    id: 'example-github-token-comprehensive',
    pattern: /\bghp_[a-zA-Z0-9]{4,}(?:example)?[a-zA-Z0-9]*/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Possible example GitHub Personal Access Token detected. AI often copies documentation examples. Use environment variables.',
    languages: [],
    excludeContextPatterns: [/process\.env/i, /import\.meta\.env/i, /\bgetenv\b/i, /\bos\.getenv\b/i],
  },
  {
    id: 'example-github-token-suffix',
    pattern: /\bghp_[a-zA-Z0-9]{4,}example\b/i,
    severity: 'error',
    confidence: 0.95,
    message: 'Example GitHub PAT with "example" suffix detected. AI commonly copies documentation examples.',
    languages: [],
  },
  {
    id: 'example-stripe-key-comprehensive',
    pattern: /\b(?:pk|sk)_(?:test|live)_[a-zA-Z0-9]{20,}(?:example)?/i,
    severity: 'error',
    confidence: 0.9,
    message: 'Possible Stripe API key detected. AI often copies example keys from Stripe documentation. Use environment variables.',
    languages: [],
  },
  {
    id: 'example-stripe-test-key',
    pattern: /\b(?:pk|sk)_test_[a-zA-Z0-9]{20,}/,
    severity: 'warning',
    confidence: 0.7,
    message: 'Stripe test key detected. While test keys are safer, consider moving to production keys only when ready and using environment variables.',
    languages: [],
  },

  // ── Enhanced Placeholder Secret Patterns ───────────────────────
  // More comprehensive patterns for placeholder secrets that AI commonly generates

  {
    id: 'placeholder-secret-basic',
    pattern: /(?:password|secret)\s*[:=]\s*['"][^'"]*(?:example|test|demo|sample)[^'"]*['"]/i,
    severity: 'warning',
    confidence: 0.8,
    message: 'Placeholder secret detected. AI commonly uses obvious placeholder values like "example" or "test" for secrets. Use environment variables instead.',
    languages: [],
  },
  {
    id: 'placeholder-secret-advanced',
    pattern: /(?:api[_-]?key|token|secret|password|credential|auth)\s*[:=]\s*['"][^'"]*(?:example|sample|demo|placeholder|changeme|test|dummy|mock|your[_-]?(?:api[_-]?)?(?:key[_-]?)?here|xxx+|FIXME|TODO|sample)[^'"]*['"]/i,
    severity: 'warning',
    confidence: 0.75,
    message: 'Placeholder secret value detected. AI often copies example values from documentation. Replace with proper secret management.',
    languages: [],
  },
  {
    id: 'placeholder-secret-very-basic',
    pattern: /(?:password|secret|key)\s*[:=]\s*['"][^'']{4,}['"]/i,
    severity: 'info',
    confidence: 0.4,
    message: 'Possible hardcoded secret detected. Verify this is intentional and consider using environment variables for secrets.',
    languages: [],
    excludeContextPatterns: [/process\.env/i, /import\.meta\.env/i, /\bgetenv\b/i, /\bos\.getenv\b/i],
  },

  // ── Enhanced JWT Security Patterns ───────────────────────────
  // Additional JWT patterns that AI commonly misconfigures

  {
    id: 'jwt-insecure-algorithm',
    pattern: /jwt\.sign\s*\([^,]+,\s*[^,]+,\s*\{[^}]*algorithm\s*:\s*['"]?(?:HS256|HS384|HS512|none|RS256|RS384|RS512|ES256|ES384|ES512)['"]?\s*\}/i,
    severity: 'error',
    confidence: 0.8,
    message: 'JWT with potentially insecure algorithm detected. Avoid using "none", and ensure you\'re using appropriate asymmetric algorithms for production.',
    languages: [],
  },
  {
    id: 'jwt-no-algorithm-specification',
    pattern: /jwt\.(?:sign|verify)\s*\([^,]+,\s*[^,]+(?:,\s*\{[^}]*\})?\)/i,
    severity: 'warning',
    confidence: 0.6,
    message: 'JWT sign/verify without explicit algorithm specification. AI often omits algorithm specification, which can lead to security issues. Always specify the algorithm.',
    languages: [],
  },
  {
    id: 'jwt-claims-injection',
    pattern: /jwt\.decode\s*\([^,]+\)/,
    severity: 'warning',
    confidence: 0.5,
    message: 'JWT decode() without verification detected. AI often decodes tokens without verifying the signature, which allows token tampering. Use jwt.verify() instead.',
    languages: ['typescript', 'javascript'],
  },

  // ── Enhanced Sensitive Data Logging Patterns ───────────────────
  // More comprehensive patterns for sensitive data in logs

  {
    id: 'javascript-sensitive-data-logging-comprehensive',
    pattern: /console\.(?:log|warn|error|info|debug)\s*\(\s*(?:.*?(?:password|passwd|pwd|secret|token|api[_-]?key|authorization|cookie|session|credential|jwt|private[_-]?key|access[_-]?token|bearer[_-]?token|auth[_-]?token|refresh[_-]?token))/i,
    severity: 'warning',
    confidence: 0.65,
    message: 'Possible sensitive data in console statement. AI commonly leaves debug logging that exposes secrets in production.',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'python-sensitive-data-logging-comprehensive',
    pattern: /(?:print|logging|logger)(?:\.\w+)?\s*\(\s*(?:.*?(?:password|secret|token|api[_-]?key|authorization|credential|jwt|private[_-]?key|access[_-]?token|bearer[_-]?token|auth[_-]?token|refresh[_-]?token))/i,
    severity: 'warning',
    confidence: 0.6,
    message: 'Possible sensitive data in log output. AI commonly leaves debug logging that exposes secrets in production.',
    languages: ['python'],
  },

  // ── Environment Variable Fallback with Hardcoded Secrets ──────
  // Enhanced patterns for environment variable fallbacks with hardcoded secrets

  {
    id: 'env-var-fallback-secret-js-nullish',
    pattern: /process\.env\.(?:\w*(?:SECRET|KEY|TOKEN|PASSWORD|PASSWD|PWD|CREDENTIALS?|AUTH)\w*)\s*\?\?\s*['"][^'"]{4,}['"]/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Environment variable with hardcoded fallback secret detected (nullish coalescing). AI often generates `process.env.SECRET ?? "default"` which silently ships the default to production. Throw an error when the env var is missing instead.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/(?:test|spec|mock|fixture|example)/i],
  },
  {
    id: 'env-var-fallback-secret-python',
    pattern: /os\.(?:getenv|environ\.get)\s*\(\s*['"](?:\w*(?:SECRET|KEY|TOKEN|PASSWORD|PASSWD|CREDENTIALS?|AUTH)\w*)['"](?:\s*,\s*['"][^'"]{4,}['"])/i,
    severity: 'error',
    confidence: 0.85,
    message: 'os.getenv() with hardcoded fallback secret detected. AI often generates `os.getenv("SECRET", "default")` which silently ships the default to production. Use os.environ["SECRET"] (which raises KeyError) or validate explicitly.',
    languages: ['python'],
    excludeContextPatterns: [/(?:test|spec|mock|fixture|example)/i],
  },

  // ── Additional TODO/FIXME Security Bypass Patterns ───────────
  // More comprehensive patterns for TODO/FIXME security bypass

  {
    id: 'todo-security-bypass-python',
    pattern: /#\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:auth|validat|sanitiz|encrypt|security|permission|rate.?limit|access.?control|rbac|csrf|xss|injection|vulnerab)/i,
    severity: 'warning',
    confidence: 0.75,
    message: 'TODO/FIXME comment references a security concern that was not implemented. AI acknowledged the risk but did not address it.',
    languages: ['python'],
    scanComments: true,
  },
  {
    id: 'todo-auth-bypass-python',
    pattern: /#\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:auth|authenti|authoriz|permission|access.?control|rbac|acl|login.?check)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'TODO/FIXME comment indicates missing authentication or authorization check. AI generated a placeholder instead of implementing the security logic.',
    languages: ['python'],
    scanComments: true,
  },
  {
    id: 'generic-security-todo',
    pattern: /(?:\/\/|#|\/\*)\s*(?:TODO|FIXME|HACK|XXX)\s*:?\s*.*?(?:implement|add|fix|create|write|setup|configure).*(?:security|auth|validat|encrypt|protect|secure)/i,
    severity: 'warning',
    confidence: 0.7,
    message: 'Generic TODO comment mentioning security implementation. AI often uses placeholder comments without actual implementation.',
    languages: [],
    scanComments: true,
  },

  // ── Dynamic CORS Origin Reflection Enhancement ──────────────────
  // Enhanced patterns for dynamic CORS origin reflection

  {
    id: 'dynamic-cors-origin-reflection-enhanced',
    pattern: /(?:Access-Control-Allow-Origin|allowOrigin|cors\.origin).*(?:req\.|request\.|headers\.origin|\$\{.*?origin|\$\{.*?headers)/i,
    severity: 'error',
    confidence: 0.85,
    message: 'Dynamic CORS origin reflection detected. Echoing the request Origin header back in Access-Control-Allow-Origin enables cross-site attacks. Use an explicit allowlist instead.',
    languages: [],
  },
  {
    id: 'cors-wildcard-with-dynamic',
    pattern: /(?:Access-Control-Allow-Origin|cors\.origin).*(?:\*|\$\{.*?\})/i,
    severity: 'error',
    confidence: 0.9,
    message: 'CORS configured with wildcard or dynamic origin. AI often generates `cors({ origin: "*" })` or `res.setHeader("Access-Control-Allow-Origin", req.headers.origin)`. Both are insecure for production. Use an explicit allowlist of trusted origins.',
    languages: [],
  },

  // ── Insecure JSON Parse Enhancement ──────────────────────────────
  // Enhanced patterns for unsafe JSON.parse usage

  {
    id: 'unsafe-json-parse-enhanced',
    pattern: /JSON\.(?:parse|stringify)\s*\(\s*(?:req\.|request\.|body|params|query|input|user|event|data).*(?!\.(?:safeParse|parse|validate|transform))/i,
    severity: 'warning',
    confidence: 0.6,
    message: 'JSON.parse() on user input without validation detected. AI often omits input validation. Use schema validation (zod, joi, yup) or parseBody utilities.',
    languages: ['typescript', 'javascript'],
    excludeContextPatterns: [/zod|joi|yup|ajv|schema|validate|parseBody|safeParse|transform/i],
  },

  // ── Additional AI Security Anti-Patterns ────────────────────────
  // More patterns specifically targeting AI-generated code issues

  {
    id: 'ai-generated-comment-security',
    pattern: /\/\/\s*(?:AI|generated|by\s+AI|LLM|chatgpt|claude|gpt)\s*:?\s*.*?(?:security|auth|validat|protect|encrypt|secure|token|password|secret)/i,
    severity: 'warning',
    confidence: 0.6,
    message: 'AI-generated comment mentions security but implementation may be missing. AI-generated code often has comments acknowledging security concerns without proper implementation.',
    languages: [],
    scanComments: true,
  },
  {
    id: 'ai-generated-import-insecure',
    pattern: /import.*?(?:crypto|child_process|fs|os).*(?!(?:secure|safe|proper|encrypted|validated))/i,
    severity: 'info',
    confidence: 0.4,
    message: 'AI-generated import of security-sensitive module without proper implementation context. AI often imports crypto, child_process, or fs modules without proper usage patterns.',
    languages: ['typescript', 'javascript'],
  },
];

// ─── Detector ──────────────────────────────────────────────────────

export class SecurityPatternDetector implements V4Detector {
  readonly id = 'security-pattern';
  readonly name = 'Security Pattern Detector';
  readonly category: DetectorCategory = 'implementation';
  readonly supportedLanguages: SupportedLanguage[] = [];

  async detect(units: CodeUnit[], context: DetectorContext): Promise<DetectorResult[]> {
    const results: DetectorResult[] = [];

    for (const unit of units) {
      // Skip non-source units (module-level containers without source)
      if (!unit.source || unit.source.trim().length === 0) continue;

      // Get applicable patterns for this language
      const applicablePatterns = SECURITY_PATTERNS.filter(
        p => p.languages.length === 0 || p.languages.includes(unit.language),
      );

      const lines = unit.source.split('\n');

      // Separate patterns that scan comments from those that don't
      const codePatterns = applicablePatterns.filter(p => !p.scanComments);
      const commentPatterns = applicablePatterns.filter(p => p.scanComments);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const isComment = trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*');

        // Pick which patterns to run based on whether this is a comment line
        const patternsToRun = isComment ? commentPatterns : [...codePatterns, ...commentPatterns];

        for (const pattern of patternsToRun) {
          // Reset regex lastIndex (patterns might be reused)
          pattern.pattern.lastIndex = 0;

          if (pattern.pattern.test(line)) {
            // Check exclude context patterns
            if (pattern.excludeContextPatterns) {
              const excluded = pattern.excludeContextPatterns.some(ep => {
                ep.lastIndex = 0;
                return ep.test(line);
              });
              if (excluded) continue;
            }

            const absoluteLine = unit.location.startLine + i;

            results.push({
              detectorId: this.id,
              severity: pattern.severity,
              category: this.category,
              messageKey: `security-pattern.${pattern.id}`,
              message: pattern.message,
              file: unit.file,
              line: absoluteLine + 1, // 0-based to 1-based
              confidence: pattern.confidence,
              metadata: {
                patternId: pattern.id,
                language: unit.language,
                matchedLine: line.trim().substring(0, 100), // Truncate for safety
              },
            });
          }
        }
      }
    }

    return results;
  }
}
