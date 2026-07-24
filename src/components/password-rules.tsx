import { passwordRules } from "@/lib/auth-validation";

export function PasswordRules({
  password,
  passwordsMatch,
  className = "",
}: {
  password: string;
  passwordsMatch: boolean;
  className?: string;
}) {
  const rules = [
    ...passwordRules.map((rule) => ({
      label: rule.label,
      valid: rule.test(password),
    })),
    {
      label: "Passwords match",
      valid: passwordsMatch,
    },
  ];
  const completed = rules.filter((rule) => rule.valid).length;

  return (
    <div
      className={`rounded-xl border border-black/[0.07] bg-black/[0.025] p-4 ${className}`}
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-black/45">
          Password strength
        </p>
        <span className="text-xs font-medium text-black/40">
          {completed}/{rules.length}
        </span>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {rules.map((rule) => (
          <li
            key={rule.label}
            className={`flex items-center gap-2 text-xs transition ${
              rule.valid ? "text-emerald-700" : "text-black/40"
            }`}
          >
            <span
              className={`size-2 shrink-0 rounded-full ${
                rule.valid ? "bg-emerald-500" : "bg-black/15"
              }`}
            />
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
