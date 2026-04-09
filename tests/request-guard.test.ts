import { describe, expect, it } from "vitest";
import { resetDatabaseClientForTests } from "@/lib/server/database";
import { checkRateLimit } from "@/lib/server/request-guard";

describe("request guard", () => {
  it("allows requests until the configured limit is exceeded", async () => {
    const key = `test-${Date.now()}`;

    expect(
      (await checkRateLimit(key, {
        limit: 2,
        windowMs: 10_000,
      })).limited,
    ).toBe(false);

    expect(
      (await checkRateLimit(key, {
        limit: 2,
        windowMs: 10_000,
      })).limited,
    ).toBe(false);

    const limited = await checkRateLimit(key, {
      limit: 2,
      windowMs: 10_000,
    });

    expect(limited.limited).toBe(true);
    expect(limited.retryAfterMs).toBeGreaterThan(0);

    await resetDatabaseClientForTests();
  });
});