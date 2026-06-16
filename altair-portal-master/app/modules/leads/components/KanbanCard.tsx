"use client";
/**
 * @file /app/modules/leads/components/KanbanCard.tsx
 * @description Small-sized Kanban Card for individual leads.
 * @dependencies react, lucide-react, @/app/modules/leads/store
 * @workplan WP-030
 */
import React from 'react';
import { LrmLead, useLeadsStore } from '../store';
import { Compass, Phone, Mail, Calendar } from 'lucide-react';

interface KanbanCardProps {
  lead: LrmLead;
  currentUser: any;
  onSelectLead: (lead: LrmLead) => void;
  isDragging?: boolean;
}

export default function KanbanCard({
  lead, currentUser, onSelectLead, isDragging
}: KanbanCardProps) {
  const updatingLeadId = useLeadsStore((s) => s.updatingLeadId);
  const isUpdating = updatingLeadId === lead.id;

  const isSuperAdminOrAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
  const displayedPhone = isSuperAdminOrAdmin
    ? lead.phone
    : lead.phone.replace(/(\d{4})\d{4,}(\d{2})/, '$1 ****** $2');
  
  const displayedEmail = isSuperAdminOrAdmin
    ? lead.email
    : lead.email.replace(/(.{2}).+@(.+)/, '$1***@$2');

  const tags = lead.tags || [];
  const hasTag = (val: string) => tags.some(t => t.toLowerCase().includes(val.toLowerCase()));
  let qualityLabel = tags.length > 0 ? tags.join(', ') : 'Unassigned';
  let qualityColor = 'text-slate-500 bg-slate-500/5 dark:text-slate-400';
  
  if (hasTag('hot qualified')) {
    qualityLabel = 'Hot Qualified';
    qualityColor = 'text-rose-700 bg-rose-500/10 dark:text-rose-400 animate-pulse';
  } else if (hasTag('not qualified')) {
    qualityLabel = 'Not Qualified';
    qualityColor = 'text-amber-800 bg-amber-500/10 dark:text-amber-400';
  } else if (hasTag('low budget')) {
    qualityLabel = 'Low Budget';
    qualityColor = 'text-yellow-700 bg-yellow-500/10 dark:text-yellow-400';
  } else if (hasTag('responsive')) {
    qualityLabel = 'Responsive';
    qualityColor = 'text-sky-700 bg-sky-500/10 dark:text-sky-400';
  } else if (hasTag('trash')) {
    qualityLabel = 'Trash';
    qualityColor = 'text-slate-600 bg-slate-500/10 dark:text-slate-400';
  } else if (hasTag('qualified')) {
    qualityLabel = 'Qualified';
    qualityColor = 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400';
  }

  return (
    <div
      onClick={() => !isUpdating && onSelectLead(lead)}
      className={`bg-white dark:bg-slate-900 rounded-[8px] p-2 flex flex-col justify-between hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative font-sans text-left ring-1 ring-slate-100 dark:ring-slate-800 ${isDragging ? 'shadow-lg ring-indigo-500/50 dark:ring-indigo-500/50 rotate-1 scale-105 z-50' : ''} ${isUpdating ? 'opacity-75 pointer-events-none' : ''}`}
      id={`kanban-card-${lead.id}`}
    >
      {isUpdating && (
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 rounded-[8px] flex flex-col items-center justify-center z-10 backdrop-blur-[1px]">
          <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-1" />
          <span className="text-[8px] font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-widest bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded">Saving...</span>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-bold text-slate-400 tracking-wider">
            LD-{new Date(lead.dateCreated).getFullYear()}-{lead.id.substring(0, 2).toUpperCase()}
          </span>
          <span className={`px-1 rounded-sm text-[7px] font-black uppercase tracking-wider ${qualityColor}`}>
            {qualityLabel}
          </span>
        </div>

        <h3 className="text-xs font-black text-slate-900 dark:text-slate-50 mb-1 leading-snug truncate">
          {lead.name}
        </h3>

        <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mb-2 truncate">
          <Compass className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
          <span className="truncate">{lead.stage}</span>
        </div>

        <div className="space-y-1 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-mono truncate">{displayedPhone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="font-mono truncate">{displayedEmail}</span>
          </div>
        </div>

        {lead.notes && (
          <div className="bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-[4px] text-[8px] text-slate-500 mb-2 border border-slate-100/60 dark:border-slate-800/50">
            <p className="italic font-medium leading-tight line-clamp-2">"{lead.notes}"</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 dark:border-slate-800/40 mt-1">
        <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{lead.dateCreated || '2025-03-12'}</span>
        </div>
        <span className="inline-block px-1 rounded-sm text-[7px] font-black bg-slate-50 text-slate-500 uppercase">
          {lead.lang || 'EN'}
        </span>
      </div>
    </div>
  );
}
