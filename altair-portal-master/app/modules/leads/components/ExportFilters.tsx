"use client";
/**
 * @file /app/modules/leads/components/ExportFilters.tsx
 * @purpose Renders the filter selection inputs for the export wizard.
 */

import React from 'react';

interface ExportFiltersProps {
  filterStage: string; setFilterStage: (v: string) => void;
  filterTag: string; setFilterTag: (v: string) => void;
  filterLang: string; setFilterLang: (v: string) => void;
  filterCountry: string; setFilterCountry: (v: string) => void;
  filterAgent: string; setFilterAgent: (v: string) => void;
  systemAgents: any[];
  languages: string[];
  countries: string[];
  STAGE_OPTIONS: string[];
}

export default function ExportFilters({
  filterStage, setFilterStage, filterTag, setFilterTag, filterLang, setFilterLang, filterCountry, setFilterCountry,
  filterAgent, setFilterAgent, systemAgents, languages, countries, STAGE_OPTIONS
}: ExportFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 text-left">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wider">Pipeline Stage</label>
        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm p-2.5 focus:outline-none">
          <option value="All">All Stages</option>
          {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wider">Lead Quality</label>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm p-2.5 focus:outline-none">
          <option value="All">All Qualities</option>
          {['Hot Qualified', 'Qualified', 'Responsive', 'Low Budget', 'Not Qualified', 'Trash'].map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wider">Language</label>
        <select value={filterLang} onChange={(e) => setFilterLang(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm p-2.5 focus:outline-none">
          <option value="All">All Languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wider">Country</label>
        <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm p-2.5 focus:outline-none">
          <option value="All">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="text-xs font-black text-slate-705 dark:text-slate-300 uppercase tracking-wider">Assigned Agent</label>
        <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[8px] text-sm p-2.5 focus:outline-none">
          <option value="All">All Agents</option>
          {systemAgents.map(ag => <option key={ag.id} value={ag.id}>{ag.firstName} {ag.lastName} ({ag.role})</option>)}
        </select>
      </div>
    </div>
  );
}
