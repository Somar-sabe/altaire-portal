/**
 * @file app/api/auth/[...nextauth]/route.ts
 * @purpose Auth.js v5 handler — wraps POST (login) with auth-path rate limiting.
 * @dependencies @/auth, @/lib/ratelimit, @/lib/errors, @/lib/client-ip, next/server
 *
 * GET is safe (CSRF / session fetches) — no rate limiting needed.
 * POST (credential login) is throttled per trusted client IP.
 */

import { handlers } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuthLimit } from '@/lib/ratelimit';
import { rateLimitError } from '@/lib/errors';
import { getClientIp } from '@/lib/client-ip';

export const { GET } = handlers;

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(req);
  const result = await checkAuthLimit(`auth:${ip}`);
  if (result.limited) {
    return rateLimitError(result.reset);
  }
  return handlers.POST(req) as Promise<NextResponse>;
}
