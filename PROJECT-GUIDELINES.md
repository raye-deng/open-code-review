# Project Guidelines — Open Code Review

## Repository Architecture

This is the **public open-source** repository. See below for what belongs here vs private repos.

### ✅ What goes here (GitHub public)
- Source code, tests, CI/CD configuration
- Development docs: ARCHITECTURE.md, DEVELOPMENT.md, CONTRIBUTING.md
- README.md, CHANGELOG.md, LICENSE, action.yml
- Issue Templates, FUNDING.yml

### ❌ What does NOT go here
- Promotion articles, marketing plans, competitor research
- Platform API keys, account credentials
- Community outreach logs, comment records
- GTM plans, business strategy, pricing documents

### 📦 Related Repositories

| Repo | Platform | Visibility | Purpose |
|------|----------|------------|---------|
| open-code-review | GitHub | Public | This repo — CLI + Core + Action |
| open-code-review-portal | GitLab | Private | Marketing portal (codes.evallab.ai) |
| open-code-review-cloud | GitLab | Private | SaaS backend + reports |
| ocr-operations | GitLab | Private | Operations — promotion, marketing, community |

## Code Development Rules

- All content in English (variable names, functions, constants, logs)
- No comments — code should be self-documenting via naming
- TypeScript with full type definitions
- Tests required — UT + E2E for all critical paths
- Commit convention: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- **Never** reference `git.makesall.cn` in any file

## Product Positioning

OCR detects **AI-specific code defects** that traditional tools miss:
1. Hallucinated packages — imports to non-existent packages
2. Stale APIs — APIs that existed in training data but are now deprecated
3. Context breaks — contradictions across AI-generated files
4. Hidden security patterns — deprecated crypto, insecure defaults
5. Over-engineering — unnecessary abstractions

**OCR complements SonarQube/ESLint, it doesn't replace them.**
