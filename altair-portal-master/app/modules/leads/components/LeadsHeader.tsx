"use client";
/**
 * @file /app/modules/leads/components/LeadsHeader.tsx
 * @description Header component for the Leads module with title and creation actions.
 * @dependencies react, lucide-react
 * @workplan WP-030
 */

import React from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';

interface LeadsHeaderProps {
  onImportClick: () => void;
  onManualAddClick: () => void;
}

export default function LeadsHeader({ onImportClick, onManualAddClick }: LeadsHeaderProps) {
  return (
    <header className="flex shrink-0 flex-row items-center justify-between gap-4 pt-4 md:pt-6 pb-2 mb-2" id="leads-module-header">
      {/* Left Side: Tab Title */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <h1 className="text-sm font-black text-slate-950 dark:text-slate-50 uppercase tracking-widest font-sans">Leads</h1>
        <p className="hidden sm:block text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 truncate" title="Track active engagement, rotations, safe deletion controls, and AI audits.">
          Track active engagement, rotations, safe deletion controls, and AI audits.
        </p>
      </div>

      {/* Right Side: Creation Triggers */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onImportClick}
          className="p-1.5 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-800 dark:text-slate-100 text-xs font-black rounded-[8px] flex items-center gap-1 cursor-pointer transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Import<span className="hidden sm:inline"> CSV</span>
        </button>
        
        <button
          onClick={onManualAddClick}
          className="p-1.5 px-3 bg-slate-950 hover:bg-slate-850 text-white text-xs font-black rounded-[8px] flex items-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          New<span className="hidden sm:inline"> Lead</span>
        </button>
      </div>
    </header>
  );
}
