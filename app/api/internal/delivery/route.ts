import { NextResponse } from "next/server";
import { processPendingDeliveryJobs } from "@/lib/server/delivery-queue";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const expectedToken = process.env.DELIVERY_QUEUE_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      {
        message: "DELIVERY_QUEUE_TOKEN is not configured.",
      },
      { status: 503 },
    );
  }

  const providedToken = request.headers.get("x-delivery-token");

  if (providedToken !== expectedToken) {
    return NextResponse.json(
      {
        message: "Unauthorized delivery processor request.",
      },
      { status: 401 },
    );
  }

  const processed = await processPendingDeliveryJobs(25);

  return NextResponse.json({
    processedCount: processed.length,
    jobs: processed.map((job) => ({
      id: job.id,
      topic: job.topic,
      status: job.status,
      attempts: job.attempts,
    })),
  });
}