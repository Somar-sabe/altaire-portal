/**
 * @file /app/api/leads/[id]/comments/route.ts
 * @description API route to fetch and append communication logs / agent comments / reminders for a specific lead.
 * @dependencies @/lib/prisma, @/lib/authz, @/auth, next/server
 * @workplan WP-011
 *
 * Permission model:
 *   GET  → view_leads
 *   POST → edit_lead; actor identity sourced from session
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { auth } from '@/auth';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('view_leads');
    // Actor identity and role sourced from session — never from client-supplied query params.
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;

    const userId = session.user.id as string;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session.user.role as string);

    // Load all comments for this lead
    const allComments = await prisma.leadComment.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'asc' }
    });

    const leadInfo = await prisma.lrmLead.findUnique({ where: { id: id } });
    if (!leadInfo) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Role verification: If Agent and NOT the admin/superadmin, hide previous agents' comments
    if (!isAdmin && userId && leadInfo.assignedAgentId === userId) {
      // Find the most recent assign/rotation activity of this lead to the current agent
      const lastAssignedLog = await prisma.leadActivity.findFirst({
        where: {
          leadId: id,
          actionType: 'ASSIGNED',
          details: { contains: userId } // Or log description containing their ID
        },
        orderBy: { createdAt: 'desc' }
      });

      if (lastAssignedLog) {
        const borderDate = new Date(lastAssignedLog.createdAt);

        // Filter: Hide any older agent comments, but keep Admin comments visible
        const filteredComments = allComments.filter(comment => {
          const isCommentAdmin = comment.authorRole === 'SUPER_ADMIN' || comment.authorRole === 'ADMIN';
          if (isCommentAdmin) return true; // Admins are always visible
          if (comment.authorId === userId) return true; // Self comments always visible

          // Hide others if they were written before current agent's assignment borderDate
          return new Date(comment.createdAt) >= borderDate;
        });

        return NextResponse.json(filteredComments);
      }
    }

    // Return all comments for Admins/Superadmins or non-rotated agents
    return NextResponse.json(allComments);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('GET Lead Comments Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('edit_lead');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    // Actor identity sourced from session — never from client body.
    const actorId = session.user.id;
    const actorName = session.user.name ?? 'Unknown';
    const actorRole = (session.user.role ?? 'AGENT') as Role;

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 422 });
    }

    const newComment = await prisma.leadComment.create({
      data: {
        leadId: id,
        authorId: actorId,
        authorName: actorName,
        authorRole: actorRole,
        content: body.content,
        isReminder: !!body.isReminder,
        reminderDate: body.reminderDate || null
      }
    });

    // Create a dynamic LeadActivity to trace actions.
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        actorId,
        actorName,
        actionType: 'COMMENTED',
        details: body.isReminder
          ? `Added a follow-up reminder for [${body.reminderDate}]: "${body.content.substring(0, 45)}..."`
          : `Added a new comment: "${body.content.substring(0, 45)}..."`
      }
    });

    // Touch lastInteractionDate on comment (Interaction rule).
    await prisma.lrmLead.update({
      where: { id },
      data: { lastInteractionDate: new Date().toISOString() }
    });

    return NextResponse.json(newComment);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('POST Lead Comment Error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
