const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildDelay = (attempt, { baseDelay, multiplier, maxDelay, jitter }) => {
  const exponential = Math.min(baseDelay * Math.pow(multiplier, attempt - 1), maxDelay);
  const jitterOffset = jitter ? Math.random() * jitter * 2 - jitter : 0;
  return Math.max(0, exponential + jitterOffset);
};

const shouldRetry = (error, response) => {
  if (response) {
    return response.status >= 500;
  }
  if (error) {
    return true;
  }
  return false;
};

export const fetchWithRetry = async (url, options = {}, retryOptions = {}) => {
  const {
    attempts = 3,
    baseDelay = 300,
    multiplier = 2,
    maxDelay = 3000,
    jitter = 150,
    timeoutMs = 8000,
  } = retryOptions;

  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let controller = null;
    let timeoutId = null;
    let abortListener = null;
    const { signal } = options;

    if (timeoutMs) {
      controller = new AbortController();
      if (signal) {
        abortListener = () => controller.abort();
        signal.addEventListener("abort", abortListener, { once: true });
      }
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller ? controller.signal : signal,
      });

      if (!response.ok) {
        if (response.status >= 500 && attempt < attempts) {
          const delay = buildDelay(attempt, { baseDelay, multiplier, maxDelay, jitter });
          await sleep(delay);
          continue;
        }
        const error = new Error(`Request failed with status ${response.status}`);
        error.response = response;
        throw error;
      }

      return response;
    } catch (error) {
      lastError = error;
      const response = error?.response;
      const retryable = shouldRetry(error, response);
      if (!retryable || attempt >= attempts) {
        throw error;
      }
      const delay = buildDelay(attempt, { baseDelay, multiplier, maxDelay, jitter });
      await sleep(delay);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (signal && abortListener) {
        signal.removeEventListener("abort", abortListener);
      }
    }
  }

  throw lastError || new Error("Request failed after retries.");
};

export const fetchJsonWithRetry = async (url, options, retryOptions) => {
  const response = await fetchWithRetry(url, options, retryOptions);
  return response.json();
};
