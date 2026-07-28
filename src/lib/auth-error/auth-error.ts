export const RATE_LIMIT_MESSAGE =
  "Too many attempts. Please wait a moment and try again.";

export function isRateLimitError(error: { status?: number }) {
  return error.status === 429;
}
