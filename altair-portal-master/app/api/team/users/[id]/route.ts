/**
 * @file app/api/team/users/[id]/route.ts
 * @purpose PUT (update profile) and DELETE (soft-deactivate) for a single user.
 * @dependencies @/lib/prisma, argon2, @/lib/validations, @/lib/authz, @/lib/errors
 *
 * Security model:
 *   edit_users  → may update profile fields; CANNOT touch role/permissions.
 *   manage_roles → additionally allowed to set role and permissions.
 *   delete_users → required for DELETE (soft deactivation).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';
import { userUpdateSchema, userRoleSchema } from '@/lib/validations';
import type { UserRolePatchRequestInput, UserUpdateRequestInput } from '@/lib/validations';
import { requirePermission, hasPermission, AuthError, ForbiddenError } from '@/lib/authz';
import { auth } from '@/auth';
import { resolveEffectivePermissions } from '@/lib/permissions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) throw new AuthError();

    const isOwnProfile = session.user.id === id;
    if (!isOwnProfile) {
      await requirePermission('view_team');
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash: _ph, ...safeUser } = user;
    return NextResponse.json({ ...safeUser, effectivePermissions: resolveEffectivePermissions(user) });
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed to retrieve user' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Status changes (active/inactive) are an edit_users privilege; no separate gate needed for P0.
    await requirePermission('edit_users');
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) throw new AuthError();

    const rawBody = await req.json();
    const hasRolePatch = rawBody.role !== undefined || rawBody.permissions !== undefined;
    const { role: _role, permissions: _permissions, ...baseBody } = rawBody;

    // Parse base fields (no role/permissions).
    const baseResult = userUpdateSchema.safeParse(baseBody);
    if (!baseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: baseResult.error.issues },
        { status: 422 }
      );
    }

    const baseData: UserUpdateRequestInput = baseResult.data;
    const { password, ...rest } = baseData;
    const dataToUpdate: Record<string, unknown> = { ...rest };
    let shouldBumpTokenVersion = Boolean(password || rest.status !== undefined);

    if (password) {
      dataToUpdate.passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    }

    // Role / permissions changes require manage_roles in addition to edit_users.
    if (hasRolePatch) {
      if (session.user.id === id) {
        throw new ForbiddenError('Users cannot edit their own role or permissions');
      }

      const canManageRoles = await hasPermission('manage_roles');
      if (!canManageRoles) {
        throw new ForbiddenError();
      }

      const roleResult = userRoleSchema.safeParse({
        role: rawBody.role,
        permissions: rawBody.permissions,
      });
      if (!roleResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: roleResult.error.issues },
          { status: 422 }
        );
      }

      const roleData: UserRolePatchRequestInput = roleResult.data;

      if (roleData.role !== undefined) {
        dataToUpdate.role = roleData.role;
        shouldBumpTokenVersion = true;
      }
      if (roleData.permissions !== undefined) {
        dataToUpdate.permissions = roleData.permissions;
        shouldBumpTokenVersion = true;
      }
    }

    if (shouldBumpTokenVersion) {
      dataToUpdate.tokenVersion = { increment: 1 };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    const { passwordHash: _ph, ...safeUser } = updatedUser;
    return NextResponse.json({ ...safeUser, effectivePermissions: resolveEffectivePermissions(updatedUser) });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('delete_users');
    const { id } = await params;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE', tokenVersion: { increment: 1 } }
    });
    const { passwordHash: _ph, ...safeUser } = updatedUser;
    return NextResponse.json({ ...safeUser, effectivePermissions: resolveEffectivePermissions(updatedUser) });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
  }
}
