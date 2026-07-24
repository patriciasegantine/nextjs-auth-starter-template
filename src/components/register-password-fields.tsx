"use client";

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
  const mismatch = confirmation.length > 0 && password !== confirmation;
  const passwordsMatch =
    confirmation.length > 0 && password === confirmation;

  return (
    <div className="space-y-4">
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
      <PasswordRules
        password={password}
        passwordsMatch={passwordsMatch}
      />
    </div>
  );
}
