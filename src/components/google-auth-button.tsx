type GoogleAuthButtonProps = {
  enabled: boolean;
  disabled: boolean;
  pending: boolean;
  onClick: () => void;
};

export function GoogleAuthButton({
  enabled,
  disabled,
  pending,
  onClick,
}: GoogleAuthButtonProps) {
  return (
    <>
      <div className="my-5 flex items-center gap-3 text-xs text-black/35">
        <span className="h-px flex-1 bg-black/10" />
        <span>or</span>
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled || !enabled}
        title={
          enabled ? undefined : "Configure Google OAuth to enable this option"
        }
        className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-black/15 text-sm font-semibold transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <GoogleIcon />
        {pending ? "Connecting to Google…" : "Continue with Google"}
      </button>

      {!enabled && (
        <p className="mt-2 text-center text-xs text-black/35">
          Google OAuth is not configured yet
        </p>
      )}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[18px] shrink-0"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.4Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.37l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.92V7.46H3.04A10 10 0 0 0 2 12c0 1.63.39 3.17 1.04 4.54l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.46l3.35 2.62C7.18 7.71 9.39 5.95 12 5.95Z"
      />
    </svg>
  );
}
