🚀 Just shipped Open Code Review v2.1.0 — the first open-source CI/CD quality gate built specifically for AI-generated code.

AI assistants write code with defects that linters completely miss. We catch them.

Free. Open-source. Self-hosted. 👇

---

The problem: AI code has 5 unique defect types that ESLint, SonarQube, and Pylint don't detect:

• Hallucinated imports (packages that don't exist)
• Stale APIs (deprecated since 2020 but AI still uses them)
• Context window artifacts
• Over-engineering
• Security anti-patterns

---

Our solution: 3-level SLA pipeline

L1 Fast (<10s): Structural detection — FREE
L2 Standard: + Embedding recall + Local LLM (Ollama)
L3 Deep: + Remote LLM deep scan on suspicious blocks

---

v2.1.0 new: L3 Remote LLM with Universal Provider Adapter

8 providers out of the box:
✅ OpenAI
✅ GLM/ZAI (free!)
✅ DeepSeek
✅ Together AI
✅ Fireworks
✅ Anthropic
✅ Ollama (local)
✅ Any OpenAI-compatible API

---

v2.1.0 new: Multi-language AI detection

Now detects AI-specific defects in:
🟦 TypeScript / JavaScript
🐍 Python
☕ Java
🔵 Go
🟣 Kotlin

Each with dedicated detectors for hallucinated imports, security patterns, and more.

---

v2.1.0 new: `ocr heal` — AI Auto-Fix

Scan → AI fixes → Re-scan → Report

```
ocr heal src/ --provider glm --model pony-alpha-2
```

Also generates IDE rules for Cursor, Copilot, and Augment 🤖

---

Get started in 30 seconds:

```
npx @opencodereview/cli scan src/ --sla L1
```

Or add to CI:
```yaml
- uses: raye-deng/open-code-review@v1
```

⭐ github.com/raye-deng/open-code-review
🌐 codes.evallab.ai

#CodeReview #AI #OpenSource
