/**
 * Retries an async function up to `attempts` times with exponential backoff.
 * Handles transient network errors like ECONNRESET from Supabase.
 */
export async function withRetry<T>(
  fn: () => PromiseLike<T>,
  attempts = 3,
  delayMs = 300,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}
