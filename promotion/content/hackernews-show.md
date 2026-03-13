# Show HN: Open Code Review – Free CI/CD quality gate for AI-generated code

## Title
Show HN: Open Code Review – Free CI/CD quality gate for AI-generated code

## URL
https://github.com/raye-deng/open-code-review

## Comment / Text
AI coding assistants (Copilot, Cursor, Claude) generate code with defects that traditional linters miss entirely: hallucinated imports to non-existent packages, stale APIs from training data, context window artifacts, over-engineered patterns, and security anti-patterns.

Open Code Review (OCR) is a free, open-source CI/CD quality gate specifically built to detect these AI-generated code defects. It runs 100% locally with two scanning levels:

**L1 (Pattern Detection, no AI needed):**
- Hallucinated import detection via npm/PyPI registry verification
- Deprecated API detection (AST-based)
- Security anti-pattern matching
- Over-engineering heuristics
- Code duplication analysis

**L2 (AI Deep Analysis, optional):**
- Embedding recall with risk scoring
- LLM analysis via local Ollama or OpenAI/Anthropic
- Cross-file context coherence checking
- Semantic duplication detection

**Key features:**
- SARIF output for GitHub Code Scanning integration
- GitHub Action + GitLab CI support
- Supports TypeScript, JavaScript, Python, Go, Java, Kotlin
- 100% local execution (data never leaves your machine)
- Self-hostable, zero cost for personal use

Install: `npm install -g @opencodereview/cli`
Scan: `ocr scan src/ --sla L1`

Licensed BSL-1.1 (free for personal use, converts to Apache 2.0 in 2030).

Portal: https://codes.evallab.ai

## Status
⚠️ **Blocked**: HN is temporarily restricting Show HN submissions for new/low-karma accounts (as of 2026-03-13). The account `aneyadeng` has 1 karma point. Need to participate in discussions first to build karma before submitting.

## Recommendation
1. Spend 1-2 weeks commenting on HN posts to build karma (aim for 50+ karma)
2. Then submit this Show HN post
3. Alternatively, submit as a regular story (not Show HN) — those may not be restricted
