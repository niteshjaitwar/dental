import { describe, expect, it } from "vitest";
import { getAppEnv, validateAppEnv } from "@/lib/server/env";

describe("environment validation", () => {
  it("accepts valid application configuration", () => {
    const env = getAppEnv({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      DATABASE_URL:
        "postgresql://user:password@db.example.com:5432/neondb?sslmode=require",
      BOOKING_WEBHOOK_URL: "https://hooks.example.com/booking",
      CONTACT_WEBHOOK_URL: "https://hooks.example.com/contact",
      DELIVERY_QUEUE_TOKEN: "1234567890abcdef",
      OPS_DASHBOARD_TOKEN: "fedcba0987654321",
    });

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
    expect(env.DATABASE_URL).toBe(
      "postgresql://user:password@db.example.com:5432/neondb?sslmode=require",
    );
    expect(env.BOOKING_WEBHOOK_URL).toBe("https://hooks.example.com/booking");
    expect(env.DELIVERY_QUEUE_TOKEN).toBe("1234567890abcdef");
    expect(env.OPS_DASHBOARD_TOKEN).toBe("fedcba0987654321");
  });

  it("rejects malformed URLs", () => {
    const result = validateAppEnv({
      NEXT_PUBLIC_SITE_URL: "not-a-url",
      BOOKING_WEBHOOK_URL: "bad-url",
    });

    expect(result.success).toBe(false);
  });
});