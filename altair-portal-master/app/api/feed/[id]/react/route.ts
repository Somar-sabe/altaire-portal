import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';

/**
 * @file /app/api/feed/[id]/react/route.ts
 * @description POST to toggle a reaction (heart) on a feed post.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('react_to_feed');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: postId } = await params;
    const body = await req.json();
    const emoji = body.emoji || '❤️';
    const userId = session.user.id;

    const existing = await prisma.feedReaction.findFirst({
      where: {
        postId,
        userId,
        emoji
      }
    });

    if (existing) {
      await prisma.feedReaction.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ reacted: false });
    } else {
      await prisma.feedReaction.create({
        data: {
          postId,
          userId,
          emoji
        }
      });
      return NextResponse.json({ reacted: true });
    }
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
