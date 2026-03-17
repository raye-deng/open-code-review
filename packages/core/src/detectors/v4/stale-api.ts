/**
 * StaleAPIDetector — V4 detector for deprecated APIs and packages.
 *
 * AI models are trained on historical data and frequently generate code using
 * APIs that have since been deprecated. This detector catches them through:
 * 1. Dynamic registry deprecation checks (npm deprecated field, etc.)
 * 2. Well-known per-language deprecated API patterns
 *
 * V4 improvements over V3:
 * - Registry-based deprecation checks instead of hardcoded data
 * - Operates on CodeUnit IR (calls + imports)
 * - Per-language deprecation pattern database
 * - Confidence scoring based on deprecation source
 *
 * @since 0.4.0
 */

import type { CodeUnit, SupportedLanguage } from '../../ir/types.js';
import type { V4Detector, DetectorResult, DetectorCategory, DetectorContext } from './types.js';

// ─── Deprecated Pattern Definition ────────────────────────────────

/** Definition of a deprecated API pattern for detection. */
export interface DeprecatedPattern {
  /** Pattern to match in call expressions (callee string) */
  pattern: string | RegExp;
  /** What replaces it */
  replacement: string;
  /** Since when deprecated */
  since?: string;
  /** Confidence level */
  confidence: number;
  /** Human-readable description */
  description?: string;
}

// ─── Well-known deprecation patterns per language ──────────────────

const TYPESCRIPT_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bnew\s+Buffer\b/,
    replacement: 'Buffer.from() / Buffer.alloc()',
    since: 'Node.js 6',
    confidence: 0.95,
    description: 'Buffer constructor is deprecated due to security and usability issues',
  },
  {
    pattern: /\burl\.parse\b/,
    replacement: 'new URL()',
    since: 'Node.js 11',
    confidence: 0.85,
    description: 'url.parse() is deprecated in favor of the WHATWG URL API',
  },
  {
    pattern: /\bfs\.exists\b/,
    replacement: 'fs.existsSync() or fs.access()',
    since: 'Node.js 1.0',
    confidence: 0.9,
    description: 'fs.exists() is deprecated; use fs.existsSync() or fs.access()',
  },
  {
    pattern: /\brequire\s*\(\s*['"]querystring['"]\s*\)/,
    replacement: 'URLSearchParams',
    since: 'Node.js 12',
    confidence: 0.8,
    description: 'querystring module is deprecated in favor of URLSearchParams',
  },
  {
    pattern: /\brequire\s*\(\s*['"]domain['"]\s*\)/,
    replacement: 'async_hooks or structured error handling',
    since: 'Node.js 4',
    confidence: 0.9,
    description: 'domain module is deprecated and pending removal',
  },
  {
    pattern: /\brequire\s*\(\s*['"]punycode['"]\s*\)/,
    replacement: 'Use a userland alternative or URL API',
    since: 'Node.js 7',
    confidence: 0.8,
    description: 'punycode module is deprecated',
  },
  {
    pattern: /\bSlowBuffer\b/,
    replacement: 'Buffer.allocUnsafeSlow()',
    since: 'Node.js 6',
    confidence: 0.9,
    description: 'SlowBuffer is deprecated in favor of Buffer.allocUnsafeSlow()',
  },
];

// ── React deprecated lifecycle methods & APIs ──────────────────────

const REACT_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bcomponentWillMount\b/,
    replacement: 'componentDidMount or useEffect',
    since: 'React 16.3',
    confidence: 0.95,
    description: 'componentWillMount is unsafe for async rendering. Use componentDidMount or useEffect instead.',
  },
  {
    pattern: /\bcomponentWillReceiveProps\b/,
    replacement: 'getDerivedStateFromProps or componentDidUpdate',
    since: 'React 16.3',
    confidence: 0.95,
    description: 'componentWillReceiveProps is unsafe for async rendering. Use static getDerivedStateFromProps or componentDidUpdate.',
  },
  {
    pattern: /\bcomponentWillUpdate\b/,
    replacement: 'getSnapshotBeforeUpdate or componentDidUpdate',
    since: 'React 16.3',
    confidence: 0.95,
    description: 'componentWillUpdate is unsafe for async rendering. Use getSnapshotBeforeUpdate or componentDidUpdate.',
  },
  {
    pattern: /\bgetDefaultProps\b/,
    replacement: 'static defaultProps class property',
    since: 'React 16.3',
    confidence: 0.9,
    description: 'getDefaultProps is deprecated. Use static defaultProps as a class property.',
  },
  {
    pattern: /\bReact\.createFactory\b/,
    replacement: 'React.createElement or JSX',
    since: 'React 16',
    confidence: 0.9,
    description: 'React.createFactory is deprecated. Use React.createElement or JSX directly.',
  },
  {
    pattern: /\bReact\.DOM\b/,
    replacement: 'react-dom package',
    since: 'React 15.5',
    confidence: 0.9,
    description: 'React.DOM is removed. Import from react-dom instead.',
  },
  {
    pattern: /\bfindDOMNode\b/,
    replacement: 'React refs (useRef / React.createRef)',
    since: 'React 18',
    confidence: 0.95,
    description: 'findDOMNode is deprecated and removed in strict mode. Use React refs instead.',
  },
  {
    pattern: /\bString\s+refs\s*\(this\.refs\)/,
    replacement: 'React.createRef() or useRef()',
    since: 'React 16.3',
    confidence: 0.85,
    description: 'String refs are deprecated. Use React.createRef() or useRef() callback refs.',
  },
  {
    pattern: /\bthis\.isMounted\b/,
    replacement: 'componentDidMount + cleanup in componentWillUnmount',
    since: 'React 16',
    confidence: 0.95,
    description: 'isMounted is deprecated as an anti-pattern. Restructure to use proper lifecycle cleanup.',
  },
  {
    pattern: /\bUNSAFE_componentWillMount\b/,
    replacement: 'componentDidMount or useEffect',
    since: 'React 16.3',
    confidence: 0.9,
    description: 'UNSAFE_componentWillMount still exists but is a migration path only. Move to useEffect.',
  },
  {
    pattern: /\bUNSAFE_componentWillReceiveProps\b/,
    replacement: 'getDerivedStateFromProps or componentDidUpdate',
    since: 'React 16.3',
    confidence: 0.9,
    description: 'UNSAFE_componentWillReceiveProps is a migration path only. Move to getDerivedStateFromProps.',
  },
  {
    pattern: /\bUNSAFE_componentWillUpdate\b/,
    replacement: 'getSnapshotBeforeUpdate or componentDidUpdate',
    since: 'React 16.3',
    confidence: 0.9,
    description: 'UNSAFE_componentWillUpdate is a migration path only. Move to getSnapshotBeforeUpdate.',
  },
  {
    pattern: /\bReact\.PureComponent\s*\(\s*\{\s*\}/,
    replacement: 'React.memo() for functional components',
    since: 'React 16.6+',
    confidence: 0.7,
    description: 'Consider using React.memo() for functional components instead of PureComponent class.',
  },
  {
    pattern: /\blegacyRenderSubtreeIntoContainer\b/,
    replacement: 'createRoot().render()',
    since: 'React 18',
    confidence: 0.95,
    description: 'ReactDOM.render is replaced by createRoot().render() in React 18.',
  },
  {
    pattern: /\bReactDOM\.render\b/,
    replacement: 'createRoot().render()',
    since: 'React 18',
    confidence: 0.95,
    description: 'ReactDOM.render is deprecated in React 18. Use createRoot from react-dom/client.',
  },
  {
    pattern: /\bReactDOM\.hydrate\b/,
    replacement: 'hydrateRoot()',
    since: 'React 18',
    confidence: 0.95,
    description: 'ReactDOM.hydrate is deprecated in React 18. Use hydrateRoot from react-dom/client.',
  },
  {
    pattern: /\bReactDOM\.unmountComponentAtNode\b/,
    replacement: 'root.unmount()',
    since: 'React 18',
    confidence: 0.95,
    description: 'unmountComponentAtNode is deprecated in React 18. Use root.unmount() instead.',
  },
];

// ── Vue deprecated APIs ────────────────────────────────────────────

const VUE_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bVue\.set\b/,
    replacement: 'Direct assignment (reactiveProxy.prop = value)',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'Vue.set is not needed in Vue 3 — the reactivity system handles it natively.',
  },
  {
    pattern: /\bVue\.delete\b/,
    replacement: 'delete reactiveProxy.prop',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'Vue.delete is not needed in Vue 3 — use the native delete operator.',
  },
  {
    pattern: /\bthis\.\$set\b/,
    replacement: 'Direct assignment',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'this.$set is removed in Vue 3. Reactivity handles reassignment natively.',
  },
  {
    pattern: /\bthis\.\$delete\b/,
    replacement: 'delete this.prop',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'this.$delete is removed in Vue 3. Use native delete.',
  },
  {
    pattern: /\bthis\.\$on\b/,
    replacement: 'mitt or provide/inject',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'this.$on (event bus) is removed in Vue 3. Use an external event emitter like mitt.',
  },
  {
    pattern: /\bthis\.\$off\b/,
    replacement: 'mitt or provide/inject',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'this.$off is removed in Vue 3. Use an external event emitter.',
  },
  {
    pattern: /\bthis\.\$once\b/,
    replacement: 'mitt or provide/inject',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'this.$once is removed in Vue 3.',
  },
  {
    pattern: /\bthis\.\$listeners\b/,
    replacement: '$attrs (Vue 3 merges $listeners into $attrs)',
    since: 'Vue 3',
    confidence: 0.9,
    description: '$listeners is removed in Vue 3 — listeners are now part of $attrs.',
  },
  {
    pattern: /\bthis\.\$children\b/,
    replacement: 'template refs or provide/inject',
    since: 'Vue 3',
    confidence: 0.95,
    description: '$children is removed in Vue 3. Use template refs or provide/inject.',
  },
  {
    pattern: /\bthis\.\$scopedSlots\b/,
    replacement: '$slots (Vue 3 unifies $slots and $scopedSlots)',
    since: 'Vue 3',
    confidence: 0.9,
    description: '$scopedSlots is removed in Vue 3. Use $slots for all slots.',
  },
  {
    pattern: /\bVue\.filter\b/,
    replacement: 'computed properties or methods',
    since: 'Vue 3',
    confidence: 0.95,
    description: 'Filters are removed in Vue 3. Use computed properties or method calls in templates.',
  },
  {
    pattern: /\bVue\.directive\b/,
    replacement: 'app.directive()',
    since: 'Vue 3',
    confidence: 0.85,
    description: 'Vue.directive is removed in Vue 3. Register directives on the app instance.',
  },
  {
    pattern: /\bVue\.component\b/,
    replacement: 'app.component()',
    since: 'Vue 3',
    confidence: 0.8,
    description: 'Vue.component global registration syntax changed in Vue 3. Use app.component().',
  },
  {
    pattern: /\bVue\.mixin\b/,
    replacement: 'composables or provide/inject',
    since: 'Vue 3',
    confidence: 0.9,
    description: 'Vue.mixin is removed in Vue 3. Use composables or provide/inject for shared logic.',
  },
  {
    pattern: /\bVue\.use\b/,
    replacement: 'app.use()',
    since: 'Vue 3',
    confidence: 0.85,
    description: 'Vue.use plugin installation changed in Vue 3. Use app.use() on the app instance.',
  },
  {
    pattern: /\bnew\s+Vue\b/,
    replacement: 'createApp()',
    since: 'Vue 3',
    confidence: 0.85,
    description: 'new Vue() constructor is removed in Vue 3. Use createApp() from vue.',
  },
  {
    pattern: /\bv-bind:\w+\.sync\b/,
    replacement: 'v-model:propName',
    since: 'Vue 3',
    confidence: 0.95,
    description: '.sync modifier is removed in Vue 3. Use v-model:propName instead.',
  },
  {
    pattern: /\.\w+\.sync(?:\s|=|>|$)/,
    replacement: 'v-model:propName',
    since: 'Vue 3',
    confidence: 0.85,
    description: '.sync modifier is removed in Vue 3. Use v-model:propName instead.',
  },
  {
    pattern: /\bv-on\.native\b/,
    replacement: 'emits option',
    since: 'Vue 3',
    confidence: 0.95,
    description: '.native modifier is removed in Vue 3. Use the emits option to declare component events.',
  },
];

// ── Angular deprecated APIs ────────────────────────────────────────

const ANGULAR_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bHttpClientModule\b/,
    replacement: 'provideHttpClient()',
    since: 'Angular 17',
    confidence: 0.9,
    description: 'HttpClientModule is deprecated in Angular 17+. Use provideHttpClient() in app.config.',
  },
  {
    pattern: /\bBrowserAnimationsModule\b/,
    replacement: 'provideAnimations() or provideAnimationsAsync()',
    since: 'Angular 17',
    confidence: 0.9,
    description: 'BrowserAnimationsModule is deprecated in Angular 17+. Use provideAnimations() in app.config.',
  },
  {
    pattern: /\b\@angular\/platform-browser-dynamic\b/,
    replacement: 'bootstrapApplication()',
    since: 'Angular 17',
    confidence: 0.7,
    description: 'platformBrowserDynamic().bootstrapModule() is the legacy bootstrap method. Use bootstrapApplication().',
  },
  {
    pattern: /\bViewChild\b.*?\bstatic\s*:\s*true\b/,
    replacement: 'signals-based ViewChild (no static flag needed)',
    since: 'Angular 17+',
    confidence: 0.7,
    description: 'ViewChild static flag is being phased out. Consider using Angular signals.',
  },
  {
    pattern: /\bRenderer\b/,
    replacement: 'Renderer2',
    since: 'Angular 4+',
    confidence: 0.85,
    description: 'Renderer is deprecated since Angular 4. Use Renderer2 instead.',
  },
  {
    pattern: /\b\@angular\/common\/http\/\$Http\b/,
    replacement: 'HttpClient',
    since: 'Angular 5',
    confidence: 0.95,
    description: 'The legacy Http service is removed. Use HttpClient from @angular/common/http.',
  },
];

const PYTHON_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bimport\s+optparse\b/,
    replacement: 'argparse',
    since: 'Python 3.2',
    confidence: 0.95,
    description: 'optparse is deprecated in favor of argparse',
  },
  {
    pattern: /\bimport\s+imp\b/,
    replacement: 'importlib',
    since: 'Python 3.4',
    confidence: 0.95,
    description: 'imp module is deprecated in favor of importlib',
  },
  {
    pattern: /\bcollections\.MutableMapping\b/,
    replacement: 'collections.abc.MutableMapping',
    since: 'Python 3.3',
    confidence: 0.9,
    description: 'Direct access to abstract base classes from collections is deprecated',
  },
  {
    pattern: /\bcollections\.MutableSequence\b/,
    replacement: 'collections.abc.MutableSequence',
    since: 'Python 3.3',
    confidence: 0.9,
    description: 'Direct access to abstract base classes from collections is deprecated',
  },
  {
    pattern: /\bcollections\.MutableSet\b/,
    replacement: 'collections.abc.MutableSet',
    since: 'Python 3.3',
    confidence: 0.9,
    description: 'Direct access to abstract base classes from collections is deprecated',
  },
  {
    pattern: /\basyncio\.coroutine\b/,
    replacement: 'async def',
    since: 'Python 3.8',
    confidence: 0.95,
    description: '@asyncio.coroutine decorator is deprecated in favor of async def',
  },
  {
    pattern: /\bimport\s+distutils\b/,
    replacement: 'setuptools',
    since: 'Python 3.10',
    confidence: 0.9,
    description: 'distutils is deprecated and removed in Python 3.12',
  },
  {
    pattern: /\bimport\s+cgi\b/,
    replacement: 'urllib.parse or email.message',
    since: 'Python 3.11',
    confidence: 0.85,
    description: 'cgi module is deprecated',
  },
];

const JAVA_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bnew\s+Date\(\)/,
    replacement: 'LocalDateTime.now() / Instant.now()',
    since: 'Java 8',
    confidence: 0.7,
    description: 'java.util.Date is largely deprecated in favor of java.time API',
  },
  {
    pattern: /\bVector\b/,
    replacement: 'ArrayList (or Collections.synchronizedList)',
    since: 'Java 1.2',
    confidence: 0.85,
    description: 'Vector is legacy; use ArrayList or CopyOnWriteArrayList',
  },
  {
    pattern: /\bStringBuffer\b/,
    replacement: 'StringBuilder',
    since: 'Java 1.5',
    confidence: 0.8,
    description: 'StringBuffer is slower than StringBuilder; use StringBuilder unless thread-safety needed',
  },
  {
    pattern: /\bThread\.stop\b/,
    replacement: 'Thread interruption pattern',
    since: 'Java 1.2',
    confidence: 0.95,
    description: 'Thread.stop() is deprecated because it is inherently unsafe',
  },
  {
    pattern: /\bThread\.suspend\b/,
    replacement: 'Use wait/notify or LockSupport',
    since: 'Java 1.2',
    confidence: 0.95,
    description: 'Thread.suspend() is deprecated due to deadlock risks',
  },
  {
    pattern: /\bThread\.resume\b/,
    replacement: 'Use wait/notify or LockSupport',
    since: 'Java 1.2',
    confidence: 0.95,
    description: 'Thread.resume() is deprecated due to deadlock risks',
  },
  {
    pattern: /\bHashtable\b/,
    replacement: 'HashMap or ConcurrentHashMap',
    since: 'Java 1.2',
    confidence: 0.8,
    description: 'Hashtable is legacy; use HashMap or ConcurrentHashMap',
  },
  {
    pattern: /\bRuntime\.getRuntime\(\)\.exec\b/,
    replacement: 'ProcessBuilder',
    since: 'Java 9',
    confidence: 0.7,
    description: 'Runtime.exec() has known issues; prefer ProcessBuilder',
  },
];

const GO_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bioutil\.ReadFile\b/,
    replacement: 'os.ReadFile',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use os.ReadFile',
  },
  {
    pattern: /\bioutil\.WriteFile\b/,
    replacement: 'os.WriteFile',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use os.WriteFile',
  },
  {
    pattern: /\bioutil\.ReadAll\b/,
    replacement: 'io.ReadAll',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use io.ReadAll',
  },
  {
    pattern: /\bioutil\.TempDir\b/,
    replacement: 'os.MkdirTemp',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use os.MkdirTemp',
  },
  {
    pattern: /\bioutil\.TempFile\b/,
    replacement: 'os.CreateTemp',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use os.CreateTemp',
  },
  {
    pattern: /\bioutil\.ReadDir\b/,
    replacement: 'os.ReadDir',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use os.ReadDir',
  },
  {
    pattern: /\bioutil\.NopCloser\b/,
    replacement: 'io.NopCloser',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'io/ioutil is deprecated; use io.NopCloser',
  },
  {
    pattern: /\bimport\s+["']io\/ioutil["']/,
    replacement: 'io and os packages',
    since: 'Go 1.16',
    confidence: 0.95,
    description: 'The entire io/ioutil package is deprecated since Go 1.16',
  },
];

const KOTLIN_DEPRECATIONS: DeprecatedPattern[] = [
  {
    pattern: /\bkotlin\.coroutines\.experimental\b/,
    replacement: 'kotlin.coroutines',
    since: 'Kotlin 1.3',
    confidence: 0.95,
    description: 'Experimental coroutines API is deprecated; use stable kotlin.coroutines',
  },
  {
    pattern: /\bwithDefault\b/,
    replacement: 'getOrElse or getOrPut',
    since: 'Kotlin 1.0',
    confidence: 0.5,
    description: 'withDefault creates a wrapper map; prefer getOrElse/getOrPut for simpler cases',
  },
  {
    pattern: /\bprint\b\s*\(/,
    replacement: 'kotlin.io.println',
    since: 'Kotlin 1.0',
    confidence: 0.4,
    description: 'print() without newline is rarely needed in server-side code; prefer println()',
  },
  {
    pattern: /\b!!\b(?!\s*[.=])/,
    replacement: 'Safe call (?.) or let { }',
    since: 'Kotlin 1.0',
    confidence: 0.55,
    description: 'Non-null assertion (!!) can cause NullPointerException. Prefer safe calls (?.) or null checks.',
  },
  // Kotlin inherits Java deprecations
  ...JAVA_DEPRECATIONS,
];

// ─── Deprecation patterns map ──────────────────────────────────────

/** Combined TypeScript/JavaScript patterns including Node.js + React + Vue + Angular. */
const TS_JS_DEPRECATIONS: DeprecatedPattern[] = [
  ...TYPESCRIPT_DEPRECATIONS,
  ...REACT_DEPRECATIONS,
  ...VUE_DEPRECATIONS,
  ...ANGULAR_DEPRECATIONS,
];

const DEPRECATION_PATTERNS: Map<SupportedLanguage, DeprecatedPattern[]> = new Map([
  ['typescript', TS_JS_DEPRECATIONS],
  ['javascript', TS_JS_DEPRECATIONS],
  ['python', PYTHON_DEPRECATIONS],
  ['java', JAVA_DEPRECATIONS],
  ['go', GO_DEPRECATIONS],
  ['kotlin', KOTLIN_DEPRECATIONS],
]);

// ─── Deprecated import modules (package-level deprecation) ─────────

const DEPRECATED_IMPORT_MODULES: Map<SupportedLanguage, Map<string, { replacement: string; since?: string }>> = new Map([
  ['python', new Map([
    ['optparse', { replacement: 'argparse', since: 'Python 3.2' }],
    ['imp', { replacement: 'importlib', since: 'Python 3.4' }],
    ['distutils', { replacement: 'setuptools', since: 'Python 3.10' }],
    ['cgi', { replacement: 'urllib.parse or email.message', since: 'Python 3.11' }],
  ])],
  ['go', new Map([
    ['io/ioutil', { replacement: 'io and os packages', since: 'Go 1.16' }],
  ])],
]);

// ─── Detector ──────────────────────────────────────────────────────

export class StaleAPIDetector implements V4Detector {
  readonly id = 'stale-api';
  readonly name = 'Stale API Detector';
  readonly category: DetectorCategory = 'code-freshness';
  readonly supportedLanguages: SupportedLanguage[] = [];

  async detect(units: CodeUnit[], context: DetectorContext): Promise<DetectorResult[]> {
    const results: DetectorResult[] = [];

    // Phase 1: Check package-level deprecation via registry
    await this.checkRegistryDeprecations(units, context, results);

    // Phase 2: Check well-known deprecated API patterns in source code
    this.checkPatternDeprecations(units, results);

    // Phase 3: Check deprecated import modules
    this.checkDeprecatedImports(units, results);

    return results;
  }

  /**
   * Check package deprecation status via the registry manager.
   */
  private async checkRegistryDeprecations(
    units: CodeUnit[],
    context: DetectorContext,
    results: DetectorResult[],
  ): Promise<void> {
    if (!context.registryManager) return;

    // Collect unique import packages by language
    const importsByLanguage = new Map<string, Map<string, { file: string; line: number }[]>>();

    for (const unit of units) {
      if (unit.kind !== 'file') continue;

      for (const imp of unit.imports) {
        if (imp.isRelative) continue;

        const packageName = this.extractPackageName(imp.module, unit.language);
        if (!importsByLanguage.has(unit.language)) {
          importsByLanguage.set(unit.language, new Map());
        }
        const langMap = importsByLanguage.get(unit.language)!;
        if (!langMap.has(packageName)) {
          langMap.set(packageName, []);
        }
        langMap.get(packageName)!.push({ file: unit.file, line: imp.line });
      }
    }

    // Check each package for deprecation
    for (const [language, packageMap] of importsByLanguage.entries()) {
      const registry = context.registryManager.getRegistry(language);
      if (!registry) continue;

      for (const [packageName, occurrences] of packageMap.entries()) {
        try {
          const deprecation = await registry.checkDeprecated(packageName);
          if (deprecation?.deprecated) {
            for (const occurrence of occurrences) {
              results.push({
                detectorId: this.id,
                severity: 'warning',
                category: this.category,
                messageKey: 'stale-api.registry-deprecated',
                message: `Package "${packageName}" is deprecated${deprecation.message ? ': ' + deprecation.message : ''}${deprecation.replacement ? '. Use ' + deprecation.replacement + ' instead' : ''}.`,
                file: occurrence.file,
                line: occurrence.line + 1, // 0-based to 1-based
                confidence: 0.95,
                metadata: {
                  packageName,
                  language,
                  source: 'registry',
                  deprecationMessage: deprecation.message,
                  replacement: deprecation.replacement,
                  since: deprecation.since,
                },
              });
            }
          }
        } catch {
          // Registry check failed; skip silently (conservative)
        }
      }
    }
  }

  /**
   * Check well-known deprecated API patterns in source code.
   */
  private checkPatternDeprecations(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    for (const unit of units) {
      const patterns = DEPRECATION_PATTERNS.get(unit.language);
      if (!patterns) continue;

      // Check source text against known deprecated patterns
      const lines = unit.source.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of patterns) {
          const regex = pattern.pattern instanceof RegExp
            ? pattern.pattern
            : new RegExp(this.escapeRegex(pattern.pattern), 'g');

          if (regex.test(line)) {
            const absoluteLine = unit.location.startLine + i;
            results.push({
              detectorId: this.id,
              severity: 'warning',
              category: this.category,
              messageKey: 'stale-api.deprecated-pattern',
              message: pattern.description || `Deprecated API usage detected. Use ${pattern.replacement} instead${pattern.since ? ' (deprecated since ' + pattern.since + ')' : ''}.`,
              file: unit.file,
              line: absoluteLine + 1, // 0-based to 1-based
              confidence: pattern.confidence,
              metadata: {
                language: unit.language,
                source: 'pattern',
                replacement: pattern.replacement,
                since: pattern.since,
                matchedPattern: pattern.pattern instanceof RegExp
                  ? pattern.pattern.source
                  : pattern.pattern,
              },
            });
          }
          // Reset regex lastIndex for global patterns
          if (pattern.pattern instanceof RegExp) {
            pattern.pattern.lastIndex = 0;
          }
        }
      }
    }
  }

  /**
   * Check deprecated import modules (entire modules that are deprecated).
   */
  private checkDeprecatedImports(
    units: CodeUnit[],
    results: DetectorResult[],
  ): void {
    for (const unit of units) {
      if (unit.kind !== 'file') continue;

      const deprecatedModules = DEPRECATED_IMPORT_MODULES.get(unit.language);
      if (!deprecatedModules) continue;

      for (const imp of unit.imports) {
        const topModule = imp.module.split(/[./]/)[0];
        const deprecation = deprecatedModules.get(imp.module) || deprecatedModules.get(topModule);
        if (deprecation) {
          results.push({
            detectorId: this.id,
            severity: 'warning',
            category: this.category,
            messageKey: 'stale-api.deprecated-module',
            message: `Module "${imp.module}" is deprecated${deprecation.since ? ' since ' + deprecation.since : ''}. Use ${deprecation.replacement} instead.`,
            file: unit.file,
            line: imp.line + 1, // 0-based to 1-based
            confidence: 0.9,
            metadata: {
              module: imp.module,
              language: unit.language,
              source: 'known-deprecation',
              replacement: deprecation.replacement,
              since: deprecation.since,
            },
          });
        }
      }
    }
  }

  /**
   * Extract top-level package name from a module path.
   */
  private extractPackageName(module: string, language: SupportedLanguage): string {
    switch (language) {
      case 'typescript':
      case 'javascript': {
        if (module.startsWith('@')) {
          const parts = module.split('/');
          return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : module;
        }
        return module.split('/')[0];
      }
      case 'python':
        return module.split('.')[0];
      case 'java':
      case 'kotlin':
        return module;
      case 'go': {
        const parts = module.split('/');
        if (parts.length >= 3 && module.includes('.')) {
          return parts.slice(0, 3).join('/');
        }
        return module;
      }
      default:
        return module;
    }
  }

  /**
   * Escape a string for use in a regular expression.
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
