import { setTimeout as delay } from "node:timers/promises";
import { logInfo, logWarn } from "@/lib/server/logger";

export type WebhookDeliveryResult = {
  status: "skipped" | "delivered" | "failed";
  attempts: number;
  endpoint?: string;
  lastAttemptAt: string;
  lastError?: string;
  statusCode?: number;
  responsePreview?: string;
};

type SendWebhookOptions = {
  endpoint?: string;
  payload: Record<string, unknown>;
  requestId: string;
  label: "booking" | "enquiry";
};

function getEndpoint(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).toString();
  } catch {
    return undefined;
  }
}

export async function sendWebhook({
  endpoint,
  payload,
  requestId,
  label,
}: SendWebhookOptions): Promise<WebhookDeliveryResult> {
  const normalizedEndpoint = getEndpoint(endpoint);
  const skippedAt = new Date().toISOString();

  if (!endpoint) {
    return {
      status: "skipped",
      attempts: 0,
      lastAttemptAt: skippedAt,
    };
  }

  if (!normalizedEndpoint) {
    return {
      status: "failed",
      attempts: 0,
      endpoint,
      lastAttemptAt: skippedAt,
      lastError: "Webhook URL is not a valid absolute URL.",
    };
  }

  let lastError = "Webhook delivery failed.";
  let lastAttemptAt = skippedAt;
  let lastStatusCode: number | undefined;
  let responsePreview: string | undefined;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      lastAttemptAt = new Date().toISOString();
      const response = await fetch(normalizedEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": requestId,
          "Idempotency-Key": requestId,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      lastStatusCode = response.status;
      responsePreview = (await response.text()).slice(0, 300) || undefined;

      if (response.ok) {
        logInfo(`${label} webhook delivered`, {
          requestId,
          attempt,
          endpoint: normalizedEndpoint,
          statusCode: response.status,
        });

        return {
          status: "delivered",
          attempts: attempt,
          endpoint: normalizedEndpoint,
          lastAttemptAt,
          statusCode: response.status,
          responsePreview,
        };
      }

      lastError = `Webhook returned ${response.status}.`;

      if (response.status < 500) {
        break;
      }
    } catch (error) {
      clearTimeout(timeout);
      lastError =
        error instanceof Error ? error.message : "Unknown webhook delivery error.";
    }

    if (attempt < 3) {
      logWarn(`${label} webhook retry scheduled`, {
        requestId,
        attempt,
        endpoint: normalizedEndpoint,
        error: lastError,
      });
      await delay(attempt * 250);
    }
  }

  return {
    status: "failed",
    attempts: 3,
    endpoint: normalizedEndpoint,
    lastAttemptAt,
    lastError,
    statusCode: lastStatusCode,
    responsePreview,
  };
}