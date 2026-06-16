/**
 * @file /app/api/workspace/spaces/route.ts
 * @description List and create Workspace spaces with privacy and team invitations.
 * @dependencies @/lib/prisma, @/lib/authz, @/auth, next/server
 *
 * Permission model:
 *   GET  → view_workspace (session guard)
 *   POST → create_space; creator identity sourced from Auth.js session
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SpacePrivacy, InvitationStatus, SpaceRole } from '@prisma/client';
import { auth } from '@/auth';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';

export async function GET(req: Request) {
  try {
    await requirePermission('view_workspace');
    // User identity sourced from session — never from client-supplied query params.
    const session = await auth();
    const userId = session?.user?.id;

    const allSpaces = await prisma.workspaceSpace.findMany({
      orderBy: { createdAt: 'asc' }
    });

    if (!userId) {
      return NextResponse.json(allSpaces.filter(space => space.privacy !== SpacePrivacy.PRIVATE));
    }

    const memberships = await prisma.spaceMember.findMany({ where: { userId } });
    const userSpaceIds = new Set(memberships.map(m => m.spaceId));

    const visibleSpaces = allSpaces.filter(space => {
      const isPublic = space.privacy !== SpacePrivacy.PRIVATE;
      const isMember = userSpaceIds.has(space.id);
      return isPublic || isMember;
    });

    return NextResponse.json(visibleSpaces);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Error fetching spaces:', error);
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // space creation intentionally open to all employees (Slack-like); tighten via dedicated perm if needed.
    await requirePermission('create_space');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, description, privacy, invitedUserIds } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Space name is required' }, { status: 400 });
    }

    // Creator identity sourced from session — never from client body.
    const creatorId = session.user.id;
    const creatorName = session.user.name ?? 'Team Member';

    const privacyVal: SpacePrivacy = privacy === 'private' ? SpacePrivacy.PRIVATE : SpacePrivacy.PUBLIC;

    const space = await prisma.workspaceSpace.create({
      data: {
        name: name.trim(),
        description: description || '',
        privacy: privacyVal,
      }
    });

    await prisma.spaceMember.create({
      data: { spaceId: space.id, userId: creatorId, role: SpaceRole.ADMIN }
    });

    if (Array.isArray(invitedUserIds) && invitedUserIds.length > 0) {
      for (const guestId of invitedUserIds) {
        await prisma.spaceInvitation.create({
          data: {
            spaceId: space.id,
            spaceName: space.name,
            invitedById: creatorId,
            invitedByName: creatorName,
            userId: guestId,
            status: InvitationStatus.PENDING,
          } as any
        });
      }
    }

    return NextResponse.json(space);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Error creating workspace space:', error);
    return NextResponse.json({ error: 'Failed to create workspace space' }, { status: 500 });
  }
}
