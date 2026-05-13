/**
 * Simple in-memory IP-based rate limiter
 * Max 5 leads per IP per 24 hours
 * 
 * For production at scale, use:
 * - Redis + ioredis
 * - Upstash (serverless Redis)
 * - Cloudflare Durable Objects
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp in ms when limit resets
}

// Store: Map<ip, { count, resetAt }>
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS = 5;

// Start cleanup timer (runs once per process)
if (typeof global !== 'undefined' && !(global as any).rateLimitCleanupStarted) {
  (global as any).rateLimitCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(ip);
      }
    }
  }, CLEANUP_INTERVAL);
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  message?: string;
}

/**
 * Check if IP has exceeded rate limit
 * Returns { success, remaining, resetAt, message }
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  let entry = rateLimitStore.get(ip);

  // Initialize or reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + WINDOW_MS,
    };
    rateLimitStore.set(ip, entry);
  }

  // Increment counter
  entry.count++;

  const remaining = Math.max(0, MAX_REQUESTS - entry.count);
  const success = entry.count <= MAX_REQUESTS;

  return {
    success,
    remaining,
    resetAt: entry.resetAt,
    message: success
      ? `${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining`
      : `Rate limit exceeded. Try again after ${new Date(entry.resetAt).toLocaleString()}`,
  };
}

/**
 * Reset rate limit for an IP (admin use, e.g., after false positive)
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}
