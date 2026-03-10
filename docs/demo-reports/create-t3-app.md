## 🔴 Open Code Review Report — create-t3-app

> 🕐 2026-03-10T17:54:18.811Z · ⏱️ 0.2s · 📁 100 files · 🌐 typescript

### Overall: 25/100 (Grade F) ❌ FAILED

| Metric | Value |
|--------|-------|
| Files Scanned | 94 |
| Files Passed | 88 |
| Files Failed | 6 |
| Issues Found | 509 |
| Threshold | 70 |

### 📊 Scoring Dimensions

| Dimension | Score | Bar | Issues |
|-----------|-------|-----|--------|
| AI Faithfulness | 0/35 | ░░░░░░░░░░ 0% | 370 |
| Code Freshness | 25/25 | ██████████ 100% | 0 |
| Context Coherence | 0/20 | ░░░░░░░░░░ 0% | 86 |
| Implementation Quality | 0/20 | ░░░░░░░░░░ 0% | 53 |

### ⚠️ Issue Summary

| Severity | Count |
|----------|-------|
| 🔴 **CRITICAL** | 46 |
| 🟠 **HIGH** | 303 |
| 🟡 MEDIUM | 48 |
| 🔵 LOW | 112 |

### 📁 Issues by File

<details>
<summary><strong>cli/src/cli/index.ts</strong> — 31 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@clack/prompts' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@clack/prompts' is a real npm package. If it exists, run 'npm install @clack/prompts'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@clack/prompts' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'commander' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L11: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L12: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L13: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L14: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L15: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L16: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L78: Function 'runCli' has cyclomatic complexity of 75 (threshold: 25)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Refactor into smaller functions. AI often generates monolithic functions with too many branches.

#### 🟡 MEDIUM L332: Possible phantom function call: 'SQLite' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L409: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L187: Incomplete implementation marker found: FIXME

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L78: Function 'runCli' is 356 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L78: Function 'runCli' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L204: Function 'if' has cyclomatic complexity of 19 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🔵 LOW L275: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L289: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L294: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L299: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L312: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L323: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L330: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L342: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L354: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L363: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L372: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L397: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L433: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/helpers/createProject.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L17: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L94: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/helpers/format.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'execa' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'ora' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/helpers/git.ts</strong> — 15 issues</summary>

#### 🔴 **CRITICAL** L3: Potentially hallucinated package: '@clack/prompts' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@clack/prompts' is a real npm package. If it exists, run 'npm install @clack/prompts'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L3: Package '@clack/prompts' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package 'execa' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package 'ora' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L9: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L34: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L128: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L15: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L23: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L34: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L46: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L55: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/helpers/installDependencies.ts</strong> — 12 issues</summary>

#### 🟠 **HIGH** L1: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'execa' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'ora' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L9: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'onDataHandle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'rej' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'res' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'getUserPkgManager' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Async function 'anonymous' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L35: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L53: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L65: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/helpers/installPackages.ts</strong> — 3 issues</summary>

#### 🟠 **HIGH** L1: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'ora' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/helpers/logNextSteps.ts</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/helpers/scaffoldProject.ts</strong> — 9 issues</summary>

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: '@clack/prompts' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@clack/prompts' is a real npm package. If it exists, run 'npm install @clack/prompts'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L2: Package '@clack/prompts' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package 'ora' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L9: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'installation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/helpers/selectBoilerplate.ts</strong> — 6 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Function 'if' has cyclomatic complexity of 23 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L85: Function 'if' has cyclomatic complexity of 25 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L123: Function 'if' has cyclomatic complexity of 25 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

</details>

<details>
<summary><strong>cli/src/helpers/setImportAlias.ts</strong> — 2 issues</summary>

#### 🟡 MEDIUM L25: Possible phantom function call: 'wildcards' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'slash' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/index.ts</strong> — 16 issues</summary>

#### 🔴 **CRITICAL** L5: Potentially hallucinated package: 'type-fest' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'type-fest' is a real npm package. If it exists, run 'npm install type-fest'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L3: Package 'execa' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package 'type-fest' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L9: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L10: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L11: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L12: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L13: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L14: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L15: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L16: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'getNpmVersion' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L31: Function 'main' is 86 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>cli/src/installers/betterAuth.ts</strong> — 6 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L131: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>cli/src/installers/biome.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/dbContainer.ts</strong> — 4 issues</summary>

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/installers/drizzle.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/envVars.ts</strong> — 9 issues</summary>

#### 🔴 **CRITICAL** L69: Hardcoded secret/credential detected

- **Detector:** security-pattern
- **Category:** security
- **Fix:** Use environment variables (process.env.XXX) or a secrets manager instead of hardcoding credentials.

#### 🔴 **CRITICAL** L73: Hardcoded secret/credential detected

- **Detector:** security-pattern
- **Category:** security
- **Fix:** Use environment variables (process.env.XXX) or a secrets manager instead of hardcoding credentials.

#### 🟠 **HIGH** L3: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'Uint8Array' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L155: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L60: Naming convention inconsistency: file predominantly uses camelCase

- **Detector:** context-break
- **Category:** context-loss

#### 🔵 LOW L66: Naming convention inconsistency: file predominantly uses camelCase

- **Detector:** context-break
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/installers/eslint.ts</strong> — 6 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/index.ts</strong> — 6 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/nextAuth.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/prisma.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/tailwind.ts</strong> — 4 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/installers/trpc.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L47: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/addPackageDependency.ts</strong> — 5 issues</summary>

#### 🔴 **CRITICAL** L3: Potentially hallucinated package: 'sort-package-json' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'sort-package-json' is a real npm package. If it exists, run 'npm install sort-package-json'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L4: Potentially hallucinated package: 'type-fest' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'type-fest' is a real npm package. If it exists, run 'npm install type-fest'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'sort-package-json' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'type-fest' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/utils/addPackageScript.ts</strong> — 5 issues</summary>

#### 🔴 **CRITICAL** L3: Potentially hallucinated package: 'sort-package-json' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'sort-package-json' is a real npm package. If it exists, run 'npm install sort-package-json'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L4: Potentially hallucinated package: 'type-fest' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'type-fest' is a real npm package. If it exists, run 'npm install type-fest'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'sort-package-json' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'type-fest' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/utils/getT3Version.ts</strong> — 5 issues</summary>

#### 🔴 **CRITICAL** L3: Potentially hallucinated package: 'type-fest' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'type-fest' is a real npm package. If it exists, run 'npm install type-fest'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L2: Package 'fs-extra' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'type-fest' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/logger.ts</strong> — 1 issue</summary>

#### 🟠 **HIGH** L1: Package 'chalk' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/src/utils/renderTitle.ts</strong> — 4 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'gradient-string' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'gradient-string' is a real npm package. If it exists, run 'npm install gradient-string'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'gradient-string' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/base/next.config.js</strong> — 1 issue</summary>

#### 🟠 **HIGH** L7: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/base/src/env.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/config/_eslint.drizzle.js</strong> — 4 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@eslint/eslintrc' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@eslint/eslintrc' is a real npm package. If it exists, run 'npm install @eslint/eslintrc'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'typescript-eslint' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'typescript-eslint' is a real npm package. If it exists, run 'npm install typescript-eslint'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L4: Potentially hallucinated package: 'eslint-plugin-drizzle' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'eslint-plugin-drizzle' is a real npm package. If it exists, run 'npm install eslint-plugin-drizzle'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L4: Package 'eslint-plugin-drizzle' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/config/drizzle-config-mysql.ts</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'drizzle-kit' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'drizzle-kit' is a real npm package. If it exists, run 'npm install drizzle-kit'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'drizzle-kit' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/config/drizzle-config-postgres.ts</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'drizzle-kit' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'drizzle-kit' is a real npm package. If it exists, run 'npm install drizzle-kit'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'drizzle-kit' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/config/drizzle-config-sqlite.ts</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'drizzle-kit' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'drizzle-kit' is a real npm package. If it exists, run 'npm install drizzle-kit'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'drizzle-kit' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/config/next-config-appdir.js</strong> — 1 issue</summary>

#### 🟠 **HIGH** L7: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/app/_components/post-tw.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L3: Package 'react' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'setName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L20: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'LatestPost' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function LatestPost(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/_components/post.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L3: Package 'react' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'setName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L21: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L8: Exported function 'LatestPost' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function LatestPost(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/api/auth/[...all]/route.ts</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'better-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'better-auth' is a real npm package. If it exists, run 'npm install better-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'better-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/app/api/auth/[...nextauth]/route.ts</strong> — 1 issue</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/app/api/trpc/[trpc]/route.ts</strong> — 7 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@trpc/server' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@trpc/server' is a real npm package. If it exists, run 'npm install @trpc/server'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@trpc/server' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/app/layout/base.tsx</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L20: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/app/layout/with-trpc-tw.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L23: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/app/layout/with-trpc.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L22: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/app/layout/with-tw.tsx</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L21: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/base.tsx</strong> — 3 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L7: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L5: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-auth-trpc-tw.tsx</strong> — 8 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L7: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L16: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-auth-trpc.tsx</strong> — 7 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L8: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-better-auth-trpc-tw.tsx</strong> — 13 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L10: Function 'Home' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L19: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L10: Function 'Home' is 96 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L10: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-better-auth-trpc.tsx</strong> — 13 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L7: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L11: Function 'Home' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L20: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L74: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L11: Function 'Home' is 93 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L11: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-better-auth-tw.tsx</strong> — 11 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L8: Function 'Home' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L8: Function 'Home' is 83 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L8: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-better-auth.tsx</strong> — 10 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L9: Function 'Home' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L62: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L9: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-trpc-tw.tsx</strong> — 7 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L6: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L6: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-trpc.tsx</strong> — 6 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L7: Async function 'Home' lacks try-catch error handling

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/app/page/with-tw.tsx</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L5: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L3: Exported function 'HomePage' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function HomePage(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-auth-db-planetscale.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-auth-db.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-auth.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-better-auth-db-planetscale.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-better-auth-db.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-better-auth.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-db-planetscale.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/env/with-db.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@t3-oss/env-nextjs' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@t3-oss/env-nextjs' is a real npm package. If it exists, run 'npm install @t3-oss/env-nextjs'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@t3-oss/env-nextjs' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/base.tsx</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-auth-trpc-tw.tsx</strong> — 9 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L19: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-auth-trpc.tsx</strong> — 9 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L8: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L19: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-auth-tw.tsx</strong> — 8 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-auth.tsx</strong> — 8 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-better-auth-trpc-tw.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-better-auth-trpc.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-trpc-tw.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-trpc.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L6: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/_app/with-tw.tsx</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/template/extras/src/pages/api/auth/[...all].ts</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'better-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'better-auth' is a real npm package. If it exists, run 'npm install better-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'better-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/pages/api/trpc/[trpc].ts</strong> — 5 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@trpc/server' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@trpc/server' is a real npm package. If it exists, run 'npm install @trpc/server'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package '@trpc/server' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/base.tsx</strong> — 4 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L8: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L6: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-auth-trpc-tw.tsx</strong> — 9 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L67: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-auth-trpc.tsx</strong> — 8 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: 'next-auth' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'next-auth' is a real npm package. If it exists, run 'npm install next-auth'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L1: Package 'next-auth' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L68: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L8: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-better-auth-trpc-tw.tsx</strong> — 8 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L71: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-better-auth-trpc.tsx</strong> — 7 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L5: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L72: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L8: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-better-auth-tw.tsx</strong> — 7 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L8: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L60: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L6: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-better-auth.tsx</strong> — 6 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L9: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L61: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-trpc-tw.tsx</strong> — 6 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L10: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L6: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-trpc.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L4: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L7: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/pages/index/with-tw.tsx</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package 'next' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'hsl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L6: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L4: Exported function 'Home' is missing a return type annotation

- **Detector:** type-safety
- **Category:** type-safety
- **Fix:** Add an explicit return type: function Home(...): ReturnType { ... }

</details>

<details>
<summary><strong>cli/template/extras/src/server/api/root.ts</strong> — 2 issues</summary>

#### 🟠 **HIGH** L1: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L2: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>cli/template/extras/src/server/api/routers/post/base.ts</strong> — 5 issues</summary>

#### 🟠 **HIGH** L1: Package 'zod' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟠 **HIGH** L3: Package '~' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L22: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L35: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L39: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/getUserPkgManager.ts</strong> — 3 issues</summary>

#### 🔵 LOW L10: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/parseNameAndPath.ts</strong> — 1 issue</summary>

#### 🔵 LOW L42: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/removeTrailingSlash.ts</strong> — 1 issue</summary>

#### 🔵 LOW L7: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/renderVersionWarning.ts</strong> — 3 issues</summary>

#### 🟡 MEDIUM L76: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L47: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L76: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/validateAppName.ts</strong> — 1 issue</summary>

#### 🔵 LOW L21: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/utils/validateImportAlias.ts</strong> — 1 issue</summary>

#### 🔵 LOW L6: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/src/consts.ts</strong> — 1 issue</summary>

#### 🔵 LOW L6: Naming convention inconsistency: file predominantly uses camelCase

- **Detector:** context-break
- **Category:** context-loss

</details>

<details>
<summary><strong>cli/eslint.config.js</strong> — 3 issues</summary>

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'typescript-eslint' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'typescript-eslint' is a real npm package. If it exists, run 'npm install typescript-eslint'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L3: Potentially hallucinated package: 'eslint-plugin-isaacscript' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'eslint-plugin-isaacscript' is a real npm package. If it exists, run 'npm install eslint-plugin-isaacscript'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L4: Potentially hallucinated package: 'eslint-plugin-import-x' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'eslint-plugin-import-x' is a real npm package. If it exists, run 'npm install eslint-plugin-import-x'. If not, it may be an AI hallucination.

</details>

<details>
<summary><strong>cli/template/extras/config/_eslint.base.js</strong> — 2 issues</summary>

#### 🔴 **CRITICAL** L1: Potentially hallucinated package: '@eslint/eslintrc' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that '@eslint/eslintrc' is a real npm package. If it exists, run 'npm install @eslint/eslintrc'. If not, it may be an AI hallucination.

#### 🔴 **CRITICAL** L2: Potentially hallucinated package: 'typescript-eslint' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'typescript-eslint' is a real npm package. If it exists, run 'npm install typescript-eslint'. If not, it may be an AI hallucination.

</details>

<details>
<summary>📋 File Scores</summary>

| File | Score | Grade | AI Faith. | Freshness | Coherence | Quality |
|------|-------|-------|-----------|-----------|-----------|---------|
| `cli/src/cli/index.ts` | 53/100 | 🔴 F | 0/35 | 25/25 | 14.8/20 | 13/20 |
| `cli/src/helpers/createProject.ts` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/helpers/format.ts` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/helpers/git.ts` | 69/100 | 🟠 D | 8.75/35 | 25/25 | 18/20 | 17/20 |
| `cli/src/helpers/installDependencies.ts` | 77/100 | 🟡 C | 14/35 | 25/25 | 18.8/20 | 19/20 |
| `cli/src/helpers/installPackages.ts` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/helpers/logNextSteps.ts` | 86/100 | 🔵 B | 21/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/helpers/scaffoldProject.ts` | 69/100 | 🟠 D | 3.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/helpers/selectBoilerplate.ts` | 87/100 | 🔵 B | 24.5/35 | 25/25 | 20/20 | 17/20 |
| `cli/src/helpers/setImportAlias.ts` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/index.ts` | 65/100 | 🟠 D | 0/35 | 25/25 | 20/20 | 19.6/20 |
| `cli/src/installers/betterAuth.ts` | 82/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 19/20 |
| `cli/src/installers/biome.ts` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/dbContainer.ts` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/installers/drizzle.ts` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/envVars.ts` | 76/100 | 🟡 C | 12.25/35 | 25/25 | 18.8/20 | 20/20 |
| `cli/src/installers/eslint.ts` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/index.ts` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/nextAuth.ts` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/prisma.ts` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/tailwind.ts` | 86/100 | 🔵 B | 21/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/installers/trpc.ts` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/utils/addPackageDependency.ts` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/utils/addPackageScript.ts` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/utils/getT3Version.ts` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/utils/logger.ts` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/src/utils/renderTitle.ts` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/base/next.config.js` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/base/src/env.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/config/_eslint.drizzle.js` | 81/100 | 🔵 B | 15.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/config/drizzle-config-mysql.ts` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/config/drizzle-config-postgres.ts` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/config/drizzle-config-sqlite.ts` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/config/next-config-appdir.js` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/app/_components/post-tw.tsx` | 90/100 | 🟢 A | 26.25/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/app/_components/post.tsx` | 90/100 | 🟢 A | 26.25/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/app/api/auth/[...all]/route.ts` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/app/api/auth/[...nextauth]/route.ts` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/app/api/trpc/[trpc]/route.ts` | 77/100 | 🟡 C | 12.25/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/app/layout/base.tsx` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/app/layout/with-trpc-tw.tsx` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/app/layout/with-trpc.tsx` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/app/layout/with-tw.tsx` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/app/page/base.tsx` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/app/page/with-auth-trpc-tw.tsx` | 82/100 | 🔵 B | 19.25/35 | 25/25 | 19.6/20 | 18.6/20 |
| `cli/template/extras/src/app/page/with-auth-trpc.tsx` | 84/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 18.6/20 |
| `cli/template/extras/src/app/page/with-better-auth-trpc-tw.tsx` | 71/100 | 🟡 C | 8.75/35 | 25/25 | 19.6/20 | 17.2/20 |
| `cli/template/extras/src/app/page/with-better-auth-trpc.tsx` | 72/100 | 🟡 C | 10.5/35 | 25/25 | 19.2/20 | 17.2/20 |
| `cli/template/extras/src/app/page/with-better-auth-tw.tsx` | 78/100 | 🟡 C | 15.75/35 | 25/25 | 19.6/20 | 17.2/20 |
| `cli/template/extras/src/app/page/with-better-auth.tsx` | 79/100 | 🟡 C | 17.5/35 | 25/25 | 19.2/20 | 17.6/20 |
| `cli/template/extras/src/app/page/with-trpc-tw.tsx` | 86/100 | 🔵 B | 22.75/35 | 25/25 | 19.6/20 | 18.6/20 |
| `cli/template/extras/src/app/page/with-trpc.tsx` | 88/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 18.6/20 |
| `cli/template/extras/src/app/page/with-tw.tsx` | 94/100 | 🟢 A | 29.75/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/env/with-auth-db-planetscale.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-auth-db.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-auth.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-better-auth-db-planetscale.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-better-auth-db.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-better-auth.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-db-planetscale.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/env/with-db.js` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/pages/_app/base.tsx` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-auth-trpc-tw.tsx` | 68/100 | 🟠 D | 3.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-auth-trpc.tsx` | 68/100 | 🟠 D | 3.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-auth-tw.tsx` | 72/100 | 🟡 C | 7/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-auth.tsx` | 72/100 | 🟡 C | 7/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-better-auth-trpc-tw.tsx` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-better-auth-trpc.tsx` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-trpc-tw.tsx` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-trpc.tsx` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/_app/with-tw.tsx` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/template/extras/src/pages/api/auth/[...all].ts` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/pages/api/trpc/[trpc].ts` | 81/100 | 🔵 B | 15.75/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/pages/index/base.tsx` | 92/100 | 🟢 A | 28/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-auth-trpc-tw.tsx` | 78/100 | 🟡 C | 14/35 | 25/25 | 19.2/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-auth-trpc.tsx` | 80/100 | 🔵 B | 15.75/35 | 25/25 | 19.2/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-better-auth-trpc-tw.tsx` | 83/100 | 🔵 B | 19.25/35 | 25/25 | 19.2/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-better-auth-trpc.tsx` | 85/100 | 🔵 B | 21/35 | 25/25 | 19.2/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-better-auth-tw.tsx` | 87/100 | 🔵 B | 22.75/35 | 25/25 | 19.2/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-better-auth.tsx` | 88/100 | 🔵 B | 24.5/35 | 25/25 | 19.2/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-trpc-tw.tsx` | 87/100 | 🔵 B | 22.75/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-trpc.tsx` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/pages/index/with-tw.tsx` | 90/100 | 🟢 A | 26.25/35 | 25/25 | 19.6/20 | 19.6/20 |
| `cli/template/extras/src/server/api/root.ts` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/src/server/api/routers/post/base.ts` | 92/100 | 🟢 A | 28/35 | 25/25 | 18.8/20 | 20/20 |
| `cli/src/utils/getUserPkgManager.ts` | 99/100 | 🏆 A+ | 35/35 | 25/25 | 18.8/20 | 20/20 |
| `cli/src/utils/parseNameAndPath.ts` | 100/100 | 🏆 A+ | 35/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/utils/removeTrailingSlash.ts` | 100/100 | 🏆 A+ | 35/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/utils/renderVersionWarning.ts` | 98/100 | 🏆 A+ | 35/35 | 25/25 | 19.2/20 | 19/20 |
| `cli/src/utils/validateAppName.ts` | 100/100 | 🏆 A+ | 35/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/utils/validateImportAlias.ts` | 100/100 | 🏆 A+ | 35/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/src/consts.ts` | 100/100 | 🏆 A+ | 35/35 | 25/25 | 19.6/20 | 20/20 |
| `cli/eslint.config.js` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |
| `cli/template/extras/config/_eslint.base.js` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |

</details>

---
*Powered by [Open Code Review](https://github.com/raye-deng/open-code-review) v0.3.0*