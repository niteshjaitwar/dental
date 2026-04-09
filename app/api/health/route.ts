import { NextResponse } from "next/server";
import { getDeliveryQueueHealth } from "@/lib/server/delivery-queue";
import { validateAppEnv } from "@/lib/server/env";
import { getStoreHealth } from "@/lib/server/submissions-store";

export const runtime = "nodejs";

export async function GET() {
  const store = await getStoreHealth();
  const queue = await getDeliveryQueueHealth();
  const envValidation = validateAppEnv();
  const bookingWebhookConfigured = Boolean(process.env.BOOKING_WEBHOOK_URL);
  const contactWebhookConfigured = Boolean(process.env.CONTACT_WEBHOOK_URL);
  const deliveryQueueTokenConfigured = Boolean(process.env.DELIVERY_QUEUE_TOKEN);
  const opsDashboardTokenConfigured = Boolean(process.env.OPS_DASHBOARD_TOKEN);
  const healthy =
    store.ok &&
    bookingWebhookConfigured &&
    contactWebhookConfigured &&
    envValidation.success;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      checks: {
        store,
        queue,
        env: envValidation.success
          ? { ok: true }
          : {
              ok: false,
              issues: envValidation.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
              })),
            },
        bookingWebhookConfigured,
        contactWebhookConfigured,
        deliveryQueueTokenConfigured,
        opsDashboardTokenConfigured,
      },
    },
    {
      status: healthy ? 200 : 503,
    },
  );
}