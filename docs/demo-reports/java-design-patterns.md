## 🔴 Open Code Review Report — java-design-patterns

> 🕐 2026-03-10T17:54:18.941Z · ⏱️ 0.1s · 📁 100 files · 🌐 java

### Overall: 51/100 (Grade F) ❌ FAILED

| Metric | Value |
|--------|-------|
| Files Scanned | 81 |
| Files Passed | 81 |
| Files Failed | 0 |
| Issues Found | 257 |
| Threshold | 70 |

### 📊 Scoring Dimensions

| Dimension | Score | Bar | Issues |
|-----------|-------|-----|--------|
| AI Faithfulness | 0/35 | ░░░░░░░░░░ 0% | 237 |
| Code Freshness | 25/25 | ██████████ 100% | 0 |
| Context Coherence | 16/20 | ████████░░ 80% | 10 |
| Implementation Quality | 10/20 | █████░░░░░ 50% | 10 |

### ⚠️ Issue Summary

| Severity | Count |
|----------|-------|
| 🟡 MEDIUM | 247 |
| 🔵 LOW | 10 |

### 📁 Issues by File

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/AbstractDocument.java</strong> — 7 issues</summary>

#### 🟡 MEDIUM L45: Possible phantom function call: 'put' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'children' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'buildStringRepresentation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'buildStringRepresentation' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'StringBuilder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'getClass' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L58: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/App.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L49: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'Car' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/Document.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'put' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L58: Possible phantom function call: 'children' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasModel.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'getModel' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasParts.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'getParts' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'children' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasPrice.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'getPrice' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasType.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'getType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/App.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L48: Possible phantom function call: 'Kingdom' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'run' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L80: Possible phantom function call: 'createKingdom' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/Army.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/Castle.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfArmy.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfCastle.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfKing.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfKingdomFactory.java</strong> — 6 issues</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'createCastle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'ElfCastle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'createKing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'ElfKing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'createArmy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'ElfArmy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/King.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/Kingdom.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L49: Possible phantom function call: 'makeFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'ElfKingdomFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'OrcKingdomFactory' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/KingdomFactory.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'createCastle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'createKing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'createArmy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcArmy.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcCastle.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcKing.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'getDescription' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcKingdomFactory.java</strong> — 6 issues</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'createCastle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'OrcCastle' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'createKing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'OrcKing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'createArmy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'OrcArmy' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>active-object/src/main/java/com/iluwatar/activeobject/ActiveCreature.java</strong> — 11 issues</summary>

#### 🟡 MEDIUM L51: Possible phantom function call: 'Thread' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L74: Possible phantom function call: 'eat' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L78: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L87: Possible phantom function call: 'roam' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L88: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L96: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L105: Possible phantom function call: 'kill' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L115: Possible phantom function call: 'getStatus' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🟡 MEDIUM L46: Function 'ActiveCreature' has nesting depth of 5 (threshold: 4)

- **Detector:** over-engineering
- **Category:** over-engineering
- **Fix:** Consider using early returns or extracting deeply nested logic.

</details>

<details>
<summary><strong>active-object/src/main/java/com/iluwatar/activeobject/App.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L51: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Possible phantom function call: 'run' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Possible phantom function call: 'Orc' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>actor-model/src/main/java/com/iluwatar/actormodel/Actor.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'send' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'stop' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'run' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'onReceive' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>actor-model/src/main/java/com/iluwatar/actormodel/ActorSystem.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L35: Possible phantom function call: 'AtomicInteger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L37: Possible phantom function call: 'startActor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'getActorById' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'shutdown' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>actor-model/src/main/java/com/iluwatar/actormodel/App.java</strong> — 6 issues</summary>

#### 🟡 MEDIUM L48: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'ActorSystem' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'ExampleActor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'ExampleActor2' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'Message' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'Message' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>actor-model/src/main/java/com/iluwatar/actormodel/ExampleActor.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L44: Possible phantom function call: 'onReceive' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'getActorId' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'getActorId' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'Message' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'getActorId' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>actor-model/src/main/java/com/iluwatar/actormodel/ExampleActor2.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L42: Possible phantom function call: 'onReceive' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'getActorId' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/App.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'ConfigureForUnixVisitor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'ConfigureForDosVisitor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'Zoom' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'Hayes' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/ConfigureForDosVisitor.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L36: Possible phantom function call: 'visit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'visit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/ConfigureForUnixVisitor.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'visit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/Hayes.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L35: Possible phantom function call: 'accept' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/HayesVisitor.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L29: Possible phantom function call: 'visit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/Modem.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L29: Possible phantom function call: 'accept' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/Zoom.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L35: Possible phantom function call: 'accept' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/ZoomVisitor.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L29: Possible phantom function call: 'visit' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>adapter/src/main/java/com/iluwatar/adapter/App.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L55: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L58: Possible phantom function call: 'Captain' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L58: Possible phantom function call: 'FishingBoatAdapter' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>adapter/src/main/java/com/iluwatar/adapter/Captain.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L42: Possible phantom function call: 'row' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>adapter/src/main/java/com/iluwatar/adapter/FishingBoat.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L36: Possible phantom function call: 'sail' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>adapter/src/main/java/com/iluwatar/adapter/FishingBoatAdapter.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'FishingBoat' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'row' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>adapter/src/main/java/com/iluwatar/adapter/RowingBoat.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'row' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>ambassador/src/main/java/com/iluwatar/ambassador/App.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L45: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'Client' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'Client' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>ambassador/src/main/java/com/iluwatar/ambassador/Client.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L33: Possible phantom function call: 'ServiceAmbassador' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L35: Possible phantom function call: 'useService' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>ambassador/src/main/java/com/iluwatar/ambassador/RemoteService.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L39: Possible phantom function call: 'getRemoteService' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'doRemoteFunction' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L70: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L75: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>ambassador/src/main/java/com/iluwatar/ambassador/RemoteServiceInterface.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'doRemoteFunction' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>ambassador/src/main/java/com/iluwatar/ambassador/ServiceAmbassador.java</strong> — 7 issues</summary>

#### 🟡 MEDIUM L46: Possible phantom function call: 'doRemoteFunction' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L47: Possible phantom function call: 'safeCall' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'checkLatency' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'taken' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'safeCall' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'checkLatency' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>ambassador/src/main/java/com/iluwatar/ambassador/util/RandomProvider.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L29: Possible phantom function call: 'random' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>anti-corruption-layer/src/main/java/com/iluwatar/corruption/App.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/AntiCorruptionLayer.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L54: Possible phantom function call: 'findOrderInLegacySystem' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'ModernOrder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'Customer' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'Shipment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L57: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/DataStore.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L46: Possible phantom function call: 'put' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/ShopException.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'throwIncorrectData' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L43: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/legacy/LegacyShop.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L44: Possible phantom function call: 'placeOrder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'findOrder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/modern/ModernShop.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L47: Possible phantom function call: 'placeOrder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L64: Possible phantom function call: 'findOrder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>arrange-act-assert/src/main/java/com/iluwatar/arrangeactassert/Cash.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L39: Possible phantom function call: 'plus' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'minus' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L48: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/App.java</strong> — 16 issues</summary>

#### 🟡 MEDIUM L66: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L68: Possible phantom function call: 'ThreadAsyncExecutor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L71: Possible phantom function call: 'lazyval' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L72: Possible phantom function call: 'lazyval' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'lazyval' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'lazyval' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L75: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'lazyval' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L77: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'lazyval' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L117: Possible phantom function call: 'callback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L120: Possible phantom function call: 'onComplete' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L125: Possible phantom function call: 'onError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🔵 LOW L105: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L108: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L119: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/AsyncCallback.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L39: Possible phantom function call: 'onComplete' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L46: Possible phantom function call: 'onError' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/AsyncExecutor.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L39: Possible phantom function call: 'startProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'startProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L60: Possible phantom function call: 'endProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/AsyncResult.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'isCompleted' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'getValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/ThreadAsyncExecutor.java</strong> — 16 issues</summary>

#### 🟡 MEDIUM L35: Possible phantom function call: 'AtomicInteger' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L38: Possible phantom function call: 'startProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'startProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L43: Possible phantom function call: 'startProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Possible phantom function call: 'Thread' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Possible phantom function call: 'endProcess' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L93: Possible phantom function call: 'hasCallback' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L103: Possible phantom function call: 'setValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L120: Possible phantom function call: 'setException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L132: Possible phantom function call: 'isCompleted' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L137: Possible phantom function call: 'getValue' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L141: Possible phantom function call: 'ExecutionException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L143: Possible phantom function call: 'IllegalStateException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

#### 🔵 LOW L140: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

#### 🔵 LOW L142: Potentially unreachable code after return/throw statement

- **Detector:** logic-gap
- **Category:** context-loss

</details>

<details>
<summary><strong>backpressure/src/main/java/com/iluwatar/backpressure/App.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L54: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L62: Possible phantom function call: 'Subscriber' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L66: Possible phantom function call: 'CountDownLatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L69: Possible phantom function call: 'Subscriber' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'CountDownLatch' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>backpressure/src/main/java/com/iluwatar/backpressure/Publisher.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L43: Possible phantom function call: 'publish' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>backpressure/src/main/java/com/iluwatar/backpressure/Subscriber.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'hookOnSubscribe' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L42: Possible phantom function call: 'hookOnNext' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'hookOnComplete' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'processItem' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L59: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>balking/src/main/java/com/iluwatar/balking/App.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L50: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L51: Possible phantom function call: 'WashingMachine' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L61: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>balking/src/main/java/com/iluwatar/balking/DelayProvider.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'executeAfterDelay' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>balking/src/main/java/com/iluwatar/balking/WashingMachine.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L63: Possible phantom function call: 'wash' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L65: Possible phantom function call: 'getWashingMachineState' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L79: Possible phantom function call: 'endOfWashing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L45: Empty catch block — errors are silently swallowed

- **Detector:** logic-gap
- **Category:** error-handling

</details>

<details>
<summary><strong>bloc/src/main/java/com/iluwatar/bloc/Bloc.java</strong> — 7 issues</summary>

#### 🟡 MEDIUM L43: Possible phantom function call: 'State' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'addListener' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L63: Possible phantom function call: 'removeListener' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L73: Possible phantom function call: 'getListeners' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L82: Possible phantom function call: 'emitState' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L90: Possible phantom function call: 'increment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L95: Possible phantom function call: 'decrement' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bloc/src/main/java/com/iluwatar/bloc/BlocUi.java</strong> — 9 issues</summary>

#### 🟡 MEDIUM L39: Possible phantom function call: 'createAndShowUi' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L41: Possible phantom function call: 'Bloc' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'JFrame' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'JLabel' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'Font' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L53: Possible phantom function call: 'JButton' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L54: Possible phantom function call: 'JButton' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'JButton' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L57: Possible phantom function call: 'BorderLayout' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bloc/src/main/java/com/iluwatar/bloc/ListenerManager.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'addListener' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'removeListener' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L55: Possible phantom function call: 'getListeners' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bloc/src/main/java/com/iluwatar/bloc/Main.java</strong> — 2 issues</summary>

#### 🟡 MEDIUM L47: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L48: Possible phantom function call: 'BlocUi' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bloc/src/main/java/com/iluwatar/bloc/State.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L31: Possible phantom function call: 'State' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bloc/src/main/java/com/iluwatar/bloc/StateListener.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L41: Possible phantom function call: 'onStateChange' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/App.java</strong> — 5 issues</summary>

#### 🟡 MEDIUM L50: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'Sword' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L52: Possible phantom function call: 'SoulEatingEnchantment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L58: Possible phantom function call: 'Hammer' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L58: Possible phantom function call: 'FlyingEnchantment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/Enchantment.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'onActivate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'apply' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'onDeactivate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/FlyingEnchantment.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'onActivate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'apply' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'onDeactivate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/Hammer.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L38: Possible phantom function call: 'wield' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'swing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'unwield' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'getEnchantment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/SoulEatingEnchantment.java</strong> — 3 issues</summary>

#### 🟡 MEDIUM L34: Possible phantom function call: 'onActivate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L39: Possible phantom function call: 'apply' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'onDeactivate' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/Sword.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L38: Possible phantom function call: 'wield' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L44: Possible phantom function call: 'swing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L50: Possible phantom function call: 'unwield' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L56: Possible phantom function call: 'getEnchantment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>bridge/src/main/java/com/iluwatar/bridge/Weapon.java</strong> — 4 issues</summary>

#### 🟡 MEDIUM L30: Possible phantom function call: 'wield' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L32: Possible phantom function call: 'swing' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L34: Possible phantom function call: 'unwield' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L36: Possible phantom function call: 'getEnchantment' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>builder/src/main/java/com/iluwatar/builder/App.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L59: Possible phantom function call: 'main' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>builder/src/main/java/com/iluwatar/builder/HairColor.java</strong> — 1 issue</summary>

#### 🟡 MEDIUM L37: Possible phantom function call: 'name' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary><strong>builder/src/main/java/com/iluwatar/builder/Hero.java</strong> — 9 issues</summary>

#### 🟡 MEDIUM L28: Possible phantom function call: 'Hero' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L49: Possible phantom function call: 'StringBuilder' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L84: Possible phantom function call: 'IllegalArgumentException' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L90: Possible phantom function call: 'withHairType' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L95: Possible phantom function call: 'withHairColor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L100: Possible phantom function call: 'withArmor' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L105: Possible phantom function call: 'withWeapon' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L110: Possible phantom function call: 'build' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

#### 🟡 MEDIUM L111: Possible phantom function call: 'Hero' is called but not imported or declared in this file

- **Detector:** hallucination
- **Category:** hallucination

</details>

<details>
<summary>📋 File Scores</summary>

| File | Score | Grade | AI Faith. | Freshness | Coherence | Quality |
|------|-------|-------|-----------|-----------|-----------|---------|
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/AbstractDocument.java` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 19.6/20 | 20/20 |
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/App.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/Document.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasModel.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasParts.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasPrice.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-document/src/main/java/com/iluwatar/abstractdocument/domain/HasType.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/App.java` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/Army.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/Castle.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfArmy.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfCastle.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfKing.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/ElfKingdomFactory.java` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/King.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/Kingdom.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/KingdomFactory.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcArmy.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcCastle.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcKing.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `abstract-factory/src/main/java/com/iluwatar/abstractfactory/OrcKingdomFactory.java` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `active-object/src/main/java/com/iluwatar/activeobject/ActiveCreature.java` | 82/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 18/20 |
| `active-object/src/main/java/com/iluwatar/activeobject/App.java` | 94/100 | 🟢 A | 29.75/35 | 25/25 | 20/20 | 19/20 |
| `actor-model/src/main/java/com/iluwatar/actormodel/Actor.java` | 92/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 19/20 |
| `actor-model/src/main/java/com/iluwatar/actormodel/ActorSystem.java` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `actor-model/src/main/java/com/iluwatar/actormodel/App.java` | 90/100 | 🟢 A | 24.5/35 | 25/25 | 20/20 | 20/20 |
| `actor-model/src/main/java/com/iluwatar/actormodel/ExampleActor.java` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `actor-model/src/main/java/com/iluwatar/actormodel/ExampleActor2.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/App.java` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/ConfigureForDosVisitor.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/ConfigureForUnixVisitor.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/Hayes.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/HayesVisitor.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/Modem.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/Zoom.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `acyclic-visitor/src/main/java/com/iluwatar/acyclicvisitor/ZoomVisitor.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `adapter/src/main/java/com/iluwatar/adapter/App.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `adapter/src/main/java/com/iluwatar/adapter/Captain.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `adapter/src/main/java/com/iluwatar/adapter/FishingBoat.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `adapter/src/main/java/com/iluwatar/adapter/FishingBoatAdapter.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `adapter/src/main/java/com/iluwatar/adapter/RowingBoat.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `ambassador/src/main/java/com/iluwatar/ambassador/App.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `ambassador/src/main/java/com/iluwatar/ambassador/Client.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `ambassador/src/main/java/com/iluwatar/ambassador/RemoteService.java` | 95/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 19/20 |
| `ambassador/src/main/java/com/iluwatar/ambassador/RemoteServiceInterface.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `ambassador/src/main/java/com/iluwatar/ambassador/ServiceAmbassador.java` | 89/100 | 🔵 B | 24.5/35 | 25/25 | 20/20 | 19/20 |
| `ambassador/src/main/java/com/iluwatar/ambassador/util/RandomProvider.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `anti-corruption-layer/src/main/java/com/iluwatar/corruption/App.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/AntiCorruptionLayer.java` | 93/100 | 🟢 A | 28/35 | 25/25 | 19.6/20 | 20/20 |
| `anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/DataStore.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/ShopException.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 19.6/20 | 20/20 |
| `anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/legacy/LegacyShop.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `anti-corruption-layer/src/main/java/com/iluwatar/corruption/system/modern/ModernShop.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `arrange-act-assert/src/main/java/com/iluwatar/arrangeactassert/Cash.java` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 19.6/20 | 20/20 |
| `async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/App.java` | 76/100 | 🟡 C | 12.25/35 | 25/25 | 18.8/20 | 20/20 |
| `async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/AsyncCallback.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/AsyncExecutor.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/AsyncResult.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `async-method-invocation/src/main/java/com/iluwatar/async/method/invocation/ThreadAsyncExecutor.java` | 75/100 | 🟡 C | 12.25/35 | 25/25 | 19.2/20 | 19/20 |
| `backpressure/src/main/java/com/iluwatar/backpressure/App.java` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `backpressure/src/main/java/com/iluwatar/backpressure/Publisher.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `backpressure/src/main/java/com/iluwatar/backpressure/Subscriber.java` | 92/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 19/20 |
| `balking/src/main/java/com/iluwatar/balking/App.java` | 96/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 19/20 |
| `balking/src/main/java/com/iluwatar/balking/DelayProvider.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `balking/src/main/java/com/iluwatar/balking/WashingMachine.java` | 94/100 | 🟢 A | 29.75/35 | 25/25 | 20/20 | 19/20 |
| `bloc/src/main/java/com/iluwatar/bloc/Bloc.java` | 88/100 | 🔵 B | 22.75/35 | 25/25 | 20/20 | 20/20 |
| `bloc/src/main/java/com/iluwatar/bloc/BlocUi.java` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |
| `bloc/src/main/java/com/iluwatar/bloc/ListenerManager.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `bloc/src/main/java/com/iluwatar/bloc/Main.java` | 97/100 | 🏆 A+ | 31.5/35 | 25/25 | 20/20 | 20/20 |
| `bloc/src/main/java/com/iluwatar/bloc/State.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `bloc/src/main/java/com/iluwatar/bloc/StateListener.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/App.java` | 91/100 | 🟢 A | 26.25/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/Enchantment.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/FlyingEnchantment.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/Hammer.java` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/SoulEatingEnchantment.java` | 95/100 | 🏆 A+ | 29.75/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/Sword.java` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `bridge/src/main/java/com/iluwatar/bridge/Weapon.java` | 93/100 | 🟢 A | 28/35 | 25/25 | 20/20 | 20/20 |
| `builder/src/main/java/com/iluwatar/builder/App.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `builder/src/main/java/com/iluwatar/builder/HairColor.java` | 98/100 | 🏆 A+ | 33.25/35 | 25/25 | 20/20 | 20/20 |
| `builder/src/main/java/com/iluwatar/builder/Hero.java` | 84/100 | 🔵 B | 19.25/35 | 25/25 | 20/20 | 20/20 |

</details>

---
*Powered by [Open Code Review](https://github.com/raye-deng/open-code-review) v0.3.0*