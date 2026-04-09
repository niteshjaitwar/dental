import { afterEach, describe, expect, it, vi } from "vitest";
import { resetDatabaseClientForTests } from "@/lib/server/database";
import {
  enqueueDeliveryJob,
  getDeliveryJob,
  getDeliveryQueueHealth,
  processDeliveryJob,
} from "@/lib/server/delivery-queue";
import {
  createBookingRecord,
  getBookingRecord,
} from "@/lib/server/submissions-store";

const originalFetch = global.fetch;

afterEach(async () => {
  global.fetch = originalFetch;
  delete process.env.BOOKING_WEBHOOK_URL;
  delete process.env.DATABASE_URL;
  await resetDatabaseClientForTests();
  vi.restoreAllMocks();
});

async function configureTempDatabase() {
  process.env.DATABASE_URL = `pg-mem://delivery-queue-${Date.now()}-${Math.random()}`;
  await resetDatabaseClientForTests();
}

describe("delivery queue", () => {
  it("delivers queued booking jobs and updates booking status", async () => {
    await configureTempDatabase();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("accepted"),
    } as Response);

    const booking = await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-10",
        patientName: "Alex Carter",
        email: "alex@example.com",
        phone: "+13105550148",
        reason: "Dental implant consultation",
        slot: "09:30",
      },
      "req-booking-queue",
    );

    if (!booking.ok) {
      throw new Error("Expected booking creation to succeed.");
    }

    const job = await enqueueDeliveryJob({
      topic: "booking",
      recordId: booking.booking.id,
      requestId: "req-booking-queue",
      endpoint: "https://hooks.example.com/booking",
      payload: { hello: "world" },
    });

    const processed = await processDeliveryJob(job.id);
    const persistedBooking = await getBookingRecord(booking.booking.id);

    expect(processed?.status).toBe("delivered");
    expect(persistedBooking?.status).toBe("submitted");
    expect(persistedBooking?.delivery.status).toBe("delivered");
  });

  it("moves repeatedly failing jobs to dead letter", async () => {
    await configureTempDatabase();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: () => Promise.resolve("unavailable"),
    } as Response);

    const booking = await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-11",
        patientName: "Jamie Parker",
        email: "jamie@example.com",
        phone: "+13105550149",
        reason: "Second opinion",
        slot: "10:30",
      },
      "req-booking-dead-letter",
    );

    if (!booking.ok) {
      throw new Error("Expected booking creation to succeed.");
    }

    const job = await enqueueDeliveryJob({
      topic: "booking",
      recordId: booking.booking.id,
      requestId: "req-booking-dead-letter",
      endpoint: "https://hooks.example.com/booking",
      payload: { hello: "world" },
      maxAttempts: 1,
    });

    const processed = await processDeliveryJob(job.id);
    const persistedBooking = await getBookingRecord(booking.booking.id);
    const health = await getDeliveryQueueHealth();

    expect(processed?.status).toBe("dead_letter");
    expect(persistedBooking?.status).toBe("delivery_failed");
    expect(health.deadLetter).toBeGreaterThanOrEqual(1);
  });

  it("returns null for a missing job id", async () => {
    await configureTempDatabase();

    await expect(getDeliveryJob("missing-job")).resolves.toBeNull();
    await expect(processDeliveryJob("missing-job")).resolves.toBeNull();
  });
});