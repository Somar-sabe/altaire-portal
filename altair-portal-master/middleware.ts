import { NextRequest, NextResponse } from 'next/server';

// GPT-Codex (G) BEGIN: add an edge-safe default-deny gate without importing Prisma-backed Auth.js middleware.
const PUBLIC_PATHS = new Set(['/']);
const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
];

function hasSessionCookie(req: NextRequest) {
  return SESSION_COOKIE_NAMES.some((name) => Boolean(req.cookies.get(name)?.value));
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.has(pathname) || pathname.startsWith('/api/auth/');

  if (isPublic || hasSessionCookie(req)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/';
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}
// GPT-Codex (G) END: protected pages/APIs now fail closed before route-level authz runs.
