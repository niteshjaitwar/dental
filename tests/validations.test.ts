import { describe, expect, it } from "vitest";
import { bookingSchema, enquirySchema } from "@/lib/validations";

describe("validation schemas", () => {
  it("rejects booking dates beyond the supported booking window", () => {
    const result = bookingSchema.safeParse({
      doctorId: "dr-amelia",
      date: "2027-12-31",
      patientName: "Alex Carter",
      email: "alex@example.com",
      phone: "+13105550148",
      reason: "Implant consultation request",
      slot: "09:30",
    });

    expect(result.success).toBe(false);
  });

  it("rejects malformed phone numbers", () => {
    const result = enquirySchema.safeParse({
      name: "Alex Carter",
      phone: "abc12345",
      email: "alex@example.com",
      service: "Dental Implants",
      message: "Need help with an implant consultation.",
    });

    expect(result.success).toBe(false);
  });
});