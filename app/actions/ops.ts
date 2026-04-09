"use server";

import { revalidatePath } from "next/cache";
import { processDeliveryJob, requeueDeliveryJob } from "@/lib/server/delivery-queue";
import { updateBookingStatus, type StoredBooking } from "@/lib/server/submissions-store";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function retryDeliveryJobAction(formData: FormData) {
  const jobId = getString(formData, "jobId");

  if (!jobId) {
    return;
  }

  await requeueDeliveryJob(jobId);
  await processDeliveryJob(jobId);
  revalidatePath("/ops");
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = getString(formData, "bookingId");
  const status = getString(formData, "status") as StoredBooking["status"];

  if (!bookingId || !status) {
    return;
  }

  await updateBookingStatus(bookingId, status);
  revalidatePath("/ops");
}