# Open Code Review — MVP Roadmap

## Vision

**Open Code Review** is the first CI/CD quality gate built specifically for AI-generated code. As AI coding assistants (Copilot, Cursor, Claude) become the primary code authoring tool, we need purpose-built validation that understands AI-specific failure modes.

## MVP Phases

### M1 (2 weeks): Core Engine + CLI — 🟡 进行中

**Goal**: Working detection engine with CLI interface.

**Deliverables**:
- [x] 4 detectors implemented (2026-03-04):
  - **Hallucination Detector**: Phantom packages, undefined functions, non-existent APIs
  - **Logic Gap Detector**: Empty catch blocks, TODO markers, unreachable code, missing error handling
  - **Duplication Detector**: Near-identical functions, duplicate imports
  - **Context Break Detector**: Architecture inconsistencies, style breaks
- [x] **Scoring engine**: 0-100 composite score, 4 dimensions (2026-03-04)
- [x] **AI Healer**: Prompt builder for Copilot/Cursor/Claude (2026-03-04)
- [x] **Tests**: 13 unit tests passing (2026-03-04)
- [x] **CLI tool**: `npx open-code-review scan ./src` ✅ 可用
- [x] **CLI build**: pnpm build + 可执行文件打包 ✅
- [x] **npm 发布**: `@open-code-review/core@0.1.0` + `open-code-review@0.1.0` ✅
- [x] **Output formats**: JSON / terminal / markdown ✅
- [x] **Dogfood**: airline-ticket-booking 评分 87/100（Grade B）✅

**Success Criteria**:
- CLI runs on any Node.js 20+ project ← 进行中
- Correctly identifies ≥80% of planted AI code defects ✅ 13/13 tests
- <3s scan time for 100-file project

---

### M2 (2 weeks): GitHub Action — 🟡 进行中

**Goal**: Automated validation in GitHub CI/CD pipelines.

**Deliverables**:
- [x] `action.yml` 完成（2026-03-04）
- [x] `packages/github-action/src/index.ts` 完整实现（2026-03-04）
- [x] **Build**: `packages/github-action` ncc 打包 dist/index.js 1.4MB ✅
- [ ] **Published to GitHub Marketplace**
- [ ] **PR comments**: Auto-post validation report on pull requests ← 代码已实现，待真实测试
- [ ] **Quality Gate**: Score <70 blocks merge ← 代码已实现，待真实测试
- [ ] **Dogfood**: 在 `open-code-review` 自身 GitHub repo 接入验证

**Success Criteria**:
- Works on any TypeScript/JavaScript GitHub repo
- PR comment shows dimensional score breakdown
- Configurable threshold with sensible defaults

**Integration example**:
```yaml
- uses: raye-deng/open-code-review@v1
  with:
    threshold: 70
    paths: 'src/**/*.ts'
    fail-on-low-score: true
```

---

### M3 (2 weeks): GitLab CI Component — 🟡 进行中

**Goal**: GitLab CI/CD integration via CI Catalog component.

**Deliverables**:
- [x] `packages/gitlab-component/templates/validate.yml` 完成（2026-03-04）
- [ ] **Published to GitLab CI Catalog** (INTERNAL_REGISTRY)
- [ ] **Code Quality report**: 生成 GitLab codequality artifact
- [ ] **Dogfood**: 在 `airline-ticket-booking` GitLab CI 接入验证

**Success Criteria**:
- Works with `include: component` syntax
- Code Quality widget shows AI validation issues
- <30s execution time in CI

**Integration example**:
```yaml
include:
  - component: INTERNAL_REGISTRY/fengsen.deng/open-code-review/validate@main
    inputs:
      threshold: 70
      paths: src
```

---

### M4 (2 weeks): Portal Website — 🟡 进行中

**Goal**: Marketing site + early access funnel.

**Deliverables**:
- [x] Next.js 项目骨架（2026-03-04）
- [x] 首页 `apps/web/src/app/page.tsx`（2026-03-04）
- [x] 定价页 `apps/web/src/app/pricing/page.tsx`（2026-03-04）
- [x] Early Access 页 `apps/web/src/app/early-access/page.tsx`（2026-03-04）
- [x] **部署到 Cloudflare Pages** ✅ https://codes.evallab.ai
- [ ] **Early Access 表单 API**：POST → Telegram Bot 通知
- [x] **SEO**：Meta tags, Open Graph, Twitter Card ✅
- [x] **域名配置**：codes.evallab.ai ✅ active

**Success Criteria**:
- <2s load time (static export)
- Form submissions captured reliably
- Clear value proposition in <10 seconds

---

### M5 (Ongoing): AI Self-Heal Loop

**Goal**: Close the feedback loop — validation results → AI assistant → fixed code.

**Deliverables**:
- [x] **Prompt Builder**: Converts validation report to structured fix prompt ✅
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
