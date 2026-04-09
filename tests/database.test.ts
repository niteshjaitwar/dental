import { afterEach, describe, expect, it } from "vitest";
import { getDatabaseUrl, resetDatabaseClientForTests } from "@/lib/server/database";

afterEach(async () => {
  delete process.env.DATABASE_URL;
  await resetDatabaseClientForTests();
});

describe("database configuration", () => {
  it("uses an in-memory postgres database when DATABASE_URL is missing", () => {
    delete process.env.DATABASE_URL;
    const databaseUrl = getDatabaseUrl();

    expect(databaseUrl).toBe("pg-mem://tests");
  });

  it("preserves remote database URLs", () => {
    process.env.DATABASE_URL = "postgresql://db.example.com:5432/neondb";

    expect(getDatabaseUrl()).toBe("postgresql://db.example.com:5432/neondb");
  });

  it("preserves pg-mem URLs for test isolation", () => {
    process.env.DATABASE_URL = "pg-mem://custom-suite";

    expect(getDatabaseUrl()).toBe("pg-mem://custom-suite");
  });
});