/**
 * @file lib/client-ip.ts
 * @purpose Trusted-proxy-aware client IP extraction for Vercel deployments.
 * @dependencies next/server
 *
 * Vercel trust model: Vercel's edge network rewrites the incoming
 * x-forwarded-for header so the FIRST (leftmost) value is always the
 * real client IP — Vercel strips any client-supplied XFF before it
 * reaches the function. Do NOT use the raw leftmost XFF on non-Vercel
 * deployments where external load-balancers prepend their own hops.
 *
 * If VERCEL env var is not set this helper falls back to x-real-ip and
 * then 'anonymous' — never trusts raw leftmost XFF off-Vercel.
 */

import { NextRequest } from 'next/server';

/**
 * Returns the real client IP for rate-limiting key construction.
 * Safe to use as a rate-limit key; never leaks to end-users.
 */
export function getClientIp(req: NextRequest): string {
  // On Vercel, the edge strips client-controlled XFF.
  // The leftmost entry of x-forwarded-for is the real client IP.
  if (process.env.VERCEL) {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) {
      const first = xff.split(',')[0]?.trim();
      if (first) return first;
    }
  }

  // Non-Vercel: prefer x-real-ip set by a trusted reverse proxy.
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'anonymous';
}
