import { afterEach, describe, expect, it, vi } from "vitest";
import { resetDatabaseClientForTests } from "@/lib/server/database";
import { enqueueDeliveryJob, processDeliveryJob } from "@/lib/server/delivery-queue";
import { getOpsSnapshot } from "@/lib/server/ops";
import { createBookingRecord } from "@/lib/server/submissions-store";

const originalFetch = global.fetch;

afterEach(async () => {
  global.fetch = originalFetch;
  delete process.env.DATABASE_URL;
  await resetDatabaseClientForTests();
  vi.restoreAllMocks();
});

async function configureTempDatabase() {
  process.env.DATABASE_URL = `pg-mem://ops-${Date.now()}-${Math.random()}`;
  await resetDatabaseClientForTests();
}

describe("operations snapshot", () => {
  it("returns bookings and queue state for the dashboard", async () => {
    await configureTempDatabase();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: () => Promise.resolve("unavailable"),
    } as Response);

    const booking = await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-14",
        patientName: "Taylor Reed",
        email: "taylor@example.com",
        phone: "+13105550150",
        reason: "Implant review",
        slot: "14:30",
      },
      "req-ops",
    );

    if (!booking.ok) {
      throw new Error("Expected booking creation to succeed.");
    }

    const job = await enqueueDeliveryJob({
      topic: "booking",
      recordId: booking.booking.id,
      requestId: "req-ops",
      endpoint: "https://hooks.example.com/booking",
      payload: { hello: "world" },
      maxAttempts: 1,
    });

    await processDeliveryJob(job.id);

    const snapshot = await getOpsSnapshot();

    expect(snapshot.bookings.length).toBeGreaterThan(0);
    expect(snapshot.jobs.length).toBeGreaterThan(0);
    expect(snapshot.queue.deadLetter).toBeGreaterThanOrEqual(1);
  });
});