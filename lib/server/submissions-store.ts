import { randomUUID } from "node:crypto";
import { getDateKey } from "@/lib/booking";
import { getDatabaseClient, getDatabaseUrl } from "@/lib/server/database";
import type { BookingValues, EnquiryValues } from "@/lib/validations";
import type { WebhookDeliveryResult } from "@/lib/server/webhooks";

type DeliverySnapshot = {
  status: "pending" | WebhookDeliveryResult["status"];
  attempts: number;
  requestId: string;
  endpoint?: string;
  lastAttemptAt?: string;
  lastError?: string;
  statusCode?: number;
  responsePreview?: string;
};

export type StoreHealth =
  | {
      ok: true;
      databaseUrl: string;
      bookingCount: number;
      enquiryCount: number;
      databaseMode: "memory" | "postgresql";
    }
  | {
      ok: false;
      databaseUrl: string;
      databaseMode: "memory" | "postgresql";
      error: string;
    };

export type StoredBooking = BookingValues & {
  id: string;
  confirmationCode: string;
  status: "pending_review" | "queued" | "submitted" | "delivery_failed" | "queued_manual_review";
  createdAt: string;
  updatedAt: string;
  delivery: DeliverySnapshot;
};

export type StoredEnquiry = EnquiryValues & {
  id: string;
  createdAt: string;
  updatedAt: string;
  delivery: DeliverySnapshot;
};

function buildConfirmationCode() {
  return `BK-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function mapBookingRow(
  row: Record<string, unknown>,
): StoredBooking {
  return {
    id: String(row.id),
    confirmationCode: String(row.confirmation_code),
    status: row.status as StoredBooking["status"],
    doctorId: String(row.doctor_id),
    date: String(row.booking_date),
    patientName: String(row.patient_name),
    email: String(row.email),
    phone: String(row.phone),
    reason: String(row.reason),
    slot: String(row.slot),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    delivery: {
      status: row.delivery_status as DeliverySnapshot["status"],
      attempts: Number(row.delivery_attempts),
      requestId: String(row.delivery_request_id),
      endpoint:
        typeof row.delivery_endpoint === "string"
          ? row.delivery_endpoint
          : undefined,
      lastAttemptAt:
        typeof row.delivery_last_attempt_at === "string"
          ? row.delivery_last_attempt_at
          : undefined,
      lastError:
        typeof row.delivery_last_error === "string"
          ? row.delivery_last_error
          : undefined,
      statusCode:
        typeof row.delivery_status_code === "number"
          ? row.delivery_status_code
          : undefined,
      responsePreview:
        typeof row.delivery_response_preview === "string"
          ? row.delivery_response_preview
          : undefined,
    },
  };
}

function mapEnquiryRow(
  row: Record<string, unknown>,
): StoredEnquiry {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    email: String(row.email),
    service: String(row.service),
    message: String(row.message),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    delivery: {
      status: row.delivery_status as DeliverySnapshot["status"],
      attempts: Number(row.delivery_attempts),
      requestId: String(row.delivery_request_id),
      endpoint:
        typeof row.delivery_endpoint === "string"
          ? row.delivery_endpoint
          : undefined,
      lastAttemptAt:
        typeof row.delivery_last_attempt_at === "string"
          ? row.delivery_last_attempt_at
          : undefined,
      lastError:
        typeof row.delivery_last_error === "string"
          ? row.delivery_last_error
          : undefined,
      statusCode:
        typeof row.delivery_status_code === "number"
          ? row.delivery_status_code
          : undefined,
      responsePreview:
        typeof row.delivery_response_preview === "string"
          ? row.delivery_response_preview
          : undefined,
    },
  };
}

export async function getReservedSlots(date: string, doctorId: string) {
  const normalizedDate = getDateKey(date);
  const client = await getDatabaseClient();
  const result = await client.execute({
    sql: `
      SELECT slot
      FROM bookings
      WHERE booking_date = ? AND doctor_id = ?
    `,
    args: [normalizedDate, doctorId],
  });

  return result.rows.map((row: Record<string, unknown>) => String(row.slot));
}

export async function createBookingRecord(
  values: BookingValues,
  requestId: string,
): Promise<
  | { ok: true; booking: StoredBooking }
  | { ok: false; reason: "slot-unavailable" }
> {
  const client = await getDatabaseClient();
  const normalizedDate = getDateKey(values.date);
  const createdAt = new Date().toISOString();
  const booking: StoredBooking = {
    ...values,
    date: normalizedDate,
    id: randomUUID(),
    confirmationCode: buildConfirmationCode(),
    status: "pending_review",
    createdAt,
    updatedAt: createdAt,
    delivery: {
      status: "pending",
      attempts: 0,
      requestId,
    },
  };

  try {
    await client.execute({
      sql: `
        INSERT INTO bookings (
          id,
          confirmation_code,
          doctor_id,
          booking_date,
          patient_name,
          email,
          phone,
          reason,
          slot,
          status,
          created_at,
          updated_at,
          delivery_status,
          delivery_attempts,
          delivery_request_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        booking.id,
        booking.confirmationCode,
        booking.doctorId,
        booking.date,
        booking.patientName,
        booking.email,
        booking.phone,
        booking.reason,
        booking.slot,
        booking.status,
        booking.createdAt,
        booking.updatedAt,
        booking.delivery.status,
        booking.delivery.attempts,
        booking.delivery.requestId,
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return { ok: false, reason: "slot-unavailable" };
    }

    throw error;
  }

  return { ok: true, booking };
}

export async function updateBookingDelivery(
  bookingId: string,
  result: WebhookDeliveryResult,
) {
  const client = await getDatabaseClient();
  await client.execute({
    sql: `
      UPDATE bookings
      SET
        updated_at = ?,
        delivery_status = ?,
        delivery_attempts = ?,
        delivery_endpoint = ?,
        delivery_last_attempt_at = ?,
        delivery_last_error = ?,
        delivery_status_code = ?,
        delivery_response_preview = ?
      WHERE id = ?
    `,
    args: [
      new Date().toISOString(),
      result.status,
      result.attempts,
      result.endpoint ?? null,
      result.lastAttemptAt,
      result.lastError ?? null,
      result.statusCode ?? null,
      result.responsePreview ?? null,
      bookingId,
    ],
  });
}

export async function updateBookingStatus(
  bookingId: string,
  status: StoredBooking["status"],
) {
  const client = await getDatabaseClient();
  await client.execute({
    sql: `
      UPDATE bookings
      SET status = ?, updated_at = ?
      WHERE id = ?
    `,
    args: [status, new Date().toISOString(), bookingId],
  });
}

export async function createEnquiryRecord(
  values: EnquiryValues,
  requestId: string,
): Promise<StoredEnquiry> {
  const client = await getDatabaseClient();
  const createdAt = new Date().toISOString();
  const enquiry: StoredEnquiry = {
    ...values,
    id: randomUUID(),
    createdAt,
    updatedAt: createdAt,
    delivery: {
      status: "pending",
      attempts: 0,
      requestId,
    },
  };

  await client.execute({
    sql: `
      INSERT INTO enquiries (
        id,
        name,
        phone,
        email,
        service,
        message,
        created_at,
        updated_at,
        delivery_status,
        delivery_attempts,
        delivery_request_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      enquiry.id,
      enquiry.name,
      enquiry.phone,
      enquiry.email,
      enquiry.service,
      enquiry.message,
      enquiry.createdAt,
      enquiry.updatedAt,
      enquiry.delivery.status,
      enquiry.delivery.attempts,
      enquiry.delivery.requestId,
    ],
  });

  return enquiry;
}

export async function updateEnquiryDelivery(
  enquiryId: string,
  result: WebhookDeliveryResult,
) {
  const client = await getDatabaseClient();
  await client.execute({
    sql: `
      UPDATE enquiries
      SET
        updated_at = ?,
        delivery_status = ?,
        delivery_attempts = ?,
        delivery_endpoint = ?,
        delivery_last_attempt_at = ?,
        delivery_last_error = ?,
        delivery_status_code = ?,
        delivery_response_preview = ?
      WHERE id = ?
    `,
    args: [
      new Date().toISOString(),
      result.status,
      result.attempts,
      result.endpoint ?? null,
      result.lastAttemptAt,
      result.lastError ?? null,
      result.statusCode ?? null,
      result.responsePreview ?? null,
      enquiryId,
    ],
  });
}

export async function getBookingRecord(bookingId: string) {
  const client = await getDatabaseClient();
  const result = await client.execute({
    sql: `SELECT * FROM bookings WHERE id = ? LIMIT 1`,
    args: [bookingId],
  });

  const row = result.rows[0];
  return row ? mapBookingRow(row as Record<string, unknown>) : null;
}

export async function getEnquiryRecord(enquiryId: string) {
  const client = await getDatabaseClient();
  const result = await client.execute({
    sql: `SELECT * FROM enquiries WHERE id = ? LIMIT 1`,
    args: [enquiryId],
  });

  const row = result.rows[0];
  return row ? mapEnquiryRow(row as Record<string, unknown>) : null;
}

export async function getStoreHealth(): Promise<StoreHealth> {
  const databaseUrl = getDatabaseUrl();
  const databaseMode: StoreHealth["databaseMode"] = databaseUrl.startsWith("pg-mem://")
    ? "memory"
    : "postgresql";

  try {
    const client = await getDatabaseClient();
    const bookings = await client.execute(`SELECT COUNT(*) AS count FROM bookings`);
    const enquiries = await client.execute(`SELECT COUNT(*) AS count FROM enquiries`);

    return {
      ok: true,
      databaseUrl,
      bookingCount: Number(bookings.rows[0]?.count ?? 0),
      enquiryCount: Number(enquiries.rows[0]?.count ?? 0),
      databaseMode,
    };
  } catch (error) {
    return {
      ok: false,
      databaseUrl,
      databaseMode,
      error: error instanceof Error ? error.message : "Unknown store error.",
    };
  }
}

export async function listRecentBookings(limit = 20) {
  const client = await getDatabaseClient();
  const result = await client.execute({
    sql: `
      SELECT *
      FROM bookings
      ORDER BY updated_at DESC
      LIMIT ?
    `,
    args: [limit],
  });

  return result.rows.map((row: Record<string, unknown>) => mapBookingRow(row));
}