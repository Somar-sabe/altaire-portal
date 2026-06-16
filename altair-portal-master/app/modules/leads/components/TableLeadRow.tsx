"use client";
/**
 * @file /app/modules/leads/components/TableLeadRow.tsx
 * @purpose Renders a single lead row in the tabular view.
 */

import React from 'react';
import { Eye } from 'lucide-react';
import type { LrmLead } from '../store';
import { STAGE_LABELS } from '../constants';

interface TableLeadRowProps {
  lead: LrmLead;
  isAgent: boolean;
  isSuperAdminOrAdmin: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: ((id: string, e: React.MouseEvent) => void) | undefined;
}

export default function TableLeadRow({
  lead, isAgent, isSuperAdminOrAdmin, isSelected, onSelect, onToggle
}: TableLeadRowProps) {
  const displayedPhone = isSuperAdminOrAdmin ? lead.phone : lead.phone.replace(/(\d{4})\d{4,}(\d{2})/, '$1 ****** $2');
  const displayedEmail = isSuperAdminOrAdmin ? lead.email : lead.email.replace(/(.{2}).+@(.+)/, '$1***@$2');

  const getQualityInfo = () => {
    let qL = 'Pending Review';
    let qC = 'bg-slate-100 text-slate-650 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50';
    const tags = lead.tags || [];
    const hasTag = (val: string) => tags.some(t => t.toLowerCase().includes(val.toLowerCase()));
    if (hasTag('hot qualified')) { qL = 'Hot Qualified'; qC = 'bg-rose-50/70 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'; }
    else if (hasTag('not qualified')) { qL = 'Not Qualified'; qC = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30'; }
    else if (hasTag('low budget')) { qL = 'Low Budget'; qC = 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-905/30'; }
    else if (hasTag('responsive')) { qL = 'Responsive'; qC = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30'; }
    else if (hasTag('trash')) { qL = 'Trash'; qC = 'bg-slate-100 text-slate-650 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50'; }
    else if (hasTag('qualified')) { qL = 'Qualified'; qC = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'; }
    return { qL, qC };
  };

  const { qL, qC } = getQualityInfo();

  return (
    <tr 
      onClick={onSelect}
      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800/60 ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
    >
      {onToggle && (
        <td className="p-3 text-center shrink-0 border-r border-slate-100 dark:border-slate-800/30" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={(e) => onToggle(lead.id, e as unknown as React.MouseEvent)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
        </td>
      )}
      <td className="p-3 font-bold text-slate-950 dark:text-slate-50 truncate select-all" title={lead.name}>{lead.name}</td>
      <td className={`p-3 font-mono truncate ${isAgent ? 'select-none pointer-events-none' : ''}`} title={displayedPhone}>{displayedPhone || '—'}</td>
      <td className={`p-3 font-mono truncate ${isAgent ? 'select-none pointer-events-none' : ''}`} title={displayedEmail}>{displayedEmail || '—'}</td>
      <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100 truncate">${lead.value.toLocaleString()}</td>
      <td className="p-3 text-center truncate"><span className="inline-block px-1.5 py-0.5 rounded-sm text-[8px] font-black bg-slate-100 dark:bg-slate-800/40 text-slate-500 uppercase">{lead.lang || 'EN'}</span></td>
      <td className="p-3 text-center truncate"><span className="inline-block px-1.5 py-0.5 rounded-full text-[8px] font-black tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700">{STAGE_LABELS[lead.stage] || lead.stage}</span></td>
      <td className="p-3 text-center truncate"><span className={`inline-block px-1.5 py-0.5 rounded-full text-[8.5px] font-black tracking-wide border ${qC}`}>{qL}</span></td>
      <td className="p-3 font-mono text-xs text-slate-400 dark:text-slate-500 truncate">{new Date(lead.dateCreated).toLocaleDateString()}</td>
      <td className="p-3 text-center truncate" onClick={(e) => e.stopPropagation()}>
        <button onClick={onSelect} className="p-1 px-2.5 bg-slate-950 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-[6px] text-[10px] font-black transition-colors flex items-center gap-1 mx-auto cursor-pointer shadow-xs uppercase tracking-tight"><Eye className="w-3 h-3" /> View</button>
      </td>
    </tr>
  );
}
