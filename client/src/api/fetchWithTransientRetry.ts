const RETRY_DELAY_MS = 200

// One retry smooths over brief database wake-up/connection failures. Callers
// use this only for reads or explicitly idempotent operations.
export async function fetchWithTransientRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  let lastError: unknown

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(input, init)
      if (response.status < 500 || attempt === 1) return response
    } catch (error) {
      if (init?.signal?.aborted) throw error
      lastError = error
      if (attempt === 1) throw error
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
  }

  throw lastError
}
