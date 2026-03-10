/**
 * SecurityPatternDetector Tests
 *
 * Tests security anti-pattern detection in AI-generated code.
 */

import { describe, it, expect } from 'vitest';
import { SecurityPatternDetector } from '../src/detectors/security-pattern.js';
import type { FileAnalysis, UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';

// ─── Helper ───

function makeFile(path: string, content: string): FileAnalysis {
  return { path, content, language: 'typescript' };
}

function validateIssue(issue: UnifiedIssue) {
  expect(issue.id).toBeTruthy();
  expect(issue.detector).toBe('security-pattern');
  expect(issue.category).toBe(AIDefectCategory.SECURITY_ANTIPATTERN);
  expect(['critical', 'high', 'medium', 'low', 'info']).toContain(issue.severity);
  expect(issue.message).toBeTruthy();
  expect(issue.file).toBeTruthy();
  expect(issue.line).toBeGreaterThan(0);
}

// ─── Tests ───

describe('SecurityPatternDetector', () => {
  const detector = new SecurityPatternDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('security-pattern');
    expect(detector.version).toBe('1.0.0');
    expect(detector.tier).toBe(1);
  });

  // ─── Hardcoded Secrets ───

  it('should detect hardcoded passwords', async () => {
    const files = [makeFile('config.ts', `
const password = "super_secret_123";
const apiKey = "sk-abc123def456";
const token = "eyJhbGciOiJIUzI1NiJ9.test";
`)];

    const issues = await detector.detect(files);
    const secretIssues = issues.filter(i => i.type === 'hardcoded-secret');
    expect(secretIssues.length).toBeGreaterThanOrEqual(2);
    for (const issue of secretIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('critical');
    }
  });

  it('should NOT detect secrets in test files', async () => {
    const files = [makeFile('auth.test.ts', `
const password = "test_password";
const apiKey = "test_key_12345";
`)];

    const issues = await detector.detect(files);
    const secretIssues = issues.filter(i => i.type === 'hardcoded-secret');
    expect(secretIssues.length).toBe(0);
  });

  it('should NOT flag environment variable references as secrets', async () => {
    const files = [makeFile('config.ts', `
const password = process.env.DB_PASSWORD;
const apiKey = config.apiKey;
`)];

    const issues = await detector.detect(files);
    const secretIssues = issues.filter(i => i.type === 'hardcoded-secret');
    expect(secretIssues.length).toBe(0);
  });

  // ─── eval / Function ───

  it('should detect eval() usage', async () => {
    const files = [makeFile('dynamic.ts', `
const result = eval(userInput);
const fn = new Function('return ' + expr);
`)];

    const issues = await detector.detect(files);
    const evalIssues = issues.filter(i => i.type === 'unsafe-eval');
    expect(evalIssues.length).toBe(2);
    for (const issue of evalIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('high');
    }
  });

  // ─── SQL Injection ───

  it('should detect SQL injection via string concatenation', async () => {
    const files = [makeFile('db.ts', `
const query = "SELECT * FROM users WHERE id = " + userId;
const insert = "INSERT INTO logs VALUES ('" + data + "')";
`)];

    const issues = await detector.detect(files);
    const sqlIssues = issues.filter(i => i.type === 'sql-injection');
    expect(sqlIssues.length).toBeGreaterThanOrEqual(2);
    for (const issue of sqlIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('medium');
    }
  });

  it('should detect SQL injection via template literals', async () => {
    const files = [makeFile('db.ts', 'const query = `SELECT * FROM users WHERE id = ${userId}`;')];

    const issues = await detector.detect(files);
    const sqlIssues = issues.filter(i => i.type === 'sql-injection');
    expect(sqlIssues.length).toBeGreaterThanOrEqual(1);
  });

  it('should NOT flag tagged template SQL (parameterized)', async () => {
    const files = [makeFile('db.ts', `
const result = sql\`SELECT * FROM users WHERE id = \${userId}\`;
const data = Prisma.$queryRaw\`SELECT * FROM users WHERE id = \${userId}\`;
`)];

    const issues = await detector.detect(files);
    const sqlIssues = issues.filter(i => i.type === 'sql-injection');
    expect(sqlIssues.length).toBe(0);
  });

  // ─── Insecure Crypto ───

  it('should detect Math.random() usage', async () => {
    const files = [makeFile('auth.ts', `
const token = Math.random().toString(36);
`)];

    const issues = await detector.detect(files);
    const cryptoIssues = issues.filter(i => i.type === 'insecure-random');
    expect(cryptoIssues.length).toBe(1);
    validateIssue(cryptoIssues[0]);
    expect(cryptoIssues[0].suggestion).toContain('crypto');
  });

  it('should detect MD5 and SHA1 hash usage', async () => {
    const files = [makeFile('hash.ts', `
const hash1 = createHash('md5').update(data).digest('hex');
const hash2 = createHash('sha1').update(data).digest('hex');
`)];

    const issues = await detector.detect(files);
    const hashIssues = issues.filter(i => i.type === 'insecure-hash');
    expect(hashIssues.length).toBe(2);
    for (const issue of hashIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('medium');
    }
  });

  // ─── Insecure Defaults ───

  it('should detect wildcard CORS origin', async () => {
    const files = [makeFile('server.ts', `
app.use(cors({ origin: '*' }));
`)];

    const issues = await detector.detect(files);
    const corsIssues = issues.filter(i => i.type === 'insecure-cors');
    expect(corsIssues.length).toBe(1);
    validateIssue(corsIssues[0]);
  });

  it('should detect disabled CSP in helmet', async () => {
    const files = [makeFile('server.ts', `
app.use(helmet({ contentSecurityPolicy: false }));
`)];

    const issues = await detector.detect(files);
    const cspIssues = issues.filter(i => i.type === 'insecure-config');
    expect(cspIssues.length).toBe(1);
    validateIssue(cspIssues[0]);
  });

  it('should detect disabled TLS verification', async () => {
    const files = [makeFile('api.ts', `
const agent = new https.Agent({ rejectUnauthorized: false });
`)];

    const issues = await detector.detect(files);
    const tlsIssues = issues.filter(i => i.type === 'insecure-config');
    expect(tlsIssues.length).toBe(1);
    validateIssue(tlsIssues[0]);
  });

  // ─── Clean Code ───

  it('should NOT report issues in secure code', async () => {
    const files = [makeFile('secure.ts', `
import crypto from 'crypto';

const hash = crypto.createHash('sha256').update(data).digest('hex');
const token = crypto.randomBytes(32).toString('hex');
const password = await bcrypt.hash(plaintext, 10);
const dbPassword = process.env.DB_PASSWORD;

// Parameterized query
const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

app.use(cors({ origin: 'https://myapp.com' }));
app.use(helmet());
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  // ─── Edge Cases ───

  it('should handle files with multiple security issues', async () => {
    const files = [makeFile('insecure.ts', `
const password = "admin123";
const result = eval(userCode);
const query = "SELECT * FROM users WHERE name = " + name;
const token = Math.random().toString(36);
`)];

    const issues = await detector.detect(files);
    // At least 4 different security issues
    expect(issues.length).toBeGreaterThanOrEqual(4);
    const types = new Set(issues.map(i => i.type));
    expect(types.size).toBeGreaterThanOrEqual(3);
  });

  it('should handle empty files', async () => {
    const files = [makeFile('empty.ts', '')];
    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should skip comments', async () => {
    const files = [makeFile('commented.ts', `
// const password = "secret123";
/* eval(userInput) */
// "SELECT * FROM users WHERE id = " + userId
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });
});
