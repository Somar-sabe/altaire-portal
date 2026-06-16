/**
 * @file /app/api/workspace/messages/route.ts
 * @description GET messages; POST to send a message in a space or DM.
 * @dependencies @/lib/prisma, @/lib/authz, @/auth, next/server
 *
 * Permission model:
 *   GET  → view_workspace (session guard)
 *   POST → send_message; senderId sourced from Auth.js session
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { parseCursorPagination, toCursorPage } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('send_messages');
    const pagination = parseCursorPagination(req.nextUrl.searchParams);
    // GPT-Codex (G) BEGIN: bound message reads and hydrate only the current page's senders.
    const messages = await prisma.message.findMany({
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: pagination.queryTake,
      ...(pagination.cursor ? { cursor: { id: pagination.cursor }, skip: 1 } : {}),
    });

    const senderIds = Array.from(new Set(messages.map(message => message.senderId)));
    const users = senderIds.length
      ? await prisma.user.findMany({ where: { id: { in: senderIds } } })
      : [];
    const mapped = messages.map(message => ({
      ...message,
      sender: users.find(user => user.id === message.senderId)
    }));

    return NextResponse.json(toCursorPage(mapped, pagination));
    // GPT-Codex (G) END: workspace polling no longer performs unbounded message/user scans.
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission('send_messages');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get('spaceId');
    const receiverId = searchParams.get('receiverId');
    const body = await req.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'content is required' }, { status: 422 });
    }

    // senderId sourced from session — never from client body.
    const senderId = session.user.id;

    const message = await prisma.message.create({
      data: {
        content: body.content,
        spaceId: spaceId || null,
        receiverId: receiverId || null,
        senderId,
      }
    });

    const user = await prisma.user.findUnique({ where: { id: senderId } });

    return NextResponse.json({ ...message, sender: user });
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
