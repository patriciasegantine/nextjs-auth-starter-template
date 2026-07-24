"use client";

import { useState, type FocusEvent } from "react";
import { FormPasswordField } from "@/components/form-password-field";
import { PasswordRules } from "@/components/password-rules";

type RegisterPasswordFieldsProps = {
  password: string;
  confirmation: string;
  onPasswordChange: (value: string) => void;
  onConfirmationChange: (value: string) => void;
};

export function RegisterPasswordFields({
  password,
  confirmation,
  onPasswordChange,
  onConfirmationChange,
}: RegisterPasswordFieldsProps) {
  const [showRules, setShowRules] = useState(false);
  const mismatch = confirmation.length > 0 && password !== confirmation;
  const passwordsMatch =
    confirmation.length > 0 && password === confirmation;

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowRules(false);
    }
  }

  return (
    <div
      className="relative space-y-3.5"
      onFocusCapture={() => setShowRules(true)}
      onBlurCapture={handleBlur}
    >
      <FormPasswordField
        id="register-password"
        label="Password"
        name="password"
        value={password}
        autoComplete="new-password"
        onChange={onPasswordChange}
      />
      <FormPasswordField
        id="register-password-confirmation"
        label="Confirm password"
        name="confirmation"
        value={confirmation}
        autoComplete="new-password"
        invalid={mismatch}
        onChange={onConfirmationChange}
      />
      {mismatch && (
        <p className="-mt-2 text-sm text-red-700" role="alert">
          Passwords do not match.
        </p>
      )}
      {showRules && (
        <>
          <PasswordRules
            password={password}
            passwordsMatch={passwordsMatch}
            className="xl:absolute xl:left-[calc(100%+1rem)] xl:top-0 xl:z-10 xl:mt-0 xl:w-72 xl:bg-white xl:shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
          />
          <span
            aria-hidden="true"
            className="absolute left-full top-8 z-20 ml-2 hidden size-4 rotate-45 border-b border-l border-black/[0.07] bg-white xl:block"
          />
        </>
      )}
    </div>
  );
}
