/**
 * @file /app/api/workspace/invitations/route.ts
 * @description API route to fetch pending Space Invitations for specific users and process Accept/Ignore dynamic actions
 *
 * @dependencies
 * - next/server: NextRequest, NextResponse
 * - @/lib/prisma: Prisma database singleton client
 *
 * @relatedFiles
 * - /prisma/schema.prisma: references SpaceInvitation, SpaceMember models
 * - /app/components/Header.tsx: client triggers for invitations processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { InvitationStatus, SpaceRole } from '@prisma/client';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { auth } from '@/auth';

/**
 * @function GET
 * @description Retrieves all pending Space invitations for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    await requirePermission('send_messages');
    // User identity sourced from session — never from client-supplied query params.
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingInvites = await prisma.spaceInvitation.findMany({
      where: {
        userId: session.user.id,
        status: InvitationStatus.PENDING
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pendingInvites);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: 'Failed to fetch space invitations' }, { status: 500 });
  }
}

/**
 * @function POST
 * @description Processes a Space Invitation action (Accept or Ignore) for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    await requirePermission('send_messages');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { invitationId, action } = body;

    if (!invitationId || !['ACCEPT', 'IGNORE'].includes(action)) {
      return NextResponse.json({ error: 'Valid invitationId and action are required' }, { status: 400 });
    }

    const invitation = await prisma.spaceInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Ownership guard: users may only act on their own invitations.
    if (invitation.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return NextResponse.json({ error: 'Invitation has already been processed' }, { status: 400 });
    }

    if (action === 'ACCEPT') {
      // 1. Create a membership record in SpaceMember
      await prisma.spaceMember.create({
        data: {
          spaceId: invitation.spaceId,
          userId: invitation.userId,
          role: SpaceRole.MEMBER
        }
      });

      // 2. Mark the status as ACCEPTED
      const updated = await prisma.spaceInvitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED }
      });

      return NextResponse.json({ success: true, status: 'ACCEPTED', invitation: updated });
    } else {
      // 3. Mark the status as IGNORED
      const updated = await prisma.spaceInvitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.DECLINED }
      });

      return NextResponse.json({ success: true, status: 'IGNORED', invitation: updated });
    }
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Error processing space invitation action:', error);
    return NextResponse.json({ error: 'Failed to process invitation action' }, { status: 500 });
  }
}
