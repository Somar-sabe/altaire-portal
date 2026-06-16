"use client";
/**
 * @file /app/modules/team/components/TeamHeader.tsx
 * @purpose Renders the header for the team members module.
 */

import React from "react";
import { Download, Plus } from "lucide-react";

interface TeamHeaderProps {
  onExport: () => void;
  onInvite: () => void;
}

export default function TeamHeader({
  onExport,
  onInvite,
}: TeamHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="text-left">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team Members</h1>
        <p className="text-sm text-slate-500 mt-1">Manage platform users and access levels</p>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onExport} 
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-[10px] text-sm font-medium transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
        <button 
          onClick={onInvite} 
          className="flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-[10px] text-sm font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Invite Member</span>
        </button>
      </div>
    </div>
  );
}
