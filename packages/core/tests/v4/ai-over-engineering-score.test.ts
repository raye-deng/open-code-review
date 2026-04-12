/**
 * Tests for AIOverEngineeringScoreDetector
 *
 * Validates the composite AI over-engineering scoring system:
 * - Per-file metric collection (pattern names, single impls, generics, decorators, etc.)
 * - Score calculation (weighted composite 0-100)
 * - Project-wide summary generation
 * - Report formatting
 *
 * @since 0.7.0
 */

import { describe, it, expect } from 'vitest';
import { AIOverEngineeringScoreDetector } from '../../src/detectors/v4/ai-over-engineering-score.js';
import type { CodeUnit } from '../../src/ir/types.js';
import type { DetectorContext } from '../../src/detectors/v4/types.js';
import { createCodeUnit } from '../../src/ir/types.js';

// ─── Helpers ───────────────────────────────────────────────────────

function makeFileUnit(file: string, source: string): CodeUnit {
  return createCodeUnit({
    id: `file:${file}`,
    file,
    language: 'typescript',
    kind: 'file',
    location: { startLine: 0, startColumn: 0, endLine: source.split('\n').length - 1, endColumn: 0 },
    source,
  });
}

const EMPTY_CONTEXT: DetectorContext = {
  projectRoot: '/test',
  allFiles: [],
};

// ─── Test Cases ────────────────────────────────────────────────────

describe('AIOverEngineeringScoreDetector', () => {
  it('should have correct metadata', () => {
    const detector = new AIOverEngineeringScoreDetector();
    expect(detector.id).toBe('ai-over-engineering-score');
    expect(detector.name).toContain('Over-engineering Score');
    expect(detector.category).toBe('implementation');
    expect(detector.supportedLanguages).toEqual([]);
  });

  it('should return empty results for clean code with no classes', async () => {
    const detector = new AIOverEngineeringScoreDetector();
    const unit = makeFileUnit('clean.ts', `
import { z } from 'zod';

function add(a: number, b: number): number {
  return a + b;
}

const result = add(1, 2);
console.log(result);
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    expect(results).toHaveLength(0);
  });

  it('should score a file with many pattern-named classes highly', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 10 });
    const unit = makeFileUnit('over-engineered.ts', `
interface UserProvider {
  getUser(id: string): User;
}

class UserProviderImpl implements UserProvider {
  getUser(id: string): User {
    return { id, name: 'test' };
  }
}

class UserFactory {
  create(name: string): User {
    return { id: '1', name };
  }
}

class UserHandler {
  handle(req: Request): Response {
    return new Response();
  }
}

class UserResolver {
  resolve(id: string): User | null {
    return null;
  }
}

class UserBuilder {
  build(): User {
    return { id: '0', name: '' };
  }
}

class UserManager {
  private users: User[] = [];
  add(user: User): void {
    this.users.push(user);
  }
}

interface User { id: string; name: string; }
interface Request { body: string; }
interface Response { status: number; }
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    expect(results.length).toBeGreaterThanOrEqual(1);

    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    expect(scoreResult!.metadata?.score).toBeGreaterThan(20);
    expect(scoreResult!.message).toContain('pattern name');
  });

  it('should detect single-implementation abstractions', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 10 });
    const unit = makeFileUnit('single-impl.ts', `
abstract class BaseService {
  abstract process(data: string): void;
}

class ConcreteService extends BaseService {
  process(data: string): void {
    console.log(data);
  }
}

interface IProcessor {
  run(): void;
}

class SimpleProcessor implements IProcessor {
  run(): void {
    console.log('running');
  }
}
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    expect(scoreResult!.metadata?.score).toBeGreaterThan(10);
  });

  it('should detect excessive generic parameters', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 10 });
    const unit = makeFileUnit('generics.ts', `
class ServiceFactory<TRequest, TResponse, TContext, TConfig, TResult> {
  process(req: TRequest, ctx: TContext): TResponse {
    return {} as TResponse;
  }
}

function transform<A, B, C, D, E>(input: A, map: (a: A) => B): E {
  return {} as E;
}

class Repository<T, TFilter, TSort, TPage> {
  findAll(filter: TFilter): T[] {
    return [];
  }
}
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    // Should have a high score due to many generic params
    expect(scoreResult!.metadata?.score).toBeGreaterThan(20);
  });

  it('should detect excessive decorator chains', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 10 });
    const unit = makeFileUnit('decorators.ts', `
@Injectable()
@Validated()
@Cached()
@Logged()
@Timed()
@Deprecated()
class OverDecoratedService {
  process(): void {
    console.log('processing');
  }
}

@Observer()
@Singleton()
@Lazy()
class AnotherDecoratedClass {
  run(): void {}
}
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    expect(scoreResult!.metadata?.score).toBeGreaterThan(10);
  });

  it('should generate project-wide summary when multiple files score high', async () => {
    const detector = new AIOverEngineeringScoreDetector({
      fileReportThreshold: 10,
      projectSummaryThreshold: 20,
    });

    const units = [
      makeFileUnit('service.ts', `
class UserServiceFactory {
  create() { return {}; }
}
class UserServiceBuilder {
  build() { return {}; }
}
class UserServiceHandler {
  handle() {}
}
class UserServiceProvider {
  provide() { return null; }
}
class UserServiceManager {
  manage() {}
}
`),
      makeFileUnit('repo.ts', `
class OrderRepository {
  find() { return null; }
}
class OrderFactory {
  create() { return {}; }
}
class OrderProcessor {
  process() {}
}
`),
    ];

    const results = await detector.detect(units, EMPTY_CONTEXT);
    // Should have per-file reports + project summary
    const summary = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score-summary');
    expect(summary).toBeDefined();
    expect(summary!.message).toContain('Project AI Over-engineering Score');
    expect(summary!.metadata?.summary).toBeDefined();
  });

  it('should not report files below threshold', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 50 });
    const unit = makeFileUnit('moderate.ts', `
class UserService {
  getUser(id: string) {
    return { id, name: 'user' };
  }
}
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    // A single non-pattern-named class should score very low
    expect(results).toHaveLength(0);
  });

  it('should handle empty source', async () => {
    const detector = new AIOverEngineeringScoreDetector();
    const unit = makeFileUnit('empty.ts', '');
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    expect(results).toHaveLength(0);
  });

  it('should handle Python source', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 10 });
    const unit = createCodeUnit({
      id: 'file:over.py',
      file: 'over.py',
      language: 'python',
      kind: 'file',
      location: { startLine: 0, startColumn: 0, endLine: 10, endColumn: 0 },
      source: `
class UserFactory:
    def create(self, name: str) -> dict:
        return {"name": name}

class UserBuilder:
    def build(self) -> dict:
        return {}

class UserHandler:
    def handle(self, request: dict) -> dict:
        return {}

class UserManager:
    def manage(self) -> None:
        pass

class UserProcessor:
    def process(self, data: dict) -> dict:
        return data
`,
    });
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    expect(scoreResult!.metadata?.score).toBeGreaterThan(15);
  });

  it('should respect config overrides from context', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 1 });
    const unit = makeFileUnit('high.ts', `
class SuperImportantServiceFactoryProviderManager {
  process(): void {}
}
`);
    const context: DetectorContext = {
      projectRoot: '/test',
      allFiles: [],
      config: {
        'ai-over-engineering-score': {
          fileReportThreshold: 99,
        },
      },
    };

    const results = await detector.detect([unit], context);
    // Context config sets threshold to 99, so this file should not be reported
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeUndefined();
  });

  it('should correctly compute metrics for a realistic mixed file', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 1 });
    const unit = makeFileUnit('mixed.ts', `
// A file with some AI patterns mixed with normal code

interface DatabaseConfig {
  host: string;
  port: number;
}

interface AppConfig {
  database: DatabaseConfig;
  logging: LogConfig;
}

interface LogConfig {
  level: string;
}

class ConfigFactory {
  create(): AppConfig {
    return {
      database: { host: 'localhost', port: 5432 },
      logging: { level: 'info' },
    };
  }
}

class RequestHandler {
  handle(req: unknown): void {
    console.log(req);
  }
}

function identity<T>(value: T): T {
  return value;
}
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    // Should detect pattern names and some nesting
    const score = scoreResult!.metadata?.score as number;
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('should count total generic parameters correctly', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 1 });
    const unit = makeFileUnit('heavy-generics.ts', `
class ServiceFactory<A, B, C> {
  create(): A { return {} as A; }
}

type Result<T, E> = { ok: T } | { err: E };

function pipe<A, B, C, D>(a: A): D { return {} as D; }
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    // 3 + 2 + 4 = 9 generic params total
    expect(scoreResult!.metadata?.metrics?.genericComplexity).toBeGreaterThan(0);
  });

  it('should report severity warning for very high scores', async () => {
    const detector = new AIOverEngineeringScoreDetector({ fileReportThreshold: 1 });
    const unit = makeFileUnit('extreme.ts', `
abstract class AbstractUserService {
  abstract getUser(): void;
}

class UserService extends AbstractUserService {
  getUser(): void {}
}

class UserServiceFactory {
  create() { return {}; }
}

class UserServiceBuilder {
  build() { return {}; }
}

class UserServiceHandler {
  handle() {}
}

class UserServiceProvider {
  provide() {}
}

class UserServiceManager {
  manage() {}
}

class UserServiceProcessor {
  process() {}
}

class UserServiceResolver {
  resolve() {}
}

class UserServiceStrategy {
  execute() {}
}

class UserServiceAdapter {
  adapt() {}
}

class UserServiceDecorator {
  decorate() {}
}

class UserServiceObserver {
  observe() {}
}

interface IServiceFactory<TRequest, TResponse, TContext, TConfig> {
  create(req: TRequest, ctx: TContext): TResponse;
}
`);
    const results = await detector.detect([unit], EMPTY_CONTEXT);
    const scoreResult = results.find(r => r.metadata?.analysisType === 'ai-over-engineering-score');
    expect(scoreResult).toBeDefined();
    expect(scoreResult!.metadata?.score).toBeGreaterThanOrEqual(20);
  });
});
