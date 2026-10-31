import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = { success: boolean };
type Limiter = { limit: (key: string) => Promise<LimitResult> };

/** Per-process fallback for local development without Upstash. Not shared across serverless instances. */
function memoryLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>();
  return {
    async limit(key) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= max) return { success: false };
      recent.push(now);
      hits.set(key, recent);
      return { success: true };
    },
  };
}

function createLimiter(prefix: string, max: number, windowMinutes: number): Limiter {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(max, `${windowMinutes} m`),
      prefix: `ratelimit:${prefix}`,
    });
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      `[ratelimit] Upstash is not configured; "${prefix}" uses a per-instance memory limit.`,
    );
  }
  return memoryLimiter(max, windowMinutes * 60_000);
}

/** Contact form: 3 messages per 10 minutes per IP. */
export const contactLimiter = createLimiter("contact", 3, 10);

/** Chatbot: 10 questions per 10 minutes per IP. */
export const chatLimiter = createLimiter("chat", 10, 10);

/** Chatbot: 300 questions a day across all visitors, to cap the API bill. */
export const chatDailyLimiter = createLimiter("chat-daily", 300, 24 * 60);
