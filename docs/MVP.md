# AI Code Validator — MVP Roadmap

## Vision

**AI Code Validator** is the first CI/CD quality gate built specifically for AI-generated code. As AI coding assistants (Copilot, Cursor, Claude) become the primary code authoring tool, we need purpose-built validation that understands AI-specific failure modes.

## MVP Phases

### M1 (2 weeks): Core Engine + CLI

**Goal**: Working detection engine with CLI interface.

**Deliverables**:
- [ ] 3 detectors implemented:
  - **Hallucination Detector**: Phantom packages, undefined functions, non-existent APIs
  - **Logic Gap Detector**: Empty catch blocks, TODO markers, unreachable code, missing error handling
  - **Duplication Detector**: Near-identical functions, duplicate imports
- [ ] **CLI tool**: `npx ai-code-validator scan ./src`
- [ ] **Output formats**: JSON report + terminal summary
- [ ] **Scoring engine**: 0-100 composite score, 4 dimensions
- [ ] **Tests**: 10 real-world AI code defect test cases
- [ ] **Documentation**: README with quick start

**Success Criteria**:
- CLI runs on any Node.js 20+ project
- Correctly identifies ≥80% of planted AI code defects
- <3s scan time for 100-file project

---

### M2 (2 weeks): GitHub Action

**Goal**: Automated validation in GitHub CI/CD pipelines.

**Deliverables**:
- [ ] Published to **GitHub Marketplace**
- [ ] **PR comments**: Auto-post validation report on pull requests
- [ ] **Quality Gate**: Score <70 blocks merge (configurable threshold)
- [ ] **Status checks**: GitHub check run with score summary
- [ ] **Dogfood**: Tested on `airline-ticket-booking` and `geo-boost` repos

**Success Criteria**:
- Works on any TypeScript/JavaScript GitHub repo
- PR comment shows dimensional score breakdown
- Configurable threshold with sensible defaults

**Integration example**:
```yaml
- uses: raye-deng/ai-code-validator@v1
  with:
    threshold: 70
    paths: 'src/**/*.ts'
    fail-on-low-score: true
```

---

### M3 (2 weeks): GitLab CI Component

**Goal**: GitLab CI/CD integration via CI Catalog component.

**Deliverables**:
- [ ] Published to **GitLab CI Catalog** (INTERNAL_REGISTRY)
- [ ] **Code Quality report**: Integrated with GitLab MR widget
- [ ] **Component syntax**: `include: component` support
- [ ] **Dogfood**: Integrated in `airline-ticket-booking` GitLab CI

**Success Criteria**:
- Works with `include: component` syntax
- Code Quality widget shows AI validation issues
- <30s execution time in CI

**Integration example**:
```yaml
include:
  - component: INTERNAL_REGISTRY/fengsen.deng/ai-code-validator/validate@main
    inputs:
      threshold: 70
      paths: src
```

---

### M4 (2 weeks): Portal Website

**Goal**: Marketing site + early access funnel.

**Deliverables**:
- [ ] **Next.js static site** deployed to Cloudflare Pages
- [ ] **Landing page**: Hero, features, comparison, pricing
- [ ] **Early Access form**: Name, email, company, CI platform
  - Submissions → Notion database or Telegram notification
- [ ] **Pricing page**: Free / Pro ($19/mo) / Enterprise
- [ ] **SEO**: Meta tags, Open Graph, structured data

**Success Criteria**:
- <2s load time (static export)
- Form submissions captured reliably
- Clear value proposition in <10 seconds

---

### M5 (Ongoing): AI Self-Heal Loop

**Goal**: Close the feedback loop — validation results → AI assistant → fixed code.

**Deliverables**:
- [ ] **Prompt Builder**: Converts validation report to structured fix prompt
- [ ] **Copilot integration**: `.github/copilot-instructions.md` template
- [ ] **Cursor integration**: `.cursorrules` template with validation context
- [ ] **Claude integration**: Structured prompt format for Claude Code
- [ ] **CLI flag**: `--heal` generates fix prompt file

**Success Criteria**:
- Generated prompt produces valid fixes ≥70% of the time
- Works with Copilot, Cursor, and Claude workflows
- Developers report measurable time savings

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript (strict mode) |
| Runtime | Node.js 20+ |
| Package Manager | pnpm (workspace) |
| Testing | Vitest |
| CI (GitHub) | GitHub Actions |
| CI (GitLab) | GitLab CI Components |
| Website | Next.js 14 + Tailwind CSS |
| Hosting | Cloudflare Pages |
| Monorepo | pnpm workspaces |

## Architecture

```
┌─────────────────────────────────────────────┐
│                 CLI / Action                  │
│        (Entry points for validation)          │
├──────────┬──────────┬──────────┬─────────────┤
│Hallucin. │Logic Gap │Duplicat. │Context Break│
│ Detector │ Detector │ Detector │  Detector   │
├──────────┴──────────┴──────────┴─────────────┤
│              Scoring Engine                    │
│         (0-100 composite scoring)             │
├──────────────────────────────────────────────┤
│              Report Generator                  │
│    (Terminal / JSON / Markdown / GitLab)       │
├──────────────────────────────────────────────┤
│              AI Healer                         │
│        (Fix prompt generation)                │
└──────────────────────────────────────────────┘
```

## First Paying Customer Strategy

### Phase 1: Dogfood (Week 1-4)
- Integrate into Raye's own projects:
  - `airline-ticket-booking` (GitLab CI)
  - `geo-boost` (GitHub Actions)
- Document real issues found
- Build case studies from own experience

### Phase 2: Early Access (Week 5-8)
- **Target**: First 50 teams
- **Pricing**: 50% off forever ($9.50/month instead of $19)
- **Collection**: Web form → Notion database → manual onboarding email
- **Commitment**: 24-hour response time

### Phase 3: Launch & Promotion (Week 9-12)
- **LinkedIn**: Personal story — "I built a tool to catch the bugs AI creates"
- **Indie Hackers**: Show IH post with revenue/user metrics
- **Reddit**: r/webdev, r/programming, r/devops posts
- **Hacker News**: Show HN
- **Dev.to**: Technical blog post on AI code failure modes
- **Twitter/X**: Thread on AI hallucination patterns in code

### Revenue Target
| Milestone | Users | MRR |
|-----------|-------|-----|
| Month 1 | 5 early access | $47.50 |
| Month 2 | 15 early access | $142.50 |
| Month 3 | 30 mixed | $380 |
| Month 6 | 100 users | $1,500 |
| Month 12 | 500 users | $7,500 |

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| False positives annoy users | Conservative defaults, easy suppressions (`// ai-validator-ignore`) |
| AI tools improve, less need | Shift to quality metrics & team dashboards |
| Competition from big players | Speed, developer experience, AI-specific focus |
| Low adoption | Freemium with generous free tier, viral PR comments |

---

_Last updated: 2026-03-04_
_Owner: Raye Deng_
