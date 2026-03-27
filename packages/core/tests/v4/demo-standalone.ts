/**
 * Standalone V4 Detector Demo
 * Runs detectors on CodeUnit IR (no tree-sitter required)
 */

import { OverEngineeringDetector } from '../../src/detectors/v4/over-engineering.js';
import { SecurityPatternDetector } from '../../src/detectors/v4/security-pattern.js';
import { StaleAPIDetector } from '../../src/detectors/v4/stale-api.js';
import { ContextCoherenceDetector } from '../../src/detectors/v4/context-coherence.js';
import { HallucinatedImportDetector } from '../../src/detectors/v4/hallucinated-import.js';
import { createCodeUnit, emptyComplexity } from '../../src/ir/types.js';
import type { DetectorContext, DetectorResult } from '../../src/detectors/v4/types.js';
import type { CodeUnit, ComplexityMetrics } from '../../src/ir/types.js';

const FIXTURE_SRC = `
// AI-Generated Over-Engineered Code

interface PaymentStrategy { execute(amount: number): boolean; }
class StripePaymentStrategy implements PaymentStrategy {
  execute(amount: number) { return amount > 0; }
}
class PaymentStrategyFactory {
  createStrategy(type: string): PaymentStrategy {
    if (type === 'stripe') return new StripePaymentStrategy();
    throw new Error("Unknown");
  }
}
class PaymentStrategyResolver {
  resolve(type: string): PaymentStrategy {
    return new PaymentStrategyFactory().createStrategy(type);
  }
}

interface AppConfig { config: ApplicationConfig; }
interface ApplicationConfig { services: ServicesConfig; }
interface ServicesConfig { database: DatabaseConfig; }
interface DatabaseConfig { postgres: PostgresConfig; }
interface PostgresConfig { host: string; port: number; credentials: PostgresCredentials; }
interface PostgresCredentials { username: string; password: string; }

interface Repository<TEntity, TId, TContext, TFilter, TOptions, TResult> {
  findById(id: TId, context: TContext): Promise<TEntity | null>;
  findMany(filter: TFilter, options: TOptions): Promise<TResult[]>;
}

abstract class BaseService { abstract validate(data: unknown): boolean; abstract process(data: unknown): Promise<void>; }
class UserService extends BaseService {
  validate(data: unknown) { return true; }
  async process(data: unknown) { console.log("processing"); }
}

const OPENAI_API_KEY = "sk-proj-demo-key-placeholder";
const GITHUB_TOKEN = "ghp_exampleTokenForDocs";
const STRIPE_SECRET = "sk_test_51ExampleKeyHere";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.post("/admin/users", (req, res) => {
  // TODO: add authentication check
  // TODO: implement authorization middleware
  const { username, role } = req.body;
  res.json({ success: true });
});

import jwt from "jsonwebtoken";
const token = jwt.sign({ userId: 123 }, "");

app.post("/login", (req, res) => {
  console.log("User credentials:", { email: req.body.email, password: req.body.password });
  logger.info("Processing payment", { cardNumber: req.body.card, cvv: req.body.cvv });
});

const fileName = req.query.file;
exec(\`cat \${fileName}\`);
exec(\`rm -rf \${userInput}\`);

app.get("/api/data", async (req, res) => {
  try { const data = await fetchData(); res.json(data); }
  catch (error) { res.status(500).json({ error: error.message, stack: error.stack }); }
});

try { await riskyOperation(); } catch (e) { }
const DB_PASSWORD = process.env.DB_PASSWORD || "admin123";
const API_SECRET = process.env.API_SECRET ?? "fallback-secret-key";

class OldComponent extends React.Component {
  componentWillMount() { this.setState({ loading: true }); }
  componentWillReceiveProps(nextProps) { if (nextProps.id !== this.props.id) { this.fetchData(nextProps.id); } }
}

ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.hydrate(<App />, document.getElementById("root"));

import { formatDate } from "./utils";
import { formatDate } from "date-fns";

function calculateDiscount(price, rate) { return price * (1 - rate); }
function applyPromoCode(code) { return 0; }
`;

async function main() {
  const ctx: DetectorContext = { projectRoot: '/demo' };

  const complexity: ComplexityMetrics = { ...emptyComplexity(), linesOfCode: 80 };
  const fileUnit = createCodeUnit({
    id: 'file:demo.ts',
    file: 'demo.ts',
    language: 'typescript',
    kind: 'file',
    location: { startLine: 0, startColumn: 0, endLine: 80, endColumn: 0 },
    source: FIXTURE_SRC,
    complexity,
    definitions: [
      { name: 'PaymentStrategy', kind: 'interface', line: 0, exported: false },
      { name: 'StripePaymentStrategy', kind: 'class', line: 1, exported: false },
      { name: 'PaymentStrategyFactory', kind: 'class', line: 4, exported: false },
      { name: 'PaymentStrategyResolver', kind: 'class', line: 9, exported: false },
      { name: 'AppConfig', kind: 'interface', line: 0, exported: false },
      { name: 'ApplicationConfig', kind: 'interface', line: 0, exported: false },
      { name: 'ServicesConfig', kind: 'interface', line: 0, exported: false },
      { name: 'DatabaseConfig', kind: 'interface', line: 0, exported: false },
      { name: 'PostgresConfig', kind: 'interface', line: 0, exported: false },
      { name: 'PostgresCredentials', kind: 'interface', line: 0, exported: false },
      { name: 'Repository', kind: 'interface', line: 0, exported: false },
      { name: 'BaseService', kind: 'class', line: 0, exported: false },
      { name: 'UserService', kind: 'class', line: 0, exported: false },
      { name: 'OldComponent', kind: 'class', line: 0, exported: false },
      { name: 'calculateDiscount', kind: 'function', line: 0, exported: false },
      { name: 'applyPromoCode', kind: 'function', line: 0, exported: false },
    ],
    imports: [
      { module: 'jsonwebtoken', symbols: ['jwt'], line: 0 },
      { module: './utils', symbols: ['formatDate'], line: 0 },
      { module: 'date-fns', symbols: ['formatDate'], line: 0 },
      { module: 'email-validator-pro', symbols: ['validateEmail'], line: 0 },
      { module: 'secure-crypto-utils', symbols: ['encryptData'], line: 0 },
      { module: 'pagination-helper', symbols: ['paginateResults'], line: 0 },
    ],
  });

  const detectors = [
    new OverEngineeringDetector(),
    new SecurityPatternDetector(),
    new StaleAPIDetector(),
    new ContextCoherenceDetector(),
  ];

  let allResults: DetectorResult[] = [];
  for (const detector of detectors) {
    const results = await detector.detect([fileUnit], ctx);
    allResults = allResults.concat(results);
  }

  // Categorize
  const byCategory = new Map<string, DetectorResult[]>();
  for (const r of allResults) {
    const cat = r.category || 'other';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(r);
  }

  console.log('═'.repeat(70));
  console.log('  Open Code Review V4 — AI Pattern Detection Demo');
  console.log('  File: ai-over-engineered-security.ts');
  console.log('═'.repeat(70));

  let total = 0;
  for (const [cat, results] of byCategory) {
    console.log(`\n  📋 ${cat} (${results.length} issue${results.length > 1 ? 's' : ''})`);
    console.log('  ' + '─'.repeat(50));
    for (const r of results) {
      const sev = r.severity === 'error' ? '🔴' : r.severity === 'warning' ? '🟡' : '🔵';
      console.log(`  ${sev} [${r.severity.toUpperCase()}] ${r.message}`);
      total++;
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log(`  Total: ${total} AI-specific issues detected`);
  console.log(`  Traditional QA (SonarQube + ESLint) would catch ~3-4 of these`);
  console.log('═'.repeat(70));
}

main().catch(console.error);
