"use client";
/**
 * @file /app/modules/team/components/ProfileHeader.tsx
 * @purpose Renders the header for the user profile page.
 */

import React from "react";
import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
  onBack: () => void;
  isPrivate: boolean;
  status: string;
}

export default function ProfileHeader({
  onBack,
  isPrivate,
  status,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 text-left">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-[10px] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Profile</h2>
          <p className="text-sm text-slate-500">
            {isPrivate ? "Manage your personal profile" : "View user details"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-950 text-white px-3 py-1.5 rounded-full text-sm font-black uppercase tracking-wider shadow-sm select-none border border-slate-900 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          status === 'ACTIVE' ? 'bg-emerald-400' :
          status === 'SUSPENDED' ? 'bg-amber-400' :
          status === 'INACTIVE' ? 'bg-rose-500' :
          'bg-slate-400'
        }`} />
        <span>{status === 'INACTIVE' ? 'Deactivated' : status}</span>
      </div>
    </div>
  );
}
