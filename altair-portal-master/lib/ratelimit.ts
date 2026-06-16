/**
 * @file lib/ratelimit.ts
 * @purpose Upstash Redis sliding-window rate limiters for auth, AI, and bulk routes.
 * @dependencies @upstash/redis, @upstash/ratelimit
 *
 * Posture:
 *   - FAIL-OPEN in development (UPSTASH_REDIS_REST_URL/TOKEN missing) to avoid
 *     blocking local iteration; logs a warning each invocation.
 *   - FAIL-CLOSED in production (NODE_ENV === 'production'): if Redis is
 *     unreachable or env vars absent, the request is rejected with 429 to prevent
 *     unauthenticated/metered resources from being called without limit tracking.
 *
 * Limiters:
 *   authLimiter    — 10 req / 60 s  (login brute-force prevention)
 *   aiLimiter      — 20 req / 60 s  (Gemini token spend control)
 *   bulkLimiter    — 3  req / 60 s  (bulk/import CPU+DB protection)
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RateLimitResult =
  | { limited: false }
  | { limited: true; reset: number };

// ---------------------------------------------------------------------------
// Internal: build Redis client only when env vars are present
// ---------------------------------------------------------------------------

function buildRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function buildLimiter(
  redis: Redis,
  requests: number,
  windowSeconds: number,
  prefix: string
): Ratelimit {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    prefix,
  });
}

// ---------------------------------------------------------------------------
// Limiter instances (lazy — only materialised when Redis is available)
// ---------------------------------------------------------------------------

let _redis: Redis | null | undefined;
let _authLimiter: Ratelimit | null | undefined;
let _aiLimiter: Ratelimit | null | undefined;
let _bulkLimiter: Ratelimit | null | undefined;

function getRedis(): Redis | null {
  if (_redis === undefined) _redis = buildRedis();
  return _redis;
}

function getAuthLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!_authLimiter) _authLimiter = buildLimiter(r, 10, 60, 'rl:auth');
  return _authLimiter;
}

function getAiLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!_aiLimiter) _aiLimiter = buildLimiter(r, 20, 60, 'rl:ai');
  return _aiLimiter;
}

function getBulkLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!_bulkLimiter) _bulkLimiter = buildLimiter(r, 3, 60, 'rl:bulk');
  return _bulkLimiter;
}

// ---------------------------------------------------------------------------
// Public: check rate limit for a given identifier
// ---------------------------------------------------------------------------

async function checkLimit(
  limiter: Ratelimit | null,
  identifier: string,
  limiterName: string
): Promise<RateLimitResult> {
  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        `[ratelimit] FAIL-CLOSED: ${limiterName} limiter unavailable in production ` +
          '(UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN missing).'
      );
      return { limited: true, reset: Date.now() + 60_000 };
    }
    console.warn(
      `[ratelimit] FAIL-OPEN (dev): ${limiterName} limiter skipped — Upstash env vars not set.`
    );
    return { limited: false };
  }

  const result = await limiter.limit(identifier);
  if (!result.success) {
    return { limited: true, reset: result.reset };
  }
  return { limited: false };
}

export async function checkAuthLimit(identifier: string): Promise<RateLimitResult> {
  return checkLimit(getAuthLimiter(), identifier, 'auth');
}

export async function checkAiLimit(identifier: string): Promise<RateLimitResult> {
  return checkLimit(getAiLimiter(), identifier, 'ai');
}

export async function checkBulkLimit(identifier: string): Promise<RateLimitResult> {
  return checkLimit(getBulkLimiter(), identifier, 'bulk');
}
