/**
 * @file /app/api/leads/comments/route.ts
 * @description API route to fetch all lead comments across leads (used for Excel reports).
 * @dependencies @/lib/prisma, @/lib/authz, next/server
 * @lastModified 2026-06-06
 * @workplan WP-057
 *
 * Permission model:
 *   GET → view_leads
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';

export async function GET() {
  try {
    await requirePermission('view_leads');
    const comments = await prisma.leadComment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(comments);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('GET all comments error:', error);
    return NextResponse.json({ error: 'Failed to retrieve all comments' }, { status: 500 });
  }
}
