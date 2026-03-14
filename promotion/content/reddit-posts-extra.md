## Post 5: r/webdev

**Title:** I built a tool that catches hallucinated npm packages in AI-generated code — saved my team from shipping 12 broken imports last week

**Body:**
Story time: We've been using Cursor and Copilot for our web app. Everything was great until we deployed and got runtime errors from packages that **don't exist**.

Turns out, AI coding assistants sometimes hallucinate package names. The code compiles, TypeScript is happy, but at runtime:

```
Error: Cannot find module 'email-validator-pro'
Error: Cannot find module 'react-hooks-optimizer-plus'
Error: Cannot find module 'date-fns-format-advanced'
```

These packages simply don't exist on npm. The AI "invented" them.

I built [Open Code Review](https://github.com/raye-deng/open-code-review) to catch these automatically. It's a CI/CD quality gate that:

1. **Verifies every import** against the npm registry — catches hallucinated packages
2. **Detects deprecated APIs** — AI loves `url.parse()` which was deprecated in Node 15
3. **Flags security anti-patterns** — hardcoded secrets, eval(), SQL injection
4. **Scores code quality** — 0-100 with a letter grade

Setup takes 5 minutes:

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

GitHub Action:
```yaml
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 60
    scan-mode: diff
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

The L1 scan runs in under 10 seconds with no AI needed. For deeper analysis, L2 mode uses local Ollama.

Free and open-source. [GitHub](https://github.com/raye-deng/open-code-review) | [Portal](https://codes.evallab.ai)

---

## Post 6: r/typescript

**Title:** Free tool detects deprecated TypeScript/Node.js APIs and hallucinated npm imports in AI-generated code

**Body:**
If you're using AI assistants for TypeScript development, you've probably hit this:

```typescript
// AI generated — package doesn't exist on npm
import { zodSchema } from 'zod-extended-validation';

// AI generated — deprecated since Node.js 15
import { parse } from 'url';
const parsed = parse(requestUrl);

// AI generated — unnecessary over-engineering
abstract class AbstractFactoryProvider<T extends BaseEntity> implements IProvider<T> {
  // 200 lines for something that could be 20
}
```

These pass TypeScript compilation but cause runtime errors or use deprecated patterns.

[Open Code Review](https://github.com/raye-deng/open-code-review) catches these automatically:

```bash
npm install -g @opencodereview/cli
ocr scan src/ --sla L1
```

**What it detects:**
- Hallucinated imports (verifies against npm registry)
- Deprecated Node.js/TypeScript APIs via AST analysis
- Over-engineered abstractions (complexity heuristics)
- Security issues (hardcoded secrets, eval())
- Context window artifacts (unused types, dead code)

Works great in CI/CD:

```yaml
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 70
    scan-mode: diff
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

Also outputs SARIF for GitHub Code Scanning integration.

Supports TypeScript, JavaScript, Python, Go, Java, and Kotlin.

[GitHub](https://github.com/raye-deng/open-code-review) | [NPM](https://www.npmjs.com/package/@opencodereview/cli)
