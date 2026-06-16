/**
 * @file lib/lead-rotation.ts
 * @purpose Server-side logic for automatic lead rotation triggers and cron inactivity rotation.
 * @dependencies @/lib/prisma
 *
 * Called by PATCH /api/leads/[id] and POST /api/cron/rotate.
 */

import { prisma } from '@/lib/prisma';
import type { LrmLead, User } from '@prisma/client';

export interface RotationResult {
  assignedAgentId: string;
  lastInteractionDate: string;
  lastActivityAt: string;
  lastActivitySummary: string;
  activityDetails: string;
}

export interface CronRotationResult {
  rotatedCount: number;
  message?: string;
}

/**
 * Picks a random active agent excluding the current assignee when possible
 * and returns the fields to merge into the update payload.
 * Returns null if no eligible agents exist.
 */
export async function rotateLeadAgent(
  leadId: string,
  currentAgentId: string | null,
  triggerLabel: 'Lost' | 'Not Qualified'
): Promise<RotationResult | null> {
  const activeAgents = await prisma.user.findMany({ where: { status: 'ACTIVE' } });
  const newAgent = pickRotationAgent(activeAgents, currentAgentId);
  if (!newAgent) return null;
  const dateNow = new Date().toISOString();

  return {
    assignedAgentId: newAgent.id,
    lastInteractionDate: dateNow,
    lastActivityAt: dateNow,
    lastActivitySummary: triggerLabel === 'Lost'
      ? 'Lead automatically rotated as a Lost Lead (Lost Lead Rotation)'
      : 'Lead automatically rotated as Not Qualified (Not Qualified Rotation)',
    activityDetails: `Lead randomly rotated after stage switched to (${triggerLabel}). Assigned to new agent (${newAgent.firstName} ${newAgent.lastName}).`
  };
}

// GPT-Codex (G) BEGIN: unified batch rotation service for the cron endpoint.
export async function rotateInactiveLeads(now = new Date()): Promise<CronRotationResult> {
  const fourDaysAgo = new Date(now);
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  const staleLeads = await prisma.lrmLead.findMany({
    where: {
      deleted: false,
      assignedAgentId: { not: null },
      OR: [
        { lastInteractionDate: null },
        { lastInteractionDate: { lt: fourDaysAgo.toISOString() } }
      ]
    }
  });

  if (staleLeads.length === 0) {
    return { rotatedCount: 0, message: 'No stale leads found' };
  }

  const agents = await prisma.user.findMany({ where: { status: 'ACTIVE' } });
  if (agents.length === 0) {
    return { rotatedCount: 0, message: 'No active agents found to rotate to' };
  }

  const eligibleCandidates = await findDailyCompleteAgents(agents, now);
  const candidates = eligibleCandidates.length > 0 ? eligibleCandidates : agents;
  const agentById = new Map(agents.map(agent => [agent.id, agent]));
  const rotations = staleLeads
    .map(lead => buildCronRotation(lead, candidates, agentById, now))
    .filter((rotation): rotation is NonNullable<typeof rotation> => rotation !== null);

  if (rotations.length === 0) {
    return { rotatedCount: 0, message: 'No eligible rotation candidates found' };
  }

  await prisma.$transaction(async (tx) => {
    for (const rotation of rotations) {
      await tx.lrmLead.update({
        where: { id: rotation.leadId },
        data: rotation.leadData
      });

      await tx.leadActivity.create({
        data: rotation.activityData
      });
    }
  });

  return { rotatedCount: rotations.length };
}
// GPT-Codex (G) END: cron rotation now uses grouped reads and one transactional write batch.

function pickRotationAgent(agents: User[], currentAgentId: string | null): User | null {
  const candidates = currentAgentId
    ? agents.filter(agent => agent.id !== currentAgentId)
    : agents;
  const rotationPool = candidates.length > 0 ? candidates : agents;
  if (rotationPool.length === 0) return null;
  return rotationPool[Math.floor(Math.random() * rotationPool.length)];
}

async function findDailyCompleteAgents(agents: User[], now: Date): Promise<User[]> {
  const agentIds = agents.map(agent => agent.id);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [allLeadCounts, touchedTodayCounts] = await Promise.all([
    prisma.lrmLead.groupBy({
      by: ['assignedAgentId'],
      where: { deleted: false, assignedAgentId: { in: agentIds } },
      _count: { _all: true }
    }),
    prisma.lrmLead.groupBy({
      by: ['assignedAgentId'],
      where: {
        deleted: false,
        assignedAgentId: { in: agentIds },
        lastInteractionDate: {
          gte: startOfToday.toISOString(),
          lt: endOfToday.toISOString()
        }
      },
      _count: { _all: true }
    })
  ]);

  const totalByAgent = new Map(allLeadCounts.map(row => [row.assignedAgentId, row._count._all]));
  const touchedByAgent = new Map(touchedTodayCounts.map(row => [row.assignedAgentId, row._count._all]));

  return agents.filter(agent => {
    const total = totalByAgent.get(agent.id) ?? 0;
    if (total === 0) return true;
    return (touchedByAgent.get(agent.id) ?? 0) === total;
  });
}

function buildCronRotation(
  lead: LrmLead,
  candidates: User[],
  agentById: Map<string, User>,
  now: Date
) {
  const currentAgentId = lead.assignedAgentId;
  if (!currentAgentId) return null;

  const newAgent = pickRotationAgent(candidates, currentAgentId);
  if (!newAgent) return null;

  const oldAgent = agentById.get(currentAgentId);
  const oldName = oldAgent ? `${oldAgent.firstName} ${oldAgent.lastName}` : 'Former';
  const newName = `${newAgent.firstName} ${newAgent.lastName}`;
  const dateNow = now.toISOString();

  return {
    leadId: lead.id,
    leadData: {
      assignedAgentId: newAgent.id,
      assignedById: 'SYSTEM',
      lastInteractionDate: dateNow,
      lastActivityAt: dateNow,
      lastActivitySummary: 'System auto-rotation due to 4 days of inactivity'
    },
    activityData: {
      leadId: lead.id,
      actorId: 'SYSTEM',
      actorName: 'Automated Rotation System',
      actionType: 'ASSIGNED' as const,
      details: `Automated lead reassignment due to 4 days of inactivity. Rotated from agent (${oldName}) to agent (${newName}).`
    }
  };
}
