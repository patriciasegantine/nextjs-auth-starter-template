"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";
import {
  readAuthEmailDraft,
  readServerAuthEmailDraft,
  subscribeAuthEmailDraft,
} from "@/lib/auth-email-draft";

type ResendStatus = "idle" | "sending" | "sent" | "error";

export function VerifyEmailNotice() {
  const email = useSyncExternalStore(
    subscribeAuthEmailDraft,
    readAuthEmailDraft,
    readServerAuthEmailDraft,
  );
  const [status, setStatus] = useState<ResendStatus>("idle");

  async function resendVerificationEmail() {
    if (!email) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/session",
      });

      setStatus(result.error ? "error" : "sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-9">
      <p className="text-sm font-medium text-black/45">Auth Starter</p>

      <div className="mt-8 grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <MailCheck aria-hidden="true" className="size-7" />
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
        Check your email
      </h1>
      <p className="mt-3 text-sm leading-6 text-black/55">
        We sent a confirmation link
        {email ? (
          <>
            {" "}
            to <strong className="font-semibold text-black">{email}</strong>
          </>
        ) : null}
        . Open it to verify your address and finish signing in.
      </p>

      <div className="mt-7 rounded-xl bg-black/[0.03] px-4 py-3 text-sm leading-6 text-black/55">
        The link expires for your security. Check your spam folder if it does
        not arrive within a few minutes.
      </div>

      {status === "sent" && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          A new confirmation link was sent.
        </p>
      )}

      {status === "error" && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          We could not resend the confirmation email. Return to registration
          and try again.
        </p>
      )}

      <button
        type="button"
        onClick={resendVerificationEmail}
        disabled={!email || status === "sending" || status === "sent"}
        className="mt-6 h-11 w-full cursor-pointer rounded-xl border border-black/15 text-sm font-semibold transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "sending"
          ? "Sending…"
          : status === "sent"
            ? "Confirmation email sent"
            : "Resend confirmation email"}
      </button>

      <p className="mt-6 text-center text-sm text-black/50">
        Entered the wrong address?{" "}
        <Link
          href="/register"
          className="font-semibold text-black hover:underline"
        >
          Create a new account
        </Link>
      </p>
    </div>
  );
}
