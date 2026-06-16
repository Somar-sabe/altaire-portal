/**
 * @file app/api/leads/[id]/comments/[commentId]/route.ts
 * @description PATCH to update content of a specific lead comment.
 * @dependencies @/lib/prisma, @/lib/authz, next/server
 *
 * Permission model:
 *   PATCH → edit_lead; only comment author may edit (ownership guard)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { auth } from '@/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string, commentId: string }> }) {
  try {
    await requirePermission('edit_lead');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, commentId } = await params;
    const body = await req.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 422 });
    }

    // Ownership guard: only the comment author may edit their comment.
    const existing = await prisma.leadComment.findUnique({ where: { id: commentId, leadId: id } });
    if (!existing) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedComment = await prisma.leadComment.update({
      where: { id: commentId, leadId: id },
      data: { content: body.content },
    });

    return NextResponse.json(updatedComment);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('PATCH Lead Comment Error:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
