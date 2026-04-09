"use server";

import { redirect } from "next/navigation";
import { clearOpsSessionCookie, isOpsTokenValid, setOpsSessionCookie } from "@/lib/server/ops-auth";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginToOpsAction(formData: FormData) {
  const token = getString(formData, "token");
  const nextPath = getString(formData, "next") || "/ops";

  if (!(await isOpsTokenValid(token, process.env.OPS_DASHBOARD_TOKEN))) {
    redirect(`/ops/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  await setOpsSessionCookie(token);
  redirect(nextPath);
}

export async function logoutFromOpsAction() {
  await clearOpsSessionCookie();
  redirect("/ops/login?loggedOut=1");
}