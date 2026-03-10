# 项目改名调研 — Open 前缀命名方案

## 调研时间
2026-03-11

## 背景
AI Code Validator 改名，蹭 "open" 前缀热度，定位为 Claude Code Review 开源免费替代。目标：名称以 `open` 开头，暗示代码审查/质量/AI 检测，适合做 npm 包名和 GitHub 仓库名。

## 候选名称可用性

> **图例**: ✅ = 可用（404/未占用）| ❌ = 已占用（200/有同名项目）| ⚠️ = 存在同名组织但无活跃项目

| # | 名称 | npm 包名 | npm | PyPI | GitHub 组织 | GitHub 同名仓库数 | 综合可用性 | 推荐度 |
|---|------|---------|-----|------|------------|------------------|-----------|--------|
| 1 | OpenCodeReview | `open-code-review` | ✅ | ✅ | ✅ 无 | 546（泛搜，无精确匹配） | ⚠️ 名称太通用 | ⭐⭐⭐ |
| 2 | OpenReview | `openreview` | ❌ | ❌ | ❌ 知名学术平台 | 大量 | ❌ 完全冲突 | ⭐ |
| 3 | OpenCodeGuard | `open-code-guard` | ✅ | ✅ | ✅ 无 | 2（无关项目） | ✅ 极佳 | ⭐⭐⭐⭐⭐ |
| 4 | OpenGuard | `openguard` | ✅ | ❌ | ❌ 有组织 | — | ⚠️ PyPI+GitHub 冲突 | ⭐⭐ |
| 5 | OpenCodeScan | `open-code-scan` | ✅ | ✅ | ✅ 无 | 31（泛搜） | ✅ 可用 | ⭐⭐⭐⭐ |
| 6 | OpenScan | `openscan` | ❌ | ✅ | ❌ 有组织 | — | ❌ npm+GitHub 冲突 | ⭐ |
| 7 | OpenLint | `openlint` | ❌ | ✅ | ✅ 无 | — | ⚠️ npm 冲突 | ⭐⭐ |
| 8 | OpenCheck | `opencheck` | ❌ | ✅ | ❌ 有组织(IT compliance) | — | ❌ npm+GitHub 冲突 | ⭐ |
| 9 | OpenCodeCheck | `open-code-check` | ✅ | ✅ | ✅ 无 | 16（泛搜） | ✅ 可用 | ⭐⭐⭐ |
| 10 | OpenValidator | `open-validator` | ✅ | ✅ | ✅ 无 | — | ✅ 可用但偏通用 | ⭐⭐⭐ |
| 11 | OpenCodeAudit | `open-code-audit` | ✅ | ✅ | ✅ 无 | 2（无关项目） | ✅ 极佳 | ⭐⭐⭐⭐⭐ |
| 12 | OpenAudit | `openaudit` | ✅ | ❌ | ❌ 有组织 | — | ⚠️ PyPI+GitHub 冲突 | ⭐⭐ |
| 13 | OpenEye | `openeye` | ❌ | ✅ | ❌ 有组织 | — | ❌ npm+GitHub 冲突 | ⭐ |
| 14 | OpenCodeEye | `open-code-eye` | ✅ | ✅ | ✅ 无 | 3（无关） | ✅ 可用 | ⭐⭐⭐ |
| 15 | OpenSentinel | `open-sentinel` | ✅ | ✅ | ❌ 有组织 | — | ⚠️ GitHub 组织冲突 | ⭐⭐ |
| 16 | OpenProbe | `openprobe` | ✅ | ✅ | ❌ 有组织 | — | ⚠️ GitHub 组织冲突 | ⭐⭐ |
| 17 | OpenCodeLens | `open-code-lens` | ✅ | ✅ | ✅ 无 | 0 | ✅ 极佳 | ⭐⭐⭐⭐⭐ |
| 18 | OpenCodeInspect | `open-code-inspect` | ✅ | ✅ | ✅ 无 | 0 | ✅ 极佳 | ⭐⭐⭐⭐ |
| 19 | OpenCodeRadar | `open-code-radar` | ✅ | ✅ | ✅ 无 | 0 | ✅ 极佳 | ⭐⭐⭐⭐ |
| 20 | OpenCodeWatch | `open-codewatch` | ✅ | ✅ | ✅ 无 | 0 | ✅ 极佳 | ⭐⭐⭐⭐ |

### 补充候选（全平台完全可用）

| # | 名称 | npm 包名 | npm | PyPI | GitHub 组织 | GitHub 同名仓库数 | 推荐度 |
|---|------|---------|-----|------|------------|------------------|--------|
| 21 | OpenCodeVet | `open-code-vet` | ✅ | ✅ | ✅ 无 | 0 | ⭐⭐⭐ |
| 22 | OpenCodeSight | `open-code-sight` | ✅ | ✅ | ✅ 无 | 0 | ⭐⭐⭐ |
| 23 | OpenCodeProbe | `open-codeprobe` | ✅ | ✅ | ✅ 无 | 0 | ⭐⭐⭐ |

---

## Top 3 推荐

### 🥇 1. OpenCodeGuard

- **npm**: `open-code-guard` ✅
- **PyPI**: `open-code-guard` ✅
- **GitHub 组织**: 无冲突 ✅
- **GitHub 仓库**: `raye-deng/open-code-guard` （建议）
- **域名建议**: `opencodeguard.dev` / `opencodeguard.io`
- **缩写**: OCG
- **推荐理由**:
  - 🛡️ "Guard" 暗示"守护代码质量"，语义精准且有力
  - 与 "code review" 场景高度契合 — 代码守卫 = 代码审查
  - 品牌感强：OpenCodeGuard 读起来像一个正式的安全/质量工具
  - 三个词组合，但朗朗上口，不冗长
  - 全平台（npm + PyPI + GitHub）完全可用
  - 类比：CodeGuard（已有备份服务）但 OpenCodeGuard 更偏向开源代码审查，不易混淆
- **潜在风险**:
  - CodeGuard.com 是一个网站备份服务，可能有轻微品牌联想（但不冲突）
  - 3 个词的 npm 包名稍长，但在 `npx open-code-guard` 场景下可接受

### 🥈 2. OpenCodeLens

- **npm**: `open-code-lens` ✅
- **PyPI**: `open-code-lens` ✅
- **GitHub 组织**: 无冲突 ✅
- **GitHub 仓库**: `raye-deng/open-code-lens`（建议）
- **域名建议**: `opencodelens.dev` / `opencodelens.io`
- **缩写**: OCL
- **推荐理由**:
  - 🔍 "Lens" 暗示"透视代码"、"洞察代码质量"，带有 AI 审视的意味
  - VS Code 有 "CodeLens" 功能（内联代码提示），开发者对此词有正面认知
  - 品牌差异化好：不像 review/check/lint 那样通用
  - GitHub 搜索 0 结果，完全无竞争
  - 适合未来做 VS Code 插件（名称天然契合）
- **潜在风险**:
  - VS Code CodeLens 是微软功能名，但 "OpenCodeLens" 作为独立项目名不构成商标风险
  - "Lens" 偏向"查看/洞察"，不如 "Guard" 有"守护/拦截"的主动语义

### 🥉 3. OpenCodeAudit

- **npm**: `open-code-audit` ✅
- **PyPI**: `open-code-audit` ✅
- **GitHub 组织**: 无冲突 ✅
- **GitHub 仓库**: `raye-deng/open-code-audit`（建议）
- **域名建议**: `opencodeaudit.dev` / `opencodeaudit.io`
- **缩写**: OCA
- **推荐理由**:
  - 📋 "Audit" 精确描述了工具的核心功能 — 代码审计
  - 企业用户对 "audit" 有天然信任感，暗示专业性和合规性
  - 与安全审计、代码质量检查的概念直接关联
  - 全平台完全可用
  - SEO 友好：搜索 "open code audit" 能精准触达目标用户
- **潜在风险**:
  - OpenAudit 是一个已存在的 IT 资产审计工具（Firstwave），需注意品牌区分
  - "Audit" 偏严肃/企业风格，可能对个人开发者吸引力稍弱

---

## 其他值得考虑的备选

| 名称 | 亮点 | 短板 |
|------|------|------|
| **OpenCodeRadar** | "雷达"寓意扫描检测，科技感强 | 稍长，"radar" 更偏监控而非审查 |
| **OpenCodeWatch** | "Watch"暗示持续监控，CI/CD 场景契合 | 与 GitHub Watch 功能语义重叠 |
| **OpenCodeInspect** | "Inspect" 精确描述审查行为 | 单词较长(14字符)，不够简洁 |
| **OpenCodeScan** | "Scan" 直接暗示扫描检测 | 偏向安全扫描(SAST)，与 Snyk/Semgrep 语义重叠 |
| **OpenCodeVet** | "Vet" 简短有力，暗示审查鉴定 | "vet" 一词不够主流，非母语者可能不理解 |

---

## 命名注意事项

### 商标风险分析
- ❌ **OpenReview**: openreview.net 是知名学术论文审稿平台，**绝对避免**
- ⚠️ **OpenAudit**: Firstwave 公司的 Open-AudIT 产品有一定知名度
- ⚠️ **CodeLens**: 微软 VS Code 功能名，但 "OpenCodeLens" 作为独立项目不构成侵权
- ✅ **OpenCodeGuard**: 无已知商标冲突，CodeGuard.com（网站备份）是不同领域
- ✅ **OpenCodeAudit**: 与 Open-AudIT 有区分（code audit vs IT asset audit）

### SEO 友好度
| 名称 | 搜索关键词覆盖 | SEO 评估 |
|------|--------------|---------|
| OpenCodeGuard | "open code guard", "code guard tool" | ⭐⭐⭐⭐ 竞争少 |
| OpenCodeLens | "open code lens", "code lens tool" | ⭐⭐⭐⭐ 竞争少但 VS Code CodeLens 会干扰 |
| OpenCodeAudit | "open code audit", "code audit tool" | ⭐⭐⭐⭐⭐ 精准匹配用户搜索意图 |

### 社区认知度
- "Guard" → 安全守护、质量把关（积极联想）
- "Lens" → 透视、洞察（技术感、智能感）
- "Audit" → 专业审计（企业信任感）
- "Review" → 代码审查（最直接但太通用）

### 最终建议
**首选: `OpenCodeGuard` (`open-code-guard`)**
- 品牌感最强，语义精准，全平台可用
- 适合做 CLI 工具名: `npx open-code-guard`
- 适合做 GitHub 组织名: `github.com/open-code-guard`
- "守护你的代码质量" — 品牌叙事清晰

**备选: `OpenCodeLens` (`open-code-lens`)**
- 更有科技感和差异化，适合 VS Code 生态
- GitHub 零竞争，品牌空间大
