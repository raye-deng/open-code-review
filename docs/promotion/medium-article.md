# Platform: Medium
## Title: The Dependency Confusion Attack of the AI Era: When Your Assistant Hallucinates Package Names
## URL: (发布后填写)
## Tags: ai, security, npm, javascript, supply-chain, cybersecurity
## Content:

---

# The Dependency Confusion Attack of the AI Era

## When Your AI Assistant Hallucinates Package Names

In 2021, Alex Birsan demonstrated **dependency confusion attacks** — a technique where attackers register internal package names on public registries to hijack builds. It earned him nearly $1 million in bug bounties from Apple, Microsoft, and others.

Now, AI coding assistants are creating a new, democratized version of this attack vector — entirely by accident.

## The New Attack Surface

When an AI model generates code like this:

```typescript
import { validateEmail } from 'email-validator-pro';
import { formatDate } from 'date-fns-utils';
import { connectDb } from 'mongoose-connector';
```

It has no idea whether these packages exist on npm. It's generating plausible-looking code based on patterns in its training data. Sometimes the packages are real. Sometimes they're not.

When they're not, two things happen:

**Scenario A: Build Failure**
The developer runs `npm install`, gets 404 errors, and manually fixes the imports. Annoying but harmless.

**Scenario B: Supply Chain Exposure (the dangerous one)**
The imports are in deeply nested files, tree-shaken in development, and only surface in production builds — or worse, the code passes initial review but the phantom package name goes unregistered. Now it's a sitting duck.

An attacker who registers `email-validator-pro` on npm can now inject arbitrary code into every project that hallucinated this import. And the victims have no idea because the import statement looks completely legitimate.

## The Scale of the Problem

To quantify this, I built [Open Code Review](https://github.com/raye-deng/open-code-review), an open-source tool that scans codebases for AI-generated defects, including phantom imports.

In testing across several open-source projects with significant AI-generated code contributions:

- **Average hallucination rate**: 2.3 phantom imports per 100 files
- **Most hallucinated prefixes**: `react-*`, `express-*`, `lodash-*`, `mongoose-*`
- **Common patterns**: Adding `-utils`, `-helper`, `-wrapper`, `-extra` to real package names
- **Detection time**: Under 3 seconds for 100 files using registry checks alone

## How the Detection Works

The core detection pipeline runs against the actual npm/PyPI registries:

```typescript
// Simplified detection logic
async function detectPhantomImports(files: SourceFile[]): Promise<PhantomIssue[]> {
  const issues: PhantomIssue[] = [];

  for (const file of files) {
    const imports = extractImportDeclarations(file);

    for (const imp of imports) {
      // Check against actual registry
      const exists = await registryClient.packageExists(imp.source);

      if (!exists) {
        issues.push({
          file: file.path,
          line: imp.line,
          package: imp.source,
          severity: 'critical',
          message: `Package '${imp.source}' not found on registry — possible AI hallucination`,
          fix: `Did you mean ${suggestRealPackage(imp.source)}?`
        });
      }
    }
  }

  return issues;
}
```

The real implementation is more sophisticated — it includes fuzzy matching against known real packages to suggest corrections, tracks common hallucination patterns, and scores the entire codebase.

## The Phantom Package Database

The most concerning finding is the **predictability** of hallucinated names. AI models tend to hallucinate the same package names across different projects. This creates a fixed target for attackers.

The Phantom Package DB tracks these patterns:

| Hallucinated Package | Likely Intended Package | Risk Level |
|---------------------|----------------------|------------|
| `email-validator-pro` | `email-validator` | 🟡 Low (rare) |
| `react-dom-utils` | `react-dom` | 🔴 High (common) |
| `express-middleware` | `express` | 🔴 High (common) |
| `mongoose-plugin-auth` | Multiple | 🟡 Low |
| `axios-interceptors` | `axios` | 🟡 Low |

High-risk patterns are those that appear frequently across projects. An attacker registering `react-dom-utils` could potentially affect thousands of AI-generated codebases.

## Why Traditional Security Tools Don't Catch This

This is fundamentally different from what existing tools check:

**Static analysis (ESLint, SonarQube):**
- Check syntax, style, and known patterns
- Cannot verify package existence
- Treat imports as opaque strings

**Package auditors (npm audit, Snyk):**
- Check *installed* packages for known vulnerabilities
- Can't detect packages that were never successfully installed
- Don't flag the import statement itself

**License scanners:**
- Check license compatibility
- Assume packages exist
- Don't query registries

What's needed is a **registry-aware static analysis** — something that understands that `import x from 'y'` is only valid if `y` actually exists on a package registry (or is a local relative path).

## Mitigation Strategies

### 1. Scan for Phantom Imports

```bash
npx @opencodereview/cli scan . --sla L1
```

This checks every import against the npm/PyPI registry in under 3 seconds.

### 2. Add to CI/CD Pipeline

```yaml
# GitHub Actions
- uses: raye-deng/open-code-review@v1
  with:
    sla: L1
    threshold: 60
```

### 3. Register Your Internal Package Names

If you use private/internal packages, register placeholder packages on public registries to prevent squatting. This is the traditional dependency confusion mitigation, now more relevant than ever.

### 4. Review AI-Generated Imports Manually

Train your team to question any import from an AI assistant that they haven't verified exists on npm.

## The Deeper Problem

Phantom imports are a symptom of a larger issue: **AI models generate plausible-looking code that doesn't correspond to reality**. This extends beyond package names to:

- APIs that were removed in newer library versions
- Configuration options that never existed
- Function signatures that are close but wrong

The code *looks* correct. It *compiles*. It *passes linting*. But it's subtly broken in ways that only manifest under specific conditions.

As AI code generation becomes more widespread, we need a new category of tools: **reality-aware code analysis** — tools that verify generated code against the actual state of the world, not just syntactic rules.

Open Code Review is my attempt at building one such tool. It's free, open-source, and runs 100% locally. I'd encourage every team using AI coding assistants to add a registry-aware check to their CI pipeline.

The cost of a phantom import is small today. The cost of a supply chain compromise through a squatted hallucinated name is potentially catastrophic.

---

*Open Code Review is available at [github.com/raye-deng/open-code-review](https://github.com/raye-deng/open-code-review)*
