/**
 * @file /app/api/leads/[id]/activities/route.ts
 * @description API route to retrieve full chronological action logging and audit trail for a specific lead.
 * @dependencies @/lib/prisma, @/lib/authz, next/server
 * @workplan WP-011
 *
 * Permission model:
 *   GET → view_leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('view_leads');
    const { id } = await params;
    const activities = await prisma.leadActivity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(activities);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('GET Lead Activities Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve logs' }, { status: 500 });
  }
}
