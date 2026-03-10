## 🔴 Open Code Review Report — moshi

> 🕐 2026-03-10T17:54:19.297Z · ⏱️ 0.2s · 📁 78 files · 🌐 kotlin

### Overall: 8/100 (Grade F) ❌ FAILED

| Metric | Value |
|--------|-------|
| Files Scanned | 65 |
| Files Passed | 43 |
| Files Failed | 22 |
| Issues Found | 1497 |
| Threshold | 70 |

### 📊 Scoring Dimensions

| Dimension | Score | Bar | Issues |
|-----------|-------|-----|--------|
| AI Faithfulness | 0/35 | ░░░░░░░░░░ 0% | 1145 |
| Code Freshness | 7.5/25 | ███░░░░░░░ 30% | 7 |
| Context Coherence | 0/20 | ░░░░░░░░░░ 0% | 211 |
| Implementation Quality | 0/20 | ░░░░░░░░░░ 0% | 134 |

### ⚠️ Issue Summary

| Severity | Count |
|----------|-------|
| 🟠 **HIGH** | 12 |
| 🟡 MEDIUM | 1279 |
| 🔵 LOW | 206 |

### 📁 Issues by File

<details>
<summary><strong>build.gradle.kts</strong> — 5 issues</summary>

#### 🟡 MEDIUM L13: Possible phantom function call: 'classpath' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L13: Possible phantom function call: 'kotlin' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'mavenCentral' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L155: Possible phantom function call: 'publishToMavenCentral' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L126: Function 'withId' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

</details>

<details>
<summary><strong>moshi/build.gradle.kts</strong> — 3 issues</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'attributes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'jvmArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'attributes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/japicmp/build.gradle.kts</strong> — 10 issues</summary>

#### 🟡 MEDIUM L14: Possible phantom function call: 'strictly' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'indent' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'hasNullable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'jsonAnnotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'jsonAnnotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'jsonName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'jsonName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'typeAnnotatedWithAnnotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'typesMatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'dependsOn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/-JsonUtf8Reader.kt</strong> — 207 issues</summary>

#### 🟠 **HIGH** L999: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟠 **HIGH** L996: Function 'nextSource' has nesting depth of 7 (threshold: 6)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Use early returns, guard clauses, or extract nested blocks into separate functions.

#### 🟡 MEDIUM L80: Possible phantom function call: 'beginArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L91: Possible phantom function call: 'endArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L92: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L102: Possible phantom function call: 'beginObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L112: Possible phantom function call: 'endObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L113: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L120: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L120: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'hasNext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L125: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L129: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L130: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L130: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L159: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Possible phantom function call: 'doPeek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L170: Possible phantom function call: 'nextNonWhitespace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L174: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L177: Possible phantom function call: 'checkLenient' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L182: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L191: Possible phantom function call: 'nextNonWhitespace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L195: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L201: Possible phantom function call: 'checkLenient' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L207: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L207: Possible phantom function call: 'nextNonWhitespace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L224: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L232: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L243: Possible phantom function call: 'nextNonWhitespace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L256: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L263: Possible phantom function call: 'nextNonWhitespace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L264: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L274: Possible phantom function call: 'doPeek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L277: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L282: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L294: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L301: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L308: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L314: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L319: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L324: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L329: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L334: Possible phantom function call: 'peekKeyword' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L338: Possible phantom function call: 'peekNumber' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L343: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L346: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L349: Possible phantom function call: 'peekKeyword' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L398: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L401: Possible phantom function call: 'peekNumber' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L411: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L472: Possible phantom function call: 'allowed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L515: Possible phantom function call: 'isLiteral' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L516: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L544: Possible phantom function call: 'nextName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L547: Possible phantom function call: 'nextUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L549: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L551: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L559: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L559: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L567: Possible phantom function call: 'selectName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L568: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L573: Possible phantom function call: 'findName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L585: Possible phantom function call: 'nextName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L586: Possible phantom function call: 'findName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L597: Possible phantom function call: 'skipName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L600: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L602: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L604: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L606: Possible phantom function call: 'skipUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L608: Possible phantom function call: 'skipQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L610: Possible phantom function call: 'skipQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L613: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L613: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L623: Possible phantom function call: 'findName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L634: Possible phantom function call: 'nextString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L637: Possible phantom function call: 'nextUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L639: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L641: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L653: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L653: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L660: Possible phantom function call: 'selectString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L661: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L666: Possible phantom function call: 'findString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L674: Possible phantom function call: 'nextString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L675: Possible phantom function call: 'findString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L688: Possible phantom function call: 'findString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L699: Possible phantom function call: 'nextBoolean' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L700: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L700: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L713: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L713: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L717: Possible phantom function call: 'nextNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L718: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L724: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L724: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L728: Possible phantom function call: 'nextDouble' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L729: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L739: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L741: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L743: Possible phantom function call: 'nextUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L750: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L750: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L757: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L760: Possible phantom function call: 'JsonEncodingException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L768: Possible phantom function call: 'nextLong' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L769: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L796: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L796: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L802: Possible phantom function call: 'BigDecimal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L805: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L807: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L822: Possible phantom function call: 'nextQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L826: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L830: Possible phantom function call: 'StringBuilder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L833: Possible phantom function call: 'readEscapeCharacter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L851: Possible phantom function call: 'nextUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L856: Possible phantom function call: 'skipQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L859: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L870: Possible phantom function call: 'skipUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L875: Possible phantom function call: 'nextInt' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L876: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L880: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L917: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L917: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L924: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L928: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L936: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L944: Possible phantom function call: 'skipValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L946: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L946: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L964: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L964: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L972: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L972: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L978: Possible phantom function call: 'skipUnquotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L981: Possible phantom function call: 'skipQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L984: Possible phantom function call: 'skipQuotedValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L988: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L988: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L996: Possible phantom function call: 'nextSource' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L997: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1026: Possible phantom function call: 'nextString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1035: Possible phantom function call: 'nextString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1039: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1039: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1047: Possible phantom function call: 'JsonValueSource' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1057: Possible phantom function call: 'nextNonWhitespace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1083: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1089: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1121: Possible phantom function call: 'EOFException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1126: Possible phantom function call: 'checkLenient' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1128: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1136: Possible phantom function call: 'skipToEndOfLine' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1142: Possible phantom function call: 'skipToEndOfBlockComment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1149: Possible phantom function call: 'peekJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1151: Possible phantom function call: 'JsonReader' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1160: Possible phantom function call: 'readEscapeCharacter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1162: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1164: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1167: Possible phantom function call: 'EOFException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1174: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1178: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1209: Possible phantom function call: 'promoteNameToValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1211: Possible phantom function call: 'nextName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1217: Possible phantom function call: 'peekIfNone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1219: Possible phantom function call: 'doPeek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L1223: Possible phantom function call: 'setPeeked' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L756: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L790: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L804: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L806: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L906: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L923: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L77: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L401: Function 'peekNumber' has cyclomatic complexity of 20 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L401: Function 'peekNumber' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L407: Function 'while' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L944: Function 'skipValue' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L996: Function 'nextSource' is 276 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L1057: Function 'nextNonWhitespace' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L131: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L265: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L283: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L302: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L494: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L517: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L626: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L691: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L701: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L720: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L790: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L806: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L839: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L906: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L1084: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L1165: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L401: Function 'peekNumber' is 112 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L407: Function 'while' is 84 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/-JsonUtf8Writer.kt</strong> — 60 issues</summary>

#### 🟠 **HIGH** L43: Function 'JsonWriter' has cyclomatic complexity of 45 (threshold: 25)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Refactor into smaller functions. AI often generates monolithic functions with too many branches.

#### 🟡 MEDIUM L43: Possible phantom function call: 'JsonWriter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'beginArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'open' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'endArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'beginObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'open' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'endObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L76: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L80: Possible phantom function call: 'open' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L99: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L100: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L118: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L119: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L130: Possible phantom function call: 'writeDeferredName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L138: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L140: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L144: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L167: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L175: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L177: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L180: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L184: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L190: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L198: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L201: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L209: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L211: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L219: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L227: Possible phantom function call: 'valueSink' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L233: Possible phantom function call: 'write' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L237: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L238: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L239: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L245: Possible phantom function call: 'flush' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L247: Possible phantom function call: 'timeout' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L253: Possible phantom function call: 'flush' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L254: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L263: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L267: Possible phantom function call: 'IOException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L272: Possible phantom function call: 'newline' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L282: Possible phantom function call: 'beforeName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L283: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L287: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L300: Possible phantom function call: 'beforeValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L327: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L327: Possible phantom function call: 'valueSink' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L329: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L344: Possible phantom function call: 'arrayOfNulls' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L185: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L43: Function 'JsonWriter' is 354 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L43: Function 'JsonWriter' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L177: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L233: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L329: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/-JsonValueReader.kt</strong> — 74 issues</summary>

#### 🟠 **HIGH** L311: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟡 MEDIUM L47: Possible phantom function call: 'arrayOfNulls' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'beginArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'endArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Possible phantom function call: 'beginObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L95: Possible phantom function call: 'endObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L98: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L104: Possible phantom function call: 'hasNext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L131: Possible phantom function call: 'ifNotClosed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L131: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L135: Possible phantom function call: 'nextName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L139: Possible phantom function call: 'stringKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L145: Possible phantom function call: 'selectName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L147: Possible phantom function call: 'stringKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L159: Possible phantom function call: 'skipName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L162: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L164: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L173: Possible phantom function call: 'nextString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L174: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L185: Possible phantom function call: 'ifNotClosed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L185: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L189: Possible phantom function call: 'selectString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'nextBoolean' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L209: Possible phantom function call: 'nextNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'nextDouble' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L217: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L224: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L233: Possible phantom function call: 'JsonEncodingException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L239: Possible phantom function call: 'nextLong' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L241: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L251: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L255: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L261: Possible phantom function call: 'nextInt' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L263: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L273: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L277: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L283: Possible phantom function call: 'skipValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L285: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L285: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L295: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L295: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L305: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L305: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L309: Possible phantom function call: 'nextSource' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L310: Possible phantom function call: 'readJsonValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L316: Possible phantom function call: 'peekJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L318: Possible phantom function call: 'promoteNameToValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L320: Possible phantom function call: 'nextName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L325: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L332: Possible phantom function call: 'push' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L335: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L348: Possible phantom function call: 'requireNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L365: Possible phantom function call: 'stringKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L368: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L371: Possible phantom function call: 'ifNotClosed' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L372: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L373: Possible phantom function call: 'body' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L380: Possible phantom function call: 'remove' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L397: Possible phantom function call: 'hasNext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L402: Possible phantom function call: 'clone' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L407: Possible phantom function call: 'Any' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L223: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L247: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L250: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L269: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L272: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L345: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🔵 LOW L115: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L175: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/-JsonValueWriter.kt</strong> — 57 issues</summary>

#### 🟠 **HIGH** L208: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟠 **HIGH** L34: Function 'JsonWriter' has cyclomatic complexity of 35 (threshold: 25)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Refactor into smaller functions. AI often generates monolithic functions with too many branches.

#### 🟡 MEDIUM L34: Possible phantom function call: 'JsonWriter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'root' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'beginArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'endArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'beginObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L92: Possible phantom function call: 'endObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L94: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L109: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L118: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L121: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L135: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L142: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L167: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L170: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L177: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L179: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L185: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L189: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L193: Possible phantom function call: 'BigDecimal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L196: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L204: Possible phantom function call: 'valueSink' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'valueSink' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L209: Possible phantom function call: 'ForwardingSink' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L210: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L211: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L212: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L232: Possible phantom function call: 'IOException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L237: Possible phantom function call: 'flush' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L238: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L241: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L242: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L245: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L255: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'valueSink' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L272: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L150: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L34: Function 'JsonWriter' is 243 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L34: Function 'JsonWriter' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L210: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L272: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/-MoshiKotlinExtensions.kt</strong> — 1 issue</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'adapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/-MoshiKotlinTypesExtensions.kt</strong> — 6 issues</summary>

#### 🟡 MEDIUM L43: Possible phantom function call: 'subtypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'subtypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'subtypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'supertypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'supertypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'supertypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/JsonAdapter.kt</strong> — 45 issues</summary>

#### 🟠 **HIGH** L65: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟠 **HIGH** L85: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟡 MEDIUM L54: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L84: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L89: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L104: Possible phantom function call: 'toJsonValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L119: Possible phantom function call: 'fromJsonValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L133: Possible phantom function call: 'serializeNulls' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L136: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L138: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'nullSafe' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L162: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L164: Possible phantom function call: 'NullSafeJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L176: Possible phantom function call: 'nonNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L184: Possible phantom function call: 'NonNullJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L194: Possible phantom function call: 'unsafeNonNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L201: Possible phantom function call: 'lenient' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L204: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L214: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L237: Possible phantom function call: 'failOnUnknown' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L240: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L250: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'indent' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L273: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L277: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L307: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L109: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L123: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L107: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L122: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L136: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L163: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L204: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L208: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L240: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L244: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L273: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/JsonEncodingException.kt</strong> — 1 issue</summary>

#### 🟡 MEDIUM L21: Possible phantom function call: 'IOException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/JsonReader.kt</strong> — 40 issues</summary>

#### 🟠 **HIGH** L573: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟡 MEDIUM L229: Possible phantom function call: 'IntArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L230: Possible phantom function call: 'arrayOfNulls' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L231: Possible phantom function call: 'IntArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L243: Possible phantom function call: 'pushScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L246: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L261: Possible phantom function call: 'syntaxError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'JsonEncodingException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L265: Possible phantom function call: 'typeMismatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L318: Possible phantom function call: 'selectName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L342: Possible phantom function call: 'selectString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L447: Possible phantom function call: 'readJsonValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L448: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L448: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L463: Possible phantom function call: 'nextName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L464: Possible phantom function call: 'readJsonValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L465: Possible phantom function call: 'put' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L467: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L476: Possible phantom function call: 'nextString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L478: Possible phantom function call: 'nextDouble' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L480: Possible phantom function call: 'nextBoolean' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L484: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L484: Possible phantom function call: 'peek' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L518: Possible phantom function call: 'getPath' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L522: Possible phantom function call: 'tag' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L528: Possible phantom function call: 'setTag' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L560: Possible phantom function call: 'strings' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L561: Possible phantom function call: 'buildList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L577: Possible phantom function call: 'quote' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L582: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L581: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L529: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L447: Function 'readJsonValue' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L267: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L449: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L451: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L461: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L468: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L562: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L573: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/JsonWriter.kt</strong> — 25 issues</summary>

#### 🟡 MEDIUM L213: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L214: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L219: Possible phantom function call: 'checkStack' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L222: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L233: Possible phantom function call: 'pushScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L238: Possible phantom function call: 'replaceTop' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L345: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L370: Possible phantom function call: 'jsonValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L391: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L393: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L395: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L397: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L399: Possible phantom function call: 'value' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L401: Possible phantom function call: 'nullValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L403: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L426: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L427: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L480: Possible phantom function call: 'beginFlatten' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L481: Possible phantom function call: 'peekScope' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L496: Possible phantom function call: 'endFlatten' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L502: Possible phantom function call: 'tag' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L508: Possible phantom function call: 'setTag' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L376: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L370: Function 'jsonValue' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L150: Naming convention inconsistency: file predominantly uses camelCase

- **Detector:** context-break
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/Moshi.kt</strong> — 49 issues</summary>

#### 🟠 **HIGH** L45: Function 'constructor' has cyclomatic complexity of 59 (threshold: 25)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Refactor into smaller functions. AI often generates monolithic functions with too many branches.

#### 🟡 MEDIUM L93: Possible phantom function call: 'emptySet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L105: Possible phantom function call: 'emptySet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L134: Possible phantom function call: 'cacheKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L171: Possible phantom function call: 'nextAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L184: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L191: Possible phantom function call: 'newBuilder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'cacheKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L204: Possible phantom function call: 'listOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L212: Possible phantom function call: 'addAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L218: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L221: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L225: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L225: Possible phantom function call: 'newAdapterFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L227: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L231: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L231: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L231: Possible phantom function call: 'AdapterMethodsFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L234: Possible phantom function call: 'addLast' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L239: Possible phantom function call: 'addLast' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L243: Possible phantom function call: 'addLast' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L243: Possible phantom function call: 'newAdapterFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L245: Possible phantom function call: 'addLast' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L248: Possible phantom function call: 'addLast' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L248: Possible phantom function call: 'addLast' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L248: Possible phantom function call: 'AdapterMethodsFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L281: Possible phantom function call: 'push' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L299: Possible phantom function call: 'adapterFound' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L309: Possible phantom function call: 'pop' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L327: Possible phantom function call: 'exceptionWithLookupStack' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L344: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L353: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L353: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L355: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L355: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L357: Possible phantom function call: 'withAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L375: Possible phantom function call: 'newAdapterFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L381: Possible phantom function call: 'newAdapterFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L178: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L45: Function 'constructor' is 361 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L45: Function 'constructor' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L161: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L165: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L185: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L377: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L393: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/Types.kt</strong> — 45 issues</summary>

#### 🟡 MEDIUM L49: Possible phantom function call: 'generatedJsonAdapterName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'generatedJsonAdapterName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'generatedJsonAdapterName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L76: Possible phantom function call: 'nextAnnotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'LinkedHashSet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'newParameterizedType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'ParameterizedTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L111: Possible phantom function call: 'newParameterizedTypeWithOwner' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'ParameterizedTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L122: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L123: Possible phantom function call: 'GenericArrayTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L132: Possible phantom function call: 'subtypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L139: Possible phantom function call: 'WildcardTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L147: Possible phantom function call: 'supertypeOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L154: Possible phantom function call: 'WildcardTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L158: Possible phantom function call: 'getRawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L159: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L175: Possible phantom function call: 'getRawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L185: Possible phantom function call: 'getRawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L189: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L202: Possible phantom function call: 'collectionElementType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'getSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L216: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L218: Possible phantom function call: 'handles' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L259: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L290: Possible phantom function call: 'getFieldJsonQualifierAnnotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L295: Possible phantom function call: 'buildSet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L307: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L306: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L80: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L216: Function 'equals' has cyclomatic complexity of 21 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L221: Function 'when' has cyclomatic complexity of 17 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🔵 LOW L160: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L190: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L208: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L224: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L228: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L237: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L253: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L268: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L296: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L308: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/AdapterMethodsFactory.kt</strong> — 61 issues</summary>

#### 🟡 MEDIUM L36: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L80: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L90: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L96: Possible phantom function call: 'annotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'invoke' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L105: Possible phantom function call: 'generateSequence' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'toAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L118: Possible phantom function call: 'fromAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L138: Possible phantom function call: 'toAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L164: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L188: Possible phantom function call: 'bind' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L201: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L202: Possible phantom function call: 'invokeMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L208: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L212: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L213: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L214: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L224: Possible phantom function call: 'parametersAreJsonAdapters' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L237: Possible phantom function call: 'fromAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'invokeMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L282: Possible phantom function call: 'bind' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L295: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L297: Possible phantom function call: 'invokeMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L303: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L307: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L308: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L309: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L343: Possible phantom function call: 'arrayOfNulls' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L345: Possible phantom function call: 'bind' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L362: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L362: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L364: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L364: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L367: Possible phantom function call: 'invokeMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L375: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L380: Possible phantom function call: 'invokeMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L389: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L69: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L87: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L374: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L388: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L128: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L36: Function 'create' has cyclomatic complexity of 19 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L36: Function 'create' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L101: Function 'invoke' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L48: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L60: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L80: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L151: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L209: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L249: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L304: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L373: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L387: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/ArrayJsonAdapter.kt</strong> — 4 issues</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L111: Possible phantom function call: 'arrayComponentType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/ClassFactory.kt</strong> — 23 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'newInstance' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'newInstance' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L92: Possible phantom function call: 'newInstance' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'newInstance' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L123: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L64: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L66: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L68: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L70: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L96: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L98: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L100: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L40: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L59: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L66: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L91: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L98: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L100: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L116: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L34: Function 'get' is 91 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/ClassJsonAdapter.kt</strong> — 28 issues</summary>

#### 🟡 MEDIUM L56: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L82: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L86: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L95: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L99: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L102: Possible phantom function call: 'read' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'write' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L115: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L134: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L143: Possible phantom function call: 'isStatic' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L159: Possible phantom function call: 'getGenericSuperclass' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L175: Possible phantom function call: 'createFieldBindings' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'includeField' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L207: Possible phantom function call: 'isStatic' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L207: Possible phantom function call: 'isTransient' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L62: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L64: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L81: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L94: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L139: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🔵 LOW L62: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L64: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L81: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L135: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L208: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/CollectionJsonAdapter.kt</strong> — 16 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'newCollection' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'newCollection' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'newArrayListAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'newCollection' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'ArrayList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'newLinkedHashSetAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'newCollection' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'LinkedHashSet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L28: Function 'constructor' has cyclomatic complexity of 16 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🔵 LOW L57: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L77: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L88: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/JsonScope.kt</strong> — 3 issues</summary>

#### 🟡 MEDIUM L56: Possible phantom function call: 'getPath' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L67: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L63: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/JsonValueSource.kt</strong> — 14 issues</summary>

#### 🟠 **HIGH** L40: Deprecated API usage: 'Buffer()' (deprecated since Node.js 6.0)

- **Detector:** stale-api
- **Category:** stale-knowledge
- **Fix:** Replace with: Buffer.from() or Buffer.alloc()

#### 🟡 MEDIUM L68: Possible phantom function call: 'advanceLimit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L176: Possible phantom function call: 'discard' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L184: Possible phantom function call: 'read' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L194: Possible phantom function call: 'read' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L199: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L208: Possible phantom function call: 'timeout' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L210: Possible phantom function call: 'close' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L68: Function 'advanceLimit' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L69: Function 'while' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L68: Function 'advanceLimit' is 103 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L69: Function 'while' is 101 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/KotlinReflectTypes.kt</strong> — 29 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'computeJavaType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'createPossiblyInnerType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'UnsupportedOperationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L69: Possible phantom function call: 'createPossiblyInnerType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'ParameterizedTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'ParameterizedTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'ParameterizedTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'createPossiblyInnerType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'WildcardTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'WildcardTypeImpl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'getName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L126: Possible phantom function call: 'getGenericDeclaration' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'getGenericDeclaration' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L131: Possible phantom function call: 'getBounds' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L134: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L137: Possible phantom function call: 'hashCode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L100: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L103: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L20: Function 'is' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L32: Function 'computeJavaType' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L51: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L80: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L88: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L102: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/LinkedHashTreeMap.kt</strong> — 101 issues</summary>

#### 🟡 MEDIUM L22: Possible phantom function call: 'arrayOfNulls' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'put' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'findOrCreate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'findByObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'containsKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'findByObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'clear' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'remove' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'removeInternalByKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L112: Possible phantom function call: 'setValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L118: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L120: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L127: Possible phantom function call: 'hashCode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L134: Possible phantom function call: 'first' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L145: Possible phantom function call: 'last' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L156: Possible phantom function call: 'doubleCapacity' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L157: Possible phantom function call: 'doubleCapacity' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'findOrCreate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L167: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L167: Possible phantom function call: 'find' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L175: Possible phantom function call: 'find' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L178: Possible phantom function call: 'secondaryHash' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L179: Possible phantom function call: 'and' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L189: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L190: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L199: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L199: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'ClassCastException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L217: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L220: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L235: Possible phantom function call: 'findByObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L251: Possible phantom function call: 'findByEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L252: Possible phantom function call: 'findByObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L253: Possible phantom function call: 'equal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L257: Possible phantom function call: 'equal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L267: Possible phantom function call: 'secondaryHash' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'xor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'xor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L271: Possible phantom function call: 'xor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L271: Possible phantom function call: 'xor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L279: Possible phantom function call: 'removeInternal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L281: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L282: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L333: Possible phantom function call: 'removeInternalByKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L334: Possible phantom function call: 'findByObject' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L341: Possible phantom function call: 'replaceInParent' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L351: Possible phantom function call: 'assert' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L355: Possible phantom function call: 'and' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L366: Possible phantom function call: 'rebalance' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L382: Possible phantom function call: 'assert' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L398: Possible phantom function call: 'assert' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L415: Possible phantom function call: 'assert' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L427: Possible phantom function call: 'rotateLeft' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L451: Possible phantom function call: 'rotateRight' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L479: Possible phantom function call: 'hasNext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L481: Possible phantom function call: 'nextNode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L484: Possible phantom function call: 'NoSuchElementException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L487: Possible phantom function call: 'ConcurrentModificationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L493: Possible phantom function call: 'remove' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L504: Possible phantom function call: 'iterator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L508: Possible phantom function call: 'nextNode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L513: Possible phantom function call: 'contains' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L514: Possible phantom function call: 'findByEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L517: Possible phantom function call: 'remove' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L521: Possible phantom function call: 'findByEntry' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L526: Possible phantom function call: 'clear' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L530: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L531: Possible phantom function call: 'NotImplementedError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L539: Possible phantom function call: 'iterator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L542: Possible phantom function call: 'nextNode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L542: Possible phantom function call: 'NoSuchElementException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L547: Possible phantom function call: 'contains' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L548: Possible phantom function call: 'containsKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L551: Possible phantom function call: 'remove' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L552: Possible phantom function call: 'removeInternalByKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L555: Possible phantom function call: 'clear' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L559: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L560: Possible phantom function call: 'NotImplementedError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L569: Possible phantom function call: 'writeReplace' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L569: Possible phantom function call: 'LinkedHashMap' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L576: Possible phantom function call: 'doubleCapacity' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L596: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L610: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L611: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L613: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L636: Possible phantom function call: 'reset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L684: Possible phantom function call: 'reset' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L693: Possible phantom function call: 'add' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L730: Possible phantom function call: 'and' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L767: Possible phantom function call: 'root' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L769: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L238: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L22: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L577: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🔵 LOW L122: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L237: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L319: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L506: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L541: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L101: Function 'constructor' has 8 parameters (threshold: 5)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using an options object to group related parameters.

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/MapJsonAdapter.kt</strong> — 9 issues</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'mapKeyAndValueTypes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L62: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/NonNullJsonAdapter.kt</strong> — 7 issues</summary>

#### 🟡 MEDIUM L24: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L26: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L27: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L35: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/NullSafeJsonAdapter.kt</strong> — 3 issues</summary>

#### 🟡 MEDIUM L23: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L25: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/RecordJsonAdapter.kt</strong> — 5 issues</summary>

#### 🟡 MEDIUM L29: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L29: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/StandardJsonAdapters.kt</strong> — 56 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'rangeCheckNextInt' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L84: Possible phantom function call: 'rangeCheckNextInt' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L91: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L96: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L99: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L104: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L113: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L121: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L126: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L130: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L137: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L140: Possible phantom function call: 'NullPointerException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L146: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L156: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L165: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L169: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L173: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L178: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L179: Possible phantom function call: 'rangeCheckNextInt' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L188: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L192: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L197: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L201: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L205: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L217: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L222: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L232: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L236: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L254: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L255: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L269: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L275: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L276: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L288: Possible phantom function call: 'toJsonType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L299: Possible phantom function call: 'toJsonType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L308: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L216: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L30: Function 'create' has cyclomatic complexity of 23 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🔵 LOW L56: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L131: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L180: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L256: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L270: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L302: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/internal/Util.kt</strong> — 93 issues</summary>

#### 🟡 MEDIUM L86: Possible phantom function call: 'getAnnotation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'LinkedHashSet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L171: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'LinkedHashSet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L226: Possible phantom function call: 'resolveTypeVariable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L293: Possible phantom function call: 'resolveTypeVariable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L298: Possible phantom function call: 'declaringClassOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L301: Possible phantom function call: 'getGenericSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L314: Possible phantom function call: 'getGenericSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L331: Possible phantom function call: 'getGenericSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L343: Possible phantom function call: 'getGenericSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L363: Possible phantom function call: 'declaringClassOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L382: Possible phantom function call: 'arrayComponentType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L383: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L390: Possible phantom function call: 'getGenericSuperclass' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L391: Possible phantom function call: 'getRawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L399: Possible phantom function call: 'mapKeyAndValueTypes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L402: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L403: Possible phantom function call: 'getSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L407: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L416: Possible phantom function call: 'getSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L418: Possible phantom function call: 'getGenericSupertype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L421: Possible phantom function call: 'createJsonQualifierImplementation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L473: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L476: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L482: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L485: Possible phantom function call: 'emptyArray' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L491: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L498: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L499: Possible phantom function call: 'newParameterizedType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L503: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L506: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L508: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L515: Possible phantom function call: 'isAnnotationPresent' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L528: Possible phantom function call: 'findConstructor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L541: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L544: Possible phantom function call: 'missingProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L556: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L559: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L571: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L578: Possible phantom function call: 'markNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L579: Possible phantom function call: 'returns' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L579: Possible phantom function call: 'implies' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L583: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L596: Possible phantom function call: 'checkNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L598: Possible phantom function call: 'lazyMessage' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L599: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L630: Possible phantom function call: 'getActualTypeArguments' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L632: Possible phantom function call: 'getRawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L634: Possible phantom function call: 'getOwnerType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L637: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L640: Possible phantom function call: 'hashCode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L646: Possible phantom function call: 'StringBuilder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L662: Possible phantom function call: 'getGenericComponentType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L665: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L668: Possible phantom function call: 'hashCode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L695: Possible phantom function call: 'getUpperBounds' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L695: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L697: Possible phantom function call: 'getLowerBounds' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L697: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L700: Possible phantom function call: 'equals' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L703: Possible phantom function call: 'hashCode' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L63: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L474: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L483: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L490: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L492: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L505: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L507: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L509: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L645: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L201: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L216: Function 'while' has cyclomatic complexity of 16 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L216: Function 'while' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L453: Function 'generatedAdapter' has cyclomatic complexity of 18 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🔵 LOW L148: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L172: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L223: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L262: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L330: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L342: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L374: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L384: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L429: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L461: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L492: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L499: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L507: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L509: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L706: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L711: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi/src/main/java16/com/squareup/moshi/internal/RecordJsonAdapter.kt</strong> — 28 issues</summary>

#### 🟡 MEDIUM L52: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'missingProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L86: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L90: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L109: Possible phantom function call: 'JsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L113: Possible phantom function call: 'knownNotNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L115: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L135: Possible phantom function call: 'createComponentBinding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L138: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L147: Possible phantom function call: 'methodType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L149: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L151: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L157: Possible phantom function call: 'createComponentBinding' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L175: Possible phantom function call: 'AssertionError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L72: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L98: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L100: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L148: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L150: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L174: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L68: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L72: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L80: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L100: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L139: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L150: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-adapters/build.gradle.kts</strong> — 1 issue</summary>

#### 🟡 MEDIUM L18: Possible phantom function call: 'attributes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-adapters/japicmp/build.gradle.kts</strong> — 2 issues</summary>

#### 🟡 MEDIUM L14: Possible phantom function call: 'strictly' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'dependsOn' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-adapters/src/main/java/com/squareup/moshi/Rfc3339DateJsonAdapter.kt</strong> — 3 issues</summary>

#### 🟡 MEDIUM L25: Possible phantom function call: 'ReplaceWith' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-adapters/src/main/java/com/squareup/moshi/adapters/EnumJsonAdapter.kt</strong> — 8 issues</summary>

#### 🟡 MEDIUM L59: Possible phantom function call: 'withUnknownFallback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L69: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Possible phantom function call: 'NullPointerException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L92: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L70: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-adapters/src/main/java/com/squareup/moshi/adapters/Iso8601Utils.kt</strong> — 24 issues</summary>

#### 🟡 MEDIUM L49: Possible phantom function call: 'GregorianCalendar' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'buildString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L126: Possible phantom function call: 'readChar' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L129: Possible phantom function call: 'GregorianCalendar' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L174: Possible phantom function call: 'readInt' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L208: Possible phantom function call: 'IndexOutOfBoundsException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'IndexOutOfBoundsException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L217: Possible phantom function call: 'GregorianCalendar' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L230: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L232: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L244: Possible phantom function call: 'readChar' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L257: Possible phantom function call: 'NumberFormatException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L266: Possible phantom function call: 'NumberFormatException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L273: Possible phantom function call: 'NumberFormatException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L229: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L231: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L183: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L79: Function 'parseIsoDate' has cyclomatic complexity of 23 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L79: Function 'parseIsoDate' is 156 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L79: Function 'parseIsoDate' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L186: Function 'if' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L55: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L209: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L231: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-adapters/src/main/java/com/squareup/moshi/adapters/PolymorphicJsonAdapterFactory.kt</strong> — 26 issues</summary>

#### 🟡 MEDIUM L109: Possible phantom function call: 'withSubtype' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L135: Possible phantom function call: 'withFallbackJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L151: Possible phantom function call: 'withDefaultValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'withFallbackJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'buildFallbackJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L155: Possible phantom function call: 'buildFallbackJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L157: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L162: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L163: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L170: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L192: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'labelIndex' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L213: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L222: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L226: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L264: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L265: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🔵 LOW L120: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L139: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L157: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L164: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L176: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L197: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L214: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L262: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-adapters/src/main/java/com/squareup/moshi/adapters/Rfc3339DateJsonAdapter.kt</strong> — 2 issues</summary>

#### 🟡 MEDIUM L39: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin/build.gradle.kts</strong> — 1 issue</summary>

#### 🟡 MEDIUM L19: Possible phantom function call: 'attributes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/KotlinJsonAdapterFactory.kt</strong> — 1 issue</summary>

#### 🟡 MEDIUM L22: Possible phantom function call: 'ReplaceWith' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/IndexedParameterMap.kt</strong> — 3 issues</summary>

#### 🟡 MEDIUM L9: Possible phantom function call: 'put' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'mutableSetOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'containsKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/Invokable.kt</strong> — 11 issues</summary>

#### 🟡 MEDIUM L19: Possible phantom function call: 'setAccessible' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'defaultsSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'setAccessible' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'defaultsSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'buildDefaultsSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'setAccessible' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'defaultsSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'buildDefaultsSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'buildDefaultsSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L74: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/JvmDescriptors.kt</strong> — 14 issues</summary>

#### 🟡 MEDIUM L23: Possible phantom function call: 'buildMap' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'RuntimeException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'readType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L166: Possible phantom function call: 'jvmMethodSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L179: Possible phantom function call: 'jvmMethodSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L182: Possible phantom function call: 'jvmMethodSignature' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Function 'TypeSignatureReader' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L49: Function 'readType' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L38: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L51: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L48: Function 'TypeSignatureReader' is 91 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L49: Function 'readType' is 89 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L50: Function 'when' is 87 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/JvmSignatureSearcher.kt</strong> — 17 issues</summary>

#### 🟡 MEDIUM L14: Possible phantom function call: 'syntheticMethodForAnnotations' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L15: Possible phantom function call: 'findMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L17: Possible phantom function call: 'getter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L18: Possible phantom function call: 'findMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'setter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L21: Possible phantom function call: 'findMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'findField' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L26: Possible phantom function call: 'findMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'findMethod' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'findField' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'findField' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L49: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L29: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L40: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L48: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L54: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/KmExecutable.kt</strong> — 11 issues</summary>

#### 🟡 MEDIUM L29: Possible phantom function call: 'findValueClassMethods' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'invoke' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L92: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L140: Possible phantom function call: 'prepareFinalArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L153: Possible phantom function call: 'newInstance' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L154: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L156: Possible phantom function call: 'prepareFinalArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L161: Possible phantom function call: 'prepareFinalArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L121: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L155: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/KotlinJsonAdapterFactory.kt</strong> — 30 issues</summary>

#### 🟡 MEDIUM L57: Possible phantom function call: 'Any' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'JsonDataException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L104: Possible phantom function call: 'missingProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L112: Possible phantom function call: 'IndexedParameterMap' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L124: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L125: Possible phantom function call: 'NullPointerException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L195: Possible phantom function call: 'fromJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L199: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'IndexedParameterMap' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L203: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L206: Possible phantom function call: 'toJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L207: Possible phantom function call: 'NullPointerException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L269: Possible phantom function call: 'JvmSignatureSearcher' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L290: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L432: Possible phantom function call: 'getAnnotation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L433: Possible phantom function call: 'with' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L228: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L235: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L215: Function 'create' has cyclomatic complexity of 25 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L215: Function 'create' is 154 lines long (threshold: 150)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Break into smaller functions. AI tends to generate long, monolithic functions.

#### 🟡 MEDIUM L215: Function 'create' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🟡 MEDIUM L273: Function 'for' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L159: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L372: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L407: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L421: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L434: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/KtTypes.kt</strong> — 18 issues</summary>

#### 🟡 MEDIUM L32: Possible phantom function call: 'defaultPrimitiveValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'UnsupportedOperationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'createClassName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'createClassName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L82: Possible phantom function call: 'createClassName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'callBy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L147: Possible phantom function call: 'defaultPrimitiveValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L148: Possible phantom function call: 'or' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L148: Possible phantom function call: 'shl' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L152: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L171: Possible phantom function call: 'primary' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L172: Possible phantom function call: 'KmExecutable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L110: Function 'KtConstructor' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L53: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L153: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/build.gradle.kts</strong> — 1 issue</summary>

#### 🟡 MEDIUM L22: Possible phantom function call: 'jvmArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/AdapterGenerator.kt</strong> — 44 issues</summary>

#### 🟡 MEDIUM L50: Possible phantom function call: 'GeneratedJsonAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'MemberName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L114: Possible phantom function call: 'NameAllocator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'prepare' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L176: Possible phantom function call: 'generateType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L193: Possible phantom function call: 'listOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L195: Possible phantom function call: 'listOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L215: Possible phantom function call: 'ProguardConfig' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L224: Possible phantom function call: 'generateType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L241: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L259: Possible phantom function call: 'generateConstructor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L262: Possible phantom function call: 'TypeRenderer' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L263: Possible phantom function call: 'renderTypeVariable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L269: Possible phantom function call: 'check' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L290: Possible phantom function call: 'generateToStringFun' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L291: Possible phantom function call: 'generateFromJsonFun' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L292: Possible phantom function call: 'generateToJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L297: Possible phantom function call: 'generateConstructor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L308: Possible phantom function call: 'generateToStringFun' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L315: Possible phantom function call: 'append' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L325: Possible phantom function call: 'generateFromJsonFun' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L339: Possible phantom function call: 'generateFromJsonRegular' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L399: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L450: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L464: Possible phantom function call: 'and' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L485: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L702: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L712: Possible phantom function call: 'generateToJson' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L726: Possible phantom function call: 'generateToJsonRegular' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L753: Possible phantom function call: 'generateFromJsonInline' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L765: Possible phantom function call: 'unexpectedNull' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L780: Possible phantom function call: 'generateToJsonInline' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L822: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L254: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L233: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🔵 LOW L216: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L312: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L333: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L561: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L704: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L720: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L823: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L530: Function 'if' is 102 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

#### 🔵 LOW L531: Function 'if' is 95 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/DelegateKey.kt</strong> — 11 issues</summary>

#### 🟡 MEDIUM L46: Possible phantom function call: 'generateProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'val' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'MemberName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'setOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L92: Possible phantom function call: 'joinToString' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L102: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L78: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L106: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/ProguardRules.kt</strong> — 4 issues</summary>

#### 🟡 MEDIUM L44: Possible phantom function call: 'outputFilePathWithoutExtension' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'writeTo' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'ClassName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L89: Possible phantom function call: 'repeat' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/PropertyGenerator.kt</strong> — 5 issues</summary>

#### 🟡 MEDIUM L56: Possible phantom function call: 'allocateNames' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'generateLocalProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'generateLocalIsPresentProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L63: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L79: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/TypeRenderer.kt</strong> — 18 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'renderTypeVariable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'render' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'render' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'renderObjectType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'renderObjectType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L99: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'render' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L106: Possible phantom function call: 'renderTypeVariable' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L108: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L112: Possible phantom function call: 'renderObjectType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L121: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Function 'render' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L52: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L100: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L114: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L122: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/kotlintypes.kt</strong> — 40 issues</summary>

#### 🟡 MEDIUM L46: Possible phantom function call: 'findRawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'copy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L116: Possible phantom function call: 'copy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'rawType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L133: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L133: Possible phantom function call: 'copy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L144: Possible phantom function call: 'copy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L153: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L155: Possible phantom function call: 'copy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'UnsupportedOperationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L175: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L187: Possible phantom function call: 'UnsupportedOperationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L197: Possible phantom function call: 'transform' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L205: Possible phantom function call: 'TypeVariableName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L205: Possible phantom function call: 'transform' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L217: Possible phantom function call: 'transform' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L222: Possible phantom function call: 'transform' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L226: Possible phantom function call: 'UnsupportedOperationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L233: Possible phantom function call: 'transform' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L253: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L260: Possible phantom function call: 'typeParamResolver' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L270: Possible phantom function call: 'TypeVariableName' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L210: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L167: Mixed module systems: both ESM import and CommonJS require() found

- **Detector:** context-break
- **Category:** context-loss

#### 🟡 MEDIUM L99: Function 'asTypeBlock' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L51: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L106: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L134: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L155: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L161: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L176: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L188: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L197: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L206: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L214: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L232: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/typeAliasUnwrapping.kt</strong> — 9 issues</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'addAll' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'unwrapTypeAliasInternal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'unwrapTypeAliasInternal' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'deepCopy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'UnsupportedOperationException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L33: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L45: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L65: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/AppliedType.kt</strong> — 3 issues</summary>

#### 🟡 MEDIUM L40: Possible phantom function call: 'superclasses' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'LinkedHashSet' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'invoke' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/JsonClassSymbolProcessorProvider.kt</strong> — 12 issues</summary>

#### 🟡 MEDIUM L45: Possible phantom function call: 'create' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L113: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L116: Possible phantom function call: 'adapterGenerator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L122: Possible phantom function call: 'targetType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L173: Possible phantom function call: 'AdapterGenerator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L181: Possible phantom function call: 'Dependencies' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L183: Possible phantom function call: 'outputFilePathWithoutExtension' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L107: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L157: Incomplete implementation marker found: TODO

- **Detector:** logic-gap
- **Category:** incomplete

#### 🟡 MEDIUM L50: Function 'JsonClassSymbolProcessor' has cyclomatic complexity of 17 (threshold: 15)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider breaking this function into smaller, more focused functions.

#### 🟡 MEDIUM L50: Function 'JsonClassSymbolProcessor' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L50: Function 'JsonClassSymbolProcessor' is 126 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/KspUtil.kt</strong> — 9 issues</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'asType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L33: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'isAnnotationPresent' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L40: Possible phantom function call: 'getAnnotationsByType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'addValueToBlock' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'arrayOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L111: Possible phantom function call: 'memberForValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L119: Possible phantom function call: 'memberForValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L45: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/MoshiApiUtil.kt</strong> — 7 issues</summary>

#### 🟡 MEDIUM L54: Possible phantom function call: 'PropertyGenerator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'DelegateKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'emptyList' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Possible phantom function call: 'PropertyGenerator' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L83: Possible phantom function call: 'DelegateKey' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'isAnnotationPresent' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L36: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/TargetTypes.kt</strong> — 14 issues</summary>

#### 🟡 MEDIUM L59: Possible phantom function call: 'targetType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L97: Possible phantom function call: 'AppliedType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L160: Possible phantom function call: 'TargetType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L181: Possible phantom function call: 'primaryConstructor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L209: Possible phantom function call: 'TargetConstructor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L217: Possible phantom function call: 'setOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L220: Possible phantom function call: 'mutableSetOf' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L232: Possible phantom function call: 'declaredProperties' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L304: Possible phantom function call: 'copy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L174: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L210: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L219: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L274: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L304: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/shadedUtil.kt</strong> — 26 issues</summary>

#### 🟠 **HIGH** L61: Function 'createInvocationHandler' has nesting depth of 9 (threshold: 6)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Use early returns, guard clauses, or extract nested blocks into separate functions.

#### 🟡 MEDIUM L49: Possible phantom function call: 'getAnnotationsByType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L76: Possible phantom function call: 'when' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L81: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L91: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L101: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L106: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L128: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L133: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L138: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L143: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L148: Possible phantom function call: 'Pair' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L204: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L257: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L264: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L76: Function 'when' has nesting depth of 6 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

#### 🔵 LOW L39: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L54: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L64: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L94: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L162: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L205: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L279: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L61: Function 'createInvocationHandler' is 97 lines long (threshold: 80)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider extracting some logic into helper functions.

</details>

<details>
<summary><strong>moshi-kotlin-tests/build.gradle.kts</strong> — 4 issues</summary>

#### 🟡 MEDIUM L15: Possible phantom function call: 'findProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L23: Possible phantom function call: 'apply' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L30: Possible phantom function call: 'jvmArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'project' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin-tests/codegen-only/build.gradle.kts</strong> — 6 issues</summary>

#### 🟡 MEDIUM L15: Possible phantom function call: 'findProperty' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L20: Possible phantom function call: 'apply' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L24: Possible phantom function call: 'apply' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L31: Possible phantom function call: 'jvmArgs' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'project' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'project' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi-kotlin-tests/extra-moshi-test-module/build.gradle.kts</strong> — 3 issues</summary>

#### 🟡 MEDIUM L1: Possible phantom function call: 'kotlin' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L3: Possible phantom function call: 'implementation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L3: Possible phantom function call: 'project' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>moshi/src/main/java/com/squareup/moshi/JsonClass.kt</strong> — 1 issue</summary>

#### 🟡 MEDIUM L54: Incomplete implementation marker found: Ellipsis comment

- **Detector:** logic-gap
- **Category:** incomplete

</details>

<details>
<summary>📋 File Scores</summary>

| File | Score | Grade | AI Faith. | Freshness | Coherence | Quality |
|------|-------|-------|-----------|-----------|-----------|---------|
| `build.gradle.kts` | 92/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 19/20 |
| `moshi/build.gradle.kts` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `moshi/japicmp/build.gradle.kts` | 83/100 | 🔵 B | 17.5/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/-JsonUtf8Reader.kt` | 40/100 | 🔴 F | 0/35 | 22.5/25 | 12.6/20 | 5.2/20 |
| `moshi/src/main/java/com/squareup/moshi/-JsonUtf8Writer.kt` | 59/100 | 🔴 F | 0/35 | 25/25 | 17.8/20 | 16/20 |
| `moshi/src/main/java/com/squareup/moshi/-JsonValueReader.kt` | 56/100 | 🔴 F | 0/35 | 22.5/25 | 18.2/20 | 15/20 |
| `moshi/src/main/java/com/squareup/moshi/-JsonValueWriter.kt` | 57/100 | 🔴 F | 0/35 | 22.5/25 | 18.2/20 | 16/20 |
| `moshi/src/main/java/com/squareup/moshi/-MoshiKotlinExtensions.kt` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/-MoshiKotlinTypesExtensions.kt` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/JsonAdapter.kt` | 53/100 | 🔴 F | 0/35 | 20/25 | 16.4/20 | 17/20 |
| `moshi/src/main/java/com/squareup/moshi/JsonEncodingException.kt` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/JsonReader.kt` | 57/100 | 🔴 F | 0/35 | 22.5/25 | 16.2/20 | 18/20 |
| `moshi/src/main/java/com/squareup/moshi/JsonWriter.kt` | 63/100 | 🟠 D | 0/35 | 25/25 | 18.6/20 | 19/20 |
| `moshi/src/main/java/com/squareup/moshi/Moshi.kt` | 57/100 | 🔴 F | 0/35 | 25/25 | 17/20 | 15/20 |
| `moshi/src/main/java/com/squareup/moshi/Types.kt` | 57/100 | 🔴 F | 0/35 | 25/25 | 15/20 | 17/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/AdapterMethodsFactory.kt` | 52/100 | 🔴 F | 0/35 | 25/25 | 15.4/20 | 12/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/ArrayJsonAdapter.kt` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/ClassFactory.kt` | 77/100 | 🟡 C | 22.75/35 | 25/25 | 17.2/20 | 11.6/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/ClassJsonAdapter.kt` | 62/100 | 🟠 D | 5.25/35 | 25/25 | 17/20 | 15/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/CollectionJsonAdapter.kt` | 77/100 | 🟡 C | 14/35 | 25/25 | 18.8/20 | 19/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/JsonScope.kt` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/JsonValueSource.kt` | 80/100 | 🔵 B | 21/35 | 22.5/25 | 19/20 | 17.2/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/KotlinReflectTypes.kt` | 59/100 | 🔴 F | 0/35 | 25/25 | 18.4/20 | 16/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/LinkedHashTreeMap.kt` | 60/100 | 🟠 D | 0/35 | 25/25 | 18/20 | 16.6/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/MapJsonAdapter.kt` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/NonNullJsonAdapter.kt` | 92/100 | 🟢 A | 28/35 | 25/25 | 18.8/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/NullSafeJsonAdapter.kt` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/RecordJsonAdapter.kt` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/StandardJsonAdapters.kt` | 61/100 | 🟠 D | 0/35 | 25/25 | 17.6/20 | 18/20 |
| `moshi/src/main/java/com/squareup/moshi/internal/Util.kt` | 45/100 | 🔴 F | 0/35 | 25/25 | 12.6/20 | 7/20 |
| `moshi/src/main/java16/com/squareup/moshi/internal/RecordJsonAdapter.kt` | 64/100 | 🟠 D | 8.75/35 | 25/25 | 17.6/20 | 13/20 |
| `moshi-adapters/build.gradle.kts` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi-adapters/japicmp/build.gradle.kts` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `moshi-adapters/src/main/java/com/squareup/moshi/Rfc3339DateJsonAdapter.kt` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `moshi-adapters/src/main/java/com/squareup/moshi/adapters/EnumJsonAdapter.kt` | 87/100 | 🔵 B | 22.75/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi-adapters/src/main/java/com/squareup/moshi/adapters/Iso8601Utils.kt` | 67/100 | 🟠 D | 10.5/35 | 25/25 | 17.8/20 | 14/20 |
| `moshi-adapters/src/main/java/com/squareup/moshi/adapters/PolymorphicJsonAdapterFactory.kt` | 66/100 | 🟠 D | 5.25/35 | 25/25 | 15.8/20 | 20/20 |
| `moshi-adapters/src/main/java/com/squareup/moshi/adapters/Rfc3339DateJsonAdapter.kt` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin/build.gradle.kts` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/KotlinJsonAdapterFactory.kt` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/IndexedParameterMap.kt` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/Invokable.kt` | 82/100 | 🔵 B | 17.5/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/JvmDescriptors.kt` | 84/100 | 🔵 B | 22.75/35 | 25/25 | 19.2/20 | 16.8/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/JvmSignatureSearcher.kt` | 77/100 | 🟡 C | 15.75/35 | 25/25 | 18.4/20 | 18/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/KmExecutable.kt` | 84/100 | 🔵 B | 21/35 | 25/25 | 19.2/20 | 19/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/KotlinJsonAdapterFactory.kt` | 59/100 | 🔴 F | 1.75/35 | 25/25 | 17/20 | 15/20 |
| `moshi-kotlin/src/main/java/com/squareup/moshi/kotlin/reflect/KtTypes.kt` | 73/100 | 🟡 C | 10.5/35 | 25/25 | 18.2/20 | 19/20 |
| `moshi-kotlin-codegen/build.gradle.kts` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/AdapterGenerator.kt` | 59/100 | 🔴 F | 0/35 | 25/25 | 16.2/20 | 18.2/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/DelegateKey.kt` | 83/100 | 🔵 B | 19.25/35 | 25/25 | 19.2/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/ProguardRules.kt` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/PropertyGenerator.kt` | 94/100 | 🟢 A | 29.75/35 | 25/25 | 19.2/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/TypeRenderer.kt` | 75/100 | 🟡 C | 12.25/35 | 25/25 | 18.4/20 | 19/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/kotlintypes.kt` | 58/100 | 🔴 F | 0/35 | 25/25 | 14.6/20 | 18/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/api/typeAliasUnwrapping.kt` | 88/100 | 🔵 B | 24.5/35 | 25/25 | 18.8/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/AppliedType.kt` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/JsonClassSymbolProcessorProvider.kt` | 83/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 15.6/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/KspUtil.kt` | 86/100 | 🔵 B | 21/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/MoshiApiUtil.kt` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/TargetTypes.kt` | 82/100 | 🔵 B | 19.25/35 | 25/25 | 18/20 | 20/20 |
| `moshi-kotlin-codegen/src/main/java/com/squareup/moshi/kotlin/codegen/ksp/shadedUtil.kt` | 67/100 | 🟠 D | 10.5/35 | 25/25 | 17.2/20 | 14.6/20 |
| `moshi-kotlin-tests/build.gradle.kts` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin-tests/codegen-only/build.gradle.kts` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `moshi-kotlin-tests/extra-moshi-test-module/build.gradle.kts` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `moshi/src/main/java/com/squareup/moshi/JsonClass.kt` | 99/100 | 🏆 A+ | 35/35 | 25/25 | 20/20 | 19/20 |

</details>

---
*Powered by [Open Code Review](https://github.com/raye-deng/open-code-review) v0.3.0*