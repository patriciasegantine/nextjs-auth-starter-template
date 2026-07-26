"use client";

import { FormEvent, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { isRateLimitError, RATE_LIMIT_MESSAGE } from "@/lib/auth-error";
import { forgotPasswordSchema } from "@/lib/auth-validation";

const RESEND_COOLDOWN_SECONDS = 60;

type ForgotPasswordFeedback =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "sent" }
  | { type: "error"; message: string };

export function useForgotPasswordForm(initialEmail: string) {
  const [email, setEmail] = useState(initialEmail);
  const [feedback, setFeedback] = useState<ForgotPasswordFeedback>({
    type: "idle",
  });
  const [cooldown, setCooldown] = useState(0);

  const emailValidation = forgotPasswordSchema.shape.email.safeParse(email);
  const emailInvalid = email.length > 0 && !emailValidation.success;

  useEffect(() => {
    if (cooldown === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  function updateEmail(value: string) {
    setEmail(value);

    if (feedback.type === "error") {
      setFeedback({ type: "idle" });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = forgotPasswordSchema.safeParse({ email });

    if (!validation.success) {
      setFeedback({
        type: "error",
        message:
          validation.error.issues[0]?.message ?? "Enter a valid email address.",
      });
      return;
    }

    setFeedback({ type: "submitting" });

    try {
      const result = await authClient.requestPasswordReset({
        email: validation.data.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setFeedback({
          type: "error",
          message: isRateLimitError(result.error)
            ? RATE_LIMIT_MESSAGE
            : "We could not process the request. Please try again.",
        });
        return;
      }

      setFeedback({ type: "sent" });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setFeedback({
        type: "error",
        message:
          "We could not process the request. Check your connection and try again.",
      });
    }
  }

  return {
    email,
    feedback,
    cooldown,
    emailInvalid,
    isValid: emailValidation.success,
    updateEmail,
    handleSubmit,
  };
}
