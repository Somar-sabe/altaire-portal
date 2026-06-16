/**
 * @file lib/authz.ts
 * @purpose Authorization helpers — session-based permission enforcement.
 * @dependencies @/auth, @prisma/client
 *
 * Exports typed error classes (AuthError, ForbiddenError) so callers
 * can use instanceof guards instead of fragile string comparisons.
 */

import { auth } from "@/auth";
import { Permission, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hasEffectivePermission, resolveEffectivePermissions } from "@/lib/permissions";

// ---------------------------------------------------------------------------
// Typed error classes
// ---------------------------------------------------------------------------

/** Thrown when no valid session exists (HTTP 401). */
export class AuthError extends Error {
  readonly status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

/** Thrown when the session exists but lacks the required permission (HTTP 403). */
export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

// ---------------------------------------------------------------------------
// Core guard
// ---------------------------------------------------------------------------

async function getCurrentPermissionSubject() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthError();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      permissions: true,
      status: true,
    },
  });

  if (!user || user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
    throw new AuthError();
  }

  return user;
}

/**
 * Asserts the current session user holds `permission`.
 * Throws AuthError (401) if unauthenticated, ForbiddenError (403) if lacking permission.
 */
export async function requirePermission(permission: Permission): Promise<void> {
  const user = await getCurrentPermissionSubject();
  if (!hasEffectivePermission(user, permission)) {
    throw new ForbiddenError();
  }
}

/**
 * Returns true if the current session user holds `permission`; false otherwise.
 * Never throws — use when you need a boolean check without early-exit.
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  try {
    const user = await getCurrentPermissionSubject();
    return hasEffectivePermission(user, permission);
  } catch {
    return false;
  }
}

export async function getCurrentEffectivePermissions(): Promise<Permission[]> {
  const user = await getCurrentPermissionSubject();
  return resolveEffectivePermissions(user);
}
