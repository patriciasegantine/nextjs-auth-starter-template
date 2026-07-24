const AUTH_EMAIL_DRAFT_KEY = "auth-starter:email-draft";

export function saveAuthEmailDraft(email: string) {
  window.sessionStorage.setItem(
    AUTH_EMAIL_DRAFT_KEY,
    email.trim().toLowerCase(),
  );
}

export function readAuthEmailDraft() {
  return window.sessionStorage.getItem(AUTH_EMAIL_DRAFT_KEY) ?? "";
}

export function readServerAuthEmailDraft() {
  return "";
}

export function subscribeAuthEmailDraft() {
  return () => {};
}

export function clearAuthEmailDraft() {
  window.sessionStorage.removeItem(AUTH_EMAIL_DRAFT_KEY);
}
