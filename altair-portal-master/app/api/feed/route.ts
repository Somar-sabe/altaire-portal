/**
 * @file /app/api/feed/route.ts
 * @description GET all feed posts; POST to create a new feed post.
 * @dependencies @/lib/prisma, @/lib/authz, @/auth, next/server
 *
 * Permission model:
 *   GET  → view_feed (session guard)
 *   POST → create_feed_post; actor identity sourced from Auth.js session
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { feedPostSchema } from '@/lib/validations';
import type { FeedPostRequestInput } from '@/lib/validations';
import { parseCursorPagination, toCursorPage } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('view_feed');
    // feed is readable by all authenticated employees — session-existence check only.
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const pagination = parseCursorPagination(req.nextUrl.searchParams);
    // GPT-Codex (G) BEGIN: stitch feed comments/reactions without relying on stale Prisma relation includes.
    const posts = await prisma.feedPost.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: pagination.queryTake,
      ...(pagination.cursor ? { cursor: { id: pagination.cursor }, skip: 1 } : {}),
      include: {
        pollOptions: {
          include: { votesList: true }
        }
      }
    });

    const postIds = posts.map(post => post.id);
    const [comments, reactions] = postIds.length
      ? await Promise.all([
          prisma.feedComment.findMany({
            where: { postId: { in: postIds } },
            orderBy: { createdAt: 'asc' }
          }),
          prisma.feedReaction.findMany({
            where: { postId: { in: postIds } },
            orderBy: { createdAt: 'asc' }
          })
        ])
      : [[], []];

    const commentsByPostId = new Map<string, typeof comments>();
    for (const comment of comments) {
      commentsByPostId.set(comment.postId, [...(commentsByPostId.get(comment.postId) ?? []), comment]);
    }

    const reactionsByPostId = new Map<string, typeof reactions>();
    for (const reaction of reactions) {
      reactionsByPostId.set(reaction.postId, [...(reactionsByPostId.get(reaction.postId) ?? []), reaction]);
    }

    const postsWithEngagement = posts.map(post => {
      const postComments = commentsByPostId.get(post.id) ?? [];
      const postReactions = reactionsByPostId.get(post.id) ?? [];

      return {
        ...post,
        comments: postComments,
        reactions: postReactions,
        _count: {
          comments: postComments.length,
          reactions: postReactions.length
        }
      };
    });
    // GPT-Codex (G) END: feed response now exposes comments/reactions while Prisma client regeneration is stale.

    // GPT-Codex (G) BEGIN: return feed posts through the shared cursor page envelope.
    return NextResponse.json(toCursorPage(postsWithEngagement, pagination));
    // GPT-Codex (G) END: feed reads no longer require an unbounded post scan.
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission('publish_to_feed');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // GPT-Codex (G) BEGIN: validate feed post bodies through the shared Zod contract.
    const parseResult = feedPostSchema.safeParse(await req.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.issues },
        { status: 422 }
      );
    }

    const body: FeedPostRequestInput = parseResult.data;
    // GPT-Codex (G) END: invalid feed post requests now fail with consistent 422 details.

    // Actor identity sourced from session — never from client body.
    const authorId = session.user.id;
    const authorName = session.user.name ?? 'Unknown';

    const post = await prisma.feedPost.create({
      data: {
        authorId,
        authorName,
        type: body.type,
        title: body.title,
        content: body.content,
        eventDate: body.eventDate,
        ...(body.type === 'POLL' && body.pollOptions
          ? {
              pollOptions: {
                create: body.pollOptions.map((opt: string) => ({ text: opt }))
              }
            }
          : {})
      },
      include: {
        pollOptions: {
          include: { votesList: true }
        }
      }
    });

    return NextResponse.json(post);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
