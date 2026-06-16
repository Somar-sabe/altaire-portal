"use client";
/**
 * @file /app/modules/workspace/components/SpaceInviteMembersStep.tsx
 * @purpose Renders the second step of the space creation modal (Member Invites).
 */

import React from 'react';
import { Search, Check } from 'lucide-react';

interface SpaceInviteMembersStepProps {
  inviteSearch: string; setInviteSearch: (v: string) => void;
  filteredMembers: any[];
  invitedUserIds: string[];
  onToggleInvite: (id: string) => void;
  onConfirm: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function SpaceInviteMembersStep({
  inviteSearch, setInviteSearch, filteredMembers, invitedUserIds, onToggleInvite, onConfirm, onBack, isSubmitting
}: SpaceInviteMembersStepProps) {
  return (
    <div className="p-4 flex flex-col overflow-hidden text-left">
      <div className="relative mb-3 shrink-0">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input type="text" placeholder="Search teammates..." value={inviteSearch} onChange={e => setInviteSearch(e.target.value)} className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 transition" />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[220px] divide-y divide-slate-50 border border-slate-100 rounded-lg p-1 bg-slate-50/30">
        {filteredMembers.length > 0 ? filteredMembers.map((m) => {
          const isSelected = invitedUserIds.includes(m.id);
          return (
            <button key={m.id} type="button" onClick={() => onToggleInvite(m.id)} className={`w-full p-2 flex items-center justify-between text-left rounded-md transition duration-150 ${isSelected ? 'bg-indigo-50/40 text-slate-900' : 'hover:bg-slate-50 text-slate-600'}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold shrink-0 border border-slate-200">{m.firstName.charAt(0)}{m.lastName.charAt(0)}</div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{m.firstName} {m.lastName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{m.department || 'Staff'} • {m.email}</p>
                </div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
            </button>
          );
        }) : <div className="py-10 text-center text-slate-400 text-xs font-bold italic">No members found matching your search.</div>}
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-slate-400">{invitedUserIds.length} members selected</p>
        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="px-3.5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition">Back</button>
          <button onClick={onConfirm} disabled={isSubmitting} className="px-4 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : null}
            <span>Complete Space</span>
          </button>
        </div>
      </div>
    </div>
  );
}
