#!/usr/bin/env python3
"""Post personalized comments to target GitHub issues."""
import subprocess
import sys
import time
import json
import tempfile
import os

COMMENTS = [
    {
        "repo": "mattschaller/slopcheck",
        "issue": 4,
        "url": "https://github.com/mattschaller/slopcheck/issues/4",
        "title": "Add ESLint plugin interface",
        "comment": """Hey! 👋 Great idea building an ESLint plugin for slopsquatting detection.

You might also be interested in [Open Code Review](https://github.com/raye-deng/open-code-review) — it takes a similar concept further with a **three-stage detection pipeline**:

1. **L1 Fast** (<10s, free) — structural detection of hallucinated imports, fake dependencies, stale APIs, and over-engineered patterns
2. **L2 Standard** — adds embedding-based recall + local LLM risk scoring
3. **L3 Deep** — sends suspicious code to remote LLMs for semantic analysis

For your ESLint plugin use case, the hallucinated import detection in L1 is particularly relevant — it checks `import`/`require` statements against the npm registry (and PyPI, crates.io, etc.) to catch slopsquatting **before CI**.

```bash
# Quick scan
npx @opencodereview/cli scan src/ --sla L1

# GitHub Action (pass/fail gate in CI)
- name: AI Code Quality Gate
  uses: raye-deng/open-code-review@v4
  with:
    sla: L1
    threshold: 70
```

It supports 6 languages and 8 LLM providers. Could be a nice complement or reference for the ESLint plugin design — especially the phantom package database we're building ([#4](https://github.com/raye-deng/open-code-review/issues/4))."""
    },
    {
        "repo": "nateschmiedehaus/LiBrainian",
        "issue": 292,
        "url": "https://github.com/nateschmiedehaus/LiBrainian/issues/292",
        "title": "VerificationOracle anti-hallucination",
        "comment": """This resonates a lot with what we are tackling at [Open Code Review](https://github.com/raye-deng/open-code-review).

Your problem statement nails it: *"Code LLMs hallucinate at every level: function names, module paths, type names, package names, and APIs that don't exist in the actual codebase."* — exactly the class of bugs we built OCR to catch.

We take a different angle though — instead of building a verification oracle per codebase, we use a **three-stage pipeline**:

1. **L1 Structural** — AST-based detection of hallucinated imports, stale APIs, security anti-patterns. Zero config, <10s, no AI needed.
2. **L2 Embedding** — local LLM (Ollama) for risk scoring and cross-file coherence checks
3. **L3 Deep** — remote LLM for semantic analysis of suspicious code blocks

The key insight is that most hallucinations are structurally detectable without needing to understand semantics. For example, `import { foo } from 'non-existent-pkg'` can be caught at the L1 stage by checking against package registries.

```bash
npx @opencodereview/cli scan src/ --sla L2 --provider ollama --model llama3
```

Your VerificationOracle concept is interesting for the cases that require deep semantic understanding. Would love to see how the approaches could complement each other — our L1 catches the obvious stuff fast, your oracle handles the nuanced cases."""
    },
    {
        "repo": "nateschmiedehaus/LiBrainian",
        "issue": 666,
        "url": "https://github.com/nateschmiedehaus/LiBrainian/issues/666",
        "title": "API Surface Index hallucinated packages",
        "comment": """Really interesting approach with the API Surface Index and MCP validate_import tool! The idea of validating package exports against local declaration files is clever.

We are solving a similar problem at [Open Code Review](https://github.com/raye-deng/open-code-review) but from a CI/CD angle. Instead of validating at coding time via MCP, we run as a **quality gate in the pipeline**:

- **Hallucinated import detection** — checks imports against npm/PyPI/crates.io registries
- **Stale API detection** — flags deprecated APIs that LLMs learned from outdated training data
- **Security anti-patterns** — catches hardcoded secrets, eval(), etc.
- **Over-engineering detection** — unnecessary abstractions and dead code

```bash
# Quick local scan
npx @opencodereview/cli scan src/ --sla L1

# CI/CD GitHub Action
- name: AI Code Quality Gate
  uses: raye-deng/open-code-review@v4
  with:
    sla: L1
    threshold: 70
```

The MCP validate_import approach and our CI gate are actually complementary — catch issues early at dev time with your tool, catch anything that slips through in CI with ours.

Would be interested to see if our phantom package database (which catalogs known hallucinated packages across npm, PyPI, etc.) could enhance your validate_import tool. We are collecting data in [issue #4](https://github.com/raye-deng/open-code-review/issues/4)."""
    },
    {
        "repo": "promptdriven/pdd",
        "issue": 494,
        "url": "https://github.com/promptdriven/pdd/issues/494",
        "title": "pdd sync silently runs pip install",
        "comment": """This is a great catch — `_try_auto_fix_import_error()` auto-installing packages is a real security risk, especially since AI-generated code frequently references packages that do not actually exist (phantom/hallucinated dependencies).

We built [Open Code Review](https://github.com/raye-deng/open-code-review) specifically to catch this class of problems before they reach runtime. It scans AI-generated code for:

- **Hallucinated imports** — packages/exports that do not exist in any registry
- **Fake dependencies** — packages that sound real but are not
- **Security anti-patterns** — including auto-install patterns like this

```bash
npx @opencodereview/cli scan . --sla L1
```

The L1 scan is free and takes <10 seconds. It checks every `import`/`require`/`from` statement against the actual package registry, so it would catch exactly the scenario described here — a hallucinated package name triggering an unintended `pip install`.

For pdd specifically, running OCR as a pre-sync check could prevent the auto-install from ever happening. And the GitHub Action version works as a CI gate:

```yaml
- name: AI Code Quality Gate
  uses: raye-deng/open-code-review@v4
  with:
    sla: L1
    threshold: 70
```

We are also building a [phantom package database](https://github.com/raye-deng/open-code-review/issues/4) to catalog the most common hallucinated package names — contributions welcome!"""
    },
    {
        "repo": "promptdriven/pdd",
        "issue": 427,
        "url": "https://github.com/promptdriven/pdd/issues/427",
        "title": "Code generation ignores interface contracts",
        "comment": """The mismatch between LLM-generated frontend code and backend schemas is a textbook example of the "context window artifact" problem — the LLM loses track of the contract as context grows.

We built [Open Code Review](https://github.com/raye-deng/open-code-review) to catch exactly this kind of issue. Its **L2 Standard** scan includes cross-file coherence checking:

1. **L1 Fast** catches structural issues (hallucinated imports, wrong APIs)
2. **L2 Standard** adds embedding-based analysis that detects when code in one file contradicts another (e.g., frontend calling an endpoint the backend does not expose)
3. **L3 Deep** uses remote LLMs for semantic validation

```bash
# Detect contract mismatches
npx @opencodereview/cli scan . --sla L2 --provider ollama --model llama3
```

For the specific frontend/backend mismatch case, you could run OCR on both directories and it will flag when the frontend references schemas, endpoints, or types that do not exist in the backend (and vice versa).

We are also documenting patterns like this in our [phantom package database](https://github.com/raye-deng/open-code-review/issues/4) — would love to add your case as an example of context window artifact detection."""
    },
    {
        "repo": "mmnto-ai/totem",
        "issue": 42,
        "url": "https://github.com/mmnto-ai/totem/issues/42",
        "title": "Epic: Solve Universal AI DevEx Friction",
        "comment": """Great epic! You have identified the three core friction points of AI-assisted development really well.

We are tackling these exact problems at [Open Code Review](https://github.com/raye-deng/open-code-review) — an open-source CI/CD quality gate specifically built for AI-generated code:

**1. Hallucinated Package Versions → Solved by L1 scan**
```bash
npx @opencodereview/cli scan src/ --sla L1
# Detects: fake packages, stale APIs, wrong versions, deprecated APIs
```

**2. Scope Creep → Over-engineering detection**
OCR flags unnecessary abstractions, dead code, and over-engineered patterns that LLMs tend to introduce.

**3. Testing Gaps → Security and quality scoring**
The L2/L3 scans use local and remote LLMs to identify code that looks correct but has subtle bugs.

The CI/CD integration is the key differentiator — it runs automatically on every PR:
```yaml
- name: AI Code Quality Gate
  uses: raye-deng/open-code-review@v4
  with:
    sla: L1
    threshold: 70
```

6 languages, 8 LLM providers, free to use. Could be a natural integration point for Totem — OCR as the quality gate, Totem as the workflow manager. Would love to explore collaboration!"""
    },
    {
        "repo": "cursor/mcp-servers",
        "issue": 324,
        "url": "https://github.com/cursor/mcp-servers/issues/324",
        "title": "[Server Request]: agent-guardrail",
        "comment": """Nice to see agent governance getting attention! Alongside action-level guardrails, **code quality gates** for AI-generated output are also important.

[Open Code Review](https://github.com/raye-deng/open-code-review) addresses the output quality side — it is an open-source tool that scans AI-generated code for:

- **Hallucinated imports** (packages/exports that do not exist)
- **Stale APIs** (deprecated methods from training data)
- **Security anti-patterns** (hardcoded secrets, eval(), etc.)
- **Over-engineering** (unnecessary abstractions, dead code)

It works as both a CLI tool and a GitHub Action:
```bash
npx @opencodereview/cli scan src/ --sla L1
```

Could be a great complement to agent-guardrail — you control *what agents do*, OCR validates *what agents produce*. Both sides of the AI safety equation."""
    },
    {
        "repo": "cursor/mcp-servers",
        "issue": 283,
        "url": "https://github.com/cursor/mcp-servers/issues/283",
        "title": "[Server Request]: Rigour",
        "comment": """Rigour looks like a solid approach to AI code governance! The 24+ quality gates and 8-language support is impressive.

For folks looking for a complementary **CI/CD pipeline** approach (not just in-editor), [Open Code Review](https://github.com/raye-deng/open-code-review) offers a similar three-stage detection pipeline:

- **L1 Fast** (<10s, free) — hallucinated imports, stale APIs, security patterns, over-engineering
- **L2 Standard** — local LLM (Ollama) for risk scoring and cross-file coherence
- **L3 Deep** — remote LLM for semantic analysis

```bash
npx @opencodereview/cli scan src/ --sla L1

# GitHub Action
- name: AI Code Quality Gate
  uses: raye-deng/open-code-review@v4
  with:
    sla: L1
    threshold: 70
```

The key difference is OCR runs as a CI gate on every PR, catching issues that slip past in-editor checks. Supports 6 languages and 8 LLM providers (including free GLM and DeepSeek tiers).

Rigour (in-editor) + OCR (CI/CD) could be a powerful combination for teams using Cursor."""
    },
    {
        "repo": "Z-M-Huang/vcp",
        "issue": 25,
        "url": "https://github.com/Z-M-Huang/vcp/issues/25",
        "title": "[Standard] Conformance model",
        "comment": """Love the formal conformance model idea! Having objective pass/fail criteria for standards is essential.

This aligns well with what we are building at [Open Code Review](https://github.com/raye-deng/open-code-review) — a tool that provides **objective quality scoring** for AI-generated code using a three-stage pipeline:

- **L1**: Structural checks (hallucinated imports, stale APIs, security) — Score A+ to F
- **L2**: Local LLM risk scoring with cross-file coherence
- **L3**: Remote LLM semantic analysis

```bash
npx @opencodereview/cli scan src/ --sla L1
# Output: Overall Score with status
```

The scoring approach with configurable thresholds could map nicely to a MUST/SHOULD/MAY conformance model. For example:
- **MUST**: Score >= 70 (block PR)
- **SHOULD**: Score >= 80 (warning)
- **MAY**: Score >= 90 (informational)

Could be interesting to align VCP standards with automated quality gates like this."""
    },
    {
        "repo": "vercel-labs/skills",
        "issue": 501,
        "url": "https://github.com/vercel-labs/skills/issues/501",
        "title": "Deprecation and Yanking lifecycle awareness",
        "comment": """Great feature request! Package lifecycle awareness is crucial, especially when AI agents are installing packages that may have been deprecated or yanked since the LLM training cutoff.

We built [Open Code Review](https://github.com/raye-deng/open-code-review) with **stale API detection** as a core feature — it catches when AI-generated code uses deprecated APIs, removed exports, or yanked packages:

```bash
npx @opencodereview/cli scan src/ --sla L1
# Detects: deprecated packages, stale APIs, hallucinated imports
```

The tool checks against current package registry data, so it would catch cases where an AI agent tries to install or import a package that has since been yanked — exactly the scenario your issue describes.

For the skills ecosystem specifically, running OCR as a pre-install validation step could complement the lifecycle awareness you are proposing. We are also building a [phantom package database](https://github.com/raye-deng/open-code-review/issues/4) to catalog known problematic packages."""
    },
    {
        "repo": "vercel-labs/skills",
        "issue": 617,
        "url": "https://github.com/vercel-labs/skills/issues/617",
        "title": "[RFC] Skill Signature Verification on Install",
        "comment": """Signature verification for skills is an important security measure! Alongside verifying authenticity, it would be valuable to also check the **code quality** of installed skills — especially since AI-generated skills can contain subtle defects.

[Open Code Review](https://github.com/raye-deng/open-code-review) provides automated quality scanning that could serve as a complementary check:

```bash
npx @opencodereview/cli scan skill-source/ --sla L1
```

It detects:
- **Hallucinated imports** — packages that do not exist
- **Security anti-patterns** — hardcoded secrets, eval(), etc.
- **Stale APIs** — deprecated methods and packages
- **Over-engineering** — unnecessary complexity

Could be a useful addition to the install pipeline: verify signature → scan for quality → approve/reject. Both address different aspects of skill safety."""
    },
    {
        "repo": "ForgeCalendar/Forge",
        "issue": 33,
        "url": "https://github.com/ForgeCalendar/Forge/issues/33",
        "title": "Code Review Problems",
        "comment": """Interesting code review! For the inconsistencies you have identified, an automated approach could help maintain standards as the codebase evolves — especially if using AI coding assistants that can introduce new patterns.

[Open Code Review](https://github.com/raye-deng/open-code-review) is an open-source tool that catches exactly these kinds of issues:

- **Over-engineering detection** — unnecessary abstractions and dead code
- **Stale APIs** — deprecated patterns from LLM training data
- **Security anti-patterns** — hardcoded configs, eval(), etc.
- **Hallucinated imports** — fake package references

```bash
npx @opencodereview/cli scan src/ --sla L1

# As a CI gate
- name: AI Code Quality Gate
  uses: raye-deng/open-code-review@v4
  with:
    sla: L1
    threshold: 70
```

It outputs an HTML report with per-file scores (A+ through F), making it easy to track code quality over time. Might be useful as an automated supplement to your manual review process."""
    },
]

LOG_FILE = "/Users/raye.deng/Documents/wss/ai-code-validator/docs/promotion/comment-log.csv"
DELAY = 45

def post_comment(repo_issue, body):
    """Post a comment using gh api with JSON input."""
    payload = json.dumps({"body": body})
    try:
        result = subprocess.run(
            ["gh", "api", f"repos/{repo_issue}/comments", "--input", "-"],
            input=payload, capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0:
            try:
                data = json.loads(result.stdout)
                return "success", data.get("html_url", "")
            except:
                return "success", result.stdout[:200]
        else:
            return "failed", result.stderr[:300]
    except subprocess.TimeoutExpired:
        return "failed", "timeout"

def main():
    log_lines = ["repo,issue,issue_url,comment_url,status,title"]
    results = []
    
    for i, c in enumerate(COMMENTS):
        repo_issue = f"{c['repo']}/issues/{c['issue']}"
        print(f"[{i+1}/{len(COMMENTS)}] Posting to {repo_issue} - {c['title'][:50]}...", flush=True)
        
        status, detail = post_comment(repo_issue, c['comment'])
        
        if status == "success":
            print(f"  OK {detail}", flush=True)
        else:
            print(f"  FAIL {detail}", flush=True)
        
        log_lines.append(f"{c['repo']},{c['issue']},{c['url']},{detail},{status},{c['title'][:60]}")
        results.append({"repo": c['repo'], "issue": c['issue'], "status": status, "url": detail})
        
        if i < len(COMMENTS) - 1:
            print(f"  Waiting {DELAY}s...", flush=True)
            time.sleep(DELAY)
    
    with open(LOG_FILE, "w") as f:
        f.write("\n".join(log_lines) + "\n")
    
    print(f"\n=== Done! Log saved to {LOG_FILE} ===", flush=True)
    print(f"Success: {sum(1 for r in results if r['status'] == 'success')}", flush=True)
    print(f"Failed: {sum(1 for r in results if r['status'] == 'failed')}", flush=True)

if __name__ == "__main__":
    main()
