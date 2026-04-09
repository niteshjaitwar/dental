import type { Metadata } from "next";
import { OpsLoginPage } from "@/components/pages/ops/ops-login-page";
import { getSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...getSiteMetadata({
    title: "Operations Login",
    description: "Protected access to the internal operations dashboard.",
    path: "/ops/login",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OpsLoginRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/ops";
  const error = typeof params.error === "string" ? params.error : undefined;
  const loggedOut = params.loggedOut === "1";

  return <OpsLoginPage next={next} error={error} loggedOut={loggedOut} />;
}