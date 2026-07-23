import { SignOutButton } from "@/components/sign-out-button";
import {
  ProjectLinks,
  SessionBrand,
  SessionCard,
} from "@/components/session/session-card";

type AuthenticatedSessionProps = {
  user: {
    name: string;
    email: string;
  };
};

export function AuthenticatedSession({ user }: AuthenticatedSessionProps) {
  const initial =
    user.name.trim().charAt(0).toUpperCase() ||
    user.email.charAt(0).toUpperCase();

  return (
    <SessionCard>
      <div className="flex items-center justify-between gap-4">
        <SessionBrand />
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          <span className="size-2 rounded-full bg-emerald-500" />
          Session active
        </span>
      </div>
      <h1 className="mt-10 text-4xl font-semibold tracking-[-0.045em]">
        You&apos;re signed in
      </h1>
      <p className="mt-4 text-base leading-7 text-black/55">
        Your identity has been verified in this browser.
      </p>

      <div className="mt-10 flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-black/[0.025] p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-black text-sm font-semibold text-white">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="mt-0.5 truncate text-sm text-black/50">{user.email}</p>
        </div>
      </div>

      <div className="mt-10 flex">
        <SignOutButton />
      </div>
      <p className="mt-8 border-t border-black/[0.07] pt-7 text-sm leading-6 text-black/55">
        Your session stays active securely in this browser until you sign out
        or it expires.
      </p>
      <ProjectLinks />
    </SessionCard>
  );
}
