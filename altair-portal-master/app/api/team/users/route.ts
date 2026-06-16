/**
 * @file app/api/team/users/route.ts
 * @purpose GET all users (read-only) and POST to invite a new user.
 * @dependencies @/lib/prisma, argon2, @/lib/validations, @/lib/authz,
 *               @/lib/mailer, next/server
 *
 * NOTE: Database seeding is NOT performed here. Use scripts/seed (non-prod only).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';
import { Role } from '@prisma/client';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { sendInvitationEmail } from '@/lib/mailer';
import { userSchema } from '@/lib/validations';
import type { UserCreateRequestInput } from '@/lib/validations';
import { DEFAULT_ROLE_PERMISSIONS, resolveEffectivePermissions } from '@/lib/permissions';
import { parseCursorPagination, toCursorPage } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('view_team');
    const pagination = parseCursorPagination(req.nextUrl.searchParams);
    // GPT-Codex (G) BEGIN: bound team user reads behind cursor pagination.
    const users = await prisma.user.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: pagination.queryTake,
      ...(pagination.cursor ? { cursor: { id: pagination.cursor }, skip: 1 } : {}),
    });
    const sanitizedUsers = users.map(u => {
      const { passwordHash: _ph, ...safeUser } = u;
      return { ...safeUser, effectivePermissions: resolveEffectivePermissions(u) };
    });
    return NextResponse.json(toCursorPage(sanitizedUsers, pagination));
    // GPT-Codex (G) END: team reads no longer expose password hashes or unbounded scans.
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission('invite_users');
    const rawBody = await req.json();
    const parseResult = userSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.issues },
        { status: 422 }
      );
    }

    const body: UserCreateRequestInput = parseResult.data;
    const { permissions, ...rest } = body;
    const role = rest.role as Role;

    // Generate a random initial password hash for invited users.
    const dummyHash = await argon2.hash(Math.random().toString(36), { type: argon2.argon2id });

    const newUser = await prisma.user.create({
      data: {
        ...rest,
        role,
        status: (
          ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'INVITED'].includes(rest.status as string)
            ? rest.status
            : 'ACTIVE'
        ) as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED',
        mobileNumber: rest.mobileNumber ?? '',
        department: rest.department ?? '',
        passwordHash: dummyHash,
        permissions: permissions ?? DEFAULT_ROLE_PERMISSIONS[role],
      },
    });

    const appUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const inviteLink = `${appUrl}/login?inviteEmail=${encodeURIComponent(newUser.email)}&department=${encodeURIComponent(newUser.department)}&role=${encodeURIComponent(newUser.role)}`;

    const mailResult = await sendInvitationEmail({
      to: newUser.email,
      inviteLink,
      department: newUser.department,
      role: newUser.role,
    });

    const { passwordHash: _ph, ...safeUser } = newUser;
    return NextResponse.json({
      ...safeUser,
      effectivePermissions: resolveEffectivePermissions(newUser),
      // Never forward raw mailer error messages — use static status only.
      emailStatus: mailResult.success ? 'sent' : 'queued',
    });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
