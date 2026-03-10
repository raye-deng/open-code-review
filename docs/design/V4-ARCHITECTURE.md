# Open Code Review V4 — Architecture Redesign

> **Version**: 4.0 | **Date**: 2026-03-11
> **Status**: Architecture Design
> **Author**: Open Code Review Architecture Team
> **Prior Art**: [V3 Architecture](./V3-ARCHITECTURE.md) | [V3 Demo Scan Results](../demo-reports/SUMMARY.md)

---

## 1. Executive Summary

### 1.1 Why V4: Lessons from V3 Scanning Results

V3 demo scans across 5 real-world repositories revealed **fundamental architectural flaws**:

| Repository | Language | Issues | Score | Grade | Root Cause of False Positives |
|-----------|----------|-------:|------:|:-----:|-------------------------------|
| create-t3-app | TypeScript | 509 | 25 | F | Package.json-based detection flags valid packages as hallucinations |
| typer | Python | 151 | 59 | F | `main()` / top-level calls flagged as "phantom" — no Python execution model understanding |
| java-design-patterns | Java | 257 | 51 | F | Method calls flagged as "phantom" — no class-scoped method understanding |
| chi | Go | 1,008 | 36 | F | `testing` stdlib flagged as hallucinated; `func`, `byte` flagged as phantom calls |
| moshi | Kotlin | 1,497 | 8 | F | `Buffer()` flagged as "deprecated since Node.js 6.0" — JS deprecation applied to Kotlin |

**3,422 total issues** were reported. Estimated **>95% are false positives**. The failures are **architectural**, not bug-level:

1. **Language-specific detection leaks**: TS-specific checks (package.json deps, Node.js deprecation DB) execute against all languages
2. **Fake parsing**: Only TS uses a real parser (oxc-parser). Python/Java/Go/Kotlin return `{ type: 'PythonModule', lines: source.split('\n') }` — raw text disguised as AST
3. **Hardcoded whitelists**: Static `Set<string>` (55–100+ entries) as package verification. Any unlisted package = hallucinated
4. **No semantic understanding**: The "phantom function" detector flags `main()`, `StringBuilder()`, `byte()` because it has no scope analysis

### 1.2 Key Changes from V3

| Aspect | V3 | V4 |
|--------|-----|-----|
| Parsing | oxc-parser (TS) + regex (others) | **tree-sitter for all 5 languages** |
| Analysis depth | AST (TS) vs line-by-line regex (others) | **Unified IR with identical capabilities** |
| Package verification | Hardcoded whitelists + package.json | **Live registry verification (npm/PyPI/Maven/Go proxy)** |
| Detection approach | Rule-based only | **Three-stage: structural + embedding recall + LLM deep scan** |
| Lint overlap | Formatting, naming, dead code | **AI-unique defects only** |
| Localization | Chinese-only comments | **Full i18n (en/zh)** |
| Language isolation | All detectors run all checks | **Language-scoped detection via unified IR** |

---

## 2. System Architecture

### 2.1 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         Open Code Review V4                                  │
│                                                                              │
│  Entry Points                                                                │
│  ┌───────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐                  │
│  │  CLI  │  │ CI Action│  │  VS Code  │  │  Web Portal   │                  │
│  └───┬───┘  └────┬─────┘  └────┬─────┘  └──────┬────────┘                  │
│      └───────────┴──────────────┴───────────────┘                            │
│                            │                                                 │
│  ┌─────────────────────────▼───────────────────────────────────────────────┐ │
│  │                     Orchestrator (Pipeline Controller)                   │ │
│  │  Config Loader → File Discovery → Language Detection → Pipeline Router  │ │
│  └─────────────────────────┬───────────────────────────────────────────────┘ │
│                            │                                                 │
│  ┌─────────────────────────▼───────────────────────────────────────────────┐ │
│  │              Unified Language Pipeline (tree-sitter)                     │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │ │
│  │  │  TS/JS │ │ Python │ │  Java  │ │   Go   │ │ Kotlin │               │ │
│  │  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘               │ │
│  │      └──────────┴──────────┴──────────┴──────────┘                      │ │
│  │                     Unified IR (CodeUnit[])                              │ │
│  └─────────────────────────┬───────────────────────────────────────────────┘ │
│                            │                                                 │
│  ┌─────────────────────────▼───────────────────────────────────────────────┐ │
│  │                     Detection Engine V4                                  │ │
│  │                                                                          │ │
│  │  Stage 0: Structural Analysis (IR-based, always runs)                   │ │
│  │  ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌─────────────┐       │ │
│  │  │Import      │ │Context     │ │Over-         │ │Security     │       │ │
│  │  │Verifier    │ │Coherence   │ │Engineering   │ │Pattern      │       │ │
│  │  │+ Registry  │ │            │ │              │ │             │       │ │
│  │  └────────────┘ └────────────┘ └──────────────┘ └─────────────┘       │ │
│  │                                                                          │ │
│  │  Stage 1: Embedding Recall (L2+, fast, high-recall)                     │ │
│  │  ┌──────────────────────────────────────────────────────────────┐       │ │
│  │  │ Code Embedder → Pattern DB Similarity → Suspicion Ranking   │       │ │
│  │  └──────────────────────────────────────────────────────────────┘       │ │
│  │                                                                          │ │
│  │  Stage 2: LLM Deep Scan (L3 only, precise, top-N from Stage 1)         │ │
│  │  ┌──────────────────────────────────────────────────────────────┐       │ │
│  │  │ Prompt Engine → LLM Analysis → Validation → Result Fusion   │       │ │
│  │  └──────────────────────────────────────────────────────────────┘       │ │
│  └─────────────────────────┬───────────────────────────────────────────────┘ │
│                            │                                                 │
│  ┌─────────────────────────▼───────────────────────────────────────────────┐ │
│  │  Scoring Engine V4  │  i18n Report System                               │ │
│  │  4-dim → Grade → Gate │ Terminal│Markdown│HTML│JSON│SARIF│Badge         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Module Overview

```
open-code-review/
├── packages/core/src/
│   ├── pipeline/                    # [NEW] Orchestrator
│   │   ├── orchestrator.ts          #   Main scan pipeline
│   │   ├── file-discovery.ts        #   Glob + language detection
│   │   └── language-detector.ts     #   Extension → language map
│   ├── parser/                      # [REWRITE] Unified tree-sitter
│   │   ├── tree-sitter-manager.ts   #   WASM init & grammar cache
│   │   ├── parser.ts               #   Unified parse() entry
│   │   └── grammars/*.wasm          #   Pre-built WASM grammars
│   ├── ir/                          # [NEW] Intermediate Representation
│   │   ├── types.ts                #   CodeUnit, ImportDecl, etc.
│   │   ├── extractor.ts            #   Extractor interface + registry
│   │   └── extractors/             #   Language-specific IR extraction
│   │       ├── typescript.ts / python.ts / java.ts / go.ts / kotlin.ts
│   ├── registry/                    # [NEW] Dynamic registry verification
│   │   ├── types.ts / npm.ts / pypi.ts / maven.ts / go-proxy.ts
│   │   ├── cache.ts               #   TTL-based cache
│   │   └── registry-manager.ts     #   Language → registry routing
│   ├── detectors/                   # [REWRITE] IR-based detectors
│   │   ├── import-verifier.ts / context-coherence.ts / over-engineering.ts
│   │   ├── security-pattern.ts / stale-api.ts / incomplete-impl.ts
│   │   └── registry.ts            #   Detector runner
│   ├── ai/                          # [REWRITE] Two-stage AI pipeline
│   │   ├── embedder/               #   Stage 1: embedding recall
│   │   ├── llm/                    #   Stage 2: LLM deep scan
│   │   └── fusion.ts              #   Result merging
│   ├── scorer/                      # Scoring engine (from V3)
│   ├── i18n/                        # [NEW] Internationalization
│   │   ├── types.ts / provider.ts
│   │   └── locales/ (en.json, zh.json)
│   ├── report/                      # Report system (i18n-updated)
│   ├── config/                      # Configuration system
│   └── types.ts                     # Core types
```

### 2.3 Data Flow

```
Source Files → File Discovery → Language Detection
    │
    ▼
tree-sitter parse(lang, source) → CST (Concrete Syntax Tree)
    │
    ▼
Language Extractor → CodeUnit (unified IR)
    │
    ├──→ Stage 0: Structural Detectors (IR-based)
    │        ├── Import Verifier + Dynamic Registry
    │        ├── Context Coherence
    │        ├── Over-Engineering (IR complexity metrics)
    │        ├── Security Pattern (AST pattern matching)
    │        ├── Stale API (language-scoped deprecation DB)
    │        └── Incomplete Implementation
    │
    ├──→ Stage 1: Embedding Recall (code blocks → embeddings → pattern match)
    │
    └──→ Stage 2: LLM Deep Scan (top-N suspicious → LLM → confirmed issues)
              │
              ▼
         Result Fusion → Scoring Engine → i18n Reports
```

---

## 3. Unified Language Pipeline

### 3.1 Parser Selection (tree-sitter vs Alternatives)

**Decision: Use tree-sitter for ALL 5 languages, including TypeScript (replacing oxc-parser).**

| Parser | Coverage | Speed | API Consistency | Verdict |
|--------|----------|-------|-----------------|---------|
| **tree-sitter** | 300+ languages, WASM grammars | ~0.15s/100 files | Single API for all | ✅ **Selected** |
| **oxc-parser** | TS/JS only | ~0.05s/100 files (3x faster) | ESTree output | ❌ Single-language |
| **ast-grep** | tree-sitter-based search | N/A (search tool) | Pattern DSL | ⚠️ Complementary |
| **LSP** | Per-language servers | Slow startup | Per-server API | ❌ Too heavy |
| **Native parsers** | Per-language | Varies | 5 different APIs | ❌ Fragmented |

**Why the 3x speed trade-off is acceptable**: oxc-parser parses 100 TS files in ~50ms, tree-sitter in ~150ms. In a full scan pipeline (parse + extract IR + run detectors + registry checks + scoring + reports), the 100ms difference is <1% of total runtime. The **architectural benefit** — identical analysis depth for all 5 languages — far outweighs this.

**tree-sitter advantages**:
- **Single API**: `parser.setLanguage(lang); parser.parse(source)` — identical for all languages
- **WASM deployment**: Ship `.wasm` grammars (50–150KB each), no native compilation, works everywhere
- **Full CST**: Every token is a node — imports, calls, functions, classes all extractable with positional accuracy
- **Battle-tested**: GitHub code search, Neovim, Zed, Helix, Cursor all use tree-sitter

### 3.2 Unified IR (Intermediate Representation)

tree-sitter CSTs are language-specific (Python has `import_from_statement`, Java has `import_declaration`). The **IR layer** normalizes these into language-neutral structures:

```typescript
// packages/core/src/ir/types.ts

export interface CodeUnit {
  filePath: string;
  language: SupportedLanguage;
  source: string;
  cst: Parser.Tree;           // Raw tree-sitter CST for advanced detectors
  imports: ImportDecl[];       // All import/require/include statements
  functions: FunctionDecl[];   // All function/method declarations
  calls: CallSite[];           // All function/method call sites
  classes: ClassDecl[];        // All class/struct/interface declarations
  symbols: SymbolDecl[];       // All declared identifiers (vars, consts, types, params)
  complexity: ComplexityMetrics;
}

export interface ImportDecl {
  module: string;              // 'lodash', 'os', 'java.util.List', 'github.com/gin/gin'
  bindings: string[];          // ['map', 'filter'] or ['*']
  location: SourceLocation;
  kind: 'value' | 'type' | 'side-effect' | 'static' | 'wildcard';
  isRelative: boolean;
  isBuiltin: boolean;
  resolvedPackage?: string;    // Registry-specific package name for verification
}

export interface FunctionDecl {
  name: string;
  params: string[];
  location: SourceLocation;
  bodyLoc: number;             // Lines of code in body
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maxNestingDepth: number;
  hasStubIndicators: boolean;  // TODO, FIXME, stub, not implemented
  hasEmptyCatch: boolean;
  className?: string;          // Enclosing class (for methods)
}

export interface CallSite {
  callee: string;              // 'readFile', 'println', 'Buffer'
  receiver?: string;           // 'fs', 'System.out', 'ctx'
  location: SourceLocation;
  isMethodCall: boolean;
  qualifiedName?: string;      // 'fs.readFile' (resolved from imports)
}

export interface SymbolDecl {
  name: string;
  kind: 'variable' | 'constant' | 'type' | 'function' | 'class' | 'parameter';
  location: SourceLocation;
}
```

### 3.3 Language-Specific Extractors

Each language implements `IRExtractor` — the **only** place where language-specific CST node types appear:

| Language | CST Import Node | CST Function Node | Built-in Detection | Package Resolution |
|----------|----------------|-------------------|--------------------|--------------------|
| TypeScript/JS | `import_statement` | `function_declaration`, `arrow_function` | `node:*` prefix, Node builtins | npm: `@scope/pkg` or first path segment |
| Python | `import_statement`, `import_from_statement` | `function_definition` | `PYTHON_STDLIB` set | PyPI: top-level module name |
| Java | `import_declaration` | `method_declaration` | `java.*`, `javax.*` prefix | Maven: groupId from import path prefix |
| Go | `import_spec` (in `import_declaration`) | `function_declaration`, `method_declaration` | No dot in first path segment | Go proxy: full module path |
| Kotlin | `import_header` | `function_declaration` | `kotlin.*` prefix | Maven: same as Java |

**Critical design point**: Detectors receive only `CodeUnit` — they never import tree-sitter types or language-specific node names. This makes them truly language-agnostic.

### 3.4 Why This Unifies the Analysis

**Before (V3)**: Each detector re-implements its own regex-based extraction. The `HallucinationDetector` checks `package.json` (TS-only concept) and runs against all languages. The `StaleAPIDetector` loads `deprecated-apis-js.json` and matches `Buffer()` in Kotlin code.

**After (V4)**: The pipeline guarantees that by the time a detector runs:

1. **Imports are already extracted and annotated** — each `ImportDecl` carries `isBuiltin`, `isRelative`, and `resolvedPackage`. The detector asks the registry "does `resolvedPackage` exist?" — it never reads `package.json`.

2. **Symbols are already resolved** — every `CallSite` can be checked against `symbols[]` (declared in file) + `imports[].bindings` (imported into scope). A call to `main()` in Python won't be flagged because `main` is in `symbols[]` as a declared function.

3. **Language-specific deprecation** — the `StaleAPIDetector` receives the `CodeUnit.language` and loads only the deprecation DB for that language. It will never check Node.js deprecations against Kotlin code.

4. **Complexity metrics are pre-computed** — `FunctionDecl.cyclomaticComplexity` is calculated by the extractor using actual tree-sitter nesting analysis, not regex brace-counting.

---

## 4. Two-Stage AI Scan Pipeline

### 4.1 Stage 1: Embedding Recall

**Purpose**: Fast, high-recall scan that identifies code blocks most likely to contain AI-specific defects. This replaces the rule-based "phantom function" detection with a semantic similarity approach.

#### Embedding Model Selection

| Model | Size | Speed | Quality | Local? | Recommendation |
|-------|------|-------|---------|--------|----------------|
| **text-embedding-3-small** (OpenAI) | Remote | ~50ms/batch | Excellent | No | ✅ Default for L3 |
| **jina-embeddings-v3** | 570M | ~20ms/chunk | Very Good | Yes (ONNX) | ✅ Default for L2 |
| **all-MiniLM-L6-v2** | 80M | ~5ms/chunk | Good | Yes (ONNX) | ✅ Fallback local |
| **StarCoder embeddings** | 1.1B | ~40ms/chunk | Best for code | Yes (ONNX) | ⚠️ Consider for future |

**Recommendation**: Ship `all-MiniLM-L6-v2` as the default local model (80MB ONNX, fast enough for CI). Use `text-embedding-3-small` for remote/L3. Support `jina-embeddings-v3` for users who want better local quality.

```typescript
// packages/core/src/ai/embedder/types.ts

export interface EmbeddingProvider {
  readonly name: string;
  readonly dimensions: number;

  /** Embed a batch of text chunks */
  embed(texts: string[]): Promise<Float32Array[]>;

  /** Embed a single text */
  embedOne(text: string): Promise<Float32Array>;
}

export interface EmbeddingResult {
  /** The code block that was embedded */
  chunk: CodeChunk;
  /** Similarity score to closest defect pattern (0-1) */
  defectSimilarity: number;
  /** Similarity score to "AI-generated" patterns (0-1) */
  aiLikelihood: number;
  /** Combined suspicion score (0-1) */
  suspicionScore: number;
}
```

#### Code Block Chunking Strategy

Source code is chunked at **function/method boundaries** (extracted from the IR). Each chunk is one `FunctionDecl` body + its imports context.

```typescript
// packages/core/src/ai/embedder/chunker.ts

export interface CodeChunk {
  /** Source file */
  filePath: string;
  /** Function name (or '<module>' for top-level) */
  scopeName: string;
  /** The code text to embed */
  text: string;
  /** Line range in original file */
  startLine: number;
  endLine: number;
  /** Associated imports (for context) */
  imports: string[];
}

export function chunkCodeUnit(unit: CodeUnit): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  // Chunk per function
  for (const fn of unit.functions) {
    const fnSource = extractLines(unit.source, fn.location.line, fn.location.endLine);
    const importContext = unit.imports
      .filter(i => !i.isRelative)
      .map(i => `import ${i.module}`)
      .join('\n');

    chunks.push({
      filePath: unit.filePath,
      scopeName: fn.className ? `${fn.className}.${fn.name}` : fn.name,
      text: `${importContext}\n\n${fnSource}`,
      startLine: fn.location.line,
      endLine: fn.location.endLine ?? fn.location.line + fn.bodyLoc,
      imports: unit.imports.map(i => i.module),
    });
  }

  // If no functions (e.g., config file), chunk the whole file
  if (chunks.length === 0 && unit.source.length < 5000) {
    chunks.push({
      filePath: unit.filePath,
      scopeName: '<module>',
      text: unit.source,
      startLine: 1,
      endLine: unit.source.split('\n').length,
      imports: unit.imports.map(i => i.module),
    });
  }

  return chunks;
}
```

#### Defect Pattern Database

A curated collection of AI-defect pattern embeddings, organized by category:

```typescript
export interface DefectPattern {
  id: string;
  category: AIDefectCategory;
  description: string;
  /** Pre-computed embedding vector */
  embedding: Float32Array;
  /** Example code snippets that match this pattern */
  examples: string[];
  /** Similarity threshold for flagging (0-1) */
  threshold: number;
}
```

**Initial pattern categories** (~50 patterns):
- **Hallucination patterns**: Code referencing non-existent APIs, impossible method signatures, fabricated library names
- **Stale knowledge patterns**: Usage of APIs deprecated in recent versions, old framework patterns
- **Context loss patterns**: Variable name inconsistency, mid-function style changes, contradictory comments
- **Over-engineering patterns**: Unnecessary abstractions, premature optimization, factory-of-factory patterns
- **Incomplete patterns**: TODO stubs, empty catch blocks, placeholder returns

The pattern DB is shipped as a `.json` file with pre-computed embeddings. It can be updated independently of the codebase.

#### Threshold Tuning

Default thresholds are calibrated against a benchmark of known AI-generated code vs. human-written code:

| Category | Default Threshold | False Positive Target | False Negative Target |
|----------|:-----------------:|:---------------------:|:---------------------:|
| Hallucination | 0.75 | <10% | <20% |
| Stale Knowledge | 0.70 | <15% | <25% |
| Context Loss | 0.65 | <15% | <30% |
| Over-Engineering | 0.60 | <20% | <30% |

Users can adjust thresholds in `.ocrrc.yml`:
```yaml
ai:
  embedding:
    thresholds:
      hallucination: 0.75
      stale-knowledge: 0.70
      context-loss: 0.65
```

### 4.2 Stage 2: LLM Deep Scan

**Purpose**: Take the top-N suspicious code blocks from Stage 1 and send them to an LLM for deep analysis. The LLM provides **precision** — confirming or rejecting the embedding-based suspicions.

#### Prompt Engineering

Three specialized prompt templates, each designed for a specific class of AI defects:

**1. Hallucination Check Prompt**
```
You are a code correctness expert. Analyze the following code block
for potential AI hallucinations.

Check specifically for:
- References to packages/modules that may not exist
- API calls with incorrect signatures (wrong parameter count/types)
- Method calls on objects that don't support those methods
- Fabricated configuration options or environment variables

Code (language: {{language}}):
```{{code}}```

Imports in this file:
{{imports}}

Respond with JSON:
{
  "issues": [
    {
      "line": <number>,
      "type": "phantom-package" | "wrong-api" | "fabricated-config",
      "severity": "critical" | "high" | "medium",
      "description": "<what is wrong>",
      "suggestion": "<how to fix>",
      "confidence": <0.0-1.0>
    }
  ],
  "summary": "<one-line summary>"
}
```

**2. Logic Verification Prompt**
```
You are a code logic expert. Analyze this code for logical correctness
issues that are typical of AI-generated code.

Check for:
- Incomplete error handling (empty catch, swallowed errors)
- Race conditions in async code
- Off-by-one errors in loops
- Null/undefined not handled
- Return value ignored where it matters
- Dead code paths that are unreachable

Code (language: {{language}}):
```{{code}}```

[Same JSON response format]
```

**3. API Correctness Prompt**
```
You are an API expert for {{language}}. Verify that all API calls
in this code use the correct, current API.

Check for:
- Deprecated APIs (suggest current replacement)
- APIs that have changed signature between versions
- APIs from training data that no longer exist
- Mixing APIs from incompatible library versions

Known project dependencies: {{dependencies}}

Code:
```{{code}}```

[Same JSON response format]
```

#### Context Window Management

- **Max chunk size**: 4,000 tokens per code block. Functions exceeding this are split at logical boundaries (nested function declarations, large if-else blocks).
- **Batching**: Up to 3 code blocks per LLM request (to amortize request overhead while staying within context limits).
- **Token budget per scan**: Configurable, default 100K tokens for L3. Prioritize highest-suspicion blocks first.

#### Result Validation

LLM outputs are validated before merging:

```typescript
function validateLLMResult(raw: unknown): LLMIssue[] {
  // 1. Parse JSON (handle markdown code fences)
  // 2. Validate each issue has required fields
  // 3. Verify line numbers are within the chunk's range
  // 4. Reject issues with confidence < 0.3
  // 5. Map severity to our Severity type
  // 6. Deduplicate against Stage 0 structural issues (same file ± 3 lines)
}
```

### 4.3 SLA Level Mapping

| SLA Level | Stage 0 (Structural) | Stage 1 (Embedding) | Stage 2 (LLM) | Speed Target | Cost |
|-----------|:--------------------:|:-------------------:|:--------------:|:------------:|:----:|
| **L1 — Fast Scan** | ✅ Full | ❌ Skip | ❌ Skip | ≤10s / 100 files | Free |
| **L2 — Standard** | ✅ Full | ✅ Local embedding | ❌ Skip | ≤30s / 100 files | Free |
| **L3 — Deep Scan** | ✅ Full | ✅ Remote embedding | ✅ LLM analysis | ≤120s / 100 files | $$$ |

**L1** is the default for pre-commit hooks and quick checks. It runs only structural detectors on the unified IR — already a massive improvement over V3 because it has real parsing and registry verification.

**L2** adds embedding-based pattern matching. Uses a local ONNX embedding model (~80MB). No network calls except registry verification (cached).

**L3** adds LLM deep analysis. Requires API keys (OpenAI/Anthropic/Ollama). Highest precision, highest cost. Recommended for release gates and security audits.

---

## 5. Dynamic Registry Verification

### 5.1 Registry Abstraction

```typescript
// packages/core/src/registry/types.ts

export interface PackageRegistry {
  readonly name: string;
  readonly language: SupportedLanguage;

  /** Check if a package exists and get basic metadata */
  verify(packageName: string): Promise<PackageVerifyResult>;

  /** Check if a specific API/export exists in a package (optional) */
  verifyAPI?(packageName: string, apiPath: string, version?: string): Promise<APIVerifyResult>;

  /** Check if a package or API is deprecated (optional) */
  checkDeprecated?(packageName: string, version?: string): Promise<DeprecatedInfo | null>;
}

export interface PackageVerifyResult {
  name: string;
  exists: boolean;
  /** Latest version (if available) */
  latestVersion?: string;
  /** Deprecation message (if deprecated) */
  deprecation?: string;
  /** When this check was performed */
  checkedAt: number;
  /** Whether the result came from cache */
  fromCache: boolean;
}

export interface APIVerifyResult {
  packageName: string;
  apiPath: string;
  exists: boolean;
  deprecated?: boolean;
  replacement?: string;
}

export interface DeprecatedInfo {
  api: string;
  reason: string;
  replacement?: string;
  since?: string;
  reference?: string;
}
```

### 5.2 Built-in Registries

#### npm Registry (TypeScript/JavaScript)

```typescript
// packages/core/src/registry/npm.ts

export class NpmRegistry implements PackageRegistry {
  readonly name = 'npm';
  readonly language = 'typescript' as SupportedLanguage;

  private baseUrl: string;
  private token?: string;

  constructor(config?: { url?: string; token?: string }) {
    this.baseUrl = config?.url ?? 'https://registry.npmjs.org';
    this.token = config?.token;
  }

  async verify(packageName: string): Promise<PackageVerifyResult> {
    // HEAD request — minimal data transfer
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(packageName)}`, {
      method: