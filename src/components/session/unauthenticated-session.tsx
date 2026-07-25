import Link from "next/link";
import { SessionCard } from "@/components/session/session-card";

export function UnauthenticatedSession() {
  return (
    <SessionCard>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-[-0.045em]">
          You&apos;re not signed in
        </h1>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          <span className="size-2 rounded-full bg-amber-500" />
          No active session
        </span>
      </div>
      <p className="mt-4 text-base leading-7 text-black/55">
        Sign in to access your account, or create one if this is your first
        visit.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-black/15 px-5 text-sm font-semibold transition hover:bg-black/[0.03]"
        >
          Create account
        </Link>
      </div>
      <p className="mt-8 border-t border-black/[0.07] pt-7 text-sm leading-6 text-black/55">
        Your account information remains private until you authenticate.
      </p>
    </SessionCard>
  );
}
