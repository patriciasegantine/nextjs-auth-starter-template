"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { AuthBrand } from "@/components/auth-brand";
import { FormTextField } from "@/components/form-text-field";
import { useForgotPasswordForm } from "@/hooks/use-forgot-password-form";
import {
  readAuthEmailDraft,
  readServerAuthEmailDraft,
  subscribeAuthEmailDraft,
} from "@/lib/auth-email-draft";

export function ForgotPasswordForm() {
  const emailDraft = useSyncExternalStore(
    subscribeAuthEmailDraft,
    readAuthEmailDraft,
    readServerAuthEmailDraft,
  );

  return <ForgotPasswordFormContent key={emailDraft} initialEmail={emailDraft} />;
}

function ForgotPasswordFormContent({ initialEmail }: { initialEmail: string }) {
  const {
    email,
    feedback,
    cooldown,
    emailInvalid,
    isValid,
    updateEmail,
    handleSubmit,
  } = useForgotPasswordForm(initialEmail);
  const isSubmitting = feedback.type === "submitting";

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-9 sm:py-8">
      <AuthBrand />
      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm leading-6 text-black/55">
        Enter your email address and we will send you a secure reset link.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
        <FormTextField
          id="forgot-password-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          invalid={emailInvalid}
          error={emailInvalid ? "Enter a valid email address." : undefined}
          onChange={updateEmail}
          autoFocus={!initialEmail}
        />

        {feedback.type === "sent" && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
          >
            If an account exists for this email, a reset link has been sent.
          </p>
        )}

        {feedback.type === "error" && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isValid || cooldown > 0}
          className="h-11 w-full cursor-pointer rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting
            ? "Sending…"
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : feedback.type === "sent"
                ? "Resend reset link"
                : "Send reset link"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-black/50">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-black hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
