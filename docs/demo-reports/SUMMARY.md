# Open Code Review — Demo Scan Results

> Generated: 2026-03-10  
> Engine: Open Code Review v0.3.0  
> Mode: Static Analysis Only (Tier 1 + Tier 2)

## Scanned Repositories

| Repository | Language | Files | Issues | Score | Grade |
|-----------|----------|------:|-------:|------:|:-----:|
| create-t3-app | typescript | 100 | 509 | 25 | F |
| typer | python | 100 | 151 | 59 | F |
| java-design-patterns | java | 100 | 257 | 51 | F |
| chi | go | 73 | 1008 | 36 | F |
| moshi | kotlin | 78 | 1497 | 8 | F |

## Issue Distribution by Category

| Category | create-t3-app | typer | java-design-patterns | chi | moshi | Total |
|----------|------:|------:|------:|------:|------:|------:|
| context-loss | 86 | 14 | 10 | 57 | 211 | 378 |
| error-handling | 15 | 0 | 9 | 0 | 62 | 86 |
| hallucination | 368 | 137 | 237 | 939 | 1145 | 2826 |
| incomplete | 1 | 0 | 0 | 4 | 9 | 14 |
| over-engineering | 15 | 0 | 1 | 8 | 63 | 87 |
| security | 2 | 0 | 0 | 0 | 0 | 2 |
| stale-knowledge | 0 | 0 | 0 | 0 | 7 | 7 |
| type-safety | 22 | 0 | 0 | 0 | 0 | 22 |

## Issue Distribution by Severity

| Severity | create-t3-app | typer | java-design-patterns | chi | moshi | Total |
|----------|------:|------:|------:|------:|------:|------:|
| critical | 46 | 0 | 0 | 1 | 0 | 47 |
| high | 303 | 0 | 0 | 1 | 12 | 316 |
| medium | 48 | 137 | 247 | 944 | 1279 | 2655 |
| low | 112 | 14 | 10 | 62 | 206 | 404 |

## Scoring Dimensions

| Dimension | create-t3-app | typer | java-design-patterns | chi | moshi |
|-----------|------:|------:|------:|------:|------:|
| AI Faithfulness (35) | 0/35 | 0/35 | 0/35 | 0/35 | 0/35 |
| Code Freshness (25) | 25/25 | 25/25 | 25/25 | 25/25 | 7.5/25 |
| Context Coherence (20) | 0/20 | 14.4/20 | 16/20 | 0/20 | 0/20 |
| Impl. Quality (20) | 0/20 | 20/20 | 10/20 | 11/20 | 0/20 |

## Top Issues per Repository

### create-t3-app (typescript)

| Severity | Category | File | Line | Message |
|----------|----------|------|-----:|--------|
| critical | security | cli/src/installers/envVars.ts | 69 | Hardcoded secret/credential detected |
| critical | security | cli/src/installers/envVars.ts | 73 | Hardcoded secret/credential detected |
| critical | hallucination | cli/eslint.config.js | 2 | Potentially hallucinated package: 'typescript-eslint' is not found in depende... |
| critical | hallucination | cli/eslint.config.js | 3 | Potentially hallucinated package: 'eslint-plugin-isaacscript' is not found in... |
| critical | hallucination | cli/eslint.config.js | 4 | Potentially hallucinated package: 'eslint-plugin-import-x' is not found in de... |
| critical | hallucination | cli/src/cli/index.ts | 1 | Potentially hallucinated package: '@clack/prompts' is not found in dependenci... |
| critical | hallucination | cli/src/helpers/git.ts | 3 | Potentially hallucinated package: '@clack/prompts' is not found in dependenci... |
| critical | hallucination | cli/src/helpers/scaffoldProject.ts | 2 | Potentially hallucinated package: '@clack/prompts' is not found in dependenci... |
| critical | hallucination | cli/src/index.ts | 5 | Potentially hallucinated package: 'type-fest' is not found in dependencies or... |
| critical | hallucination | cli/src/utils/addPackageDependency.ts | 3 | Potentially hallucinated package: 'sort-package-json' is not found in depende... |

_...and 499 more issues._

### typer (python)

| Severity | Category | File | Line | Message |
|----------|----------|------|-----:|--------|
| medium | hallucination | docs_src/app_dir/tutorial001_py310.py | 11 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...ments/default/tutorial001_an_py310.py | 9 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...rguments/default/tutorial001_py310.py | 7 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...ments/default/tutorial002_an_py310.py | 9 | Possible phantom function call: 'get_name' is called but not imported or decl... |
| medium | hallucination | ...ments/default/tutorial002_an_py310.py | 14 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...rguments/default/tutorial002_py310.py | 8 | Possible phantom function call: 'get_name' is called but not imported or decl... |
| medium | hallucination | ...rguments/default/tutorial002_py310.py | 13 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...uments/envvar/tutorial001_an_py310.py | 9 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...arguments/envvar/tutorial001_py310.py | 7 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...uments/envvar/tutorial002_an_py310.py | 9 | Possible phantom function call: 'main' is called but not imported or declared... |

_...and 141 more issues._

### java-design-patterns (java)

| Severity | Category | File | Line | Message |
|----------|----------|------|-----:|--------|
| medium | hallucination | ...bstractdocument/AbstractDocument.java | 45 | Possible phantom function call: 'put' is called but not imported or declared ... |
| medium | hallucination | ...bstractdocument/AbstractDocument.java | 56 | Possible phantom function call: 'children' is called but not imported or decl... |
| medium | hallucination | ...bstractdocument/AbstractDocument.java | 68 | Possible phantom function call: 'buildStringRepresentation' is called but not... |
| medium | hallucination | ...bstractdocument/AbstractDocument.java | 71 | Possible phantom function call: 'buildStringRepresentation' is called but not... |
| medium | hallucination | ...bstractdocument/AbstractDocument.java | 72 | Possible phantom function call: 'StringBuilder' is called but not imported or... |
| medium | hallucination | ...bstractdocument/AbstractDocument.java | 73 | Possible phantom function call: 'getClass' is called but not imported or decl... |
| medium | hallucination | ...om/iluwatar/abstractdocument/App.java | 49 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | ...om/iluwatar/abstractdocument/App.java | 73 | Possible phantom function call: 'Car' is called but not imported or declared ... |
| medium | hallucination | ...uwatar/abstractdocument/Document.java | 41 | Possible phantom function call: 'put' is called but not imported or declared ... |
| medium | hallucination | ...uwatar/abstractdocument/Document.java | 58 | Possible phantom function call: 'children' is called but not imported or decl... |

_...and 247 more issues._

### chi (go)

| Severity | Category | File | Line | Message |
|----------|----------|------|-----:|--------|
| critical | hallucination | context_test.go | 3 | Potentially hallucinated package: 'testing' is not found in dependencies or n... |
| high | hallucination | context_test.go | 3 | Package 'testing' is imported but not listed in package.json dependencies |
| medium | hallucination | _examples/custom-handler/main.go | 10 | Possible phantom function call: 'func' is called but not imported or declared... |
| medium | hallucination | _examples/custom-handler/main.go | 16 | Possible phantom function call: 'byte' is called but not imported or declared... |
| medium | hallucination | _examples/custom-handler/main.go | 20 | Possible phantom function call: 'main' is called but not imported or declared... |
| medium | hallucination | _examples/custom-handler/main.go | 22 | Possible phantom function call: 'Handler' is called but not imported or decla... |
| medium | hallucination | _examples/custom-handler/main.go | 26 | Possible phantom function call: 'customHandler' is called but not imported or... |
| medium | hallucination | _examples/custom-handler/main.go | 33 | Possible phantom function call: 'byte' is called but not imported or declared... |
| medium | hallucination | _examples/custom-method/main.go | 10 | Possible phantom function call: 'init' is called but not imported or declared... |
| medium | hallucination | _examples/custom-method/main.go | 16 | Possible phantom function call: 'main' is called but not imported or declared... |

_...and 998 more issues._

### moshi (kotlin)

| Severity | Category | File | Line | Message |
|----------|----------|------|-----:|--------|
| high | stale-knowledge | ...com/squareup/moshi/-JsonUtf8Reader.kt | 999 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | stale-knowledge | ...om/squareup/moshi/-JsonValueReader.kt | 311 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | stale-knowledge | ...om/squareup/moshi/-JsonValueWriter.kt | 208 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | stale-knowledge | ...ava/com/squareup/moshi/JsonAdapter.kt | 65 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | stale-knowledge | ...ava/com/squareup/moshi/JsonAdapter.kt | 85 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | stale-knowledge | ...java/com/squareup/moshi/JsonReader.kt | 573 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | stale-knowledge | ...eup/moshi/internal/JsonValueSource.kt | 40 | Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0) |
| high | over-engineering | ...com/squareup/moshi/-JsonUtf8Reader.kt | 996 | Function 'nextSource' has nesting depth of 7 (threshold: 6) |
| high | over-engineering | ...com/squareup/moshi/-JsonUtf8Writer.kt | 43 | Function 'JsonWriter' has cyclomatic complexity of 45 (threshold: 25) |
| high | over-engineering | ...om/squareup/moshi/-JsonValueWriter.kt | 34 | Function 'JsonWriter' has cyclomatic complexity of 35 (threshold: 25) |

_...and 1487 more issues._

## Key Findings

- **Total files scanned**: 451 across 5 repositories
- **Total issues found**: 3422
- **Average quality score**: 36/100
- **Total scan time**: 0.6s
- **Scan mode**: Static analysis only (Tier 1 + Tier 2, no AI/LLM)

### Per-Language Observations

- **create-t3-app** (typescript): 509 issues in 100 files (5.1/file), Grade F
- **typer** (python): 151 issues in 100 files (1.5/file), Grade F
- **java-design-patterns** (java): 257 issues in 100 files (2.6/file), Grade F
- **chi** (go): 1008 issues in 73 files (13.8/file), Grade F
- **moshi** (kotlin): 1497 issues in 78 files (19.2/file), Grade F

---

_Generated by Open Code Review v0.3.0 — [https://github.com/anthropics/open-code-review](https://github.com/anthropics/open-code-review)_
