import { randomUUID } from "node:crypto";
import { getDatabaseClient } from "@/lib/server/database";
import { logInfo, logWarn } from "@/lib/server/logger";
import {
  updateBookingDelivery,
  updateBookingStatus,
  updateEnquiryDelivery,
} from "@/lib/server/submissions-store";
import { sendWebhook, type WebhookDeliveryResult } from "@/lib/server/webhooks";

export type DeliveryTopic = "booking" | "enquiry";
export type DeliveryJobStatus =
  | "queued"
  | "processing"
  | "delivered"
  | "failed"
  | "dead_letter"
  | "skipped";

export type DeliveryJob = {
  id: string;
  topic: DeliveryTopic;
  recordId: string;
  requestId: string;
  endpoint?: string;
  payloadJson: string;
  status: DeliveryJobStatus;
  attempts: number;
  maxAttempts: number;
  availableAt: string;
  lockedAt?: string;
  lastAttemptAt?: string;
  lastError?: string;
  lastStatusCode?: number;
  responsePreview?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
};

function mapJobRow(row: Record<string, unknown>): DeliveryJob {
  return {
    id: String(row.id),
    topic: row.topic as DeliveryTopic,
    recordId: String(row.record_id),
    requestId: String(row.request_id),
    endpoint: typeof row.endpoint === "string" ? row.endpoint : undefined,
    payloadJson: String(row.payload_json),
    status: row.status as DeliveryJobStatus,
    attempts: Number(row.attempts),
    maxAttempts: Number(row.max_attempts),
    availableAt: String(row.available_at),
    lockedAt: typeof row.locked_at === "string" ? row.locked_at : undefined,
    lastAttemptAt:
      typeof row.last_attempt_at === "string" ? row.last_attempt_at : undefined,
    lastError: typeof row.last_error === "string" ? row.last_error : undefined,
    lastStatusCode:
      typeof row.last_status_code === "number" ? row.last_status_code : undefined,
    responsePreview:
      typeof row.response_preview === "string" ? row.response_preview : undefined,
    deliveredAt:
      typeof row.delivered_at === "string" ? row.delivered_at : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

async function setRecordDeliveryState(
  topic: DeliveryTopic,
  recordId: string,
  result: WebhookDeliveryResult,
) {
  if (topic === "booking") {
    await updateBookingDelivery(recordId, result);

    if (result.status === "delivered") {
      await updateBookingStatus(recordId, "submitted");
      return;
    }

    if (result.status === "skipped") {
      await updateBookingStatus(recordId, "queued_manual_review");
      return;
    }

    await updateBookingStatus(recordId, "delivery_failed");
    return;
  }

  await updateEnquiryDelivery(recordId, result);
}

export async function enqueueDeliveryJob(input: {
  topic: DeliveryTopic;
  recordId: string;
  requestId: string;
  endpoint?: string;
  payload: Record<string, unknown>;
  maxAttempts?: number;
}) {
  const client = await getDatabaseClient();
  const now = new Date().toISOString();
  const job: DeliveryJob = {
    id: randomUUID(),
    topic: input.topic,
    recordId: input.recordId,
    requestId: input.requestId,
    endpoint: input.endpoint,
    payloadJson: JSON.stringify(input.payload),
    status: "queued",
    attempts: 0,
    maxAttempts: input.maxAttempts ?? 5,
    availableAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await client.execute({
    sql: `
      INSERT INTO delivery_jobs (
        id, topic, record_id, request_id, endpoint, payload_json, status,
        attempts, max_attempts, available_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      job.id,
      job.topic,
      job.recordId,
      job.requestId,
      job.endpoint ?? null,
      job.payloadJson,
      job.status,
      job.attempts,
      job.maxAttempts,
      job.availableAt,
      job.createdAt,
      job.updatedAt,
    ],
  });

  if (input.topic === "booking") {
    await updateBookingStatus(input.recordId, "queued");
  }

  return job;
}

export async function getDeliveryJob(jobId: string) {
  const client = await getDatabaseClient();
  const result = await client.execute({
    sql: `SELECT * FROM delivery_jobs WHERE id = ? LIMIT 1`,
    args: [jobId],
  });

  const row = result.rows[0];
  return row ? mapJobRow(row as Record<string, unknown>) : null;
}

export async function getDeliveryQueueHealth() {
  const client = await getDatabaseClient();
  const queued = await client.execute({
    sql: `SELECT COUNT(*) AS count FROM delivery_jobs WHERE status IN ('queued', 'failed')`,
  });
  const deadLetter = await client.execute({
    sql: `SELECT COUNT(*) AS count FROM delivery_jobs WHERE status = 'dead_letter'`,
  });

  return {
    queued: Number(queued.rows[0]?.count ?? 0),
    deadLetter: Number(deadLetter.rows[0]?.count ?? 0),
  };
}

export async function listDeliveryJobs(limit = 20) {
  const client = await getDatabaseClient();
  const result = await client.execute({
    sql: `
      SELECT *
      FROM delivery_jobs
      ORDER BY updated_at DESC
      LIMIT ?
    `,
    args: [limit],
  });

  return result.rows.map((row: Record<string, unknown>) => mapJobRow(row));
}

export async function requeueDeliveryJob(jobId: string) {
  const client = await getDatabaseClient();
  const now = new Date().toISOString();

  await client.execute({
    sql: `
      UPDATE delivery_jobs
      SET
        status = 'queued',
        available_at = ?,
        locked_at = NULL,
        updated_at = ?
      WHERE id = ?
    `,
    args: [now, now, jobId],
  });

  return getDeliveryJob(jobId);
}

export async function processDeliveryJob(jobId: string) {
  const client = await getDatabaseClient();
  const now = new Date().toISOString();
  const lookup = await client.execute({
    sql: `SELECT * FROM delivery_jobs WHERE id = ? LIMIT 1`,
    args: [jobId],
  });
  const row = lookup.rows[0];

  if (!row) {
    return null;
  }

  const job = mapJobRow(row as Record<string, unknown>);

  if (!["queued", "failed"].includes(job.status)) {
    return job;
  }

  await client.execute({
    sql: `
      UPDATE delivery_jobs
      SET status = 'processing', locked_at = ?, updated_at = ?
      WHERE id = ?
    `,
    args: [now, now, job.id],
  });

  const delivery = await sendWebhook({
    endpoint: job.endpoint,
    payload: JSON.parse(job.payloadJson) as Record<string, unknown>,
    requestId: job.requestId,
    label: job.topic,
  });

  const attempts = job.attempts + 1;
  const isDeadLetter = delivery.status === "failed" && attempts >= job.maxAttempts;
  const nextStatus: DeliveryJobStatus =
    delivery.status === "delivered"
      ? "delivered"
      : delivery.status === "skipped"
        ? "skipped"
        : isDeadLetter
          ? "dead_letter"
          : "failed";
  const retryDelayMs = attempts * 60_000;
  const nextAvailableAt =
    nextStatus === "failed"
      ? new Date(Date.now() + retryDelayMs).toISOString()
      : now;

  await client.execute({
    sql: `
      UPDATE delivery_jobs
      SET
        status = ?,
        attempts = ?,
        locked_at = NULL,
        last_attempt_at = ?,
        last_error = ?,
        last_status_code = ?,
        response_preview = ?,
        available_at = ?,
        delivered_at = ?,
        updated_at = ?
      WHERE id = ?
    `,
    args: [
      nextStatus,
      attempts,
      delivery.lastAttemptAt,
      delivery.lastError ?? null,
      delivery.statusCode ?? null,
      delivery.responsePreview ?? null,
      nextAvailableAt,
      nextStatus === "delivered" ? now : null,
      now,
      job.id,
    ],
  });

  await setRecordDeliveryState(job.topic, job.recordId, delivery);

  if (nextStatus === "dead_letter") {
    logWarn("delivery job moved to dead letter", {
      jobId: job.id,
      topic: job.topic,
      recordId: job.recordId,
      requestId: job.requestId,
    });
  } else if (nextStatus === "delivered") {
    logInfo("delivery job completed", {
      jobId: job.id,
      topic: job.topic,
      recordId: job.recordId,
      requestId: job.requestId,
    });
  }

  return getDeliveryJob(job.id);
}

export async function processPendingDeliveryJobs(limit = 10) {
  const client = await getDatabaseClient();
  const now = new Date().toISOString();
  const result = await client.execute({
    sql: `
      SELECT id
      FROM delivery_jobs
      WHERE status IN ('queued', 'failed')
        AND available_at <= ?
      ORDER BY created_at ASC
      LIMIT ?
    `,
    args: [now, limit],
  });

  const processed = [];

  for (const row of result.rows) {
    const job = await processDeliveryJob(String(row.id));
    if (job) {
      processed.push(job);
    }
  }

  return processed;
}