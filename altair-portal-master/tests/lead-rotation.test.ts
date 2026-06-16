// GPT-Codex (G) BEGIN: unit coverage for the unified lead rotation service.
import { beforeEach, describe, expect, test, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
  lrmLead: {
    findMany: vi.fn(),
    groupBy: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
  },
  leadActivity: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { rotateInactiveLeads, rotateLeadAgent } from '../lib/lead-rotation';

describe('lead rotation service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    prismaMock.$transaction.mockImplementation(async (callback) => callback(prismaMock));
  });

  test('single lead rotation returns assignment data without writing activity directly', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { id: 'agent-old', firstName: 'Old', lastName: 'Agent', status: 'ACTIVE' },
      { id: 'agent-new', firstName: 'New', lastName: 'Agent', status: 'ACTIVE' },
    ]);

    const result = await rotateLeadAgent('lead-1', 'agent-old', 'Lost');

    expect(result?.assignedAgentId).toBe('agent-new');
    expect(result?.activityDetails).toContain('New Agent');
    expect(prismaMock.leadActivity.create).not.toHaveBeenCalled();
  });

  test('inactive lead rotation exits before user lookup when no stale leads exist', async () => {
    prismaMock.lrmLead.findMany.mockResolvedValue([]);

    await expect(rotateInactiveLeads(new Date('2026-06-12T08:00:00Z'))).resolves.toEqual({
      rotatedCount: 0,
      message: 'No stale leads found',
    });

    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  test('inactive lead rotation uses grouped eligibility reads and one write transaction', async () => {
    prismaMock.lrmLead.findMany.mockResolvedValue([
      { id: 'lead-1', assignedAgentId: 'agent-old', deleted: false },
    ]);
    prismaMock.user.findMany.mockResolvedValue([
      { id: 'agent-old', firstName: 'Old', lastName: 'Agent', status: 'ACTIVE' },
      { id: 'agent-new', firstName: 'New', lastName: 'Agent', status: 'ACTIVE' },
    ]);
    prismaMock.lrmLead.groupBy
      .mockResolvedValueOnce([{ assignedAgentId: 'agent-old', _count: { _all: 1 } }])
      .mockResolvedValueOnce([{ assignedAgentId: 'agent-old', _count: { _all: 1 } }]);

    await expect(rotateInactiveLeads(new Date('2026-06-12T08:00:00Z'))).resolves.toEqual({
      rotatedCount: 1,
    });

    expect(prismaMock.lrmLead.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.lrmLead.groupBy).toHaveBeenCalledTimes(2);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.lrmLead.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'lead-1' },
      data: expect.objectContaining({ assignedAgentId: 'agent-new', assignedById: 'SYSTEM' }),
    }));
    expect(prismaMock.leadActivity.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        leadId: 'lead-1',
        actorId: 'SYSTEM',
        actionType: 'ASSIGNED',
      }),
    }));
  });
});
// GPT-Codex (G) END: rotation behavior is covered without mutating live data.
