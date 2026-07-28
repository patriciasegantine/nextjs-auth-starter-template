"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  clearAuthEmailDraft,
  saveAuthEmailDraft,
} from "@/lib/auth-email-draft";
import { isRateLimitError, RATE_LIMIT_MESSAGE } from "@/lib/auth-error";
import { loginSchema } from "@/lib/auth-validation";

type LoginField = "email" | "password";
type LoginFeedback =
  | { type: "idle" }
  | { type: "submitting"; method: "email" | "google" }
  | { type: "error"; message: string };

export function useLoginForm(initialEmail: string) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: "",
  });
  const [feedback, setFeedback] = useState<LoginFeedback>({ type: "idle" });

  const validation = loginSchema.safeParse(formData);
  const emailInvalid =
    formData.email.length > 0 &&
    !loginSchema.shape.email.safeParse(formData.email).success;

  function updateField(field: LoginField, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setFeedback({ type: "idle" });
  }

  function handlePasswordRecovery() {
    const email = loginSchema.shape.email.safeParse(formData.email);

    if (email.success) {
      saveAuthEmailDraft(email.data);
    } else {
      clearAuthEmailDraft();
    }

    router.push("/forgot-password");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      setFeedback({
        type: "error",
        message: result.error.issues[0]?.message ?? "Check your details.",
      });
      return;
    }

    setFeedback({ type: "submitting", method: "email" });

    try {
      const signInResult = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
        callbackURL: "/session",
      });

      if (signInResult.error) {
        if (signInResult.error.code === "EMAIL_NOT_VERIFIED") {
          saveAuthEmailDraft(result.data.email);
          router.push("/verify-email");
          return;
        }

        setFeedback({
          type: "error",
          message: isRateLimitError(signInResult.error)
            ? RATE_LIMIT_MESSAGE
            : "Incorrect email or password.",
        });
        return;
      }

      clearAuthEmailDraft();
      router.push("/session");
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        message:
          "We could not sign you in. Check your connection and try again.",
      });
    }
  }

  async function handleGoogleSignIn() {
    setFeedback({ type: "submitting", method: "google" });

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/session",
      });

      if (result.error) {
        setFeedback({
          type: "error",
          message: result.error.message ?? "Google sign-in failed.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message:
          "We could not connect to Google. Check your connection and try again.",
      });
    }
  }

  return {
    formData,
    feedback,
    isValid: validation.success,
    emailInvalid,
    updateField,
    handlePasswordRecovery,
    handleSubmit,
    handleGoogleSignIn,
  };
}
