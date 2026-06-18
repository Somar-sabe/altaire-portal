export const dynamic = 'force-dynamic'; // <-- CRITICAL NEXT.JS 15 BUILD FIX

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
