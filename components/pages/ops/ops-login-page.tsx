import { loginToOpsAction } from "@/app/actions/ops-auth";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";

export function OpsLoginPage({
  next,
  error,
  loggedOut,
}: {
  next: string;
  error?: string;
  loggedOut?: boolean;
}) {
  return (
    <section className="section-shell section-space">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[color:var(--border)] bg-white/80 p-8 shadow-sm backdrop-blur">
        <p className="eyebrow">Protected Access</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-slate-900">
          Operations login
        </h1>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          Enter the operations access token to open the internal dashboard.
        </p>
        <form action={loginToOpsAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Access token
            </label>
            <Input name="token" type="password" autoComplete="current-password" />
          </div>
          {error === "invalid" ? (
            <FormMessage>Invalid operations token.</FormMessage>
          ) : null}
          {loggedOut ? (
            <FormMessage tone="success">Operations session closed.</FormMessage>
          ) : null}
          <Button type="submit" className="w-full">
            Continue to dashboard
          </Button>
        </form>
      </div>
    </section>
  );
}