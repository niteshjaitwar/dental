import { createRequire } from "node:module";
import { Pool, type PoolConfig } from "pg";

type QueryInput = string | { sql: string; args?: unknown[] };
type QueryResultRow = Record<string, unknown>;

export type DatabaseClient = {
  execute: (input: QueryInput) => Promise<{ rows: QueryResultRow[] }>;
  batch: (statements: string[], mode?: string) => Promise<void>;
  close?: () => Promise<void>;
};

type DatabaseState = {
  client: DatabaseClient;
  url: string;
  ready: Promise<DatabaseClient>;
};

declare global {
  var __dentalDatabaseState: DatabaseState | undefined;
}

function normalizeSql(sql: string, args: unknown[] = []) {
  let parameterIndex = 0;

  return {
    text: sql.replace(/\?/g, () => `$${++parameterIndex}`),
    values: args,
  };
}

function getDefaultDatabaseUrl() {
  if (process.env.NODE_ENV === "test") {
    return "pg-mem://tests";
  }

  if (process.env.NODE_ENV === "development") {
    return "pg-mem://local-dev";
  }

  throw new Error("DATABASE_URL is required in production.");
}

export function getDatabaseUrl() {
  return process.env.DATABASE_URL || getDefaultDatabaseUrl();
}

function createPostgresPool(url: string) {
  const config: PoolConfig = {
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 10_000,
    allowExitOnIdle: process.env.NODE_ENV === "test",
  };

  if (url.includes("sslmode=require") || url.includes(".neon.tech")) {
    config.ssl = { rejectUnauthorized: false };
  }

  return new Pool(config);
}

async function createMemoryPool() {
  const pgMemModule = process.env.NODE_ENV === "test"
    ? (createRequire(import.meta.url)("pg-mem") as typeof import("pg-mem"))
    : await (new Function(
        'return import("pg-mem")',
      ) as () => Promise<typeof import("pg-mem")>)();
  const { newDb } = pgMemModule;
  const db = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = db.adapters.createPg();

  return new adapter.Pool();
}

function createDatabaseClient(pool: Pick<Pool, "query" | "end">): DatabaseClient {
  return {
    async execute(input) {
      const statement =
        typeof input === "string"
          ? { text: input, values: [] as unknown[] }
          : normalizeSql(input.sql, input.args);
      const result = await pool.query(statement.text, statement.values as unknown[]);

      return {
        rows: result.rows as QueryResultRow[],
      };
    },
    async batch(statements) {
      for (const statement of statements) {
        await pool.query(statement);
      }
    },
    async close() {
      await pool.end();
    },
  };
}

async function initializeSchema(client: DatabaseClient) {
  await client.batch([
    `
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        confirmation_code TEXT NOT NULL UNIQUE,
        doctor_id TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        patient_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        reason TEXT NOT NULL,
        slot TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending_review',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        delivery_status TEXT NOT NULL,
        delivery_attempts INTEGER NOT NULL,
        delivery_request_id TEXT NOT NULL,
        delivery_endpoint TEXT,
        delivery_last_attempt_at TEXT,
        delivery_last_error TEXT,
        delivery_status_code INTEGER,
        delivery_response_preview TEXT,
        UNIQUE (doctor_id, booking_date, slot)
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        service TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        delivery_status TEXT NOT NULL,
        delivery_attempts INTEGER NOT NULL,
        delivery_request_id TEXT NOT NULL,
        delivery_endpoint TEXT,
        delivery_last_attempt_at TEXT,
        delivery_last_error TEXT,
        delivery_status_code INTEGER,
        delivery_response_preview TEXT
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS rate_limit_events (
        id TEXT PRIMARY KEY,
        rate_key TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
      )
    `,
    `
      CREATE INDEX IF NOT EXISTS rate_limit_key_idx
      ON rate_limit_events (rate_key, expires_at)
    `,
    `
      CREATE TABLE IF NOT EXISTS delivery_jobs (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        record_id TEXT NOT NULL,
        request_id TEXT NOT NULL,
        endpoint TEXT,
        payload_json TEXT NOT NULL,
        status TEXT NOT NULL,
        attempts INTEGER NOT NULL,
        max_attempts INTEGER NOT NULL,
        available_at TEXT NOT NULL,
        locked_at TEXT,
        last_attempt_at TEXT,
        last_error TEXT,
        last_status_code INTEGER,
        response_preview TEXT,
        delivered_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `,
    `
      CREATE INDEX IF NOT EXISTS delivery_jobs_status_idx
      ON delivery_jobs (status, available_at)
    `,
    `
      CREATE INDEX IF NOT EXISTS bookings_date_doctor_idx
      ON bookings (booking_date, doctor_id)
    `,
    `
      CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
      ON enquiries (created_at)
    `,
    `
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_review'
    `,
  ]);

  return client;
}

export async function getDatabaseClient() {
  const url = getDatabaseUrl();
  const existing = globalThis.__dentalDatabaseState;

  if (existing && existing.url === url) {
    return existing.ready;
  }

  const pool = url.startsWith("pg-mem://")
    ? await createMemoryPool()
    : createPostgresPool(url);
  const client = createDatabaseClient(pool);
  const ready = initializeSchema(client);

  globalThis.__dentalDatabaseState = {
    client,
    url,
    ready,
  };

  return ready;
}

export async function resetDatabaseClientForTests() {
  const existing = globalThis.__dentalDatabaseState;
  globalThis.__dentalDatabaseState = undefined;

  if (!existing) {
    return;
  }

  const client = await existing.ready;
  await client.close?.();
}