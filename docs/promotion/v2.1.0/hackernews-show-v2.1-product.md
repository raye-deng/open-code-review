# Show HN: Open Code Review – Linter for AI-Generated Code

## Post Text

**Open Code Review (OCR)** is a CI/CD quality gate that catches defects in AI-generated code that traditional linters miss — things like hallucinated package imports (referencing modules that don't exist in your dependency tree), outdated API usage based on stale training data, security anti-patterns, and over-engineered abstractions.

The key insight: existing tools (ESLint, SonarQube, etc.) were designed for human-written code. They check syntax and style, but they can't tell you that `import { formatDate } from 'date-fns/format'` will crash at runtime because that subpath doesn't exist. OCR catches exactly these cases.

It runs 100% locally with three tiers: L1 (pattern matching, 3 seconds, no AI needed), L2 (local LLM via Ollama), L3 (configurable model). L1 is completely free and requires zero configuration. Supports GitHub Actions, GitLab CI, and SARIF output.

Try it: `npx @opencodereview/cli scan . --sla L1`

GitHub: https://github.com/raye-deng/open-code-review
Portal: https://codes.evallab.ai
Supports: Python, JS, TS, Go, Rust

---

## First Comment (Post Immediately After Submitting)

Hi HN, a few more details for anyone curious:

**Why not just use existing linters?** Traditional linters check for known anti-patterns — unused variables, missing semicolons, etc. AI-generated code has a fundamentally different failure mode: it *looks* correct syntactically but references things that don't exist (hallucinated imports), uses APIs from old versions (the model's training data is stale), or introduces patterns that are secure in isolation but dangerous in your specific context. We benchmarked this against ESLint + SonarQube on 500+ AI-generated snippets — they caught ~12% of AI-specific issues. OCR catches the remaining ~88%.

**Q: How is L1 "no AI needed"?**
L1 uses deterministic pattern matching and AST analysis. It checks import paths against your actual package manifest, cross-references API calls against current package versions, and scans for known AI security anti-patterns. No LLM, no API key, no cost. It runs in about 3 seconds on a typical project.

**Q: What about false positives?**
This was our biggest concern during development. L1 is intentionally conservative — it only flags things that have a very high confidence of being actual issues (e.g., an import path that provably doesn't exist in your node_modules). In our testing on real projects, the false positive rate for L1 is under 2%. L2 and L3 allow tuning sensitivity.

**Q: Why open source?**
AI-generated code quality is a shared problem. We wanted this to be something any team can adopt without budget approval, vendor lock-in, or sending their code to a third party. The more people use it, the better the pattern database gets.

Happy to answer questions about the detection logic, architecture, or anything else.
