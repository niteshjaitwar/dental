import { logoutFromOpsAction } from "@/app/actions/ops-auth";
import { retryDeliveryJobAction, updateBookingStatusAction } from "@/app/actions/ops";
import { Button } from "@/components/ui/button";
import type { DeliveryJob } from "@/lib/server/delivery-queue";
import type { StoredBooking } from "@/lib/server/submissions-store";

type OpsPageProps = {
  snapshot: {
    store: {
      ok: boolean;
      databaseUrl: string;
      bookingCount?: number;
      enquiryCount?: number;
      databaseMode: "memory" | "postgresql";
      error?: string;
    };
    queue: {
      queued: number;
      deadLetter: number;
    };
    bookings: StoredBooking[];
    jobs: DeliveryJob[];
  };
};

const bookingStatuses: StoredBooking["status"][] = [
  "pending_review",
  "queued",
  "submitted",
  "delivery_failed",
  "queued_manual_review",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function OpsPage({ snapshot }: OpsPageProps) {
  return (
    <section className="section-shell section-space">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <p className="eyebrow">Operations</p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-semibold text-slate-900">
                Booking and delivery operations
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
                Internal dashboard for queue visibility, delivery recovery, and manual booking state changes.
              </p>
            </div>
            <form action={logoutFromOpsAction}>
              <Button type="submit" variant="secondary">
                Sign out
              </Button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="glass-card rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Bookings
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {snapshot.store.bookingCount ?? 0}
            </p>
          </div>
          <div className="glass-card rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Enquiries
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {snapshot.store.enquiryCount ?? 0}
            </p>
          </div>
          <div className="glass-card rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Queued Jobs
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {snapshot.queue.queued}
            </p>
          </div>
          <div className="glass-card rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Dead Letter
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {snapshot.queue.deadLetter}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-slate-900">Storage health</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {snapshot.store.ok ? "Database connection healthy." : snapshot.store.error}
              </p>
            </div>
            <div className="rounded-full border border-[color:var(--border)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {snapshot.store.databaseMode === "memory" ? "Memory DB" : "Postgres"}
            </div>
          </div>
          <p className="mt-4 break-all text-xs text-[color:var(--muted)]">
            {snapshot.store.databaseUrl}
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card rounded-[2rem] p-6">
            <div className="mb-4">
              <p className="text-lg font-semibold text-slate-900">Recent bookings</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Manual review and lifecycle controls for the most recent booking records.
              </p>
            </div>
            <div className="space-y-4">
              {snapshot.bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.patientName} · {booking.confirmationCode}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted)]">
                        {booking.date} · {booking.slot} · {booking.email}
                      </p>
                    </div>
                    <div className="rounded-full border border-[color:var(--border)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      {booking.status.replaceAll("_", " ")}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{booking.reason}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted)]">
                    <span>Updated {formatDate(booking.updatedAt)}</span>
                    <span>Delivery {booking.delivery.status}</span>
                    <span>Attempts {booking.delivery.attempts}</span>
                  </div>
                  <form action={updateBookingStatusAction} className="mt-4 flex flex-wrap items-center gap-3">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <select
                      name="status"
                      defaultValue={booking.status}
                      className="rounded-2xl border border-[color:var(--border)] bg-transparent px-4 py-3 text-sm outline-none"
                    >
                      {bookingStatuses.map((status) => (
                        <option key={status} value={status} className="text-slate-900">
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary">
                      Update status
                    </Button>
                  </form>
                </article>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <div className="mb-4">
              <p className="text-lg font-semibold text-slate-900">Delivery queue</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Retry failed jobs and inspect request delivery state.
              </p>
            </div>
            <div className="space-y-4">
              {snapshot.jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {job.topic} · {job.status.replaceAll("_", " ")}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">
                        {job.recordId}
                      </p>
                    </div>
                    <div className="text-right text-xs text-[color:var(--muted)]">
                      <p>{job.attempts} / {job.maxAttempts} attempts</p>
                      <p>{formatDate(job.updatedAt)}</p>
                    </div>
                  </div>
                  {job.lastError ? (
                    <p className="mt-3 text-sm text-rose-500">{job.lastError}</p>
                  ) : null}
                  {(job.status === "failed" || job.status === "dead_letter") ? (
                    <form action={retryDeliveryJobAction} className="mt-4">
                      <input type="hidden" name="jobId" value={job.id} />
                      <Button type="submit" variant="secondary">
                        Retry now
                      </Button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}