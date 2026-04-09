import { randomUUID } from "node:crypto";
import { getDatabaseClient } from "@/lib/server/database";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<{ limited: boolean; retryAfterMs: number }> {
  const client = await getDatabaseClient();
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const expiresAt = new Date(now + options.windowMs).toISOString();

  await client.execute({
    sql: `DELETE FROM rate_limit_events WHERE expires_at <= ?`,
    args: [nowIso],
  });

  const countResult = await client.execute({
    sql: `SELECT COUNT(*) AS count, MIN(expires_at) AS oldest_expiry FROM rate_limit_events WHERE rate_key = ?`,
    args: [key],
  });
  const count = Number(countResult.rows[0]?.count ?? 0);
  const oldestExpiry =
    typeof countResult.rows[0]?.oldest_expiry === "string"
      ? countResult.rows[0]?.oldest_expiry
      : undefined;

  if (count >= options.limit) {
    const retryAfterMs = oldestExpiry
      ? Math.max(0, new Date(oldestExpiry).getTime() - now)
      : options.windowMs;
    return {
      limited: true,
      retryAfterMs,
    };
  }

  await client.execute({
    sql: `
      INSERT INTO rate_limit_events (id, rate_key, created_at, expires_at)
      VALUES (?, ?, ?, ?)
    `,
    args: [randomUUID(), key, nowIso, expiresAt],
  });

  return {
    limited: false,
    retryAfterMs: 0,
  };
}