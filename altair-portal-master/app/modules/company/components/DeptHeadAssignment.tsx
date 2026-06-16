"use client";
/**
 * @file /app/modules/company/components/DeptHeadAssignment.tsx
 * @purpose Renders the assignment UI for the head of a department.
 */

import React from 'react';
import { UserCheck } from 'lucide-react';
import type { User } from '../hooks/useDepartmentDetails';

interface DeptHeadAssignmentProps {
  selectedHead: string;
  onHeadChange: (name: string) => void;
  users: User[];
}

export default function DeptHeadAssignment({
  selectedHead, onHeadChange, users
}: DeptHeadAssignmentProps) {
  return (
    <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[12px] p-5 shadow-sm space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <UserCheck className="w-4 h-4 text-indigo-500" />
        <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase">Department Head</h3>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-950/30 rounded-[8px] border border-slate-100 dark:border-slate-850">
        <span className="text-[10px] text-slate-400 block pb-1 font-black uppercase">Current Head</span>
        <span className="text-sm font-black text-slate-800 dark:text-slate-100 block truncate">{selectedHead || 'Unassigned'}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-slate-400 font-black uppercase">Appoint New Head</label>
        <div className="relative">
          <input
            type="text" list="system-users-head" value={selectedHead} onChange={e => onHeadChange(e.target.value)}
            placeholder="Search or enter custom..."
            className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[8px] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <datalist id="system-users-head">{users.map(u => (<option key={u.id} value={`${u.firstName} ${u.lastName}`}>{u.role}</option>))}</datalist>
        </div>
      </div>
    </div>
  );
}
