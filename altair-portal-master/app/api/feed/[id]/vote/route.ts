import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Both viewing and voting require at least view_feed
    await requirePermission('view_feed');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: postId } = await params;
    const body = await req.json();

    if (!body.optionId || typeof body.optionId !== 'string') {
      return NextResponse.json({ error: 'optionId is required' }, { status: 422 });
    }

    const userId = session.user.id;

    // SECURITY: Verify that the optionId actually belongs to the postId
    const option = await prisma.feedPollOption.findFirst({
      where: {
        id: body.optionId,
        postId
      }
    });

    if (!option) {
      return NextResponse.json({ error: 'Invalid option for this post' }, { status: 422 });
    }

    // Check if the user already voted on this post
    const existingVote = await prisma.feedPollVote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId
        }
      }
    });

    if (existingVote) {
      if (existingVote.optionId === body.optionId) {
        return NextResponse.json({ message: 'Already voted for this option' }, { status: 200 });
      }

      // GPT-Codex (G) BEGIN: keep poll vote counters and selected option changes atomic.
      const updatedVote = await prisma.$transaction(async (tx) => {
        await tx.feedPollOption.update({
          where: { id: existingVote.optionId },
          data: { votes: { decrement: 1 } }
        });
        await tx.feedPollOption.update({
          where: { id: body.optionId },
          data: { votes: { increment: 1 } }
        });
        return tx.feedPollVote.update({
          where: { id: existingVote.id },
          data: { optionId: body.optionId }
        });
      });
      // GPT-Codex (G) END: changed votes can no longer leave mismatched option counters.
      return NextResponse.json(updatedVote);
    }

    // GPT-Codex (G) BEGIN: keep new poll votes and option counter increments atomic.
    const vote = await prisma.$transaction(async (tx) => {
      const createdVote = await tx.feedPollVote.create({
        data: {
          postId,
          optionId: body.optionId,
          userId
        }
      });

      await tx.feedPollOption.update({
        where: { id: body.optionId },
        data: { votes: { increment: 1 } }
      });

      return createdVote;
    });
    // GPT-Codex (G) END: poll vote counters cannot drift on partial write failure.

    return NextResponse.json(vote);
  } catch (error: unknown) {
    // GPT-Codex (G) BEGIN: expected auth failures should not pollute e2e logs as server errors.
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Vote error:', error);
    // GPT-Codex (G) END: only unexpected vote failures are logged server-side.
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
