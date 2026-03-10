/**
 * Defect Pattern Database
 *
 * Curated set of AI-generated code defect patterns.
 * These are used as embedding comparison targets in Stage 1 (Embedding Recall).
 *
 * Each pattern includes:
 * - Unique ID for tracking
 * - Category aligned with V4 scoring dimensions
 * - Description used for embedding generation
 * - Example code snippets matching the pattern
 * - Severity and applicable languages
 *
 * @since 0.4.0
 */

import type { DetectorCategory } from '../../../detectors/v4/types.js';
import type { SupportedLanguage } from '../../../ir/types.js';

// ─── Defect Pattern Interface ──────────────────────────────────────

export interface DefectPattern {
  /** Unique pattern identifier */
  id: string;
  /** Scoring category */
  category: DetectorCategory;
  /** Human-readable description (also used for embedding) */
  description: string;
  /** Code examples that match this pattern */
  examples: string[];
  /** Issue severity */
  severity: 'error' | 'warning' | 'info';
  /** Languages this pattern applies to (empty = all languages) */
  languages: SupportedLanguage[];
}

// ─── Defect Pattern Database ───────────────────────────────────────

/**
 * Curated defect patterns that AI commonly generates.
 * These are used as embedding comparison targets in Stage 1.
 *
 * Organized by category:
 * - ai-faithfulness: Hallucinated imports, phantom APIs, fabricated types
 * - code-freshness: Deprecated APIs, outdated patterns, stale knowledge
 * - context-coherence: Inconsistencies, contradictions, style shifts
 * - implementation: Over-engineering, security, incomplete implementations
 */
export const DEFECT_PATTERNS: DefectPattern[] = [
  // ─── AI Faithfulness (Hallucinations) ──────────────────────────

  {
    id: 'hallucinated-import',
    category: 'ai-faithfulness',
    description: 'Import of a non-existent package or module that AI fabricated',
    examples: [
      'import { createAIValidator } from "ai-validator-pro"',
      'from advanced_ml_toolkit import HyperOptimizer',
      'import "github.com/ai-tools/nonexistent-package"',
      'import ai.magic.transformer.AutoModel',
    ],
    severity: 'error',
    languages: [],
  },
  {
    id: 'phantom-api',
    category: 'ai-faithfulness',
    description: 'Usage of an API method that does not exist on the object or library',
    examples: [
      'array.filterMap(x => x > 0)',
      'string.toCapitalCase()',
      'response.getJSON()',
      'promise.flatMap(result => result)',
      'map.getOrDefault(key, fallback)',
    ],
    severity: 'error',
    languages: [],
  },
  {
    id: 'fabricated-type',
    category: 'ai-faithfulness',
    description: 'Reference to a type or interface that does not exist in the imported library',
    examples: [
      'const config: NextConfig<AppProps> = {}',
      'type Handler = express.TypedHandler<Req, Res>',
      'implements SpringSecurityFilter',
      'class MyService extends AbstractServiceBase',
    ],
    severity: 'error',
    languages: [],
  },
  {
    id: 'wrong-api-signature',
    category: 'ai-faithfulness',
    description: 'Calling a real API with incorrect parameter types or wrong number of arguments',
    examples: [
      'fs.readFile(path, "utf8", callback, options)',
      'json.loads(data, encoding="utf-8")',
      'Arrays.sort(list, comparator, reverse)',
      'http.Get(url, headers)',
    ],
    severity: 'error',
    languages: [],
  },
  {
    id: 'imaginary-config-option',
    category: 'ai-faithfulness',
    description: 'Using configuration options that do not exist for a library or framework',
    examples: [
      'new Webpack({ optimizeChunks: true, autoTree: true })',
      'app.use(cors({ allowAllHeaders: true }))',
      'logging.config({ autoRotate: true, maxSize: "10mb" })',
    ],
    severity: 'warning',
    languages: [],
  },

  // ─── Code Freshness (Stale/Deprecated) ─────────────────────────

  {
    id: 'deprecated-node-api',
    category: 'code-freshness',
    description: 'Usage of deprecated Node.js API that should be replaced with modern alternative',
    examples: [
      'new Buffer("data")',
      'require("url").parse(urlString)',
      'fs.exists(path, callback)',
      'new require("domain").Domain()',
    ],
    severity: 'warning',
    languages: ['typescript', 'javascript'],
  },
  {
    id: 'deprecated-python-api',
    category: 'code-freshness',
    description: 'Usage of deprecated Python API or pattern from older Python versions',
    examples: [
      'import imp',
      'from collections import MutableMapping',
      'asyncio.get_event_loop()',
      'from distutils.core import setup',
      'os.popen("command")',
    ],
    severity: 'warning',
    languages: ['python'],
  },
  {
    id: 'deprecated-java-api',
    category: 'code-freshness',
    description: 'Usage of deprecated Java API that has modern replacements',
    examples: [
      'new Date(year, month, day)',
      'Thread.stop()',
      'Runtime.getRuntime().exec("command")',
      'new StringBuffer()',
    ],
    severity: 'warning',
    languages: ['java', 'kotlin'],
  },
  {
    id: 'outdated-framework-pattern',
    category: 'code-freshness',
    description: 'Using outdated framework patterns that have been superseded',
    examples: [
      'componentWillMount() { }',
      'class MyComponent extends React.Component { render() { } }',
      'app.use(bodyParser.json())',
      '@RunWith(SpringJUnit4ClassRunner.class)',
    ],
    severity: 'info',
    languages: [],
  },
  {
    id: 'legacy-syntax-pattern',
    category: 'code-freshness',
    description: 'Using legacy language syntax when modern alternatives exist',
    examples: [
      'var self = this;',
      'function.apply(null, arguments)',
      '.then(function(result) { return result; })',
      'for (var i = 0; i < arr.length; i++)',
    ],
    severity: 'info',
    languages: ['typescript', 'javascript'],
  },

  // ─── Context Coherence (Inconsistency) ─────────────────────────

  {
    id: 'naming-inconsistency',
    category: 'context-coherence',
    description: 'Inconsistent naming conventions within the same file or function',
    examples: [
      'const user_name = ""; const userName = ""; const UserName = "";',
      'function getData() {} function process_result() {} function HandleError() {}',
      'let maxRetries = 3; let min_timeout = 100;',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'contradictory-comment',
    category: 'context-coherence',
    description: 'Comment that contradicts the actual code behavior',
    examples: [
      '// Returns true if valid\nfunction validate(x) { return false; }',
      '// Sort in ascending order\narray.sort((a, b) => b - a)',
      '// This function never throws\nasync function fetch() { throw new Error(); }',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'unused-variable-from-context-loss',
    category: 'context-coherence',
    description: 'Variable declared and assigned but never used in the rest of the function',
    examples: [
      'const result = await fetchData();\n// result never referenced again\nreturn defaultValue;',
      'const config = loadConfig();\nsetupApp(hardcodedConfig);',
      'err := doSomething()\n_ = err\n// error silently ignored',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'abrupt-style-shift',
    category: 'context-coherence',
    description: 'Sudden change in code style mid-function suggesting context window boundary',
    examples: [
      '// First half uses async/await, second half uses .then() callbacks',
      '// First half uses const, second half uses var',
      '// Error handling changes from try/catch to .catch() mid-function',
    ],
    severity: 'info',
    languages: [],
  },
  {
    id: 'duplicate-logic-different-style',
    category: 'context-coherence',
    description: 'Same logic implemented twice in different styles within a file',
    examples: [
      'function formatDate(d) { return d.toISOString(); }\nfunction dateToString(d) { return `${d.getFullYear()}-${d.getMonth()}`; }',
      'const isValid = (x) => x > 0;\nfunction checkValid(value) { if (value > 0) return true; return false; }',
    ],
    severity: 'info',
    languages: [],
  },

  // ─── Implementation (Over-engineering, Security, Incomplete) ───

  {
    id: 'unnecessary-abstraction',
    category: 'implementation',
    description: 'Over-engineered abstraction layers that add complexity without value',
    examples: [
      'class AbstractFactoryProvider<T> { abstract createFactory(): Factory<T>; }',
      'interface IServiceLocatorStrategy<TService, TLocator>',
      'class ConfigurationManagerBuilderFactory',
      'export abstract class BaseAbstractHandler implements IHandler',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'hardcoded-secret',
    category: 'implementation',
    description: 'Hardcoded API keys, passwords, or tokens in source code',
    examples: [
      'const API_KEY = "sk-proj-abc123def456"',
      'password = "admin123"',
      'private static final String SECRET = "my-secret-key"',
      'token := "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"',
    ],
    severity: 'error',
    languages: [],
  },
  {
    id: 'empty-catch-block',
    category: 'implementation',
    description: 'Empty catch block that silently swallows errors',
    examples: [
      'try { riskyOperation(); } catch (e) { }',
      'try { riskyOperation(); } catch (e) { /* TODO */ }',
      'except Exception:\n    pass',
      'catch (Exception e) { // ignore }',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'todo-stub-placeholder',
    category: 'implementation',
    description: 'Placeholder or stub implementation that should be completed',
    examples: [
      'function processData() { /* TODO: implement */ return null; }',
      'def calculate(): raise NotImplementedError()',
      'public void handle() { throw new UnsupportedOperationException("Not implemented"); }',
      'func (s *Service) Process() error { return nil // TODO }',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'sql-injection-risk',
    category: 'implementation',
    description: 'SQL query built with string concatenation instead of parameterized queries',
    examples: [
      'const query = "SELECT * FROM users WHERE id = " + userId',
      'cursor.execute(f"SELECT * FROM users WHERE name = \'{name}\'")',
      'String sql = "DELETE FROM orders WHERE id=" + orderId;',
    ],
    severity: 'error',
    languages: [],
  },
  {
    id: 'insecure-random',
    category: 'implementation',
    description: 'Using non-cryptographic random for security-sensitive operations',
    examples: [
      'const token = Math.random().toString(36)',
      'import random; secret = random.randint(0, 999999)',
      'Random random = new Random(); int otp = random.nextInt(999999);',
    ],
    severity: 'warning',
    languages: [],
  },
  {
    id: 'excessive-function-complexity',
    category: 'implementation',
    description: 'Function with very high cyclomatic complexity suggesting AI generated a monolith',
    examples: [
      '// 200-line function with 15+ if/else branches',
      '// deeply nested switch inside for inside if inside try',
      '// function handling 10 different concerns in one method',
    ],
    severity: 'warning',
    languages: [],
  },
];

/**
 * Get all defect patterns for a specific category.
 */
export function getPatternsByCategory(
  category: DetectorCategory,
): DefectPattern[] {
  return DEFECT_PATTERNS.filter(p => p.category === category);
}

/**
 * Get all defect patterns applicable to a specific language.
 * Patterns with empty languages array apply to all languages.
 */
export function getPatternsForLanguage(
  language: SupportedLanguage,
): DefectPattern[] {
  return DEFECT_PATTERNS.filter(
    p => p.languages.length === 0 || p.languages.includes(language),
  );
}

/**
 * Get the combined text representation of a pattern for embedding.
 * Concatenates description and examples for richer embedding.
 */
export function getPatternText(pattern: DefectPattern): string {
  return `${pattern.description}\n${pattern.examples.join('\n')}`;
}
