"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FormPasswordField } from "@/components/form-password-field";
import { FormTextField } from "@/components/form-text-field";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { useLoginForm } from "@/hooks/use-login-form";
import {
  readAuthEmailDraft,
  readServerAuthEmailDraft,
  subscribeAuthEmailDraft,
} from "@/lib/auth-email-draft";

type LoginFormProps = {
  googleEnabled: boolean;
};

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const emailDraft = useSyncExternalStore(
    subscribeAuthEmailDraft,
    readAuthEmailDraft,
    readServerAuthEmailDraft,
  );

  return (
    <LoginFormContent
      key={emailDraft}
      initialEmail={emailDraft}
      googleEnabled={googleEnabled}
    />
  );
}

type LoginFormContentProps = LoginFormProps & {
  initialEmail: string;
};

function LoginFormContent({
  initialEmail,
  googleEnabled,
}: LoginFormContentProps) {
  const {
    formData,
    feedback,
    isValid,
    emailInvalid,
    updateField,
    handlePasswordRecovery,
    handleSubmit,
    handleGoogleSignIn,
  } = useLoginForm(initialEmail);
  const isSubmitting = feedback.type === "submitting";

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-9 sm:py-8">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Welcome back
      </h1>
      <p className="mt-2 text-sm leading-6 text-black/55">
        Sign in to continue to your authenticated session.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
        <FormTextField
          id="login-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          invalid={emailInvalid}
          error={emailInvalid ? "Enter a valid email address." : undefined}
          onChange={(value) => updateField("email", value)}
          autoFocus={!initialEmail}
        />
        <FormPasswordField
          id="login-password"
          label="Password"
          name="password"
          value={formData.password}
          autoComplete="current-password"
          onChange={(value) => updateField("password", value)}
          action={
            <button
              type="button"
              onClick={handlePasswordRecovery}
              className="cursor-pointer text-xs font-medium text-black/45 hover:text-black hover:underline"
            >
              Forgot password?
            </button>
          }
        />

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
          disabled={isSubmitting || !isValid}
          className="h-11 w-full cursor-pointer rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {feedback.type === "submitting" && feedback.method === "email"
            ? "Signing in…"
            : "Sign in"}
        </button>
      </form>

      <GoogleAuthButton
        enabled={googleEnabled}
        disabled={isSubmitting}
        pending={
          feedback.type === "submitting" && feedback.method === "google"
        }
        onClick={handleGoogleSignIn}
      />

      <p className="mt-5 text-center text-sm text-black/50">
        New here?{" "}
        <Link
          href="/register"
          className="font-semibold text-black hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
