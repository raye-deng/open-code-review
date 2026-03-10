/**
 * StaleAPIDetector Tests
 *
 * Tests deprecated/outdated API detection for AI-generated code.
 */

import { describe, it, expect } from 'vitest';
import { StaleAPIDetector } from '../src/detectors/stale-api.js';
import type { FileAnalysis, UnifiedIssue } from '../src/types.js';
import { AIDefectCategory } from '../src/types.js';

// ─── Helper ───

function makeFile(path: string, content: string): FileAnalysis {
  return { path, content, language: 'typescript' };
}

function validateIssue(issue: UnifiedIssue) {
  expect(issue.id).toBeTruthy();
  expect(issue.detector).toBe('stale-api');
  expect(issue.category).toBe(AIDefectCategory.STALE_KNOWLEDGE);
  expect(['critical', 'high', 'medium', 'low', 'info']).toContain(issue.severity);
  expect(issue.message).toBeTruthy();
  expect(issue.file).toBeTruthy();
  expect(issue.line).toBeGreaterThan(0);
}

// ─── Tests ───

describe('StaleAPIDetector', () => {
  const detector = new StaleAPIDetector();

  it('should have correct metadata', () => {
    expect(detector.name).toBe('stale-api');
    expect(detector.version).toBe('1.0.0');
    expect(detector.tier).toBe(1);
  });

  it('should detect new Buffer() usage', async () => {
    const files = [makeFile('test.ts', `
const buf = new Buffer(10);
const buf2 = new Buffer('hello');
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBeGreaterThanOrEqual(2);

    for (const issue of issues) {
      validateIssue(issue);
      expect(issue.message).toContain('Buffer');
      expect(issue.suggestion).toContain('Buffer.from');
    }
  });

  it('should detect fs.exists() usage', async () => {
    const files = [makeFile('server.ts', `
import fs from 'fs';
if (fs.exists('/tmp/file')) {
  console.log('found');
}
`)];

    const issues = await detector.detect(files);
    const fsIssues = issues.filter(i => i.message.includes('fs.exists'));
    expect(fsIssues.length).toBeGreaterThanOrEqual(1);
    expect(fsIssues[0].suggestion).toContain('fs.existsSync');
    validateIssue(fsIssues[0]);
  });

  it('should detect deprecated crypto APIs', async () => {
    const files = [makeFile('crypto.ts', `
import crypto from 'crypto';
const cipher = crypto.createCipher('aes-256-cbc', 'password');
const decipher = crypto.createDecipher('aes-256-cbc', 'password');
`)];

    const issues = await detector.detect(files);
    const cryptoIssues = issues.filter(i => i.message.includes('crypto'));
    expect(cryptoIssues.length).toBeGreaterThanOrEqual(2);
    for (const issue of cryptoIssues) {
      validateIssue(issue);
    }
  });

  it('should detect deprecated React lifecycle methods', async () => {
    const files = [makeFile('component.tsx', `
class MyComponent extends React.Component {
  componentWillMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.fetchData(nextProps.id);
    }
  }
  componentWillUpdate(nextProps, nextState) {
    // ...
  }
}
`)];

    const issues = await detector.detect(files);
    const reactIssues = issues.filter(i =>
      i.message.includes('componentWillMount') ||
      i.message.includes('componentWillReceiveProps') ||
      i.message.includes('componentWillUpdate')
    );
    expect(reactIssues.length).toBeGreaterThanOrEqual(3);
    for (const issue of reactIssues) {
      validateIssue(issue);
      expect(issue.severity).toBe('medium');
    }
  });

  it('should detect ReactDOM.render() deprecation', async () => {
    const files = [makeFile('index.tsx', `
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
`)];

    const issues = await detector.detect(files);
    const renderIssues = issues.filter(i => i.message.includes('ReactDOM.render'));
    expect(renderIssues.length).toBeGreaterThanOrEqual(1);
    expect(renderIssues[0].suggestion).toContain('createRoot');
  });

  it('should detect deprecated url.parse()', async () => {
    const files = [makeFile('server.ts', `
import url from 'url';
const parsed = url.parse(req.url, true);
const resolved = url.resolve('http://example.com', '/path');
`)];

    const issues = await detector.detect(files);
    const urlIssues = issues.filter(i => i.message.includes('url.'));
    expect(urlIssues.length).toBeGreaterThanOrEqual(2);
  });

  it('should NOT report issues in clean modern code', async () => {
    const files = [makeFile('clean.ts', `
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { URL } from 'node:url';

const buf = Buffer.from('hello');
const buf2 = Buffer.alloc(10);
const hash = createHash('sha256');
const parsed = new URL('http://example.com/path');
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should skip comments', async () => {
    const files = [makeFile('commented.ts', `
// new Buffer(10) is deprecated
/* crypto.createCipher() should not be used */
// fs.exists() is old
const x = 1;
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });

  it('should respect ai-validator-ignore comments', async () => {
    const files = [makeFile('suppressed.ts', `
// ai-validator-ignore
const parsed = url.parse('http://example.com');
const parsed2 = url.parse('http://test.com');
`)];

    const issues = await detector.detect(files);
    // First url.parse is suppressed (line 3), second is not (line 4)
    const urlIssues = issues.filter(i => i.message.includes('url.parse'));
    expect(urlIssues.length).toBe(1);
    expect(urlIssues[0].line).toBe(4);
  });

  it('should detect document.write() in browser code', async () => {
    const files = [makeFile('legacy.js', `
document.write('<h1>Hello</h1>');
document.writeln('<p>World</p>');
`)];

    const issues = await detector.detect(files);
    const domIssues = issues.filter(i => i.message.includes('document.write'));
    expect(domIssues.length).toBeGreaterThanOrEqual(2);
  });

  it('should handle multiple deprecated APIs in a single file', async () => {
    const files = [makeFile('legacy-hell.ts', `
import url from 'url';
import crypto from 'crypto';

const buf = new Buffer('data');
const parsed = url.parse('http://example.com');
const cipher = crypto.createCipher('aes-256-cbc', 'key');
`)];

    const issues = await detector.detect(files);
    expect(issues.length).toBeGreaterThanOrEqual(3);
    // Check all are unique
    const ids = issues.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should handle empty files gracefully', async () => {
    const files = [makeFile('empty.ts', '')];
    const issues = await detector.detect(files);
    expect(issues.length).toBe(0);
  });
});
