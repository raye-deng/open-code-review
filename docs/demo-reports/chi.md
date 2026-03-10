## 🔴 Open Code Review Report — chi

> 🕐 2026-03-10T17:54:19.055Z · ⏱️ 0.1s · 📁 73 files · 🌐 go

### Overall: 36/100 (Grade F) ❌ FAILED

| Metric | Value |
|--------|-------|
| Files Scanned | 72 |
| Files Passed | 59 |
| Files Failed | 13 |
| Issues Found | 1008 |
| Threshold | 70 |

### 📊 Scoring Dimensions

| Dimension | Score | Bar | Issues |
|-----------|-------|-----|--------|
| AI Faithfulness | 0/35 | ░░░░░░░░░░ 0% | 939 |
| Code Freshness | 25/25 | ██████████ 100% | 0 |
| Context Coherence | 0/20 | ░░░░░░░░░░ 0% | 57 |
| Implementation Quality | 11/20 | ██████░░░░ 55% | 12 |

### ⚠️ Issue Summary

| Severity | Count |
|----------|-------|
| 🔴 **CRITICAL** | 1 |
| 🟠 **HIGH** | 1 |
| 🟡 MEDIUM | 944 |
| 🔵 LOW | 62 |

### 📁 Issues by File

<details>
<summary><strong>_examples/custom-handler/main.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'Handler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'customHandler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/custom-method/main.go</strong> — 10 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/fileserver/main.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L28: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'FileServer' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/graceful/main.go</strong> — 10 issues</summary>

#### 🟡 MEDIUM L17: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'service' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'stop' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'cancel' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'service' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/hello-world/main.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/limits/main.go</strong> — 14 issues</summary>

#### 🟡 MEDIUM L21: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/logging/main.go</strong> — 1 issue</summary>

#### 🟡 MEDIUM L7: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/pathvalue/main.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'pathValueHandler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/rest/main.go</strong> — 65 issues</summary>

#### 🟡 MEDIUM L55: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L84: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'adminRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'ListArticles' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L115: Possible phantom function call: 'NewArticleListResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L116: Possible phantom function call: 'ErrRender' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'ArticleCtx' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L125: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L130: Possible phantom function call: 'dbGetArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L132: Possible phantom function call: 'dbGetArticleBySlug' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'SearchArticles' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L150: Possible phantom function call: 'NewArticleListResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L155: Possible phantom function call: 'CreateArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L158: Possible phantom function call: 'ErrInvalidRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L173: Possible phantom function call: 'GetArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L179: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L180: Possible phantom function call: 'ErrRender' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L186: Possible phantom function call: 'UpdateArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L191: Possible phantom function call: 'ErrInvalidRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L197: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L201: Possible phantom function call: 'DeleteArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L209: Possible phantom function call: 'dbRemoveArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L211: Possible phantom function call: 'ErrInvalidRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L219: Possible phantom function call: 'adminRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L222: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L223: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L225: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L226: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L228: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L235: Possible phantom function call: 'AdminOnly' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L236: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L248: Possible phantom function call: 'paginate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L249: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L258: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L259: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L295: Possible phantom function call: 'NewUserPayloadResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L360: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L364: Possible phantom function call: 'dbGetUser' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L365: Possible phantom function call: 'NewUserPayloadResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L378: Possible phantom function call: 'NewArticleListResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L381: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L381: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L415: Possible phantom function call: 'ErrInvalidRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L424: Possible phantom function call: 'ErrRender' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L469: Possible phantom function call: 'dbNewArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L471: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L475: Possible phantom function call: 'dbGetArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L484: Possible phantom function call: 'dbGetArticleBySlug' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L493: Possible phantom function call: 'dbUpdateArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L503: Possible phantom function call: 'dbRemoveArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L506: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L513: Possible phantom function call: 'dbGetUser' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L237: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L252: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L417: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L426: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>_examples/router-walk/main.go</strong> — 11 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'Ping' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/todos-resource/main.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L14: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/todos-resource/todos.go</strong> — 7 issues</summary>

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/todos-resource/users.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/versions/data/errors.go</strong> — 1 issue</summary>

#### 🟡 MEDIUM L16: Possible phantom function call: 'PresentError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/versions/main.go</strong> — 26 issues</summary>

#### 🟡 MEDIUM L22: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'apiVersionCtx' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'articleRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'apiVersionCtx' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'articleRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'apiVersionCtx' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'articleRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'apiVersionCtx' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'articleRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'listArticles' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'getArticle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L142: Possible phantom function call: 'randomErrorMiddleware' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L143: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L53: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L54: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L144: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>_examples/versions/presenter/v1/article.go</strong> — 1 issue</summary>

#### 🟡 MEDIUM L20: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/versions/presenter/v2/article.go</strong> — 1 issue</summary>

#### 🟡 MEDIUM L28: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>_examples/versions/presenter/v3/article.go</strong> — 1 issue</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'NewArticleResponse' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>chain.go</strong> — 9 issues</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'Chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L7: Possible phantom function call: 'Middlewares' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>chi.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L60: Possible phantom function call: 'NewRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'NewMux' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L137: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>context.go</strong> — 11 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'URLParam' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'RouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'URLParamFromCtx' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'RouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'RouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'replaceWildcards' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L139: Possible phantom function call: 'replaceWildcards' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L153: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L154: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>context_test.go</strong> — 6 issues</summary>

#### 🔴 **CRITICAL** L3: Potentially hallucinated package: 'testing' is not found in dependencies or node_modules

- **Detector:** deep-hallucination
- **Category:** hallucination
- **Fix:** Verify that 'testing' is a real npm package. If it exists, run 'npm install testing'. If not, it may be an AI hallucination.

#### 🟠 **HIGH** L3: Package 'testing' is imported but not listed in package.json dependencies

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'TestRoutePattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'TestReplaceWildcardsConsecutive' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'replaceWildcards' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'replaceWildcards' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/basic_auth.go</strong> — 9 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'BasicAuth' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'basicAuthFailed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/clean_path.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'CleanPath' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/compress.go</strong> — 29 issues</summary>

#### 🟡 MEDIUM L40: Possible phantom function call: 'Compress' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'NewCompressor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'NewCompressor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L162: Possible phantom function call: 'fn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L165: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'fn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L178: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L182: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L188: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'cleanup' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L219: Possible phantom function call: 'matchAcceptEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L222: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L230: Possible phantom function call: 'fn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L230: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L237: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L240: Possible phantom function call: 'matchAcceptEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L253: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L378: Possible phantom function call: 'encoderGzip' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L386: Possible phantom function call: 'encoderDeflate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L120: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🔵 LOW L167: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L189: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/compress_test.go</strong> — 30 issues</summary>

#### 🟡 MEDIUM L16: Possible phantom function call: 'TestCompressor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'NewCompressor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L99: Possible phantom function call: 'testRequestWithAcceptedEncodings' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L112: Possible phantom function call: 'TestCompressorWildcards' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L153: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L157: Possible phantom function call: 'recover' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L161: Possible phantom function call: 'NewCompressor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L162: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L165: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L172: Possible phantom function call: 'testRequestWithAcceptedEncodings' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L178: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L189: Possible phantom function call: 'decodeResponseBody' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L195: Possible phantom function call: 'decodeResponseBody' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L216: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L26: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L16: Function 'TestCompressor' is 95 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>middleware/content_charset.go</strong> — 12 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'ContentCharset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'contentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'contentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'split' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'split' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'split' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'split' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L18: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/content_charset_test.go</strong> — 12 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'TestContentCharset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'ContentCharset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L94: Possible phantom function call: 'TestSplit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'split' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'split' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L113: Possible phantom function call: 'TestContentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L116: Possible phantom function call: 'contentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L120: Possible phantom function call: 'contentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'contentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Function 'TestContentCharset' is 82 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>middleware/content_encoding.go</strong> — 7 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'AllowContentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L16: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/content_encoding_test.go</strong> — 5 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'TestContentEncodingMiddleware' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'AllowContentEncoding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/content_type.go</strong> — 14 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'SetHeader' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'AllowContentType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L27: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L28: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/content_type_test.go</strong> — 5 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'TestContentType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'AllowContentType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/get_head.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'GetHead' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/get_head_test.go</strong> — 19 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'TestGetHead' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L25: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/heartbeat.go</strong> — 5 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'Heartbeat' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/logger.go</strong> — 16 issues</summary>

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'Logger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'DefaultLogger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'RequestLogger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'NewWrapResponseWriter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'WithLogEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'GetLogEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'WithLogEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L107: Possible phantom function call: 'GetReqID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L171: Possible phantom function call: 'RequestLogger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L46: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/logger_test.go</strong> — 7 issues</summary>

#### 🟡 MEDIUM L21: Possible phantom function call: 'TestRequestLogger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'DefaultLogger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'TestRequestLoggerReadFrom' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'DefaultLogger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/maybe.go</strong> — 9 issues</summary>

#### 🟡 MEDIUM L8: Possible phantom function call: 'Maybe' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'maybeFn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L10: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/middleware.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L6: Possible phantom function call: 'New' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L6: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L7: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L8: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L8: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L9: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/middleware_test.go</strong> — 18 issues</summary>

#### 🟡 MEDIUM L17: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'TestWrapWriterHTTP2' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'NewWrapResponseWriter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'wmw' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L82: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L102: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L105: Possible phantom function call: 'testRequestNoRedirect' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L132: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L135: Possible phantom function call: 'assertNoError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L142: Possible phantom function call: 'assertError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'assertEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L49: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L116: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/nocache.go</strong> — 2 issues</summary>

#### 🟡 MEDIUM L40: Possible phantom function call: 'NoCache' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/page_route.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'PageRoute' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/path_rewrite.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'PathRewrite' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L12: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/profiler.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L23: Possible phantom function call: 'Profiler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/realip.go</strong> — 4 issues</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'RealIP' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'realIP' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'realIP' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/realip_test.go</strong> — 12 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'TestXRealIP' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'TestXForwardForIP' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'TestXForwardForXRealIPPrecedence' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L80: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'TestInvalidIP' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L102: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L104: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/recoverer.go</strong> — 15 issues</summary>

#### 🟡 MEDIUM L22: Possible phantom function call: 'Recoverer' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L25: Possible phantom function call: 'recover' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'GetLogEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'PrintPrettyStack' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L80: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L84: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L85: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L86: Possible phantom function call: 'panic' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L94: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L137: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L176: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/recoverer_test.go</strong> — 9 issues</summary>

#### 🟡 MEDIUM L13: Possible phantom function call: 'panickingHandler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'panic' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'TestRecoverer' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'TestRecovererAbortHandler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'recover' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/request_id.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L46: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'RequestID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Possible phantom function call: 'GetReqID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L94: Possible phantom function call: 'NextRequestID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/request_id_test.go</strong> — 12 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'maintainDefaultRequestID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'TestRequestID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'maintainDefaultRequestID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'GetReqID' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L16: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L33: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L43: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/request_size.go</strong> — 4 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'RequestSize' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/route_headers.go</strong> — 14 issues</summary>

#### 🟡 MEDIUM L42: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'NewPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'NewPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L111: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L135: Possible phantom function call: 'NewPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L145: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L145: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L79: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/route_headers_test.go</strong> — 38 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'TestRouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L69: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L90: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L95: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L100: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L106: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L121: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L126: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L132: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Possible phantom function call: 'RouteHeaders' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L165: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L170: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L187: Possible phantom function call: 'TestPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L205: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'NewPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L208: Possible phantom function call: 'Pattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Function 'TestRouteHeaders' is 176 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🔵 LOW L37: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L43: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L70: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L96: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L101: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L127: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L166: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/strip.go</strong> — 13 issues</summary>

#### 🟡 MEDIUM L14: Possible phantom function call: 'StripSlashes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'RedirectSlashes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'StripPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L75: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/strip_test.go</strong> — 76 issues</summary>

#### 🟡 MEDIUM L13: Possible phantom function call: 'TestStripSlashes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L25: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'TestStripSlashesInRoute' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L82: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L85: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L91: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L94: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L102: Possible phantom function call: 'TestRedirectSlashes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L109: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L111: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L115: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L118: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L119: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L121: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L133: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L137: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L142: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L146: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'testRequestNoRedirect' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L164: Possible phantom function call: 'testRequestNoRedirect' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L179: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L191: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'TestStripSlashesWithNilContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L207: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L210: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L211: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L214: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L218: Possible phantom function call: 'StripSlashes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L221: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L224: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L227: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L230: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L233: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L236: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L241: Possible phantom function call: 'TestStripPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L244: Possible phantom function call: 'StripPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L246: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L247: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L250: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L251: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L254: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L256: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L265: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L268: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L271: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L276: Possible phantom function call: 'TestRedirectSlashes_PreventBackslashRelativeOpenRedirect' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L277: Possible phantom function call: 'RedirectSlashes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L294: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L102: Function 'TestRedirectSlashes' is 98 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>middleware/sunset.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'Sunset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L13: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L14: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/sunset_test.go</strong> — 12 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'TestSunset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'Sunset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'Sunset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/supress_notfound.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L15: Possible phantom function call: 'SupressNotFound' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L17: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L18: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/terminal.go</strong> — 2 issues</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'init' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'cW' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/throttle.go</strong> — 19 issues</summary>

#### 🟡 MEDIUM L21: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'Throttle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'ThrottleWithOpts' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'ThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'ThrottleWithOpts' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'ThrottleWithOpts' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L86: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L140: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L150: Possible phantom function call: 'int' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L75: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/throttle_test.go</strong> — 38 issues</summary>

#### 🟡 MEDIUM L15: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'TestThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'ThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L58: Possible phantom function call: 'TestThrottleClientTimeout' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'ThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L80: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L90: Possible phantom function call: 'TestThrottleTriggerGatewayTimeout' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'ThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L95: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L113: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L144: Possible phantom function call: 'TestThrottleMaximum' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L147: Possible phantom function call: 'ThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L186: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L202: Possible phantom function call: 'TestThrottleRetryAfter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L204: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'ThrottleWithOpts' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L212: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L233: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L264: Possible phantom function call: 'TestThrottleCustomStatusCode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L267: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'ThrottleWithOpts' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L271: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L283: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L284: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L287: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L297: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L315: Possible phantom function call: 'BenchmarkThrottle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L316: Possible phantom function call: 'ThrottleBacklog' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L318: Possible phantom function call: 'throttleMiddleware' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L318: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/timeout.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L32: Possible phantom function call: 'Timeout' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L34: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/url_format.go</strong> — 2 issues</summary>

#### 🟡 MEDIUM L46: Possible phantom function call: 'URLFormat' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/url_format_test.go</strong> — 18 issues</summary>

#### 🟡 MEDIUM L11: Possible phantom function call: 'TestURLFormat' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'TestURLFormatInSubRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/value.go</strong> — 5 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'WithValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L9: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L11: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>middleware/wrap_writer.go</strong> — 3 issues</summary>

#### 🟡 MEDIUM L15: Possible phantom function call: 'NewWrapResponseWriter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L212: Possible phantom function call: 'int' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L218: Possible phantom function call: 'int' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>middleware/wrap_writer_test.go</strong> — 12 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'TestHttpFancyWriterRemembersWroteHeaderWhenFlushed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'TestHttp2FancyWriterRemembersWroteHeaderWhenFlushed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'TestBasicWritesTeesWritesWithoutDiscard' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'TestBasicWriterDiscardsWritesToOriginalResponseWriter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>mux.go</strong> — 28 issues</summary>

#### 🟡 MEDIUM L43: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'NewMux' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L104: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'Chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L208: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L223: Possible phantom function call: 'Chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L228: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L246: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L246: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L249: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L276: Possible phantom function call: 'NewRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L309: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L310: Possible phantom function call: 'RouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L316: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L317: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L324: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L411: Possible phantom function call: 'methodNotAllowedHandler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L417: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L430: Possible phantom function call: 'Chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L489: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L490: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L512: Possible phantom function call: 'chain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L518: Possible phantom function call: 'methodNotAllowedHandler' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L518: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L519: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L520: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>path_value_test.go</strong> — 8 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'TestPathValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'NewRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L10: Function 'TestPathValue' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

</details>

<details>
<summary><strong>pattern_test.go</strong> — 6 issues</summary>

#### 🟡 MEDIUM L12: Possible phantom function call: 'TestPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'NewRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'byte' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'testRequest' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>tree.go</strong> — 74 issues</summary>

#### 🟡 MEDIUM L61: Possible phantom function call: 'RegisterMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L69: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'methodTyp' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L145: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L159: Possible phantom function call: 'patNextSegment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L192: Possible phantom function call: 'longestPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L193: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L214: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L243: Possible phantom function call: 'patNextSegment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L274: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L278: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L314: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L320: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L347: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L350: Possible phantom function call: 'patParamKeys' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L387: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L388: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L393: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L406: Possible phantom function call: 'nodeTyp' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L407: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L425: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L440: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L457: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L458: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L461: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L465: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L473: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L493: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L497: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L507: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L511: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L519: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L536: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L537: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L548: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L581: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L595: Possible phantom function call: 'longestPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L596: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L604: Possible phantom function call: 'longestPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L611: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L623: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L629: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L644: Possible phantom function call: 'make' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L659: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L670: Possible phantom function call: 'fn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L687: Possible phantom function call: 'patNextSegment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L692: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L727: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L736: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L740: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L749: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L752: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L755: Possible phantom function call: 'patParamKeys' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L759: Possible phantom function call: 'patNextSegment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L763: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L768: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L774: Possible phantom function call: 'longestPrefix' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L775: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L775: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L788: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L788: Possible phantom function call: 'Swap' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L794: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L796: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L803: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L831: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L834: Possible phantom function call: 'Walk' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L835: Possible phantom function call: 'walk' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L838: Possible phantom function call: 'walk' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L845: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L849: Possible phantom function call: 'walk' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L865: Possible phantom function call: 'walkFn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L865: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L869: Possible phantom function call: 'walkFn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L663: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>tree_test.go</strong> — 130 issues</summary>

#### 🟡 MEDIUM L10: Possible phantom function call: 'TestTree' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L11: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L12: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L14: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L16: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L19: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L22: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L25: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L27: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'NewRouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L130: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L145: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L146: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L146: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L148: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L154: Possible phantom function call: 'TestTreeMoar' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L155: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L156: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L157: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L158: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L159: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L161: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L162: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L164: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L165: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L167: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L168: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L169: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L170: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L171: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L246: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L261: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L264: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L265: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L265: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'TestTreeRegexp' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L271: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L272: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L273: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L274: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L275: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L276: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L277: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L312: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L327: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L328: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L328: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L330: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L331: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L331: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L336: Possible phantom function call: 'TestTreeRegexpRecursive' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L337: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L338: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L363: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L378: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L379: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L379: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L381: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L382: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L382: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L387: Possible phantom function call: 'TestTreeRegexMatchWholeParam' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L388: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L390: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L417: Possible phantom function call: 'TestTreeFindPattern' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L418: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L419: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L420: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L447: Possible phantom function call: 'debugPrintTree' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L450: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L459: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L459: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L461: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L461: Possible phantom function call: 'string' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L467: Possible phantom function call: 'debugPrintTree' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L475: Possible phantom function call: 'stringSliceEqual' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L476: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L476: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L487: Possible phantom function call: 'BenchmarkTreeGet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L488: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L489: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L501: Possible phantom function call: 'NewRouteContext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L512: Possible phantom function call: 'TestWalker' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L513: Possible phantom function call: 'bigMux' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L516: Possible phantom function call: 'Walk' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L516: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L525: Possible phantom function call: 'TestWalkInlineMiddlewaresAcrossSubrouter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L526: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L527: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L531: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L536: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L537: Possible phantom function call: 'NewMux' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L538: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L539: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L549: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L550: Possible phantom function call: 'NewMux' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L551: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L552: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L564: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L567: Possible phantom function call: 'Walk' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L567: Possible phantom function call: 'func' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L568: Possible phantom function call: 'len' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L173: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L194: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L525: Function 'TestWalkInlineMiddlewaresAcrossSubrouter' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L520: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L544: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L558: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L570: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L10: Function 'TestTree' is 143 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L154: Function 'TestTreeMoar' is 115 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary>📋 File Scores</summary>

| File | Score | Grade | AI Faith. | Freshness | Coherence | Quality |
|------|-------|-------|-----------|-----------|-----------|---------|
| `_examples/custom-handler/main.go` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `_examples/custom-method/main.go` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `_examples/fileserver/main.go` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `_examples/graceful/main.go` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `_examples/hello-world/main.go` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `_examples/limits/main.go` | 76/100 | 🟡 C | 10.5/35 | 25/25 | 20/20 | 20/20 |
| `_examples/logging/main.go` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `_examples/pathvalue/main.go` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `_examples/rest/main.go` | 63/100 | 🟠 D | 0/35 | 25/25 | 18.4/20 | 20/20 |
| `_examples/router-walk/main.go` | 81/100 | 🔵 B | 15.75/35 | 25/25 | 20/20 | 20/20 |
| `_examples/todos-resource/main.go` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `_examples/todos-resource/todos.go` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `_examples/todos-resource/users.go` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `_examples/versions/data/errors.go` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `_examples/versions/main.go` | 64/100 | 🟠 D | 0/35 | 25/25 | 18.8/20 | 20/20 |
| `_examples/versions/presenter/v1/article.go` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `_examples/versions/presenter/v2/article.go` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `_examples/versions/presenter/v3/article.go` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `chain.go` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |
| `chi.go` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `context.go` | 81/100 | 🔵 B | 15.75/35 | 25/25 | 20/20 | 20/20 |
| `context_test.go` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |
| `middleware/basic_auth.go` | 87/100 | 🔵 B | 22.75/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/clean_path.go` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/compress.go` | 62/100 | 🟠 D | 0/35 | 25/25 | 19.2/20 | 18/20 |
| `middleware/compress_test.go` | 64/100 | 🟠 D | 0/35 | 25/25 | 19.6/20 | 19.6/20 |
| `middleware/content_charset.go` | 82/100 | 🔵 B | 17.5/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/content_charset_test.go` | 80/100 | 🔵 B | 15.75/35 | 25/25 | 20/20 | 19.6/20 |
| `middleware/content_encoding.go` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/content_encoding_test.go` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `middleware/content_type.go` | 81/100 | 🔵 B | 17.5/35 | 25/25 | 18.4/20 | 20/20 |
| `middleware/content_type_test.go` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `middleware/get_head.go` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/get_head_test.go` | 67/100 | 🟠 D | 1.75/35 | 25/25 | 20/20 | 20/20 |
| `middleware/heartbeat.go` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `middleware/logger.go` | 73/100 | 🟡 C | 8.75/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/logger_test.go` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `middleware/maybe.go` | 87/100 | 🔵 B | 22.75/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/middleware.go` | 92/100 | 🟢 A | 28/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/middleware_test.go` | 71/100 | 🟡 C | 7/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/nocache.go` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `middleware/page_route.go` | 92/100 | 🟢 A | 28/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/path_rewrite.go` | 92/100 | 🟢 A | 28/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/profiler.go` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `middleware/realip.go` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `middleware/realip_test.go` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `middleware/recoverer.go` | 74/100 | 🟡 C | 8.75/35 | 25/25 | 20/20 | 20/20 |
| `middleware/recoverer_test.go` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |
| `middleware/request_id.go` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `middleware/request_id_test.go` | 83/100 | 🔵 B | 19.25/35 | 25/25 | 18.8/20 | 20/20 |
| `middleware/request_size.go` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `middleware/route_headers.go` | 77/100 | 🟡 C | 12.25/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/route_headers_test.go` | 61/100 | 🟠 D | 0/35 | 25/25 | 17.2/20 | 19/20 |
| `middleware/strip.go` | 79/100 | 🟡 C | 14/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/strip_test.go` | 65/100 | 🟠 D | 0/35 | 25/25 | 20/20 | 19.6/20 |
| `middleware/sunset.go` | 92/100 | 🟢 A | 28/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/sunset_test.go` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `middleware/supress_notfound.go` | 92/100 | 🟢 A | 28/35 | 25/25 | 19.2/20 | 20/20 |
| `middleware/terminal.go` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `middleware/throttle.go` | 68/100 | 🟠 D | 3.5/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/throttle_test.go` | 65/100 | 🟠 D | 0/35 | 25/25 | 20/20 | 20/20 |
| `middleware/timeout.go` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/url_format.go` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `middleware/url_format_test.go` | 69/100 | 🟠 D | 3.5/35 | 25/25 | 20/20 | 20/20 |
| `middleware/value.go` | 93/100 | 🟢 A | 28/35 | 25/25 | 19.6/20 | 20/20 |
| `middleware/wrap_writer.go` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `middleware/wrap_writer_test.go` | 79/100 | 🟡 C | 14/35 | 25/25 | 20/20 | 20/20 |
| `mux.go` | 65/100 | 🟠 D | 0/35 | 25/25 | 19.6/20 | 20/20 |
| `path_value_test.go` | 87/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 19/20 |
| `pattern_test.go` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `tree.go` | 65/100 | 🟠 D | 0/35 | 25/25 | 19.6/20 | 20/20 |
| `tree_test.go` | 60/100 | 🟠 D | 0/35 | 25/25 | 18.4/20 | 16.2/20 |

</details>

---
*Powered by [Open Code Review](https://github.com/raye-deng/open-code-review) v0.3.0*