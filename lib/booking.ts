import dayjs from "dayjs";
import { clinicConfig } from "@/lib/config";

export function getAvailableSlots(date: Date, doctorId: string): string[] {
  const seed = dayjs(date).date() + doctorId.length;

  return clinicConfig.booking.slotPools.filter(
    (_, index) => (index + seed) % 3 !== 0,
  );
}
