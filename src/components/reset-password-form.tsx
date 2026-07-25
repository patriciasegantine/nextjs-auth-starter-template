"use client";

import Link from "next/link";
import { PasswordSetupFields } from "@/components/password-setup-fields";
import { useResetPasswordForm } from "@/hooks/use-reset-password-form";

export function ResetPasswordForm({
  token,
  invalid,
}: {
  token?: string;
  invalid: boolean;
}) {
  const { formData, feedback, isValid, updateField, handleSubmit } =
    useResetPasswordForm(token);
  const unusable = invalid || !token;
  const isSubmitting = feedback.type === "submitting";

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-9 sm:py-8">
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Choose a new password
      </h1>

      {feedback.type === "complete" ? (
        <div className="mt-6">
          <p
            role="status"
            className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800"
          >
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Link
            href="/login"
            className="mt-5 block text-center text-sm font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      ) : unusable ? (
        <div className="mt-6">
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            This reset link is invalid or expired.
          </p>
          <Link
            href="/forgot-password"
            className="mt-5 block text-center text-sm font-semibold hover:underline"
          >
            Request another link
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-black/55">
            Choose a strong password that you have not used before.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-3.5"
            noValidate
          >
          <PasswordSetupFields
            idPrefix="reset"
            password={formData.password}
            confirmation={formData.confirmation}
            passwordLabel="New password"
            onPasswordChange={(value) => updateField("password", value)}
            onConfirmationChange={(value) =>
              updateField("confirmation", value)
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
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
