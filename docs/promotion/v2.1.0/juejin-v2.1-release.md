# AI 生成的代码也有质量门？Open Code Review v2.1 发布，GLM 免费支持 LLM 深度扫描

## AI 编程工具越来越普及，但生成的代码质量谁来保证？

2024 年，AI 编程助手（Copilot、Cursor、Claude Code）的代码生成量呈指数级增长。GitHub 报告称，Copilot 用户接受了近 30% 的代码建议。但一个被忽视的问题是：**这些代码的质量如何保证？**

传统方案是跑 ESLint、SonarQube 这类 Linter。但问题是——这些工具是为人类写的代码设计的，而 AI 生成的代码有一类传统工具完全检测不到的缺陷。

## AI 代码的 5 种独特缺陷

经过对数十万行 AI 生成代码的扫描分析，我们总结出了 5 种传统 Linter 检测不到的缺陷类型：

### 1. 幻觉导入（Hallucinated Imports）

AI 模型有时会"编造"听起来合理但根本不存在的包名：

```typescript
// 看起来没问题，ESLint 也不报错。但这个包根本不存在
import { validateEmail } from 'validator-email-utils';
import { S3Client } from '@aws-sdk/client-s3-v3';
```

ESLint 检查语法，不检查 npm 上有没有这个包。这段代码会通过所有检查，直到运行时才报错。

### 2. 过时 API（Stale APIs）

AI 模型的训练数据有截止日期，它们经常推荐已经被废弃多年的 API：

```python
# 2019 年就废弃了，Python 3.12 已移除，AI 仍然在推荐
import imp
module = imp.load_source('mymodule', '/path/to/file.py')
```

```javascript
// Node.js 4 就废弃了，AI 还在用
fs.exists('/tmp/file', (exists) => { ... });
```

### 3. 上下文窗口残留（Context Window Artifacts）

当 AI 在对话中跨多个文件生成代码时，可能会"忘记"之前写过什么：

```typescript
// file-a.ts — AI 先生成了这个
export function getUser(id: string): Promise<User> {
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}

// file-b.ts — AI 15 条消息后又生成了同名函数
export function getUser(id: string): Promise<User> {
  return db.query('SELECT * FROM users WHERE user_id = ?', [id]);
}
```

两个同名函数，两个不同的 SQL 查询。没有 Linter 能捕获这个问题，因为从语法角度看两个文件都是正确的。

### 4. 过度工程（Over-Engineering）

AI 喜欢"展示"设计模式的运用，经常把简单的逻辑过度封装：

```typescript
// AI 为一个简单的布尔开关生成了策略模式 + 工厂模式
interface FeatureToggleStrategy {
  isEnabled(feature: string): Promise<boolean>;
}

class DefaultFeatureToggleStrategy implements FeatureToggleStrategy {
  // ... 20 行代码
}

class FeatureToggleFactory {
  static create(config: Config): FeatureToggleStrategy {
    return new DefaultFeatureToggleStrategy(config);
  }
}
// 其实只需要: config.get(feature) ?? false
```

### 5. 安全反模式（Security Anti-Patterns）

AI 基于博客文章和 Stack Overflow 训练，经常复现不安全模式：

```javascript
// AI 生成的登录逻辑
app.post('/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === 'admin' && pass === 'password123') { // ⚠️ 硬编码
    res.json({ token: 'admin-token-12345' }); // ⚠️ 明文 token
  }
});
```

## Open Code Review 是什么？

Open Code Review 是一个**开源、免费、可自托管**的 CI/CD 代码质量门禁，专门针对 AI 生成代码的缺陷进行检测。

核心特点：

- ✅ **免费** — L1 级别完全免费，无需任何 API Key
- ✅ **开源** — 代码完全开放，欢迎贡献
- ✅ **自托管** — 代码不离开你的机器
- ✅ **速度快** — L1 扫描 <10 秒
- ✅ **CI/CD 集成** — GitHub Actions + GitLab CI 开箱即用

## v2.1.0 三大新功能

### 1. L3 Deep Scan：远程 LLM 深度分析

L1/L2 解决的是结构性问题，但有些缺陷需要理解语义。v2.1.0 引入了 L3 Deep Scan：

**工作流程：**

1. L1+L2 扫描完成后，标记"可疑代码块"（超长函数、不在依赖树中的导入、与项目风格不一致的代码）
2. 将可疑代码块发送给远程 LLM，提问具体的代码质量相关问题
3. 解析 LLM 返回的结构化结果，与 L1+L2 结果合并

**关键设计：不会把整个代码库发送给 LLM**，只发送针对性的代码片段，兼顾隐私和效率。

```bash
# 使用 GLM 免费 LLM 进行深度扫描
npx @opencodereview/cli scan src/ --sla L3 --provider glm --model pony-alpha-2
```

### 2. 多语言支持：6 种编程语言

v2.1.0 为每种语言提供了专用检测器：

| 语言 | 生态注册表 | 特色检测 |
|------|-----------|---------|
| 🟦 TypeScript/JavaScript | npm | Node.js API 废弃检查 |
| 🐍 Python | PyPI | 标准库废弃检查 |
| ☕ Java | Maven Central | Jakarta EE 迁移问题 |
| 🔵 Go | Go Modules | 标准库 API 变更 |
| 🟣 Kotlin | Maven Central | Android API 废弃 |

每种语言都有针对性的幻觉导入检测、安全模式检测和生态特有的缺陷检测。

### 3. AI Auto-Fix：一键自动修复

v2.1.0 引入 `ocr heal` 命令，实现"扫描 → AI 修复 → 再扫描 → 报告"的完整流水线：

```bash
npx @opencodereview/cli heal src/ --provider glm --model pony-alpha-2
```

**输出示例：**

```
🔍 扫描 src/ 中...（L1+L2+L3 流水线）
📊 发现 12 个问题

🤖 使用 GLM (pony-alpha-2) 修复问题中...
  ✅ 已修复: 幻觉导入 → 替换为正确的包
  ✅ 已修复: 过时 API → 迁移到当前 API
  ✅ 已修复: 过度工程 → 简化为直接实现
  ✅ 已修复: 另外 9 个问题

📋 生成 Cursor、Copilot、Augment 的 IDE 规则文件...

✨ 完成！发现 12 个问题，自动修复 11 个，1 个需要人工审查。
```

同时还会生成 IDE 规则文件，教你的 AI 编程助手在后续会话中避免这些缺陷。

## GLM/ZAI 免费支持

v2.1.0 的 Universal Provider Adapter 支持 8 种 LLM 供应商：

| 供应商 | 费用 | 说明 |
|--------|------|------|
| **GLM/ZAI** | **免费** | 免费额度充足，开源友好 |
| OpenAI | 按量付费 | GPT-4o, GPT-4-turbo |
| Anthropic | 按量付费 | Claude 3.5 Sonnet |
| DeepSeek | 按量付费 | 性价比高，代码能力强 |
| Together AI | 按量付费 | 开源模型托管 |
| Fireworks | 按量付费 | 快速推理 |
| Ollama | 免费（本地） | 本地运行任意模型 |
| OpenAI 兼容 | 自定义 | 任何兼容 API |

**GLM/ZAI 的免费额度是最亮眼的特性**——你可以在每次 CI 构建中运行 L3 深度扫描，而不花一分钱。对于开源项目和个人开发者来说，这非常友好。

## 30 秒接入 CI

**方式一：npm 直接运行**

```bash
npx @opencodereview/cli scan src/ --sla L1
```

**方式二：GitHub Actions**

```yaml
# .github/workflows/ocr.yml
name: Open Code Review
on: [push, pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: raye-deng/open-code-review@v1
        with:
          sla: L1
          threshold: 70
```

**方式三：深度扫描 + 自动修复**

```bash
# L3 深度扫描
npx @opencodereview/cli scan src/ --sla L3 --provider glm --model pony-alpha-2

# 自动修复
npx @opencodereview/cli heal src/ --provider glm --model pony-alpha-2
```

## 开源路线图

- **v2.2.0**: Git-aware 扫描 — 只分析变更文件，集成 git diff
- **v2.3.0**: 自定义规则引擎 — 用 TypeScript 编写自己的缺陷检测器
- **v3.0.0**: 插件系统 — 社区贡献的语言支持和检测器

## 加入我们

Open Code Review 是开源项目，欢迎各种形式的贡献：

- ⭐ [GitHub Star](https://github.com/raye-deng/open-code-review)
- 🐛 [报告 Bug](https://github.com/raye-deng/open-code-review/issues)
- 🔀 [提交 PR](https://github.com/raye-deng/open-code-review/pulls)
- 🌐 [在线体验](https://codes.evallab.ai)

AI 编程助手是大势所趋，问题不在于要不要用，而在于如何信任它生成的代码。Open Code Review 给你这个信任——免费的、不把你的代码发送给任何人的。

试试看吧！如果觉得有用，给个 Star ⭐ 支持一下。
