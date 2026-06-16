/**
 * @file app/api/leads/[id]/route.ts
 * @description GET, PATCH (with Lost/Not-Qual rotation), DELETE (soft + audit email).
 * @dependencies @/lib/prisma, @/lib/mailer, @/lib/authz, @/lib/errors,
 *               @/lib/lead-rotation, @/auth, next/server
 * @workplan WP-011
 *
 * Permission model:
 *   GET   → view_leads
 *   PATCH → edit_lead; AGENT role additionally requires lead ownership
 *   DELETE → delete_lead (soft archive + audit alert)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import { auth } from '@/auth';
import { leadSchema } from '@/lib/validations';
import { requirePermission, AuthError, ForbiddenError } from '@/lib/authz';
import { serverError } from '@/lib/errors';
import { rotateLeadAgent } from '@/lib/lead-rotation';

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('view_leads');
    const { id } = await params;
    const lead = await prisma.lrmLead.findFirst({ where: { id, deleted: false } });
    if (!lead) return NextResponse.json({ error: 'Lead not found or has been deleted' }, { status: 404 });
    return NextResponse.json(lead);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return serverError();
  }
}

// ---------------------------------------------------------------------------
// PATCH
// ---------------------------------------------------------------------------

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('edit_lead');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const rawBody = await req.json();
    const parseResult = leadSchema.partial().safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: parseResult.error.issues }, { status: 422 });
    }

    const body = parseResult.data as Record<string, unknown>;
    const oldLead = await prisma.lrmLead.findUnique({ where: { id } });
    if (!oldLead) return NextResponse.json({ error: 'Target lead does not exist' }, { status: 404 });

    // AGENT ownership guard.
    if (session.user.role === 'AGENT' && oldLead.assignedAgentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let payload: Record<string, unknown> = { ...body };

    const isLost = body.stage === 'LOST' && oldLead.stage !== 'LOST';
    const isNotQualified =
      Array.isArray(body.tags) &&
      (body.tags as string[]).includes('Not Qualified') &&
      !oldLead.tags?.includes('Not Qualified');

    // Actor identity sourced from session — never from client body (NEW-2 fix).
    const actorId = session.user.id;
    const actorName = session.user.name ?? 'Unknown';

    let activityData: {
      actorId: string;
      actorName: string;
      actionType: 'ASSIGNED';
      details: string;
    } | null = null;

    if (isLost || isNotQualified) {
      const result = await rotateLeadAgent(id, oldLead.assignedAgentId, isLost ? 'Lost' : 'Not Qualified');
      if (result) {
        const { activityDetails, ...rotationPayload } = result;
        Object.assign(payload, rotationPayload);
        activityData = {
          actorId: 'SYSTEM',
          actorName: 'Random Rotation Server',
          actionType: 'ASSIGNED',
          details: activityDetails,
        };
      }
    } else if (body.assignedAgentId !== undefined && body.assignedAgentId !== oldLead.assignedAgentId) {
      payload.lastInteractionDate = new Date().toISOString();
      const assignedUser = body.assignedAgentId
        ? await prisma.user.findUnique({ where: { id: body.assignedAgentId as string } })
        : null;
      const agentName = assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'None';
      activityData = {
        actorId,
        actorName,
        actionType: 'ASSIGNED',
        details: `Lead hand-assigned to responsible agent (${agentName}).`
      };
    }

    // GPT-Codex (G) BEGIN: keep lead updates and assignment/rotation activity rows atomic.
    const updatedLead = await prisma.$transaction(async (tx) => {
      const lead = await tx.lrmLead.update({
        where: { id },
        data: {
          name: payload.name as string | undefined,
          company: payload.company as string | undefined,
          targetProject: payload.targetProject as string | undefined,
          value: payload.value !== undefined ? parseFloat(payload.value as string) : undefined,
          stage: payload.stage as import('@prisma/client').LeadStage | undefined,
          email: payload.email as string | undefined,
          phone: payload.phone as string | undefined,
          altPhone: payload.altPhone as string | null | undefined,
          workPhone: payload.workPhone as string | null | undefined,
          workEmail: payload.workEmail as string | null | undefined,
          whatsapp: payload.whatsapp as string | null | undefined,
          telegram: payload.telegram as string | null | undefined,
          instagram: payload.instagram as string | null | undefined,
          facebook: payload.facebook as string | null | undefined,
          source: payload.source as string | null | undefined,
          status: payload.status as import('@prisma/client').LeadStatus | undefined,
          tags: payload.tags as string[] | undefined,
          notes: payload.notes as string | undefined,
          avatarColor: payload.avatarColor as string | undefined,
          assignedAgentId: payload.assignedAgentId as string | undefined,
          adminInChargeId: payload.adminInChargeId as string | null | undefined,
          assignedById: payload.assignedById as string | null | undefined,
          details: payload.details as string | undefined,
          lastActivityAt: payload.lastActivityAt as string | undefined,
          lastActivitySummary: (payload.lastActivitySummary as string | undefined) ?? 'Basic details updated',
          lastInteractionDate: payload.lastInteractionDate as string | undefined,
        }
      });

      if (activityData) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            ...activityData,
          }
        });
      }

      return lead;
    });
    // GPT-Codex (G) END: assignment activity cannot be separated from the lead update.

    return NextResponse.json(updatedLead);
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return serverError();
  }
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission('delete_lead');
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const actorId = session.user.id;
    const actorName = session.user.name ?? 'Unknown User';

    const targetLead = await prisma.lrmLead.findUnique({ where: { id } });
    if (!targetLead) return NextResponse.json({ error: 'Target lead does not exist' }, { status: 404 });

    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

    await prisma.lrmLead.update({
      where: { id },
      data: {
        deleted: true,
        status: 'TRASH',
        lastActivityAt: new Date().toISOString(),
        lastActivitySummary: 'Lead archived'
      }
    });
    await prisma.leadActivity.create({ data: { leadId: id, actorId, actorName, actionType: 'DELETED', details: 'Lead was archived' } });

    const auditEmail = process.env.AUDIT_ALERT_EMAIL;
    if (!auditEmail) {
      console.error('DELETE Lead: AUDIT_ALERT_EMAIL not set; skipping audit email.');
      return NextResponse.json({ success: true, message: 'Lead archived. Audit email skipped: AUDIT_ALERT_EMAIL not configured.' });
    }

    await sendEmail({ to: auditEmail, subject: '[Audit Alert] Lead Archived', body: `Lead ${targetLead.name} was archived by ${actorName} (ID: ${actorId}) on ${dateStr}.` });

    return NextResponse.json({ success: true, message: 'Lead soft-deleted securely and system alerts dispatched.' });
  } catch (error: unknown) {
    if (error instanceof AuthError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return serverError();
  }
}
