"use client";
/**
 * @file /app/modules/leads/components/LeadsBulkAssign.tsx
 * @description Renders the tools to bulk assign leads to agents.
 * @dependencies react
 * @workplan WP-030
 */

import React from 'react';

interface LeadsBulkAssignProps {
  selectedLeadIds: string[];
  bulkAgentId: string;
  setBulkAgentId: (id: string) => void;
  systemAgents: any[];
  isBulkAssigning: boolean;
  executeBulkAssign: () => void;
}

export default function LeadsBulkAssign({
  selectedLeadIds,
  bulkAgentId,
  setBulkAgentId,
  systemAgents,
  isBulkAssigning,
  executeBulkAssign
}: LeadsBulkAssignProps) {
  if (selectedLeadIds.length === 0) return null;

  return (
    <fieldset className="border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/10 p-2 rounded-[8px] mb-4 text-left flex items-center justify-between flex-wrap gap-2 animate-fade-in" id="leads-bulk-assign-fieldset">
      <div className="flex items-center gap-2">
        <select
          value={bulkAgentId}
          onChange={(e) => setBulkAgentId(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[6px] text-xs font-bold py-1 px-3"
        >
          <option value="">-- Select agent for bulk assignment --</option>
          {systemAgents.map(ag => (
            <option key={ag.id} value={ag.id}>{ag.firstName} {ag.lastName} ({ag.role})</option>
          ))}
        </select>
        <button
          onClick={executeBulkAssign}
          disabled={!bulkAgentId || isBulkAssigning}
          className="px-3 py-1 bg-indigo-600 hover:bg-slate-950 text-white rounded-[6px] text-xs font-black cursor-pointer disabled:opacity-50"
        >
          {isBulkAssigning ? 'Assigning...' : `Bulk Assign (${selectedLeadIds.length} Leads)`}
        </button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-500">
          Pick multiple lead rows from the tabular view to execute synchronised bulk agent mappings.
        </span>
      </div>
    </fieldset>
  );
}
