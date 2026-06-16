"use client";
/**
 * @file /app/modules/team/components/BulkActionsBar.tsx
 * @purpose Renders the floating bar for bulk actions on selected users.
 */

import React from "react";
import { X } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onAction: (action: 'Suspend' | 'Activate' | 'Delete') => void;
  onClear: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onAction,
  onClear,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700/60 text-white rounded-[16px] px-4 py-3 flex flex-row items-center justify-between shadow-2xl backdrop-blur-sm gap-6 z-[60] animate-in slide-in-from-bottom-8 fade-in duration-300 min-w-[320px]">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-black flex items-center justify-center border border-indigo-500/30">
           {selectedCount}
        </span>
        <span className="text-sm font-semibold tracking-wide">users selected</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
           onClick={() => onAction('Activate')}
           className="px-3 py-1.5 hover:bg-emerald-500/20 rounded-[8px] text-xs font-bold transition-colors text-emerald-400"
        >
           Activate
        </button>
        <button 
           onClick={() => onAction('Suspend')}
           className="px-3 py-1.5 hover:bg-amber-500/20 rounded-[8px] text-xs font-bold transition-colors text-amber-400"
        >
           Suspend
        </button>
        <button 
           onClick={() => onAction('Delete')}
           className="px-3 py-1.5 hover:bg-rose-500/20 rounded-[8px] text-xs font-bold transition-colors text-rose-400"
        >
           Delete
        </button>
        <div className="w-px h-5 bg-slate-700 mx-1"></div>
        <button 
           onClick={onClear}
           className="p-1.5 w-7 h-7 flex flex-col justify-center items-center hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
           title="Clear selection"
        >
           <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
