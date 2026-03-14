# Platform: Hashnode
## Title: Building a Local-First AI Code Scanner: Lessons from Detecting 1,200+ Hallucinated Packages
## URL: (发布后填写)
## Tags: ai, javascript, security, devops, ci-cd, opensource
## Content:

---

# Building a Local-First AI Code Scanner: Lessons from Detecting 1,200+ Hallucinated Packages

## Why I Built Another Code Scanner

There are already hundreds of code quality tools. ESLint, SonarQube, CodeRabbit, DeepSource — the list goes on. So why build another one?

Because none of them solve the specific problem I kept hitting: **AI coding assistants generate code that references things that don't exist.**

Not syntax errors. Not style violations. Not even logic bugs in the traditional sense. References to npm packages that were never published. Calls to APIs that were deprecated two years ago. Function signatures that look right but are slightly wrong.

These are **reality failures** — the code is syntactically valid but factually incorrect. Traditional static analysis tools, designed for human-written code, fundamentally can't detect these.

## Architecture of a Local-First Scanner

The core design principle: **never send user code to any server**. This meant every capability had to work locally.

### Three-Level Scanning Engine

```
┌─────────────────────────────────────────┐
│  L1: Pattern Detection                  │
│  ├── Import registry verification        │
│  ├── AST-based deprecated API detection  │
│  ├── Security pattern matching           │
│  └── Complexity heuristics               │
│                                          │
│  L2: Embedding Analysis (Ollama)         │
│  ├── Code embedding generation           │
│  ├── Similarity-based risk scoring       │
│  └── Semantic anomaly detection          │
│                                          │
│  L3: LLM Review (Ollama / Cloud)         │
│  ├── Cross-file coherence analysis       │
│  ├── Logic gap detection                 │
│  └── Over-engineering identification     │
└─────────────────────────────────────────┘
```

Each level is optional and independent. Most teams start with L1 and add deeper scanning as needed.

### How L1 Registry Checking Works

The L1 scanner parses every import/require statement and checks against the npm/PyPI registries:

```typescript
import { parse } from './parser';
import { RegistryClient } from './registry';

async function scanImports(filePath: string): Promise<Issue[]> {
  const ast = parse(filePath);
  const imports = extractImports(ast);
  const issues: Issue[] = [];

  for (const imp of imports) {
    // Skip relative imports
    if (imp.source.startsWith('.')) continue;

    // Check against registry (with cache)
    const exists = await registry.exists(imp.source);

    if (!exists) {
      // Check if it's a known hallucination pattern
      const isHallucination = await phantomDb.match(imp.source);

      issues.push({
        severity: isHallucination ? 'high' : 'medium',
        message: `Package '${imp.source}' not found on registry`,
        suggestion: await findClosestMatch(imp.source),
      });
    }
  }

  return issues;
}
```

Key optimizations:
- **Registry result caching** with TTL (5 minutes for npm, 30 minutes for PyPI)
- **Batch API calls** to reduce round trips
- **Parallel file scanning** across CPU cores
- **Incremental scanning** — only check changed files on subsequent runs

### Performance Numbers

| Project Size | L1 Time | L2 Time | Memory |
|-------------|---------|---------|--------|
| 50 files | 1.2s | 4.8s | ~120MB |
| 100 files | 2.7s | 8.7s | ~180MB |
| 500 files | 8.4s | 22s | ~350MB |
| 1000 files | 15s | 38s | ~500MB |

L1 is fast enough for CI/CD. L2 is suitable for nightly builds or manual deep scans.

### Running L2 with Local Ollama

One of the key decisions was supporting Ollama for local AI inference:

```yaml
# .ocrrc.yml
sla: L2
ai:
  embedding:
    provider: ollama
    model: nomic-embed-text
    baseUrl: http://localhost:11434
  llm:
    provider: ollama
    model: qwen3-coder
    endpoint: http://localhost:11434
```

Why Ollama specifically:
- **Zero API cost** — no OpenAI/Anthropic billing
- **Data privacy** — code stays on the developer's machine
- **Consistent performance** — no rate limiting or queue times
- **Model flexibility** — swap models without changing infrastructure

The embedding model (`nomic-embed-text`) is ~270MB. The LLM (`qwen3-coder`) is ~4.7GB. Both run fine on a MacBook with 16GB RAM.

## The Phantom Package Database

After scanning hundreds of projects, I started noticing patterns in hallucinated package names:

```
Most hallucinated prefixes (by frequency):
1. react-dom-*     (23% of all hallucinations)
2. express-*       (18%)
3. mongoose-*      (12%)
4. lodash-*        (9%)
5. axios-*         (7%)
6. next-*          (6%)
7. firebase-*      (5%)
8. All others      (20%)
```

The hallucination pattern is predictable: AI models add plausible suffixes to real package names. `-utils`, `-helper`, `-wrapper`, `-extra`, `-pro`, `-advanced` are the most common.

This predictability is a security concern. An attacker could proactively register the most common hallucination patterns and potentially compromise many projects.

## CI/CD Integration

### GitHub Action

```yaml
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 60
    scan-mode: diff  # Only scan changed files
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### GitLab CI

```yaml
code-review:
  script:
    - npx @opencodereview/cli scan src/ --sla L1 \
        --format json --output ocr-report.json
  artifacts:
    reports:
      codequality: ocr-report.json
```

### SARIF Output for GitHub Code Scanning

```bash
ocr scan src/ --sla L1 --format sarif --output results.sarif
```

This integrates with GitHub's security tab, showing phantom import issues alongside Dependabot alerts.

## Lessons Learned

### 1. Registry APIs Are Rate Limited (and Sometimes Down)
npm's registry is surprisingly unreliable. Build in retries, fallbacks, and aggressive caching. I cache results for 5 minutes and use ETag-based conditional requests.

### 2. False Positives Kill Adoption
Every false positive is a developer who uninstalls your tool. I erred on the side of false negatives — it's better to miss a phantom import than to flag a valid one. Current false positive rate is under 2%.

### 3. Developers Want to Know *Why*, Not Just *What*
A bare "package not found" message is useless. Always include:
- The exact import statement
- The file and line number
- A suggested alternative package
- Whether this is a known hallucination pattern

### 4. Local-First Requires Careful Resource Management
Ollama models are memory-hungry. Implement lazy loading — only start the embedding/LLM pipeline when L2 is explicitly requested. And always detect if Ollama is running before attempting to connect.

### 5. The Output Format Matters More Than You Think
SARIF for CI, HTML for human review, JSON for automation, terminal for CLI. Each format serves a different audience. Invest in making each one excellent.

## What's Next

- **Phantom Package DB API** — public endpoint to check if a package name is a known hallucination
- **IDE extensions** — real-time detection in VS Code and JetBrains
- **Language expansion** — Rust, Ruby, PHP support
- **L3 production-ready** — full LLM code review with auto-fix suggestions

## Try It

```bash
npx @opencodereview/cli scan . --sla L1
```

[GitHub Repository](https://github.com/raye-deng/open-code-review) — feedback and contributions welcome.

---

*If you're building developer tools or working on AI code quality, I'd love to connect. The phantom package problem is only going to get bigger as AI code generation becomes the norm.*
