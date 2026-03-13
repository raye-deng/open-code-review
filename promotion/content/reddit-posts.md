# Reddit Posts for Open Code Review

## Post 1: r/programming

**Title:** I built a free CI/CD quality gate specifically for AI-generated code — catches hallucinated imports, stale APIs, and other defects that ESLint misses

**Body:**
AI coding assistants (Copilot, Cursor, Claude) have changed how we write code, but they also introduced a new category of bugs that traditional linters completely ignore:

- **Hallucinated imports** — `import { x } from 'non-existent-pkg'` (package doesn't exist on npm)
- **Stale APIs** — Using deprecated APIs from the model's training data cutoff
- **Context window artifacts** — Unused interfaces, dead code from truncated generation
- **Over-engineered patterns** — Unnecessary abstractions, excessive complexity
- **Security anti-patterns** — Hardcoded example secrets, `eval()`, SQL injection

I built [Open Code Review](https://github.com/raye-deng/open-code-review) to catch these. It's free, open-source, and runs 100% locally.

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

**Two scanning levels:**
- **L1** (no AI needed): Pattern detection — hallucinated imports, deprecated APIs, security issues. Under 10 seconds.
- **L2** (optional): Embedding + local LLM (Ollama) — cross-file coherence, semantic duplicates, AI confidence scoring.

**CI/CD integration:** GitHub Action, GitLab CI, SARIF output for GitHub Code Scanning.

What I think makes it different from existing tools:
1. Actually verifies imports against npm/PyPI registries (catches hallucinated packages)
2. AST-based deprecated API detection (not just regex)
3. 100% local — no API keys, no cloud, your code stays on your machine
4. SARIF integration with GitHub Security tab

[GitHub](https://github.com/raye-deng/open-code-review) | [Portal](https://codes.evallab.ai)

Happy to answer questions about the architecture or detection approach.

---

## Post 2: r/codesecurity

**Title:** Open Code Review: Free tool that catches AI-generated security anti-patterns that traditional SAST tools miss

**Body:**
AI coding assistants generate code with subtle security issues that traditional SAST tools often miss:

```typescript
// AI generated this — the "API key" is an example placeholder
const API_KEY = "sk-1234567890abcdefghijklmnop";

// SQL injection via string concatenation (common in AI-generated code)
const query = `SELECT * FROM users WHERE id = ${userId}`;

// eval() usage — AI sometimes suggests this for dynamic code execution
const result = eval(userInput);
```

[Open Code Review](https://github.com/raye-deng/open-code-review) is a free, open-source CI/CD tool that detects these AI-specific security anti-patterns alongside:

- Hardcoded secrets and credentials
- TLS certificate verification bypasses
- Path traversal vulnerabilities
- Command injection patterns
- eval()/Function constructor usage

It runs 100% locally (no cloud dependency) and integrates with GitHub Actions, GitLab CI, and outputs SARIF for GitHub Code Scanning.

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

Unlike traditional SAST tools, it also detects **hallucinated imports** — packages that don't actually exist on npm/PyPI — which can be a supply chain security risk if a malicious actor registers a hallucinated package name.

[GitHub](https://github.com/raye-deng/open-code-review) | [Portal](https://codes.evallab.ai)

---

## Post 3: r/devops

**Title:** Added AI code quality gate to CI/CD — blocks PRs with hallucinated imports and stale APIs (free, self-hosted)

**Body:**
We added [Open Code Review](https://github.com/raye-deng/open-code-review) to our CI/CD pipeline to catch AI-generated code defects before they merge. Here's the GitHub Action config:

```yaml
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 60
    scan-mode: diff
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

It catches things that our existing linters (ESLint, Prettier) completely miss:

1. **Hallucinated imports** — AI references packages that don't exist on npm. OCR verifies every import against the registry.
2. **Deprecated APIs** — `url.parse()` was deprecated in Node 15, but AI models still generate it because it was in their training data.
3. **Over-engineering** — Cyclomatic complexity 28 in a function (max should be ~15), nesting depth 9.
4. **Security anti-patterns** — Hardcoded secrets, eval(), SQL injection.

**Key benefits for DevOps:**
- Runs in <10 seconds for L1 scan (no AI needed)
- SARIF output integrates with GitHub Security tab
- Works with both GitHub Actions and GitLab CI
- 100% self-hosted, no external dependencies for L1
- Free for personal and non-commercial use

For teams that want deeper analysis, L2 mode uses local Ollama for embedding-based analysis.

Has anyone else implemented AI code quality gates in their CI/CD? What tools are you using?

[GitHub](https://github.com/raye-deng/open-code-review) | [Portal](https://codes.evallab.ai)

---

## Post 4: r/javascript

**Title:** Free tool catches hallucinated npm imports and deprecated Node.js APIs in AI-generated code

**Body:**
If you're using AI coding assistants (Copilot, Cursor, etc.) for JavaScript/TypeScript projects, you've probably seen this:

```typescript
// AI hallucinated this package — it doesn't exist on npm
import { validateSchema } from 'json-schema-validator-pro';

// AI used this deprecated API from training data
const parsed = url.parse(request.url); // Deprecated since Node 15
```

The first one will crash at runtime. The second one "works" but uses a deprecated API.

I built [Open Code Review](https://github.com/raye-deng/open-code-review) to catch these automatically:

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

It verifies every import against the npm registry (catches hallucinated packages), detects deprecated APIs via AST analysis, and flags security anti-patterns. Runs in under 10 seconds, 100% locally.

Also supports Python, Go, Java, and Kotlin.

[GitHub](https://github.com/raye-deng/open-code-review) | [Portal](https://codes.evallab.ai)

---

## Status
⚠️ **Reddit API not configured.** To post automatically:
1. Create a Reddit app at https://www.reddit.com/prefs/apps
2. Get client_id, client_secret
3. Create `scripts/config/platforms.json` with Reddit credentials
4. Account must have sufficient karma to post in target subreddits

Alternatively, post manually using the content above.
