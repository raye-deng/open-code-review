// ──────────────────────────────────────────────────────────────────
// Test fixture: AI-generated over-engineered configuration types
// Demonstrates deeply nested config hierarchies and generic abuse
// ──────────────────────────────────────────────────────────────────

// ── Deeply nested configuration hierarchy ──────────────────────────
// AI models create excessively deep config type chains when a flat
// config object would be simpler and more maintainable.

interface PostgresConnectionPoolConfig {
  minConnections: number;
  maxConnections: number;
  idleTimeoutMs: number;
}

interface PostgresDatabaseConfig {
  host: string;
  port: number;
  pool: PostgresConnectionPoolConfig;
}

interface DatabaseConfig {
  primary: PostgresDatabaseConfig;
  replica: PostgresDatabaseConfig;
  migrationsDir: string;
}

interface ServiceConfig {
  database: DatabaseConfig;
  cache: CacheConfig;
  timeout: number;
}

interface CacheConfig {
  redisOptions: RedisOptions;
  ttlSeconds: number;
}

interface RedisOptions {
  host: string;
  port: number;
}

interface AppConfig {
  service: ServiceConfig;
  name: string;
  version: string;
}

// ── Generic type parameter over-engineering ─────────────────────────
// AI models add excessive generic parameters "just in case"

function processRequest<TInput, TOutput, TContext, TError, TMetadata>(
  input: TInput,
  context: TContext,
): Promise<TOutput> {
  return Promise.resolve(input as unknown as TOutput);
}

class DataPipelineFactory<TSource, TTransform, TDestination, TSideEffect, TMetrics> {
  create(source: TSource): TDestination {
    return {} as TDestination;
  }
}

// ── Deeply nested generic types ─────────────────────────────────────
// AI produces unreadable type expressions with 4+ levels of nesting

type PipelineResult = Map<string, Array<Promise<Either<Error, Response<ApiData>>>>>;

interface Either<L, R> { left?: L; right?: R; }
interface Response<T> { data: T; status: number; }
interface ApiData { id: string; }

// ── Clean alternative (what a human would write) ────────────────────
// A flat config object that's easier to understand and maintain

interface AppConfigFlat {
  name: string;
  version: string;
  dbHost: string;
  dbPort: number;
  dbPoolMin: number;
  dbPoolMax: number;
  cacheHost: string;
  cacheTtl: number;
  requestTimeout: number;
}
