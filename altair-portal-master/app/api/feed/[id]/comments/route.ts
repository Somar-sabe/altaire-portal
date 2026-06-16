import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';

/**
 * @file /app/api/feed/[id]/comments/route.ts
 * @description POST a new comment on a feed post.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('comment_on_feed');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: postId } = await params;
    const body = await req.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 422 });
    }

    const authorId = session.user.id;
    const authorName = session.user.name ?? 'Unknown';

    const comment = await prisma.feedComment.create({
      data: {
        postId,
        authorId,
        authorName,
        content: body.content
      }
    });

    return NextResponse.json(comment);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
