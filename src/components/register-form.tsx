"use client";

import Link from "next/link";
import { AuthBrand } from "@/components/auth-brand";
import { FormTextField } from "@/components/form-text-field";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { RegisterPasswordFields } from "@/components/register-password-fields";
import { useRegistrationForm } from "@/hooks/use-registration-form";

type RegisterFormProps = {
  googleEnabled: boolean;
};

export function RegisterForm({ googleEnabled }: RegisterFormProps) {
  const {
    formData,
    feedback,
    isValid,
    nameInvalid,
    emailInvalid,
    updateField,
    handleSubmit,
    handleGoogleSignIn,
  } = useRegistrationForm();
  const { name, email, password, confirmation } = formData;

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:px-9 sm:py-8">
      <AuthBrand />
      <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
        Create your account
      </h1>
      <p className="mt-2 text-sm leading-6 text-black/55">
        Enter your details and choose a strong password to get started.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3.5" noValidate>
        <FormTextField
          id="register-name"
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          invalid={nameInvalid}
          error={nameInvalid ? "Name must be at least 3 characters." : undefined}
          onChange={(value) => updateField("name", value)}
          autoFocus
        />
        <FormTextField
          id="register-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          invalid={emailInvalid}
          error={emailInvalid ? "Enter a valid email address." : undefined}
          onChange={(value) => updateField("email", value)}
        />
        <RegisterPasswordFields
          password={password}
          confirmation={confirmation}
          onPasswordChange={(value) => updateField("password", value)}
          onConfirmationChange={(value) =>
            updateField("confirmation", value)
          }
        />

        {feedback.type === "account-exists" && (
          <div
            role="alert"
            className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <p>An account already uses this email.</p>
            <p className="mt-1 text-amber-900/70">
              <Link
                href="/login"
                className="font-semibold underline"
              >
                Sign in
              </Link>{" "}
              or{" "}
              <Link
                href="/forgot-password"
                className="font-semibold underline"
              >
                reset your password
              </Link>
              .
            </p>
          </div>
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
          disabled={feedback.type === "submitting" || !isValid}
          className="h-11 w-full cursor-pointer rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {feedback.type === "submitting" && feedback.method === "email"
            ? "Creating account…"
            : "Create account"}
        </button>
      </form>

      <GoogleAuthButton
        enabled={googleEnabled}
        disabled={feedback.type === "submitting"}
        pending={
          feedback.type === "submitting" && feedback.method === "google"
        }
        onClick={handleGoogleSignIn}
      />

      <p className="mt-5 text-center text-sm text-black/50">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-black hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
