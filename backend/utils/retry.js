// backend/utils/retry.js
export async function withRetry(fn, maxRetries = 3, delayMs = 200) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (['40P01', '40001'].includes(err.code) && attempt < maxRetries) {
        console.warn(`Retrying due to ${err.code} (attempt ${attempt})`);
        await new Promise((res) => setTimeout(res, delayMs * attempt));
        continue;
      }
      throw err;
    }
  }
}
