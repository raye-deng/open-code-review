# Open Source: AI code quality gate for CI/CD — detects hallucinated imports, stale APIs, over-engineering (now with LLM deep scan)

Hey everyone, I've been working on an open-source tool called **Open Code Review** — a CI/CD quality gate specifically designed for AI-generated code. v2.1.0 just dropped with LLM deep scan, multi-language support, and auto-fix.

## What it does

Traditional linters (ESLint, SonarQube, Pylint) check code style and known patterns. They were built for human-written code. AI-generated code has a different class of defects they can't detect:

1. **Hallucinated imports** — AI invents package names that don't exist on npm/PyPI
   ```typescript
   import { validate } from 'validator-email-utils'; // package doesn't exist
   ```

2. **Stale APIs** — AI recommends deprecated APIs from its training data
   ```python
   import imp  # Deprecated in 2019, removed in Python 3.12
   ```

3. **Context window artifacts** — Logic contradictions across files in the same conversation
   ```typescript
   // file-a.ts: db.query('SELECT * FROM users WHERE id = ?', [id])
   // file-b.ts: db.query('SELECT * FROM users WHERE user_id = ?', [id])
   // Same function, different implementations
   ```

4. **Over-engineering** — Unnecessary abstractions for simple operations
   ```typescript
   // AI generates a Strategy + Factory pattern for a boolean toggle
   ```

5. **Security anti-patterns** — Hardcoded example secrets, eval(), injection patterns

None of these are caught by ESLint or SonarQube. They all pass linting and reach production.

## 30-second CI setup

```yaml
# .github/workflows/ocr.yml
name: Open Code Review
on: [push, pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: raye-deng/open-code-review@v1
        with:
          sla: L1
          threshold: 70
```

Or run locally:

```bash
npx @opencodereview/cli scan src/ --sla L1
```

## What's new in v2.1.0

**L3 Deep Scan** — Sends suspicious code blocks to a remote LLM for semantic analysis. Catches logic errors, business logic issues, and nuanced anti-patterns that structural analysis can't detect.

**Multi-language support** — Dedicated detectors for TypeScript, JavaScript, Python, Java, Go, and Kotlin. Each with registry validation, deprecation checks, and ecosystem-specific security patterns.

**AI Auto-Fix (`ocr heal`)** — Scan → AI fixes → Re-scan → Report:
```bash
npx @opencodereview/cli heal src/ --provider glm --model pony-alpha-2
```

## Free LLM provider: GLM/ZAI

The Universal Provider Adapter supports 8 providers: OpenAI, GLM/ZAI, DeepSeek, Together AI, Fireworks, Anthropic, Ollama, and any OpenAI-compatible API.

The highlight: **GLM/ZAI has a free tier** that's genuinely usable. You can run L3 deep scans on every CI build without paying anything. This is unusual for LLM providers and makes the tool accessible to open-source projects and individual developers.

## Links

- **GitHub**: https://github.com/raye-deng/open-code-review
- **npm**: https://www.npmjs.com/package/@opencodereview/cli
- **Portal**: https://codes.evallab.ai

Feedback welcome. Happy to answer questions about the architecture or design decisions.
