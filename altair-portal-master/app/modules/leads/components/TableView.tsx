"use client";
/**
 * @file /app/modules/leads/components/TableView.tsx
 * @purpose Renders a tabular list of leads with resizable columns and clean flat rows.
 */

'use client';

import React from 'react';
import { LrmLead } from '../store';
import { useAuthStore } from '../../team/authStore';
import { FileSpreadsheet } from 'lucide-react';

// Sub-components
import TableColumnHeader from './TableColumnHeader';
import TableLeadRow from './TableLeadRow';

// Hooks
import { useTableWidths } from '../hooks/useTableWidths';

interface TableProps {
  leads: LrmLead[];
  onSelectLead: (lead: LrmLead) => void;
  selectedLeadIds?: string[];
  onToggleLead?: (id: string, e: React.MouseEvent) => void;
  onSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TableView({ leads, onSelectLead, selectedLeadIds = [], onToggleLead, onSelectAll }: TableProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAgent = (currentUser?.role as string) === 'AGENT';
  const isSuperAdminOrAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
  const allSelected = leads.length > 0 && selectedLeadIds.length === leads.length;

  const { widths, startResize } = useTableWidths();

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-[10px] overflow-hidden flex flex-col min-w-0 shadow-sm" id="table-view-container">
      <div className="overflow-auto scrollbar-thin flex-1 min-w-0">
        <table className="w-full text-left border-collapse text-xs table-fixed">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 font-black uppercase text-[10px] tracking-widest sticky top-0 z-10 select-none shadow-sm">
              {onToggleLead && onSelectAll && (
                <th className="p-3 w-[40px] text-center shrink-0 border-r border-slate-100 dark:border-slate-800/30">
                  <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
                </th>
              )}
              <TableColumnHeader label="Lead Name" width={widths.name} onResize={(e) => startResize('name', e)} />
              <TableColumnHeader label="Phone" width={widths.phone} onResize={(e) => startResize('phone', e)} />
              <TableColumnHeader label="Email Address" width={widths.email} onResize={(e) => startResize('email', e)} />
              <TableColumnHeader label="Target Value" width={widths.value} onResize={(e) => startResize('value', e)} />
              <TableColumnHeader label="Language" width={widths.lang} onResize={(e) => startResize('lang', e)} className="text-center" />
              <TableColumnHeader label="Stage" width={widths.stage} onResize={(e) => startResize('stage', e)} className="text-center" />
              <TableColumnHeader label="Quality" width={widths.quality} onResize={(e) => startResize('quality', e)} className="text-center" />
              <TableColumnHeader label="Date Created" width={widths.created} onResize={(e) => startResize('created', e)} />
              <TableColumnHeader label="Action" width={widths.action} onResize={(e) => startResize('action', e)} className="text-center" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-200">
            {leads.map((lead) => (
              <TableLeadRow 
                key={lead.id} lead={lead} isAgent={isAgent} isSuperAdminOrAdmin={isSuperAdminOrAdmin} 
                isSelected={selectedLeadIds.includes(lead.id)} onSelect={() => onSelectLead(lead)} onToggle={onToggleLead} 
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {leads.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center" id="empty-leads-table">
          <FileSpreadsheet className="w-10 h-10 text-slate-200 mb-3 animate-pulse" />
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">No leads found in this channel</h3>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Tweak active filters or initiate a spreadsheet bulk import.</p>
        </div>
      )}
    </div>
  );
}
