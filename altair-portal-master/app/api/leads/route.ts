/**
 * @file app/api/leads/route.ts
 * @purpose Core API route to GET all leads and POST single / bulk mapped leads.
 * @dependencies @/lib/prisma, @/lib/ratelimit, @/lib/errors, @/lib/validations,
 *               @/lib/client-ip, @/lib/authz, @/auth, next/server
 * @workplan WP-011
 *
 * Permission model:
 *   GET  → view_leads (session guard only — broad read is acceptable)
 *   POST → create_lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { leadSchema } from '@/lib/validations';
import type { LeadRequestInput } from '@/lib/validations';
import { checkBulkLimit, checkAiLimit } from '@/lib/ratelimit';
import { rateLimitError, serverError } from '@/lib/errors';
import { getClientIp } from '@/lib/client-ip';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { parseCursorPagination, toCursorPage } from '@/lib/pagination';
import { z } from 'zod';

const VALID_STAGES = ['NEW', 'IN_PROGRESS', 'INTERESTED', 'NOT_INTERESTED', 'CONTACTED', 'FEEDBACK_REQ', 'BOOKED', 'CONVERTED', 'LOST'] as const;
const BULK_MAX = 1000;

export async function GET(req: NextRequest) {
  try {
    // GPT-Codex (G) BEGIN: enforce the documented view_leads permission for lead list reads.
    await requirePermission('view_leads');
    // GPT-Codex (G) END: restricted authenticated users can no longer read the lead list.
    const pagination = parseCursorPagination(req.nextUrl.searchParams);
    // GPT-Codex (G) BEGIN: bound lead list reads behind cursor pagination.
    const leads = await prisma.lrmLead.findMany({
      where: { deleted: false },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: pagination.queryTake,
      ...(pagination.cursor ? { cursor: { id: pagination.cursor }, skip: 1 } : {}),
    });
    return NextResponse.json(toCursorPage(leads, pagination));
    // GPT-Codex (G) END: lead reads no longer require an unbounded findMany.
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('[GET /api/leads] Error:', error);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission('create_lead');
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return serverError();
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rawBody = await req.json();
  const isBulk = Array.isArray(rawBody);

  if (isBulk) {
    const rl = await checkBulkLimit(`bulk:${ip}`);
    if (rl.limited) return rateLimitError(rl.reset);
  } else {
    const rl = await checkAiLimit(`leads:${ip}`);
    if (rl.limited) return rateLimitError(rl.reset);
  }

  try {
    const schema = z.union([leadSchema, z.array(leadSchema).max(BULK_MAX, `Bulk import capped at ${BULK_MAX} records`)]);
    const parseResult = schema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.issues },
        { status: 422 }
      );
    }

    const body: LeadRequestInput | LeadRequestInput[] = parseResult.data;

    if (Array.isArray(body)) {
      const createdLeads = await prisma.$transaction(
        body.map(item =>
          prisma.lrmLead.create({
            data: {
              name: item.name,
              company: item.company || 'Imported Company',
              targetProject: item.targetProject || '',
              value: typeof item.value === 'string' ? parseFloat(item.value) || 0 : item.value ?? 0,
              stage: VALID_STAGES.includes(item.stage as never) ? (item.stage as never) : 'NEW',
              email: item.email || '',
              phone: item.phone || '',
              altPhone: item.altPhone ?? null,
              workPhone: item.workPhone ?? null,
              workEmail: item.workEmail ?? null,
              whatsapp: item.whatsapp ?? null,
              telegram: item.telegram ?? null,
              instagram: item.instagram ?? null,
              facebook: item.facebook ?? null,
              source: item.source ?? null,
              status: 'ACTIVE',
              tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
              aiScore: typeof item.aiScore === 'string' ? parseInt(item.aiScore) || 50 : item.aiScore ?? 50,
              lastActivityAt: new Date().toISOString(),
              lastActivitySummary: 'Imported and uploaded via Excel',
              notes: item.notes || '',
              avatarColor: item.avatarColor || '#3b82f6',
              lang: item.lang || 'en',
              dateCreated: item.dateCreated || new Date().toISOString(),
              assignedAgentId: item.assignedAgentId ?? null,
              adminInChargeId: item.adminInChargeId ?? null,
              assignedById: item.assignedById ?? null,
              details: item.details || '[]',
              lastInteractionDate: item.assignedAgentId ? new Date().toISOString() : null,
            },
          })
        )
      );
      return NextResponse.json({ success: true, count: createdLeads.length, data: createdLeads });
    }

    // GPT-Codex (G) BEGIN: keep single lead creation and its audit activity atomic.
    const lead = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.lrmLead.create({
        data: {
          name: body.name,
          company: body.company || '',
          targetProject: body.targetProject || '',
          value: typeof body.value === 'string' ? parseFloat(body.value) || 0 : body.value ?? 0,
          stage: VALID_STAGES.includes(body.stage as never) ? (body.stage as never) : 'NEW',
          status: 'ACTIVE',
          email: body.email || '',
          phone: body.phone || '',
          altPhone: body.altPhone ?? null,
          workPhone: body.workPhone ?? null,
          workEmail: body.workEmail ?? null,
          whatsapp: body.whatsapp ?? null,
          telegram: body.telegram ?? null,
          instagram: body.instagram ?? null,
          facebook: body.facebook ?? null,
          source: body.source ?? null,
          tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
          aiScore: typeof body.aiScore === 'string' ? parseInt(body.aiScore) || 50 : body.aiScore ?? 50,
          lastActivityAt: new Date().toISOString(),
          lastActivitySummary: 'Lead added manually',
          notes: body.notes || '',
          avatarColor: body.avatarColor || '#000000',
          lang: body.lang || 'en',
          dateCreated: body.dateCreated || new Date().toISOString(),
          assignedAgentId: body.assignedAgentId ?? null,
          adminInChargeId: body.adminInChargeId ?? null,
          assignedById: body.assignedById ?? null,
          details: body.details || '[]',
          lastInteractionDate: body.assignedAgentId ? new Date().toISOString() : null,
        },
      });

      await tx.leadActivity.create({
        data: {
          leadId: createdLead.id,
          actorId: session.user.id,
          actorName: session.user.name || 'System Administrator',
          actionType: 'ASSIGNED',
          details: body.assignedAgentId
            ? 'Lead created and immediately assigned to the responsible agent.'
            : 'Lead created, pending agent assignment.',
        },
      });

      return createdLead;
    });
    // GPT-Codex (G) END: callers never receive a lead without its initial activity row.

    return NextResponse.json(lead);
  } catch {
    return serverError();
  }
}
