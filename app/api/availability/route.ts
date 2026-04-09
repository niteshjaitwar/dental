import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/booking";
import { getReservedSlots } from "@/lib/server/submissions-store";

export const runtime = "nodejs";

const querySchema = z.object({
  date: z.string().date(),
  doctorId: z.string().trim().min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    date: searchParams.get("date"),
    doctorId: searchParams.get("doctorId"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid availability query.",
        slots: [],
      },
      { status: 400 },
    );
  }

  const reservedSlots = await getReservedSlots(
    parsed.data.date,
    parsed.data.doctorId,
  );
  const slots = getAvailableSlots(
    new Date(`${parsed.data.date}T00:00:00`),
    parsed.data.doctorId,
    reservedSlots,
  );

  return NextResponse.json({
    date: parsed.data.date,
    doctorId: parsed.data.doctorId,
    slots,
  });
}