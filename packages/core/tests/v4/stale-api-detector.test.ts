/**
 * StaleAPIDetector Tests
 *
 * Tests detection of deprecated APIs and packages using both
 * registry-based and pattern-based approaches.
 * All registry calls are mocked — no real HTTP.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect, vi } from 'vitest';
import { StaleAPIDetector } from '../../src/detectors/v4/stale-api.js';
import type { DetectorContext } from '../../src/detectors/v4/types.js';
import type { CodeUnit } from '../../src/ir/types.js';
import { createCodeUnit } from '../../src/ir/types.js';
import type { RegistryManager } from '../../src/registry/registry-manager.js';
import type { PackageRegistry, DeprecationInfo } from '../../src/registry/types.js';

// ─── Helper: create a file-level CodeUnit ──────────────────────────

function makeFileUnit(overrides: Partial<CodeUnit> & { file?: string; language?: CodeUnit['language'] }): CodeUnit {
  return createCodeUnit({
    id: `file:${overrides.file || 'test.ts'}`,
    file: overrides.file || 'test.ts',
    language: overrides.language || 'typescript',
    kind: 'file',
    location: { startLine: 0, startColumn: 0, endLine: 100, endColumn: 0 },
    source: overrides.source || '',
    ...overrides,
  });
}

function makeFuncUnit(overrides: Partial<CodeUnit>): CodeUnit {
  return createCodeUnit({
    id: `func:${overrides.file || 'test.ts'}:fn`,
    file: overrides.file || 'test.ts',
    language: overrides.language || 'typescript',
    kind: 'function',
    location: { startLine: 0, startColumn: 0, endLine: 20, endColumn: 0 },
    source: overrides.source || '',
    ...overrides,
  });
}

// ─── Helper: create a mock RegistryManager ─────────────────────────

function createMockRegistryManager(
  deprecationMap: Map<string, DeprecationInfo | null>,
): RegistryManager {
  const mockRegistry: PackageRegistry = {
    name: 'mock',
    language: 'typescript',
    verify: vi.fn().mockResolvedValue({ exists: true, name: 'mock', source: 'registry', latencyMs: 0 }),
    checkDeprecated: vi.fn().mockImplementation(async (name: string) => {
      return deprecationMap.get(name) ?? null;
    }),
  };

  return {
    getRegistry: vi.fn().mockReturnValue(mockRegistry),
    verifyBatch: vi.fn(),
    verifyPackage: vi.fn(),
    cacheStats: vi.fn(),
    persistCache: vi.fn(),
  } as unknown as RegistryManager;
}

function createContext(registryManager?: RegistryManager): DetectorContext {
  return {
    projectRoot: '/project',
    allFiles: ['test.ts'],
    registryManager,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('StaleAPIDetector', () => {
  const detector = new StaleAPIDetector();

  it('should have correct metadata', () => {
    expect(detector.id).toBe('stale-api');
    expect(detector.name).toBe('Stale API Detector');
    expect(detector.category).toBe('code-freshness');
    expect(detector.supportedLanguages).toEqual([]);
  });

  // ── Pattern-based detection ────────────────────────────────────

  it('should detect new Buffer() in TypeScript', async () => {
    const unit = makeFuncUnit({
      source: 'const buf = new Buffer("hello");',
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const bufferResult = results.find(r => r.message.includes('Buffer constructor'));
    expect(bufferResult).toBeDefined();
    expect(bufferResult!.severity).toBe('warning');
    expect(bufferResult!.category).toBe('code-freshness');
    expect(bufferResult!.metadata?.replacement).toContain('Buffer.from');
  });

  it('should detect ioutil.ReadFile in Go', async () => {
    const unit = makeFuncUnit({
      file: 'main.go',
      language: 'go',
      source: 'data, err := ioutil.ReadFile("config.json")',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const ioutilResult = results.find(r => r.message.includes('ioutil') || r.metadata?.replacement === 'os.ReadFile');
    expect(ioutilResult).toBeDefined();
    expect(ioutilResult!.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('should detect optparse in Python via deprecated imports', async () => {
    const unit = makeFileUnit({
      file: 'app.py',
      language: 'python',
      imports: [
        { module: 'optparse', symbols: ['OptionParser'], line: 0, isRelative: false, raw: 'from optparse import OptionParser' },
      ],
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const optparseResult = results.find(r => r.message.includes('optparse'));
    expect(optparseResult).toBeDefined();
    expect(optparseResult!.metadata?.replacement).toBe('argparse');
  });

  it('should detect Vector usage in Java', async () => {
    const unit = makeFuncUnit({
      file: 'App.java',
      language: 'java',
      source: 'Vector<String> list = new Vector<>();',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const vectorResult = results.find(r => r.message.includes('Vector'));
    expect(vectorResult).toBeDefined();
    expect(vectorResult!.metadata?.replacement).toContain('ArrayList');
  });

  it('should detect StringBuffer usage in Java', async () => {
    const unit = makeFuncUnit({
      file: 'App.java',
      language: 'java',
      source: 'StringBuffer sb = new StringBuffer();',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    const sbResult = results.find(r => r.message.includes('StringBuffer'));
    expect(sbResult).toBeDefined();
  });

  // ── Registry-based deprecation ─────────────────────────────────

  it('should detect registry-level deprecation (mock)', async () => {
    const unit = makeFileUnit({
      imports: [
        { module: 'deprecated-pkg', symbols: ['x'], line: 3, isRelative: false, raw: "import { x } from 'deprecated-pkg'" },
      ],
    });

    const deprecationMap = new Map<string, DeprecationInfo | null>([
      ['deprecated-pkg', {
        deprecated: true,
        message: 'This package is no longer maintained',
        replacement: 'better-pkg',
        since: '2023-01-01',
      }],
    ]);

    const results = await detector.detect([unit], createContext(createMockRegistryManager(deprecationMap)));
    // Should find registry-based deprecation
    const registryResult = results.find(r => r.metadata?.source === 'registry');
    expect(registryResult).toBeDefined();
    expect(registryResult!.message).toContain('deprecated-pkg');
    expect(registryResult!.message).toContain('better-pkg');
    expect(registryResult!.confidence).toBe(0.95);
  });

  it('should not flag current APIs', async () => {
    const unit = makeFuncUnit({
      source: `
const data = Buffer.from("hello");
const url = new URL("https://example.com");
const exists = fs.existsSync("./file");
      `.trim(),
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    // None of these should match deprecated patterns
    expect(results.filter(r => r.message.includes('Buffer constructor'))).toHaveLength(0);
  });

  it('should have correct per-language pattern matching (not cross-pollinate)', async () => {
    // Python patterns should not fire on TypeScript code
    const tsUnit = makeFuncUnit({
      source: 'import optparse from "optparse-cli";', // npm package, not Python
      language: 'typescript',
    });

    const results = await detector.detect([tsUnit], createContext());
    // The Python-specific "import optparse" pattern should not match here
    // because it uses \bimport\s+optparse\b which is Python-specific import syntax
    const optparseResults = results.filter(r => r.message.includes('optparse'));
    expect(optparseResults).toHaveLength(0);
  });

  it('should assign appropriate confidence levels', async () => {
    const unit = makeFuncUnit({
      source: 'const buf = new Buffer(10);',
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    expect(results.length).toBeGreaterThanOrEqual(1);
    // All results should have confidence between 0 and 1
    for (const r of results) {
      expect(r.confidence).toBeGreaterThan(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('should detect deprecated io/ioutil import in Go', async () => {
    const unit = makeFileUnit({
      file: 'main.go',
      language: 'go',
      imports: [
        { module: 'io/ioutil', symbols: [], line: 2, isRelative: false, raw: '"io/ioutil"' },
      ],
    });

    const results = await detector.detect([unit], createContext());
    const ioutilResult = results.find(r => r.message.includes('io/ioutil') || r.message.includes('ioutil'));
    expect(ioutilResult).toBeDefined();
  });

  it('should detect asyncio.coroutine in Python', async () => {
    const unit = makeFuncUnit({
      file: 'app.py',
      language: 'python',
      source: '@asyncio.coroutine\ndef my_coroutine():\n    pass',
    });

    const results = await detector.detect([unit], createContext());
    const asyncResult = results.find(r => r.message.includes('asyncio.coroutine') || r.metadata?.replacement === 'async def');
    expect(asyncResult).toBeDefined();
  });

  it('should detect kotlin.coroutines.experimental in Kotlin', async () => {
    const unit = makeFuncUnit({
      file: 'App.kt',
      language: 'kotlin',
      source: 'import kotlin.coroutines.experimental.CoroutineContext',
    });

    const results = await detector.detect([unit], createContext());
    const kotlinResult = results.find(r => r.message.includes('coroutines') || r.metadata?.replacement === 'kotlin.coroutines');
    expect(kotlinResult).toBeDefined();
  });

  it('should not flag when registry says not deprecated', async () => {
    const unit = makeFileUnit({
      imports: [
        { module: 'active-pkg', symbols: ['x'], line: 0, isRelative: false, raw: "import { x } from 'active-pkg'" },
      ],
    });

    const deprecationMap = new Map<string, DeprecationInfo | null>([
      ['active-pkg', null], // Not deprecated
    ]);

    const results = await detector.detect([unit], createContext(createMockRegistryManager(deprecationMap)));
    const registryResults = results.filter(r => r.metadata?.source === 'registry');
    expect(registryResults).toHaveLength(0);
  });

  it('should detect url.parse() in TypeScript', async () => {
    const unit = makeFuncUnit({
      source: 'const parsed = url.parse(myUrl);',
      language: 'typescript',
    });

    const results = await detector.detect([unit], createContext());
    const urlResult = results.find(r => r.message.includes('url.parse'));
    expect(urlResult).toBeDefined();
  });

  it('should detect Go deprecated io/ioutil package import', async () => {
    const unit = makeFuncUnit({
      file: 'main.go',
      language: 'go',
      source: 'import "io/ioutil"',
    });

    const results = await detector.detect([unit], createContext());
    const ioutilResult = results.find(r => r.message.includes('io/ioutil'));
    expect(ioutilResult).toBeDefined();
  });

  it('should detect Java Thread.stop() deprecated usage', async () => {
    const unit = makeFuncUnit({
      file: 'App.java',
      language: 'java',
      source: 'Thread.stop();',
    });

    const results = await detector.detect([unit], createContext());
    const stopResult = results.find(r => r.message.includes('Thread.stop'));
    expect(stopResult).toBeDefined();
    expect(stopResult!.confidence).toBe(0.95);
  });

  it('should detect Kotlin experimental coroutines', async () => {
    const unit = makeFuncUnit({
      file: 'Coroutine.kt',
      language: 'kotlin',
      source: 'import kotlin.coroutines.experimental.Continuation',
    });

    const results = await detector.detect([unit], createContext());
    const expResult = results.find(r => r.message.includes('coroutines') && r.metadata?.replacement === 'kotlin.coroutines');
    expect(expResult).toBeDefined();
  });

  it('should detect Python distutils import as deprecated', async () => {
    const unit = makeFileUnit({
      file: 'setup.py',
      language: 'python',
      imports: [
        { module: 'distutils', symbols: ['setup'], line: 1, isRelative: false, raw: 'from distutils import setup' },
      ],
    });

    const results = await detector.detect([unit], createContext());
    const distutilsResult = results.find(r => r.message.includes('distutils'));
    expect(distutilsResult).toBeDefined();
    expect(distutilsResult!.metadata?.replacement).toBe('setuptools');
  });

  // ── React deprecated lifecycle detection ────────────────────────

  it('should detect React componentWillMount', async () => {
    const unit = makeFuncUnit({
      file: 'MyComponent.tsx',
      language: 'typescript',
      source: 'componentWillMount() {\n    this.fetchData();\n  }',
    });

    const results = await detector.detect([unit], createContext());
    const cwmResult = results.find(r => r.message.includes('componentWillMount'));
    expect(cwmResult).toBeDefined();
    expect(cwmResult!.confidence).toBeGreaterThanOrEqual(0.9);
    expect(cwmResult!.metadata?.since).toBe('React 16.3');
  });

  it('should detect React componentWillReceiveProps', async () => {
    const unit = makeFuncUnit({
      file: 'MyComponent.tsx',
      language: 'typescript',
      source: 'componentWillReceiveProps(nextProps) {\n    this.setState({ data: nextProps.data });\n  }',
    });

    const results = await detector.detect([unit], createContext());
    const cwrpResult = results.find(r => r.message.includes('componentWillReceiveProps'));
    expect(cwrpResult).toBeDefined();
  });

  it('should detect React findDOMNode', async () => {
    const unit = makeFuncUnit({
      file: 'MyComponent.tsx',
      language: 'typescript',
      source: 'const node = findDOMNode(this);',
    });

    const results = await detector.detect([unit], createContext());
    const fdnResult = results.find(r => r.message.includes('findDOMNode'));
    expect(fdnResult).toBeDefined();
    expect(fdnResult!.metadata?.since).toBe('React 18');
  });

  it('should detect React ReactDOM.render (React 18)', async () => {
    const unit = makeFuncUnit({
      file: 'index.tsx',
      language: 'typescript',
      source: 'ReactDOM.render(<App />, document.getElementById("root"));',
    });

    const results = await detector.detect([unit], createContext());
    const renderResult = results.find(r => r.message.includes('ReactDOM.render'));
    expect(renderResult).toBeDefined();
    expect(renderResult!.metadata?.replacement).toContain('createRoot');
  });

  it('should detect React ReactDOM.hydrate (React 18)', async () => {
    const unit = makeFuncUnit({
      file: 'index.tsx',
      language: 'typescript',
      source: 'ReactDOM.hydrate(<App />, document.getElementById("root"));',
    });

    const results = await detector.detect([unit], createContext());
    const hydrateResult = results.find(r => r.message.includes('hydrate'));
    expect(hydrateResult).toBeDefined();
  });

  it('should detect React this.isMounted anti-pattern', async () => {
    const unit = makeFuncUnit({
      file: 'MyComponent.tsx',
      language: 'typescript',
      source: 'if (this.isMounted()) {\n    this.setState({ loading: false });\n  }',
    });

    const results = await detector.detect([unit], createContext());
    const mountedResult = results.find(r => r.message.includes('isMounted'));
    expect(mountedResult).toBeDefined();
  });

  it('should detect React React.createFactory', async () => {
    const unit = makeFuncUnit({
      file: 'factory.tsx',
      language: 'typescript',
      source: 'const divFactory = React.createFactory("div");',
    });

    const results = await detector.detect([unit], createContext());
    const factoryResult = results.find(r => r.message.includes('createFactory'));
    expect(factoryResult).toBeDefined();
  });

  it('should detect React UNSAFE_ lifecycle methods', async () => {
    const unit = makeFuncUnit({
      file: 'LegacyComponent.tsx',
      language: 'typescript',
      source: 'UNSAFE_componentWillMount() {\n    this.loadData();\n  }',
    });

    const results = await detector.detect([unit], createContext());
    const unsafeResult = results.find(r => r.message.includes('UNSAFE_componentWillMount'));
    expect(unsafeResult).toBeDefined();
  });

  // ── Vue deprecated API detection ───────────────────────────────

  it('should detect Vue 2 this.$set (removed in Vue 3)', async () => {
    const unit = makeFuncUnit({
      file: 'MyComponent.vue',
      language: 'typescript',
      source: 'this.$set(this.items, index, newValue);',
    });

    const results = await detector.detect([unit], createContext());
    const setResult = results.find(r => r.message.includes('$set'));
    expect(setResult).toBeDefined();
    expect(setResult!.metadata?.since).toBe('Vue 3');
  });

  it('should detect Vue 2 event bus (this.$on)', async () => {
    const unit = makeFuncUnit({
      file: 'MyComponent.vue',
      language: 'typescript',
      source: 'this.$on("event-name", this.handler);',
    });

    const results = await detector.detect([unit], createContext());
    const onResult = results.find(r => r.message.includes('$on'));
    expect(onResult).toBeDefined();
  });

  it('should detect Vue 2 $children (removed in Vue 3)', async () => {
    const unit = makeFuncUnit({
      file: 'ParentComponent.vue',
      language: 'typescript',
      source: 'const child = this.$children[0];',
    });

    const results = await detector.detect([unit], createContext());
    const childrenResult = results.find(r => r.message.includes('$children'));
    expect(childrenResult).toBeDefined();
  });

  it('should detect Vue 2 new Vue() (removed in Vue 3)', async () => {
    const unit = makeFuncUnit({
      file: 'main.js',
      language: 'javascript',
      source: 'new Vue({\n  render: h => h(App),\n}).$mount("#app");',
    });

    const results = await detector.detect([unit], createContext());
    const newVueResult = results.find(r => r.message.includes('new Vue'));
    expect(newVueResult).toBeDefined();
  });

  it('should detect Vue 2 Vue.filter (removed in Vue 3)', async () => {
    const unit = makeFuncUnit({
      file: 'filters.js',
      language: 'javascript',
      source: 'Vue.filter("uppercase", (value) => value.toUpperCase());',
    });

    const results = await detector.detect([unit], createContext());
    const filterResult = results.find(r => r.message.includes('Vue.filter') || r.message.includes('Filters are removed'));
    expect(filterResult).toBeDefined();
    expect(filterResult!.metadata?.since).toBe('Vue 3');
  });

  it('should detect Vue 2 .sync modifier (removed in Vue 3)', async () => {
    const unit = makeFuncUnit({
      file: 'Parent.vue',
      language: 'typescript',
      source: '<Child v-bind:title.sync="pageTitle" />',
    });

    const results = await detector.detect([unit], createContext());
    const syncResult = results.find(r => r.message.includes('.sync'));
    expect(syncResult).toBeDefined();
    expect(syncResult!.metadata?.since).toBe('Vue 3');
  });

  it('should detect Vue 2 this.$listeners (merged into $attrs in Vue 3)', async () => {
    const unit = makeFuncUnit({
      file: 'Child.vue',
      language: 'typescript',
      source: 'const listeners = this.$listeners;',
    });

    const results = await detector.detect([unit], createContext());
    const listenersResult = results.find(r => r.message.includes('$listeners'));
    expect(listenersResult).toBeDefined();
  });

  // ── Angular deprecated API detection ───────────────────────────

  it('should detect Angular deprecated HttpClientModule', async () => {
    const unit = makeFuncUnit({
      file: 'app.module.ts',
      language: 'typescript',
      source: "import { HttpClientModule } from '@angular/common/http';",
    });

    const results = await detector.detect([unit], createContext());
    const httpResult = results.find(r => r.message.includes('HttpClientModule'));
    expect(httpResult).toBeDefined();
    expect(httpResult!.metadata?.since).toBe('Angular 17');
  });

  it('should detect Angular deprecated BrowserAnimationsModule', async () => {
    const unit = makeFuncUnit({
      file: 'app.module.ts',
      language: 'typescript',
      source: "import { BrowserAnimationsModule } from '@angular/platform-browser/animations';",
    });

    const results = await detector.detect([unit], createContext());
    const animResult = results.find(r => r.message.includes('BrowserAnimationsModule'));
    expect(animResult).toBeDefined();
  });

  it('should detect Angular deprecated Renderer (should use Renderer2)', async () => {
    const unit = makeFuncUnit({
      file: 'MyDirective.ts',
      language: 'typescript',
      source: 'constructor(private renderer: Renderer) {}',
    });

    const results = await detector.detect([unit], createContext());
    const rendererResult = results.find(r => r.message.includes('Renderer'));
    expect(rendererResult).toBeDefined();
    expect(rendererResult!.metadata?.replacement).toContain('Renderer2');
  });

  // ── Cross-framework: no cross-pollination ──────────────────────

  it('should not detect React/Vue patterns in Python files', async () => {
    const unit = makeFuncUnit({
      file: 'views.py',
      language: 'python',
      source: 'def componentWillMount(self): # Django, not React\n    pass',
    });

    const results = await detector.detect([unit], createContext());
    const reactResults = results.filter(r =>
      r.message.includes('componentWillMount') &&
      r.metadata?.since === 'React 16.3',
    );
    expect(reactResults).toHaveLength(0);
  });

  it('should not detect React/Vue patterns in Go files', async () => {
    const unit = makeFuncUnit({
      file: 'main.go',
      language: 'go',
      source: 'func componentDidMount() {} // Go, not React',
    });

    const results = await detector.detect([unit], createContext());
    const reactResults = results.filter(r =>
      r.message.includes('componentDidMount'),
    );
    expect(reactResults).toHaveLength(0);
  });
});
