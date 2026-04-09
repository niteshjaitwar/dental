import { afterEach, describe, expect, it, vi } from "vitest";
import { sendWebhook } from "@/lib/server/webhooks";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("sendWebhook", () => {
  it("returns skipped when no endpoint is configured", async () => {
    const result = await sendWebhook({
      endpoint: undefined,
      payload: { hello: "world" },
      requestId: "req-1",
      label: "booking",
    });

    expect(result.status).toBe("skipped");
    expect(result.attempts).toBe(0);
  });

  it("returns failed when endpoint is not a valid URL", async () => {
    const result = await sendWebhook({
      endpoint: "not-a-url",
      payload: { hello: "world" },
      requestId: "req-2",
      label: "enquiry",
    });

    expect(result.status).toBe("failed");
    expect(result.lastError).toContain("valid absolute URL");
  });

  it("returns delivered when the webhook accepts the request", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    } as Response);

    const result = await sendWebhook({
      endpoint: "https://hooks.example.com/booking",
      payload: { hello: "world" },
      requestId: "req-3",
      label: "booking",
    });

    expect(result).toMatchObject({
      status: "delivered",
      attempts: 1,
      endpoint: "https://hooks.example.com/booking",
      statusCode: 200,
      responsePreview: "accepted",
    });
  });

  it("retries server errors and returns failure after the final attempt", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: () => Promise.resolve("temporary outage"),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: () => Promise.resolve("still down"),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: () => Promise.resolve("final failure"),
      } as Response);

    const result = await sendWebhook({
      endpoint: "https://hooks.example.com/contact",
      payload: { hello: "world" },
      requestId: "req-4",
      label: "enquiry",
    });

    expect(result).toMatchObject({
      status: "failed",
      attempts: 3,
      endpoint: "https://hooks.example.com/contact",
      statusCode: 503,
      responsePreview: "final failure",
    });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});