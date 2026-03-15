Open Code Review: Open-source CI/CD quality gate for AI-generated code (L3 Remote LLM, 6 languages, 8 LLM providers)

Open Code Review is a free, open-source, self-hostable CI/CD quality gate that detects defects specific to AI-generated code — things ESLint, SonarQube, and Pylint miss entirely.

**Key technical details:**

- **3-level SLA pipeline**: L1 (structural, <10s, 100% local), L2 (+ embedding recall + local LLM via Ollama), L3 (+ remote LLM deep scan on suspicious blocks). Each level is additive.
- **L3 Deep Scan (v2.1.0)**: Identifies suspicious code blocks post-L1/L2 analysis (unusually long functions, imports not in dependency tree, style mismatches), sends targeted prompts to a remote LLM, parses structured findings, and merges with existing results. No full codebase sent to LLM.
- **Universal Provider Adapter**: Abstracts LLM access behind a common interface. Supports OpenAI, GLM/ZAI (free tier), DeepSeek, Together AI, Fireworks, Anthropic, Ollama, and any OpenAI-compatible endpoint.
- **Multi-language AI detection (v2.1.0)**: Dedicated detectors for TypeScript, JavaScript, Python, Java, Go, and Kotlin. Each validates imports against ecosystem registries (npm, PyPI, Maven Central), checks stdlib deprecation, and detects ecosystem-specific security anti-patterns.
- **AI Auto-Fix (`ocr heal`)**: Scan → LLM fixes → Re-scan → Report cycle. Also generates IDE rules for Cursor, Copilot, and Augment to prevent future defects.
- **Defect types**: Hallucinated imports (packages that don't exist), stale APIs (deprecated methods from training data), context window artifacts (cross-file contradictions), over-engineering, and security anti-patterns.

**Differentiation from existing tools**: ESLint/SonarQube check code style and known patterns — they weren't designed for AI-generated code hallucinations. Commercial code review tools (CodeRabbit, Copilot) are cloud-hosted and paid. Open Code Review runs 100% locally at L1, is free, and specifically targets AI defect patterns.

**Quick start**: `npx @opencodereview/cli scan src/ --sla L1`

**GitHub**: https://github.com/raye-deng/open-code-review
**Portal**: https://codes.evallab.ai
