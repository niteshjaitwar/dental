import { getDeliveryQueueHealth, listDeliveryJobs } from "@/lib/server/delivery-queue";
import { getStoreHealth, listRecentBookings } from "@/lib/server/submissions-store";

export async function getOpsSnapshot() {
  const [store, queue, bookings, jobs] = await Promise.all([
    getStoreHealth(),
    getDeliveryQueueHealth(),
    listRecentBookings(12),
    listDeliveryJobs(12),
  ]);

  return {
    store,
    queue,
    bookings,
    jobs,
  };
}