# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-03-04

### Added

- **Core detection engine** with 4 detectors:
  - Hallucination Detector — flags non-existent packages and fabricated APIs
  - Logic Gap Detector — catches empty catch blocks, TODOs, unreachable code
  - Duplication Detector — identifies near-identical code blocks
  - Context Break Detector — finds mixed naming conventions and module systems
- **Scoring engine** with 0–100 scale and letter grades (A–F)
- **AI Healer** — suggests fixes for detected issues
- **Report generator** — JSON and Markdown output formats
- **CLI tool** (`open-code-review`) published to npm
  - `scan` command with glob pattern support
  - Configurable threshold, output format, and fail behavior
- **GitHub Action** (`raye-deng/open-code-review@v1`)
  - Automatic PR comments with validation report
  - Configurable threshold and file paths
  - Quality gate — fails workflow on low scores
- **GitLab CI Component** with Code Quality report integration
- **Telegram bot** (Cloudflare Worker)
  - `/scan <repo>` command for public GitHub repos
  - Inline detection (no Node.js fs dependency)
  - Real-time scan results with issue breakdown
- **Website** at [codes.evallab.ai](https://codes.evallab.ai)
  - SEO optimized with sitemap, robots.txt, JSON-LD
- **Self-validation** — the project runs its own validator in CI (dogfooding)

### Infrastructure

- Monorepo with pnpm workspaces
- CI pipeline: test → build → dogfood → GitLab sync
- Cloudflare Workers deployment for Telegram bot
