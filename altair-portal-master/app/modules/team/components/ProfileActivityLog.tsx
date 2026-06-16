"use client";
/**
 * @file /app/modules/team/components/ProfileActivityLog.tsx
 * @purpose Renders the activity log section for a user.
 */

import React, { useState } from "react";
import { Lock, Edit2, Check, User } from "lucide-react";

interface ProfileActivityLogProps {
  currentUser: any;
  user: any;
}

export default function ProfileActivityLog({ currentUser, user }: ProfileActivityLogProps) {
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'This Week'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Auth' | 'Setting' | 'Project'>('All');

  if (!currentUser || user.managerId !== currentUser.id) return null;

  const MOCK_LOGS = [
    { date: 'Today, 10:45 AM', action: 'Logged in from New York, USA', type: 'Auth', icon: <Lock className="w-3 h-3 text-emerald-500" /> },
    { date: 'Yesterday, 3:20 PM', action: 'Updated profile information', type: 'Setting', icon: <Edit2 className="w-3 h-3 text-blue-500" /> },
    { date: 'May 20, 2026', action: 'Created new project "Alpha"', type: 'Project', icon: <Check className="w-3 h-3 text-indigo-500" /> },
    { date: 'May 18, 2026', action: 'Account created via Invitation', type: 'Auth', icon: <User className="w-3 h-3 text-slate-500" /> },
  ];

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchType = typeFilter === 'All' || log.type === typeFilter;
    const matchDate = dateFilter === 'All' || 
      (dateFilter === 'Today' && log.date.includes('Today')) ||
      (dateFilter === 'This Week' && (log.date.includes('Today') || log.date.includes('Yesterday')));
    return matchType && matchDate;
  });

  return (
    <section className="text-left">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2 flex-wrap gap-2">
        <h4 className="text-sm font-bold text-slate-900">Activity Log</h4>
        <div className="flex items-center gap-2">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="text-xs font-bold border border-slate-200 rounded p-1 text-slate-600 bg-slate-50 outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
          </select>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-xs font-bold border border-slate-200 rounded p-1 text-slate-600 bg-slate-50 outline-none focus:border-slate-400 cursor-pointer"
          >
            <option value="All">All Activities</option>
            <option value="Auth">Authentication</option>
            <option value="Setting">Settings</option>
            <option value="Project">Projects</option>
          </select>
        </div>
      </div>
      
      {filteredLogs.length === 0 ? (
        <div className="text-center py-10 text-xs text-slate-400 font-bold border border-dashed border-slate-200 rounded-[10px]">
          No activity logs found for the selected filters.
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {filteredLogs.map((log, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform hover:scale-110">
                {log.icon}
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-[10px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-slate-400 block mb-1">{log.date}</span>
                <span className="text-xs font-medium text-slate-800">{log.action}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
