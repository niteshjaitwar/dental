import type { Metadata } from "next";
import { OpsPage } from "@/components/pages/ops/ops-page";
import { getSiteMetadata } from "@/lib/metadata";
import { getOpsSnapshot } from "@/lib/server/ops";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...getSiteMetadata({
    title: "Operations",
    description: "Internal operations dashboard for bookings and delivery queue state.",
    path: "/ops",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OpsDashboardPage() {
  const snapshot = await getOpsSnapshot();

  return <OpsPage snapshot={snapshot} />;
}