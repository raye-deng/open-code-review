# Product Hunt Draft — Open Code Review

## Product Name
Open Code Review

## Tagline
The free, open-source quality gate for AI-generated code

## Categories
- Developer Tools
- Open Source
- Productivity
- Security

## Elevator Pitch (60 words)
Open Code Review catches bugs in AI-generated code that traditional linters miss — hallucinated imports, deprecated APIs, security anti-patterns, and over-engineered patterns. Free, self-hosted, runs in under 10 seconds. Works with GitHub Actions and GitLab CI.

## Full Description

AI coding assistants (Copilot, Cursor, Claude Code) have transformed how we write code. But they've also introduced a new category of bugs:

- **Hallucinated imports** — AI references packages that don't exist on npm
- **Stale APIs** — AI uses deprecated APIs from its training data
- **Security anti-patterns** — Hardcoded secrets, eval(), SQL injection
- **Over-engineering** — Unnecessary complexity and abstractions
- **Context artifacts** — Dead code from truncated AI generation

Traditional tools (ESLint, SonarQube, Prettier) were built for human-written code. They can't detect these AI-specific defects.

**Open Code Review fills this gap.**

### Key Features
✅ **Hallucinated import detection** — Verifies every import against npm/PyPI registries
✅ **AST-based deprecated API detection** — Not regex, actual AST analysis
✅ **Security anti-pattern scanning** — Hardcoded secrets, eval(), injection
✅ **Code quality scoring** — 0-100 with letter grades (A-F)
✅ **Two-stage pipeline** — L1 (fast, no AI) + L2 (deep, local Ollama)
✅ **CI/CD integration** — GitHub Actions, GitLab CI, SARIF output
✅ **100% local** — No API keys, no cloud dependency
✅ **6+ languages** — TypeScript, JavaScript, Python, Go, Java, Kotlin

### Quick Start
```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

### GitHub Action
```yaml
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 60
```

### Pricing
- **Free** for personal and non-commercial use
- Team and Enterprise plans available

### Links
- GitHub: https://github.com/raye-deng/open-code-review
- NPM: https://www.npmjs.com/package/@opencodereview/cli
- Portal: https://codes.evallab.ai

## First Comment (Maker Comment)

Hey Product Hunt! 👋

I'm Raye, the creator of Open Code Review.

**Why I built this:** After my team started using AI coding assistants, we kept shipping code with bugs that ESLint and TypeScript couldn't catch — packages that didn't exist, deprecated APIs, hardcoded secrets. These are a new category of defects unique to AI-generated code.

**What makes OCR different:**
- It specifically targets AI-generated code defects (not just general code quality)
- Verifies imports against npm/PyPI (catches hallucinated packages)
- AST-based analysis (not regex pattern matching)
- 100% local — your code never leaves your machine
- Free and open-source

**What I'd love feedback on:**
- What AI-generated code bugs have you encountered?
- Would you use L2 mode with local AI (Ollama) for deeper analysis?
- What languages should we support next?

Happy to answer any questions! 🚀

## Social Media Preview Text
"Catch bugs in AI-generated code that ESLint misses. Free, open-source, runs in 10 seconds."

## Thumbnail Suggestion
Screenshot of the terminal output showing the quality report with findings

## Launch Date Strategy
- Tuesday or Wednesday (highest PH traffic)
- Launch between 12:01 AM and 5:00 AM PST
- Prepare hunter outreach list
- Have supporters ready to upvote in first hour

## Maker Checklist Before Launch
- [ ] Create Product Hunt account (if not exists)
- [ ] Claim product page
- [ ] Add logo, screenshots, demo video/GIF
- [ ] Write all descriptions
- [ ] Prepare maker comment
- [ ] Line up supporters (5-10 people to upvote in first hour)
- [ ] Schedule launch date
- [ ] Prepare social media posts to announce launch
- [ ] Set up analytics (UTM tracking)
