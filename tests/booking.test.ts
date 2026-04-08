import { describe, expect, it } from "vitest";
import { getAvailableSlots } from "@/lib/booking";
import { clinicConfig } from "@/lib/config";

describe("getAvailableSlots", () => {
  it("only returns configured booking slots", () => {
    const slots = getAvailableSlots(new Date("2026-04-08"), "dr-amelia");

    expect(slots.length).toBeGreaterThan(0);
    expect(
      slots.every((slot) => clinicConfig.booking.slotPools.includes(slot)),
    ).toBe(true);
  });

  it("changes slot output when doctor or date changes", () => {
    const first = getAvailableSlots(new Date("2026-04-08"), "dr-amelia");
    const second = getAvailableSlots(new Date("2026-04-09"), "dr-amelia");
    const third = getAvailableSlots(new Date("2026-04-08"), "dr-liam");

    expect(first).not.toEqual(second);
    expect(first).not.toEqual(third);
  });
});
