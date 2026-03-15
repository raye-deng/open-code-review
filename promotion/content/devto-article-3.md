---
title: "How I Added AI Code Quality Checks to My CI Pipeline in 5 Minutes (And Found 47 Bugs on Day One)"
published: true
tags: ["ai", "cicd", "devops", "tutorial"]
series: "AI Code Quality"
canonical_url: "https://codes.evallab.ai/blog/ci-pipeline-setup-guide"
description: "Step-by-step guide to adding Open Code Review — a free, open-source CI/CD quality gate for AI-generated code — to your pipeline. Found 47 bugs on day one."
---

# How I Added AI Code Quality Checks to My CI Pipeline in 5 Minutes (And Found 47 Bugs on Day One)

**TL;DR:** Set up [Open Code Review](https://github.com/raye-deng/open-code-review) — a free, open-source tool that catches AI-generated code defects — in your CI/CD pipeline. Here's the step-by-step guide.

---

## The Problem

My team started using AI coding assistants (Copilot, Cursor, Claude Code) about 6 months ago. Velocity went up. But so did a new category of bugs:

```typescript
// Bug 1: Hallucinated import — package doesn't exist
import { validateEmail } from 'email-validator-pro';  // ❌ Doesn't exist on npm

// Bug 2: Deprecated API — worked fine in 2020
const parsed = url.parse(request.url);  // ⚠️ Deprecated since Node 15

// Bug 3: Security anti-pattern
const query = `SELECT * FROM users WHERE id = ${userId}`;  // 🔴 SQL injection
```

These bugs slip past ESLint, Prettier, and even TypeScript. They compile fine. They just break at runtime.

I needed a quality gate that understood AI-generated code defects specifically.

## The Solution: Open Code Review

[Open Code Review (OCR)](https://github.com/raye-deng/open-code-review) is a free, open-source CLI that detects AI-specific code defects:

- **Hallucinated imports** — Verifies every import against npm/PyPI registries
- **Stale APIs** — AST-based deprecated API detection
- **Security anti-patterns** — Hardcoded secrets, eval(), SQL injection
- **Over-engineering** — Cyclomatic complexity, nesting depth
- **Context artifacts** — Unused interfaces, dead code from truncated generation

Best part: L1 mode runs in under 10 seconds with **no AI needed**.

## 5-Minute Setup

### Step 1: Install (30 seconds)

```bash
npm install -g @opencodereview/cli
```

### Step 2: Scan Locally (1 minute)

```bash
ocr scan src/ --sla L1
```

You'll get a detailed report:

```
╔══════════════════════════════════════════════════════════════╗
║           Open Code Review V4 — Quality Report              ║
╚══════════════════════════════════════════════════════════════╝

  Overall Score: 72/100  🟠 C
  Files Scanned: 48  |  Duration: 6.3s

  🔴 [error] api/handler.ts:45   — Possible hardcoded API key
  🟡 [warn]  utils/request.ts:12 — url.parse() deprecated → WHATWG URL API
  🟡 [warn]  services/auth.ts:67 — Cyclomatic complexity 22 (max: 15)
  ⚪ [info]  types/index.ts:8    — Unused interface (context window artifact)
```

### Step 3: Add to GitHub Actions (2 minutes)

Create `.github/workflows/ocr.yml`:

```yaml
name: AI Code Quality Check

on: [pull_request]

jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install OCR
        run: npm install -g @opencodereview/cli
      - name: Scan changed files
        uses: raye-deng/open-code-review@v1
        with:
          sla: L1
          threshold: 60
          scan-mode: diff
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Step 4: Generate SARIF Report (1 minute)

For GitHub Code Scanning integration:

```yaml
      - name: Generate SARIF
        run: ocr scan src/ --sla L1 --format sarif -o ocr-results.sarif
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: ocr-results.sarif
```

### Step 5: Set Your Quality Threshold (30 seconds)

The `threshold` parameter sets the minimum quality score (0-100). If the scan score falls below it, the CI check fails.

```yaml
          threshold: 70  # Adjust based on your team's tolerance
```

**That's it.** Your CI pipeline now catches AI-generated code defects before they merge.

## What I Found on Day One

Running OCR on our main codebase revealed:

| Finding | Count | Severity |
|---------|-------|----------|
| Hallucinated imports | 12 | 🔴 Error |
| Deprecated Node.js APIs | 8 | 🟡 Warning |
| Hardcoded secrets | 3 | 🔴 Error |
| Over-engineered functions | 15 | 🟡 Warning |
| Unused types/interfaces | 9 | ⚪ Info |

**47 issues** that our existing toolchain (ESLint + TypeScript + SonarQube) completely missed.

## L2 Mode: AI-Powered Deep Analysis

If you want deeper analysis, OCR has an L2 mode that uses local AI (Ollama) for:

- Cross-file coherence checking
- Semantic duplication detection
- AI confidence scoring

```yaml
# .ocrrc.yml
sla: L2
ai:
  embedding:
    provider: ollama
    model: nomic-embed-text
    baseUrl: http://localhost:11434
  llm:
    provider: ollama
    model: qwen3-coder
    endpoint: http://localhost:11434
```

L2 takes a bit longer (~30 seconds for medium projects) but catches subtle issues that pattern matching alone can't.

## How It Compares

| | OCR | ESLint | SonarQube | CodeRabbit |
|---|---|---|---|---|
| **Hallucinated imports** | ✅ | ❌ | ❌ | ❌ |
| **Deprecated API detection** | ✅ AST | ❌ | ⚠️ Partial | ❌ |
| **Runs locally** | ✅ | ✅ | ✅ | ❌ |
| **Free** | ✅ | ✅ | Community | ❌ |
| **SARIF output** | ✅ | Via plugin | ✅ | ❌ |
| **AI-specific rules** | ✅ | ❌ | ❌ | ⚠️ |

OCR **complements** your existing tools — it doesn't replace them. Keep ESLint for style. Add OCR for AI-specific defects.

## GitLab CI Integration

Not on GitHub? No problem:

```yaml
code-review:
  script:
    - npx @opencodereview/cli scan src/ --sla L1 --threshold 60 --format json --output ocr-report.json
  artifacts:
    reports:
      codequality: ocr-report.json
```

## Tips from Production Use

1. **Start with L1.** It's fast enough for every PR. Add L2 later for critical paths.
2. **Use `scan-mode: diff`** in CI to only scan changed files — keeps PR checks fast.
3. **Don't set threshold too high initially.** Start at 50-60 and raise it as you fix existing issues.
4. **Use `--format html`** for human-readable reports in pull request comments.
5. **Run a full scan weekly** (not just diffs) to catch gradual drift.

## Wrapping Up

AI coding assistants are incredible productivity boosters. But they introduce a new category of bugs that traditional tools weren't designed to catch.

Open Code Review fills that gap. It's free, open-source, runs locally, and takes 5 minutes to set up.

**Give it a try:**

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

[GitHub](https://github.com/raye-deng/open-code-review) · [Portal](https://codes.evallab.ai) · [NPM](https://www.npmjs.com/package/@opencodereview/cli)

---

*What AI-generated code bugs have you encountered? I'd love to hear about your experience in the comments.*
