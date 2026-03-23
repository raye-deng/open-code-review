/**
 * OverEngineeringDetector Tests
 *
 * Tests detection of over-engineered code patterns typical of AI generation:
 * excessive parameters, deep nesting, long functions, high complexity.
 *
 * @since 0.4.0 (V4)
 */

import { describe, it, expect } from 'vitest';
import { OverEngineeringDetector } from '../../src/detectors/v4/over-engineering.js';
import type { DetectorContext } from '../../src/detectors/v4/types.js';
import type { CodeUnit, ComplexityMetrics } from '../../src/ir/types.js';
import { createCodeUnit, emptyComplexity } from '../../src/ir/types.js';

// ─── Helpers ───────────────────────────────────────────────────────

function makeFuncUnit(overrides: Partial<CodeUnit> & { complexity?: Partial<ComplexityMetrics> }): CodeUnit {
  const complexity: ComplexityMetrics = {
    ...emptyComplexity(),
    ...overrides.complexity,
  };

  return createCodeUnit({
    id: `func:test.ts:testFunc`,
    file: overrides.file || 'test.ts',
    language: overrides.language || 'typescript',
    kind: 'function',
    location: { startLine: 0, startColumn: 0, endLine: 20, endColumn: 0 },
    source: 'function testFunc() {}',
    complexity,
    ...overrides,
  });
}

function makeFileUnit(overrides: Partial<CodeUnit> & { file?: string; language?: CodeUnit['language'] }): CodeUnit {
  return createCodeUnit({
    id: `file:${overrides.file || 'test.ts'}`,
    file: overrides.file || 'test.ts',
    language: overrides.language || 'typescript',
    kind: 'file',
    location: { startLine: 0, startColumn: 0, endLine: 100, endColumn: 0 },
    source: '',
    ...overrides,
  });
}

function createContext(config?: Record<string, unknown>): DetectorContext {
  return {
    projectRoot: '/project',
    allFiles: ['test.ts'],
    config,
  };
}

// ─── Tests ─────────────────────────────────────────────────────────

describe('OverEngineeringDetector', () => {
  const detector = new OverEngineeringDetector();

  it('should have correct metadata', () => {
    expect(detector.id).toBe('over-engineering');
    expect(detector.name).toBe('Over-engineering Detector');
    expect(detector.category).toBe('implementation');
    expect(detector.supportedLanguages).toEqual([]);
  });

  // ── Excessive parameters ───────────────────────────────────────

  it('should detect function with >5 parameters', async () => {
    const unit = makeFuncUnit({
      complexity: { parameterCount: 8, linesOfCode: 10, cyclomaticComplexity: 2, maxNestingDepth: 1, cognitiveComplexity: 3 },
    });

    const results = await detector.detect([unit], createContext());
    const paramResult = results.find(r => r.metadata?.analysisType === 'excessive-params');
    expect(paramResult).toBeDefined();
    expect(paramResult!.severity).toBe('warning');
    expect(paramResult!.message).toContain('8 parameters');
    expect(paramResult!.message).toContain('max: 5');
  });

  it('should not flag function with <=5 parameters', async () => {
    const unit = makeFuncUnit({
      complexity: { parameterCount: 3, linesOfCode: 10, cyclomaticComplexity: 2, maxNestingDepth: 1, cognitiveComplexity: 3 },
    });

    const results = await detector.detect([unit], createContext());
    const paramResult = results.filter(r => r.metadata?.analysisType === 'excessive-params');
    expect(paramResult).toHaveLength(0);
  });

  it('should not flag function with exactly 5 parameters', async () => {
    const unit = makeFuncUnit({
      complexity: { parameterCount: 5, linesOfCode: 10, cyclomaticComplexity: 2, maxNestingDepth: 1, cognitiveComplexity: 3 },
    });

    const results = await detector.detect([unit], createContext());
    const paramResult = results.filter(r => r.metadata?.analysisType === 'excessive-params');
    expect(paramResult).toHaveLength(0);
  });

  // ── Deep nesting ───────────────────────────────────────────────

  it('should detect deep nesting >4 levels', async () => {
    const unit = makeFuncUnit({
      complexity: { maxNestingDepth: 6, linesOfCode: 30, cyclomaticComplexity: 5, cognitiveComplexity: 10 },
    });

    const results = await detector.detect([unit], createContext());
    const nestingResult = results.find(r => r.metadata?.analysisType === 'deep-nesting');
    expect(nestingResult).toBeDefined();
    expect(nestingResult!.message).toContain('6');
    expect(nestingResult!.message).toContain('max: 4');
  });

  it('should not flag nesting <=4 levels', async () => {
    const unit = makeFuncUnit({
      complexity: { maxNestingDepth: 3, linesOfCode: 20, cyclomaticComplexity: 3, cognitiveComplexity: 5 },
    });

    const results = await detector.detect([unit], createContext());
    const nestingResult = results.filter(r => r.metadata?.analysisType === 'deep-nesting');
    expect(nestingResult).toHaveLength(0);
  });

  // ── Long functions ─────────────────────────────────────────────

  it('should detect long function >100 LOC', async () => {
    const unit = makeFuncUnit({
      complexity: { linesOfCode: 150, cyclomaticComplexity: 5, maxNestingDepth: 2, cognitiveComplexity: 10 },
    });

    const results = await detector.detect([unit], createContext());
    const longResult = results.find(r => r.metadata?.analysisType === 'long-function');
    expect(longResult).toBeDefined();
    expect(longResult!.message).toContain('150 lines');
    expect(longResult!.message).toContain('max: 100');
  });

  it('should not flag function with <=100 LOC', async () => {
    const unit = makeFuncUnit({
      complexity: { linesOfCode: 50, cyclomaticComplexity: 3, maxNestingDepth: 2, cognitiveComplexity: 5 },
    });

    const results = await detector.detect([unit], createContext());
    const longResult = results.filter(r => r.metadata?.analysisType === 'long-function');
    expect(longResult).toHaveLength(0);
  });

  // ── High cyclomatic complexity ─────────────────────────────────

  it('should detect high cyclomatic complexity', async () => {
    const unit = makeFuncUnit({
      complexity: { cyclomaticComplexity: 20, linesOfCode: 80, maxNestingDepth: 3, cognitiveComplexity: 25 },
    });

    const results = await detector.detect([unit], createContext());
    const complexityResult = results.find(r => r.metadata?.analysisType === 'high-complexity');
    expect(complexityResult).toBeDefined();
    expect(complexityResult!.message).toContain('20');
    expect(complexityResult!.message).toContain('max: 15');
    expect(complexityResult!.confidence).toBe(0.85);
  });

  it('should not flag reasonable complexity', async () => {
    const unit = makeFuncUnit({
      complexity: { cyclomaticComplexity: 8, linesOfCode: 40, maxNestingDepth: 2, cognitiveComplexity: 10 },
    });

    const results = await detector.detect([unit], createContext());
    const complexityResult = results.filter(r => r.metadata?.analysisType === 'high-complexity');
    expect(complexityResult).toHaveLength(0);
  });

  // ── Configurable thresholds ────────────────────────────────────

  it('should respect custom thresholds via constructor', async () => {
    const customDetector = new OverEngineeringDetector({
      maxParams: 3,
      maxNesting: 2,
      maxFunctionLOC: 50,
      maxCyclomaticComplexity: 10,
    });

    const unit = makeFuncUnit({
      complexity: { parameterCount: 4, linesOfCode: 60, maxNestingDepth: 3, cyclomaticComplexity: 12, cognitiveComplexity: 15 },
    });

    const results = await customDetector.detect([unit], createContext());
    // All four checks should trigger with custom thresholds
    expect(results.find(r => r.metadata?.analysisType === 'excessive-params')).toBeDefined();
    expect(results.find(r => r.metadata?.analysisType === 'deep-nesting')).toBeDefined();
    expect(results.find(r => r.metadata?.analysisType === 'long-function')).toBeDefined();
    expect(results.find(r => r.metadata?.analysisType === 'high-complexity')).toBeDefined();
  });

  it('should respect config overrides via DetectorContext', async () => {
    const unit = makeFuncUnit({
      complexity: { parameterCount: 4, linesOfCode: 30, maxNestingDepth: 2, cyclomaticComplexity: 5, cognitiveComplexity: 5 },
    });

    // Default detector should not flag these values
    const resultsDefault = await detector.detect([unit], createContext());
    expect(resultsDefault.filter(r => r.metadata?.analysisType === 'excessive-params')).toHaveLength(0);

    // With config override: maxParams=3
    const resultsWithConfig = await detector.detect([unit], createContext({
      'over-engineering': { maxParams: 3 },
    }));
    expect(resultsWithConfig.find(r => r.metadata?.analysisType === 'excessive-params')).toBeDefined();
  });

  // ── Only function/method units ─────────────────────────────────

  it('should only check function and method units (skip file/class)', async () => {
    const fileUnit = createCodeUnit({
      id: 'file:test.ts',
      file: 'test.ts',
      language: 'typescript',
      kind: 'file',
      location: { startLine: 0, startColumn: 0, endLine: 200, endColumn: 0 },
      source: '',
      complexity: { cyclomaticComplexity: 50, cognitiveComplexity: 50, maxNestingDepth: 10, linesOfCode: 200, parameterCount: 20 },
    });

    const results = await detector.detect([fileUnit], createContext());
    // File-level units should be skipped by param/nesting/LOC/complexity checks
    const codeResults = results.filter(r =>
      ['excessive-params', 'deep-nesting', 'long-function', 'high-complexity'].includes(r.metadata?.analysisType as string),
    );
    expect(codeResults).toHaveLength(0);
  });
});

// ─── Single implementation abstraction ─────────────────────────────

describe('OverEngineeringDetector - single implementation abstraction', () => {
  const detector = new OverEngineeringDetector();

  it('should detect abstract class with only one implementation', async () => {
    const source = [
      'abstract class Animal {',
      '  abstract speak(): string;',
      '}',
      'class Dog extends Animal {',
      '  speak() { return "Woof"; }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({
      kind: 'file',
      source,
      imports: [],
      definitions: [],
    });

    const results = await detector.detect([unit], createContext());
    const singleImpl = results.find(r => r.metadata?.analysisType === 'single-impl-abstraction');
    expect(singleImpl).toBeDefined();
    expect(singleImpl!.message).toContain('Animal');
    expect(singleImpl!.message).toContain('Dog');
    expect(singleImpl!.confidence).toBe(0.7);
    expect(singleImpl!.severity).toBe('warning');
  });

  it('should detect interface with only one implementation', async () => {
    const source = [
      'interface Logger {',
      '  log(msg: string): void;',
      '}',
      'class ConsoleLogger implements Logger {',
      '  log(msg: string) { console.log(msg); }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({
      kind: 'file',
      source,
      imports: [],
      definitions: [],
    });

    const results = await detector.detect([unit], createContext());
    const singleImpl = results.find(r => r.metadata?.analysisType === 'single-impl-abstraction');
    expect(singleImpl).toBeDefined();
    expect(singleImpl!.message).toContain('Logger');
    expect(singleImpl!.message).toContain('ConsoleLogger');
  });

  it('should not flag abstract class with multiple implementations', async () => {
    const source = [
      'abstract class Shape {',
      '  abstract area(): number;',
      '}',
      'class Circle extends Shape {',
      '  area() { return 3.14; }',
      '}',
      'class Square extends Shape {',
      '  area() { return 4; }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({
      kind: 'file',
      source,
      imports: [],
      definitions: [],
    });

    const results = await detector.detect([unit], createContext());
    const singleImpl = results.filter(r => r.metadata?.analysisType === 'single-impl-abstraction');
    expect(singleImpl).toHaveLength(0);
  });

  it('should not flag abstract class with zero implementations', async () => {
    const source = [
      'abstract class BaseHandler {',
      '  abstract handle(): void;',
      '}',
    ].join('\n');

    const unit = makeFileUnit({
      kind: 'file',
      source,
      imports: [],
      definitions: [],
    });

    const results = await detector.detect([unit], createContext());
    const singleImpl = results.filter(r => r.metadata?.analysisType === 'single-impl-abstraction');
    expect(singleImpl).toHaveLength(0);
  });

  it('should work across multiple files', async () => {
    const source1 = [
      'interface Repository<T> {',
      '  findById(id: string): T | null;',
      '}',
    ].join('\n');

    const source2 = [
      'class UserRepository implements Repository<User> {',
      '  findById(id: string) { return null; }',
      '}',
    ].join('\n');

    const unit1 = makeFileUnit({
      file: 'repository.ts',
      kind: 'file',
      source: source1,
      imports: [],
      definitions: [],
    });

    const unit2 = makeFileUnit({
      file: 'user-repository.ts',
      kind: 'file',
      source: source2,
      imports: [],
      definitions: [],
    });

    const results = await detector.detect([unit1, unit2], createContext());
    const singleImpl = results.find(r => r.metadata?.analysisType === 'single-impl-abstraction');
    expect(singleImpl).toBeDefined();
    expect(singleImpl!.message).toContain('Repository');
    expect(singleImpl!.message).toContain('UserRepository');
  });
});

// ─── Design pattern name abuse ────────────────────────────────────

describe('OverEngineeringDetector - design pattern name abuse', () => {
  const detector = new OverEngineeringDetector();

  it('should detect trivially simple Factory class', async () => {
    const source = [
      'class UserFactory {',
      '  createUser(name: string) {',
      '    return { name, id: crypto.randomUUID() };',
      '  }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.find(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toBeDefined();
    expect(abuse!.message).toContain('UserFactory');
    expect(abuse!.message).toContain('Factory');
    expect(abuse!.severity).toBe('info');
    expect(abuse!.confidence).toBe(0.6);
  });

  it('should detect trivially simple Provider class', async () => {
    const source = [
      'class ConfigProvider {',
      '  getConfig() {',
      '    return { port: 3000, host: "localhost" };',
      '  }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.find(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toBeDefined();
    expect(abuse!.message).toContain('ConfigProvider');
    expect(abuse!.message).toContain('Provider');
  });

  it('should detect trivially simple Strategy interface', async () => {
    const source = [
      'interface PaymentStrategy {',
      '  pay(amount: number): boolean;',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.find(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toBeDefined();
    expect(abuse!.message).toContain('PaymentStrategy');
  });

  it('should detect trivially simple Handler class', async () => {
    const source = [
      'class ErrorHandler {',
      '  handle(error: Error) {',
      '    console.error(error.message);',
      '  }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.find(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toBeDefined();
    expect(abuse!.message).toContain('ErrorHandler');
  });

  it('should not flag a substantial Factory class with many methods', async () => {
    const source = [
      'class OrderFactory {',
      '  private validator: Validator;',
      '  private repository: OrderRepository;',
      '',
      '  constructor(validator: Validator, repository: OrderRepository) {',
      '    this.validator = validator;',
      '    this.repository = repository;',
      '  }',
      '',
      '  createOrder(data: OrderData): Order {',
      '    this.validator.validate(data);',
      '    const order = new Order(data);',
      '    this.repository.save(order);',
      '    return order;',
      '  }',
      '',
      '  createBulkOrder(items: OrderData[]): Order[] {',
      '    return items.map(item => this.createOrder(item));',
      '  }',
      '',
      '  createFromTemplate(template: OrderTemplate): Order {',
      '    const data = this.applyTemplate(template);',
      '    return this.createOrder(data);',
      '  }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.filter(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toHaveLength(0);
  });

  it('should not flag non-pattern-named classes', async () => {
    const source = [
      'class User {',
      '  constructor(private name: string) {}',
      '  greet() { return `Hello, ${this.name}`; }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.filter(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toHaveLength(0);
  });

  it('should detect multiple pattern-named classes in one file', async () => {
    const source = [
      'class AuthHandler {',
      '  authenticate(token: string) { return true; }',
      '}',
      '',
      'class UserManager {',
      '  getUser(id: string) { return { id, name: "test" }; }',
      '}',
      '',
      'class DataProcessor {',
      '  process(input: string) { return input.toUpperCase(); }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.filter(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse.length).toBeGreaterThanOrEqual(3);
  });

  it('should skip pattern names in comments', async () => {
    const source = [
      '// Factory pattern: create users',
      '// class UserFactory { }',
      'class User {',
      '  constructor(private name: string) {}',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.filter(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toHaveLength(0);
  });

  it('should include metadata with suffix and method count', async () => {
    const source = [
      'class EmailService {',
      '  send(to: string, body: string) {',
      '    console.log(`Sending to ${to}`);',
      '  }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const abuse = results.find(r => r.metadata?.analysisType === 'pattern-name-abuse');
    expect(abuse).toBeDefined();
    expect(abuse!.metadata!.patternSuffix).toBe('Service');
    expect(abuse!.metadata!.className).toBe('EmailService');
    expect(typeof abuse!.metadata!.methodCount).toBe('number');
    expect(typeof abuse!.metadata!.effectiveLines).toBe('number');
  });

  // ── Analysis 8: Nested Config Abstraction ─────────────────────────

  it('should detect deeply nested configuration type hierarchies', async () => {
    const source = [
      'interface PostgresConfig {',
      '  host: string;',
      '  port: number;',
      '}',
      '',
      'interface DatabaseConfig {',
      '  postgres: PostgresConfig;',
      '  poolSize: number;',
      '}',
      '',
      'interface ServiceConfig {',
      '  database: DatabaseConfig;',
      '  timeout: number;',
      '}',
      '',
      'interface AppConfig {',
      '  service: ServiceConfig;',
      '  name: string;',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const nested = results.filter(r => r.metadata?.analysisType === 'nested-config-abstraction');
    expect(nested.length).toBeGreaterThanOrEqual(1);
    expect(nested[0].metadata!.nestingDepth).toBeGreaterThan(2);
    expect(nested[0].metadata!.chain).toBeDefined();
    expect((nested[0].metadata!.chain as string[]).length).toBeGreaterThan(2);
  });

  it('should NOT flag shallow config hierarchies (depth <= 2)', async () => {
    const source = [
      'interface DatabaseConfig {',
      '  host: string;',
      '  port: number;',
      '}',
      '',
      'interface AppConfig {',
      '  database: DatabaseConfig;',
      '  name: string;',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const nested = results.filter(r => r.metadata?.analysisType === 'nested-config-abstraction');
    expect(nested.length).toBe(0);
  });

  it('should NOT flag non-config type hierarchies', async () => {
    const source = [
      'interface User {',
      '  name: string;',
      '  address: Address;',
      '}',
      '',
      'interface Address {',
      '  street: Street;',
      '  city: string;',
      '}',
      '',
      'interface Street {',
      '  name: string;',
      '  number: number;',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const nested = results.filter(r => r.metadata?.analysisType === 'nested-config-abstraction');
    expect(nested.length).toBe(0);
  });

  // ── Analysis 9: Generic Over-engineering ──────────────────────────

  it('should detect functions with too many generic type parameters', async () => {
    const source = [
      'function transform<TInput, TOutput, TContext, TError, TMetadata>(input: TInput): TOutput {',
      '  return input as unknown as TOutput;',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const generics = results.filter(r => r.metadata?.analysisType === 'excessive-generics');
    expect(generics.length).toBe(1);
    expect(generics[0].metadata!.genericParamCount).toBe(5);
    expect(generics[0].metadata!.name).toBe('transform');
  });

  it('should detect deeply nested generic types', async () => {
    const source = [
      'type Result = Map<string, Array<Promise<Either<Error, Response<Data>>>>>;',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const deepNesting = results.filter(r => r.metadata?.analysisType === 'deep-generic-nesting');
    expect(deepNesting.length).toBe(1);
    expect(deepNesting[0].metadata!.nestingDepth).toBeGreaterThan(3);
  });

  it('should NOT flag functions with reasonable generic params (<=3)', async () => {
    const source = [
      'function map<T, U>(arr: T[], fn: (item: T) => U): U[] {',
      '  return arr.map(fn);',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const generics = results.filter(r => r.metadata?.analysisType === 'excessive-generics');
    expect(generics.length).toBe(0);
  });

  it('should NOT flag shallow generic nesting (<=3)', async () => {
    const source = [
      'const data: Map<string, Array<number>> = new Map();',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const deepNesting = results.filter(r => r.metadata?.analysisType === 'deep-generic-nesting');
    expect(deepNesting.length).toBe(0);
  });

  it('should detect class with excessive generics', async () => {
    const source = [
      'class ServiceFactory<TRequest, TResponse, TContext, TMiddleware> {',
      '  create(req: TRequest): TResponse {',
      '    return {} as TResponse;',
      '  }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const generics = results.filter(r => r.metadata?.analysisType === 'excessive-generics');
    expect(generics.length).toBe(1);
    expect(generics[0].metadata!.genericParamCount).toBe(4);
  });

  it('should skip generic detection for non-TypeScript files', async () => {
    const source = [
      'class Factory<A, B, C, D, E> {',
      '  public A create() { return null; }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source, language: 'java', file: 'Test.java' });
    const results = await detector.detect([unit], createContext());
    const generics = results.filter(r => r.metadata?.analysisType === 'excessive-generics');
    expect(generics.length).toBe(0);
  });

  // ── Excessive Decorator Chains ─────────────────────────────────

  it('should detect excessive decorator chain (>4 decorators)', async () => {
    const source = [
      '@Injectable',
      '@Validated',
      '@Cached',
      '@Logged',
      '@Timed',
      'class UserService {',
      '  getUser() { return {}; }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const decoratorResults = results.filter(r => r.metadata?.analysisType === 'excessive-decorator-chain');
    expect(decoratorResults.length).toBe(1);
    expect(decoratorResults[0].metadata!.decoratorCount).toBe(5);
    expect(decoratorResults[0].severity).toBe('warning');
  });

  it('should not flag 4 or fewer decorators', async () => {
    const source = [
      '@Injectable',
      '@Validated',
      '@Cached',
      '@Logged',
      'class UserService {',
      '  getUser() { return {}; }',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const decoratorResults = results.filter(r => r.metadata?.analysisType === 'excessive-decorator-chain');
    expect(decoratorResults.length).toBe(0);
  });

  it('should detect Python excessive decorators', async () => {
    const source = [
      '@app.route("/api/users")',
      '@login_required',
      '@cache_control(max_age=300)',
      '@rate_limit(100)',
      '@validate_json',
      'def get_users():',
      '    return []',
    ].join('\n');

    const unit = makeFileUnit({ source, language: 'python', file: 'app.py' });
    const results = await detector.detect([unit], createContext());
    const decoratorResults = results.filter(r => r.metadata?.analysisType === 'excessive-decorator-chain');
    expect(decoratorResults.length).toBe(1);
    expect(decoratorResults[0].metadata!.decoratorCount).toBe(5);
  });

  it('should not flag JSDoc annotations as decorators', async () => {
    const source = [
      '@param {string} name',
      '@returns {boolean}',
      '@type {Object}',
      '@deprecated Use newMethod',
      '@see otherModule',
      'function doStuff(name) { return true; }',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const decoratorResults = results.filter(r => r.metadata?.analysisType === 'excessive-decorator-chain');
    expect(decoratorResults.length).toBe(0);
  });

  it('should handle decorators with blank lines in between', async () => {
    const source = [
      '@Injectable',
      '@Validated',
      '',
      '@Cached',
      '@Logged',
      '@Timed',
      'class Service {',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source });
    const results = await detector.detect([unit], createContext());
    const decoratorResults = results.filter(r => r.metadata?.analysisType === 'excessive-decorator-chain');
    expect(decoratorResults.length).toBe(1);
    expect(decoratorResults[0].metadata!.decoratorCount).toBe(5);
  });

  it('should detect Java annotation stacking', async () => {
    const source = [
      '@RestController',
      '@RequestMapping("/api")',
      '@CrossOrigin',
      '@Validated',
      '@Secured("ROLE_ADMIN")',
      'public class UserController {',
      '}',
    ].join('\n');

    const unit = makeFileUnit({ source, language: 'java', file: 'UserController.java' });
    const results = await detector.detect([unit], createContext());
    const decoratorResults = results.filter(r => r.metadata?.analysisType === 'excessive-decorator-chain');
    expect(decoratorResults.length).toBe(1);
    expect(decoratorResults[0].metadata!.decoratorCount).toBe(5);
  });
});
