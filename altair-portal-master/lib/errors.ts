/**
 * @file lib/errors.ts
 * @purpose Sanitized error response helpers — prevents stack-trace / internal
 *          message leakage to API consumers.
 * @dependencies next/server
 */

import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiErrorOptions {
  /** HTTP status code. Defaults to 500. */
  status?: number;
  /** Public-facing human-readable message. Never set from raw error objects. */
  message?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return a generic 500 response without leaking internal details.
 * Use for unexpected errors caught in try/catch blocks.
 */
export function serverError(message = 'An unexpected error occurred.'): NextResponse {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Return a 429 response when a rate limiter fires.
 * `reset` is a Unix-ms timestamp indicating when the window resets.
 */
export function rateLimitError(reset?: number): NextResponse {
  const headers: Record<string, string> = {
    'Retry-After': reset
      ? String(Math.ceil((reset - Date.now()) / 1000))
      : '60',
  };
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429, headers }
  );
}

/**
 * Generic sanitized error envelope.
 * NEVER pass `error.message` or `error.stack` as the message argument.
 */
export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
