---
title: "Open Code Review: The Missing Quality Gate for AI-Generated Code"
published: false
description: "AI coding assistants generate code with defects that traditional linters miss. Here's how Open Code Review detects hallucinated imports, stale APIs, and other AI-specific defects in your CI/CD pipeline — for free."
tags: opensource, ci, codequality, ai, devtools
cover_image: https://github.com/raye-deng/open-code-review/raw/main/docs/images/l2-html-report-screenshot.png
---

# Open Code Review: The Missing Quality Gate for AI-Generated Code

AI coding assistants have transformed how we write code. Copilot, Cursor, Claude Code — they generate hundreds of lines per minute. But there's a growing problem: **the code they generate contains defects that traditional tools completely miss.**

## The Problem with AI-Generated Code

I've been building code quality tools for years, and the rise of AI coding assistants exposed a blind spot in the entire CI/CD toolchain. Consider these real-world examples:

```typescript
// AI hallucinated this import — the package doesn't exist on npm
import { validateSchema } from 'json-schema-validator-pro';

// Using an API deprecated 2 years ago (training data cutoff)
const parsed = url.parse(request.url); // Deprecated since Node 15

// Context window artifact — dead code from truncated generation
interface PaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
  refundPayment(transactionId: string): Promise<void>;
  cancelSubscription(subscriptionId: string): Promise<boolean>; // never called
  upgradePlan(userId: string): Promise<void>; // never called
}
```

| Defect Type | ESLint | SonarQube | Open Code Review |
|------------|--------|-----------|-----------------|
| Hallucinated imports | ❌ | ❌ | ✅ |
| Stale APIs | ❌ | ⚠️ | ✅ |
| Context window artifacts | ❌ | ❌ | ✅ |
| Over-engineered patterns | ⚠️ | ⚠️ | ✅ |
| Security anti-patterns | ⚠️ | ✅ | ✅ |

## Introducing Open Code Review

[Open Code Review](https://github.com/raye-deng/open-code-review) is a free, open-source CI/CD quality gate specifically designed for AI-generated code. It runs 100% locally and provides two scanning levels.

### L1: Pattern Detection (Fast, No AI Needed)

The first layer catches common AI defects using static analysis:

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

This scans for:
- **Hallucinated imports** — verifies every import against npm/PyPI registries
- **Deprecated APIs** — AST-based detection of outdated API usage
- **Security anti-patterns** — hardcoded secrets, `eval()`, SQL injection via concatenation
- **Over-engineering** — excessive cyclomatic complexity, deep nesting, unused abstractions
- **Code duplication** — copy-paste patterns common in AI output

### L2: AI Deep Analysis (Optional, Local LLM)

For deeper analysis, L2 uses embeddings and local LLMs:

```yaml
# .ocrrc.yml
sla: L2
ai:
  embedding:
    provider: ollama
    model: nomic-embed-text
  llm:
    provider: ollama
    model: qwen3-coder
```

L2 adds:
- **Embedding recall** — detects semantic duplicates and suspicious code blocks
- **Cross-file coherence** — checks logical consistency across generated files
- **AI confidence scoring** — flags code that looks machine-generated with low confidence

### Sample Output

```
╔══════════════════════════════════════════════════════════════╗
║           Open Code Review V4 — Quality Report              ║
╚══════════════════════════════════════════════════════════════╝

  Project: packages/core/src
  Overall Score: 67/100  🟠 D | Status: ❌ FAILED

  AI Faithfulness           ████████████████████ 35/35 (100%)
  Code Freshness            ████████████░░░░░░░░ 15/25 (60%)
  Context Coherence         █████████████████░░░ 17/20 (85%)

  🔴 hallucination.ts:58    — Nesting depth 9 (max: 4)
  🔴 defect-patterns.ts:308 — SQL injection via string concatenation
  🟡 stale-api.ts:51        — url.parse() deprecated → WHATWG URL API
```

## CI/CD Integration

### GitHub Actions

```yaml
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 60
    scan-mode: diff
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### GitLab CI

```yaml
code-review:
  script:
    - npx @opencodereview/cli scan src/ --sla L1 --threshold 60 --format sarif
  artifacts:
    reports:
      codequality: ocr-report.json
```

### SARIF Output for GitHub Code Scanning

```bash
ocr scan src/ --sla L1 --format sarif --output results.sarif
```

This integrates with GitHub's native Code Scanning UI, so AI-generated code defects appear alongside your existing security alerts.

## What Makes It Different

There are plenty of code review tools. Here's why Open Code Review takes a different approach:

1. **Built for AI-generated code, not legacy code** — Traditional linters assume a human wrote the code. They check for style, common bugs, and security issues. But they don't understand that an AI might hallucinate an import to a package that doesn't exist.

2. **100% local, zero cost** — Your code never leaves your machine. No API keys needed for L1 scanning. L2 uses local Ollama models.

3. **Registry verification** — The hallucinated import detection actually queries npm and PyPI registries to verify packages exist. This catches one of the most common AI coding mistakes.

4. **SARIF + Code Scanning integration** — Not just terminal output. Defects appear in GitHub's Security tab alongside dependency vulnerabilities.

5. **Self-hostable** — Runs anywhere Node.js runs. No cloud dependency.

## The Hallucination Problem is Real

A [2024 study](https://arxiv.org/abs/2402.01264) found that AI coding assistants generate incorrect package references approximately 3.4% of the time. In a codebase with 1,000 imports, that's ~34 hallucinated packages that will silently fail at runtime.

Open Code Review's L1 scanner detects these in under 10 seconds by cross-referencing every import against the actual registry.

## Try It

```bash
# Install
npm install -g @opencodereview/cli

# Quick scan (L1 — pattern detection, no AI needed)
ocr scan src/ --sla L1

# Deep scan (L2 — embedding + local LLM via Ollama)
ocr scan src/ --sla L2

# CI mode with SARIF output
ocr scan src/ --sla L1 --format sarif --output results.sarif
```

**GitHub**: [raye-deng/open-code-review](https://github.com/raye-deng/open-code-review)
**Portal**: [codes.evallab.ai](https://codes.evallab.ai)

---

*Open Code Review is licensed under BSL-1.1 — free for personal and non-commercial use. Converts to Apache 2.0 on 2030-03-11.*
