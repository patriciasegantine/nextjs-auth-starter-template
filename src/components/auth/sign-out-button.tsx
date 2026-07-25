"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-xl border border-black/15 bg-white px-5 text-sm font-semibold transition hover:bg-black/[0.03]"
    >
      Sign out
    </button>
  );
}
