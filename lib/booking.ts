import dayjs from "dayjs";
import { clinicConfig } from "@/lib/config";

export function getDateKey(date: Date | string) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function getBaseAvailableSlots(date: Date, doctorId: string): string[] {
  const seed = dayjs(date).date() + doctorId.length;

  return clinicConfig.booking.slotPools.filter(
    (_, index) => (index + seed) % 3 !== 0,
  );
}

export function getAvailableSlots(
  date: Date,
  doctorId: string,
  reservedSlots: string[] = [],
): string[] {
  const reserved = new Set(reservedSlots);

  return getBaseAvailableSlots(date, doctorId).filter(
    (slot) => !reserved.has(slot),
  );
}
