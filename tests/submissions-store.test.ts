import { afterEach, describe, expect, it } from "vitest";
import { getAvailableSlots } from "@/lib/booking";
import { resetDatabaseClientForTests } from "@/lib/server/database";
import {
  createBookingRecord,
  createEnquiryRecord,
  getBookingRecord,
  getEnquiryRecord,
  getReservedSlots,
  getStoreHealth,
  updateBookingDelivery,
  updateEnquiryDelivery,
} from "@/lib/server/submissions-store";

afterEach(async () => {
  await resetDatabaseClientForTests();
  delete process.env.DATABASE_URL;
});

async function configureTempStore() {
  process.env.DATABASE_URL = `pg-mem://submissions-store-${Date.now()}-${Math.random()}`;
  await resetDatabaseClientForTests();
}

describe("submissions store", () => {
  it("persists bookings and reserves the chosen slot", async () => {
    await configureTempStore();

    const result = await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-01",
        patientName: "Alex Carter",
        email: "alex@example.com",
        phone: "+13105550148",
        reason: "Dental implant consultation",
        slot: "09:30",
      },
      "req-1",
    );

    expect(result.ok).toBe(true);
    const reservedSlots = await getReservedSlots("2026-05-01", "dr-amelia");
    const createdBooking = result.ok
      ? await getBookingRecord(result.booking.id)
      : null;

    expect(reservedSlots).toContain("09:30");
    expect(
      getAvailableSlots(new Date("2026-05-01"), "dr-amelia", reservedSlots),
    ).not.toContain("09:30");
    expect(createdBooking?.delivery).toMatchObject({
      status: "pending",
      attempts: 0,
      endpoint: undefined,
      lastAttemptAt: undefined,
      lastError: undefined,
      statusCode: undefined,
      responsePreview: undefined,
    });
    expect(createdBooking?.status).toBe("pending_review");
  });

  it("rejects duplicate bookings for the same doctor, date, and slot", async () => {
    await configureTempStore();

    await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-02",
        patientName: "Alex Carter",
        email: "alex@example.com",
        phone: "+13105550148",
        reason: "Dental implant consultation",
        slot: "10:30",
      },
      "req-1",
    );

    const duplicate = await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-02",
        patientName: "Jamie Parker",
        email: "jamie@example.com",
        phone: "+13105550149",
        reason: "Second opinion",
        slot: "10:30",
      },
      "req-2",
    );

    expect(duplicate).toEqual({
      ok: false,
      reason: "slot-unavailable",
    });
  });

  it("updates persisted delivery metadata for bookings and enquiries", async () => {
    await configureTempStore();

    const booking = await createBookingRecord(
      {
        doctorId: "dr-amelia",
        date: "2026-05-03",
        patientName: "Alex Carter",
        email: "alex@example.com",
        phone: "+13105550148",
        reason: "Dental implant consultation",
        slot: "11:30",
      },
      "req-booking",
    );

    if (!booking.ok) {
      throw new Error("Expected booking record creation to succeed.");
    }

    const enquiry = await createEnquiryRecord(
      {
        name: "Jamie Parker",
        phone: "+13105550149",
        email: "jamie@example.com",
        service: "Dental Implants",
        message: "Need follow-up details.",
      },
      "req-enquiry",
    );

    await updateBookingDelivery(booking.booking.id, {
      status: "delivered",
      attempts: 1,
      endpoint: "https://hooks.example.com/booking",
      lastAttemptAt: new Date().toISOString(),
      statusCode: 200,
      responsePreview: "accepted",
    });

    await updateEnquiryDelivery(enquiry.id, {
      status: "failed",
      attempts: 3,
      endpoint: "https://hooks.example.com/contact",
      lastAttemptAt: new Date().toISOString(),
      lastError: "temporary failure",
      statusCode: 503,
      responsePreview: "retry later",
    });

    const persistedBooking = await getBookingRecord(booking.booking.id);
    const persistedEnquiry = await getEnquiryRecord(enquiry.id);

    expect(persistedBooking?.delivery).toMatchObject({
      status: "delivered",
      endpoint: "https://hooks.example.com/booking",
    });
    expect(persistedEnquiry?.delivery).toMatchObject({
      status: "failed",
      lastError: "temporary failure",
    });
  });

  it("reports store health for the configured persistence paths", async () => {
    await configureTempStore();

    const health = await getStoreHealth();

    expect(health.ok).toBe(true);
    expect(health.databaseUrl).toBe(process.env.DATABASE_URL);
    expect(health.databaseMode).toBe("memory");
  });

  it("returns null for records that do not exist", async () => {
    await configureTempStore();

    await expect(getBookingRecord("missing-booking")).resolves.toBeNull();
    await expect(getEnquiryRecord("missing-enquiry")).resolves.toBeNull();
  });
});