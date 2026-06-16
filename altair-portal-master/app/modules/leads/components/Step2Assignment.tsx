"use client";
/**
 * @file /app/modules/leads/components/Step2Assignment.tsx
 * @purpose Renders the second step of the manual lead creation modal (Assignment).
 */

import React from 'react';
import { STAGE_LABELS } from '../constants';

interface Step2AssignmentProps {
  source: string; setSource: (v: string) => void;
  stage: string; setStage: (v: string) => void;
  quality: string; setQuality: (v: string) => void;
  assignedAgentId: string; setAssignedAgentId: (v: string) => void;
  systemAgents: any[];
  STAGE_OPTIONS: string[];
  QUALITY_OPTIONS: string[];
}

export default function Step2Assignment({
  source, setSource, stage, setStage, quality, setQuality, assignedAgentId, setAssignedAgentId,
  systemAgents, STAGE_OPTIONS, QUALITY_OPTIONS
}: Step2AssignmentProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 mb-1 tracking-widest">CRM Assignment</h4>
      <div className="flex flex-col gap-1">
        <label className="uppercase tracking-wider text-sm text-slate-500">Source</label>
        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Website, LinkedIn, Referral" className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-sm text-slate-500">Pipeline Stage</label>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-indigo-500/5 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-850 dark:text-slate-100 font-bold cursor-pointer focus:outline-none">
            {STAGE_OPTIONS.map(s => <option key={s} value={s}>{STAGE_LABELS[s] || s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-sm text-slate-500">Lead Quality</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-indigo-500/5 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-850 dark:text-slate-100 font-bold cursor-pointer focus:outline-none">
            <option value="">-- Unassigned --</option>
            {QUALITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="uppercase tracking-wider text-sm text-slate-500">Assigned Sales Agent</label>
          <select value={assignedAgentId} onChange={(e) => setAssignedAgentId(e.target.value)} className="p-3 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-indigo-500/5 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-indigo-700 dark:text-indigo-300 font-bold cursor-pointer focus:outline-none">
            <option value="">-- Auto-allocation Cycle --</option>
            {systemAgents.map(ag => (
              <option key={ag.id} value={ag.id}>{ag.firstName} {ag.lastName} ({ag.role})</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
