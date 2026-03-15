# Product Hunt Launch — Open Code Review (OCR)

---

## Tagline (max 60 characters)

**The linter your AI coding tools don't have.**

---

## Short Description (Elevator Pitch)

Open Code Review is the first CI/CD quality gate built specifically for AI-generated code. It catches 5 types of defects that traditional linters miss — hallucinated imports, outdated APIs, security anti-patterns, over-engineering, and context disconnects. 100% local, zero cost, runs in 3 seconds.

---

## Long Description

### The Problem: Your Linter Can't See AI Mistakes

AI coding tools (Copilot, Cursor, ChatGPT) are the biggest productivity leap since compilers. But they come with a blind spot your team probably doesn't know about yet.

AI models hallucinate. They confidently import packages that don't exist, suggest API calls from outdated versions, and generate code that looks perfect but breaks at runtime. Traditional linters (ESLint, SonarQube, Prettier) were built for human mistakes — typos, style issues, known anti-patterns. They're completely blind to AI-specific defects.

In our testing, traditional tooling catches only ~12% of AI-generated code issues. The other 88% slip through to code review, QA, or production.

### The Solution: AI-Specific Quality Gate

Open Code Review (OCR) is the first CI/CD quality gate designed from the ground up for AI-generated code. It runs in your pipeline alongside your existing tools and catches the defects they can't see:

- 🚫 **Hallucinated Imports** — flags packages, functions, and paths that don't exist in your dependency tree
- 📅 **Outdated APIs** — detects calls to deprecated/removed APIs based on current package versions
- 🔒 **Security Anti-Patterns** — catches AI-generated code that introduces secrets, injection vectors, or unsafe patterns
- 🎯 **Over-Engineering** — identifies unnecessarily complex abstractions that increase maintenance burden
- 🔗 **Context Disconnects** — finds inconsistencies across AI-generated files (mismatched signatures, dropped variables)

### Three Tiers. Zero Cost.

| Tier | Speed | AI Required | Cost | What It Catches |
|------|-------|-------------|------|-----------------|
| **L1** | ~3 sec | No | Free | Hallucinated imports, outdated APIs, security patterns |
| **L2** | ~15 sec | Local LLM (Ollama) | Free | + Over-engineering, context consistency |
| **L3** | ~30 sec | Any model | Your cost | + Full semantic review |

**L1 requires zero configuration and zero AI.** It uses deterministic pattern matching and AST analysis. Most teams get 80%+ of the value from L1 alone.

### Why Different?

- **100% local** — your code never leaves your machine or CI runner
- **Zero cost** — L1 is free, L2 uses free local models via Ollama
- **No signup** — `npx` and go
- **CI-native** — GitHub Actions, GitLab CI, SARIF output built in
- **Open source** — MIT licensed, transparent detection logic

### Quick Start

```bash
npx @opencodereview/cli scan . --sla L1
```

Add to CI in one line:

```yaml
- name: AI Code Quality Gate
  run: npx @opencodereview/cli scan . --sla L1
```

### Tech Specs

- **Languages:** Python, JavaScript, TypeScript, Go, Rust
- **CI Integration:** GitHub Actions, GitLab CI, any CI that runs npm
- **Output Formats:** Terminal, JSON, SARIF (shows in GitHub PR checks)
- **Current Version:** v2.1.1

---

## First Comment

Hey Product Hunt! 👋

Quick backstory on why this exists:

Six months ago, my team adopted AI coding tools across the board. Productivity went up 40%. But we started seeing a new kind of bug — code that passed every check, looked perfect in review, and then crashed in production because the AI had hallucinated an import path that didn't exist in our dependency tree.

We audited three months of AI-generated commits and found that roughly 15-20% had issues our entire CI pipeline (ESLint + tests + code review) missed. Two made it to production and caused incidents.

The problem wasn't that the AI was bad — it was that our quality tools were designed for a different era. Linters check syntax. Tests check logic. But nothing was checking whether the AI's "knowledge" matched our actual codebase.

That's why we built OCR. We wanted a tool that runs in 3 seconds, costs nothing, and catches the specific failure modes of AI-generated code. We open-sourced it because this is a problem every team using AI coding tools will face — and the solution shouldn't require a budget approval.

**FAQ:**

**Q: How is this different from ESLint/SonarQube?**
Those tools check for known anti-patterns in human-written code. OCR checks for AI-specific failures: hallucinated references, stale API usage, and over-engineering that looks clean but adds complexity. They're complementary — use both.

**Q: Do I need an API key?**
No. L1 requires nothing. L2 uses a free local model via Ollama. L3 supports any model you configure.

**Q: Will it slow down my CI?**
L1 adds ~3 seconds. In most pipelines, that's less than your linter step.

**Q: What about false positives?**
L1 is intentionally conservative. We tested on real projects and saw under 2% false positive rate. You can always adjust sensitivity in L2/L3.

Give it a try and let us know what you think! 🚀
