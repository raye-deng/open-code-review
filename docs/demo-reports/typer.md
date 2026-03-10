## 🔴 Open Code Review Report — typer

> 🕐 2026-03-10T17:54:18.869Z · ⏱️ 0.0s · 📁 100 files · 🌐 python

### Overall: 59/100 (Grade F) ❌ FAILED

| Metric | Value |
|--------|-------|
| Files Scanned | 97 |
| Files Passed | 97 |
| Files Failed | 0 |
| Issues Found | 151 |
| Threshold | 70 |

### 📊 Scoring Dimensions

| Dimension | Score | Bar | Issues |
|-----------|-------|-----|--------|
| AI Faithfulness | 0/35 | ░░░░░░░░░░ 0% | 137 |
| Code Freshness | 25/25 | ██████████ 100% | 0 |
| Context Coherence | 14.4/20 | ███████░░░ 72% | 14 |
| Implementation Quality | 20/20 | ██████████ 100% | 0 |

### ⚠️ Issue Summary

| Severity | Count |
|----------|-------|
| 🟡 MEDIUM | 137 |
| 🔵 LOW | 14 |

### 📁 Issues by File

<details>
<summary><strong>docs_src/app_dir/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/default/tutorial001_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/default/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/default/tutorial002_an_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'get_name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/arguments/default/tutorial002_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'get_name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/arguments/envvar/tutorial001_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/envvar/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/envvar/tutorial002_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/envvar/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/envvar/tutorial003_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/envvar/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial001_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial002_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial003_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial004_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial004_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial005_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial005_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial006_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial006_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial007_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial007_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial008_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/help/tutorial008_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial000_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial000_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial001_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial002_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/arguments/optional/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/arguments/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/callback/tutorial001_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/callback/tutorial002_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/callback/tutorial003_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'new_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/callback/tutorial004_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/context/tutorial001_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/context/tutorial002_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/context/tutorial003_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/context/tutorial004_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial001_an_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'delete_all' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial001_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'delete_all' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial004_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial004_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial005_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial005_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial006_py310.py</strong> — 5 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'config' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'sync' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'help' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'report' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial007_an_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'config' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial007_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'config' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/help/tutorial008_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/index/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/index/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/index/tutorial004_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/index/tutorial005_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/name/tutorial001_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'cli_create_user' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'cli_delete_user' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/one_or_multiple/tutorial001_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/one_or_multiple/tutorial002_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/options/tutorial001_an_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'delete_all' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/commands/options/tutorial001_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'delete_all' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/exceptions/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/exceptions/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/exceptions/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/exceptions/tutorial004_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/first_steps/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/first_steps/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/first_steps/tutorial003_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/first_steps/tutorial004_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/first_steps/tutorial005_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/first_steps/tutorial006_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L4: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/launch/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/launch/tutorial002_py310.py</strong> — 2 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'str' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/arguments_with_multiple_values/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/arguments_with_multiple_values/tutorial002_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/arguments_with_multiple_values/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/multiple_options/tutorial001_an_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'print' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'users' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/multiple_options/tutorial001_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'print' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'users' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/multiple_options/tutorial002_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/multiple_options/tutorial002_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/options_with_multiple_values/tutorial001_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/multiple_values/options_with_multiple_values/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/one_file_per_command/app_py310/users/add.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/one_file_per_command/app_py310/version.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'version' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial001_an_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial001_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial002_an_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L15: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial002_py310.py</strong> — 3 issues</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial003_an_py310.py</strong> — 4 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial003_py310.py</strong> — 4 issues</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L9: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L15: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial004_an_py310.py</strong> — 4 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/callback/tutorial004_py310.py</strong> — 4 issues</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'name_callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L9: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L15: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>docs_src/options/help/tutorial001_an_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>docs_src/options/help/tutorial001_py310.py</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary>📋 File Scores</summary>

| File | Score | Grade | AI Faith. | Freshness | Coherence | Quality |
|------|-------|-------|-----------|-----------|-----------|---------|
| `docs_src/app_dir/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/default/tutorial001_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/default/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/default/tutorial002_an_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `docs_src/arguments/default/tutorial002_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `docs_src/arguments/envvar/tutorial001_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/envvar/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/envvar/tutorial002_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/envvar/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/envvar/tutorial003_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/envvar/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial001_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial002_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial003_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial004_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial004_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial005_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial005_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial006_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial006_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial007_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial007_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial008_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/help/tutorial008_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial000_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial000_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial001_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial002_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/arguments/optional/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/arguments/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/callback/tutorial001_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/callback/tutorial002_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/callback/tutorial003_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/callback/tutorial004_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/context/tutorial001_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/context/tutorial002_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/context/tutorial003_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/context/tutorial004_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial001_an_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial001_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial004_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial004_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial005_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial005_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial006_py310.py` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial007_an_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial007_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/help/tutorial008_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/index/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/index/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/index/tutorial004_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/index/tutorial005_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/name/tutorial001_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/one_or_multiple/tutorial001_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/one_or_multiple/tutorial002_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/options/tutorial001_an_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/commands/options/tutorial001_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/exceptions/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/exceptions/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/exceptions/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/exceptions/tutorial004_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/first_steps/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/first_steps/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/first_steps/tutorial003_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/first_steps/tutorial004_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/first_steps/tutorial005_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/first_steps/tutorial006_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/launch/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/launch/tutorial002_py310.py` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/arguments_with_multiple_values/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/arguments_with_multiple_values/tutorial002_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/arguments_with_multiple_values/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/multiple_options/tutorial001_an_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/multiple_options/tutorial001_py310.py` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/multiple_options/tutorial002_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/multiple_options/tutorial002_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/options_with_multiple_values/tutorial001_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/multiple_values/options_with_multiple_values/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/one_file_per_command/app_py310/users/add.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/one_file_per_command/app_py310/version.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/options/callback/tutorial001_an_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `docs_src/options/callback/tutorial001_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `docs_src/options/callback/tutorial002_an_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `docs_src/options/callback/tutorial002_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `docs_src/options/callback/tutorial003_an_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.2/20 | 20/20 |
| `docs_src/options/callback/tutorial003_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.2/20 | 20/20 |
| `docs_src/options/callback/tutorial004_an_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.2/20 | 20/20 |
| `docs_src/options/callback/tutorial004_py310.py` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.2/20 | 20/20 |
| `docs_src/options/help/tutorial001_an_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `docs_src/options/help/tutorial001_py310.py` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |

</details>

---
*Powered by [Open Code Review](https://github.com/raye-deng/open-code-review) v0.3.0*