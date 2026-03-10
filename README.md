# Open Code Review

> 🔍 Open-source, lightweight alternative to Claude Code Review — AI-generated code quality scanner

[![npm](https://img.shields.io/npm/v/open-code-review)](https://www.npmjs.com/package/open-code-review)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## What is Open Code Review?

Open Code Review (OCR) is a **free, open-source** tool that detects AI-specific code defects — the kind that ESLint, SonarQube, and traditional linters miss.

While tools like Claude Code Review focus on general code quality, **OCR specializes in catching AI hallucinations, stale APIs, and context window artifacts** that AI coding assistants (Copilot, Cursor, Claude, ChatGPT) commonly introduce.

### 🎯 What We Detect (That Others Don't)

| Category | Example | Severity |
|----------|---------|----------|
| 🔴 **AI Hallucination** | `import { magic } from 'non-existent-pkg'` | Critical |
| 🟠 **Stale API** | `new Buffer()` instead of `Buffer.from()` | High |
| 🟡 **Context Loss** | Variable redefined with conflicting types | Medium |
| 🟡 **Over-Engineering** | Unnecessary abstraction layers | Medium |
| 🔵 **Security Anti-pattern** | AI-generated hardcoded secrets | Critical |
| ⚪ **Type Safety** | Excessive `any` types | Low |

### 💡 What We DON'T Flag

Issues already covered by ESLint, Prettier, SonarQube, etc. are automatically downgraded to `info` (0 deduction). We focus on **AI-unique defects** only.

## Quick Start

```bash
# Scan current directory
npx open-code-review scan .

# With license (free, for usage tracking)
npx open-code-review --license AICV-XXXX-XXXX-XXXX-XXXX scan .

# Short alias
npx ocr scan .
```

## Supported Languages

| Language | Status | Adapter |
|----------|--------|---------|
| TypeScript/JavaScript | ✅ Full | oxc-parser |
| Python | ✅ Full | Regex-based |
| Java | ✅ Full | Regex-based |
| Go | ✅ Full | Regex-based |
| Kotlin | ✅ Full | Regex-based |

## Scoring System

4 dimensions × 5 severity levels:

| Dimension | Weight | Focus |
|-----------|--------|-------|
| AI Faithfulness | 35% | Hallucination detection |
| Code Freshness | 25% | Deprecated API usage |
| Context Coherence | 20% | Cross-function consistency |
| Implementation Quality | 20% | Completeness, error handling |

Grades: **A+** (95-100) → **F** (0-59)

## SLA Service Levels

| Level | Speed | AI | Precision |
|-------|-------|----|-----------| 
| L1 Fast | ≤10s/100 files | None | ≥80% |
| L2 Standard | ≤30s/100 files | Local (Ollama) | ≥85% |
| L3 Deep | ≤120s/100 files | Local + Remote | ≥90% |

## CI Integration

### GitHub Action
```yaml
- uses: raye-deng/open-code-review@v3
  with:
    license: ${{ secrets.OCR_LICENSE }}
```

### GitLab CI
```yaml
include:
  - remote: 'https://codes.evallab.ai/ci/gitlab-component.yml'
```

## vs Claude Code Review

| Feature | Claude Code Review | Open Code Review |
|---------|-------------------|-----------------|
| Price | Paid | **Free** |
| Source | Closed | **Open Source** |
| AI Hallucination Detection | ❌ | ✅ |
| Stale API Detection | ❌ | ✅ |
| Local AI (Ollama) | ❌ | ✅ |
| Multi-language | Limited | 5 languages |
| CI Integration | GitHub only | GitHub + GitLab + Any |
| Self-hosted | ❌ | ✅ |

## 📦 Packages

| Package | Description |
|---------|------------|
| `@open-code-review/core` | Core detection engine |
| `@open-code-review/cli` | CLI tool (`open-code-review` / `ocr`) |
| `@open-code-review/github-action` | GitHub Actions integration |
| GitLab Component | GitLab CI/CD Component |
| `@open-code-review/web` | Marketing website |

## 🏗️ Development

```bash
# Clone
git clone https://github.com/raye-deng/open-code-review.git
cd open-code-review

# Install
pnpm install

# Build all
pnpm build

# Test
pnpm test
```

## License

MIT © [Raye Deng](https://github.com/raye-deng)
