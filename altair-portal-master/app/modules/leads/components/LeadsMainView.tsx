"use client";
/**
 * @file /app/modules/leads/components/LeadsMainView.tsx
 * @purpose Renders the main content area of the leads module, handling view switching and empty states.
 */

import React from 'react';
import KanbanView from './KanbanView';
import TableView from './TableView';
import CardsView from './CardsView';
import { useLeadsStore } from '../store';

interface LeadsMainViewProps {
  selectedView: 'kanban' | 'table' | 'grid';
  isLoading: boolean;
  leadsLength: number;
  filteredList: any[];
  selectedLeadIds: string[];
  onSelectLead: (lead: any) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleLead: (id: string, e: React.MouseEvent) => void;
}

export default function LeadsMainView({
  selectedView, isLoading, leadsLength, filteredList, selectedLeadIds, onSelectLead, onSelectAll, onToggleLead
}: LeadsMainViewProps) {
  const updatingLeadId = useLeadsStore((s) => s.updatingLeadId);

  if (isLoading && leadsLength === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
        <div className="w-8 h-8 rounded-full border border-indigo-600 border-t-transparent animate-spin" />
        <span className="text-sm text-slate-500 font-bold tracking-widest uppercase mt-4 animate-pulse">Fetching lead records...</span>
      </div>
    );
  }

  if (filteredList.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-16 bg-white dark:bg-slate-900 text-center shadow-sm">
        <h3 className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">No matching leads found</h3>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col relative">
      {isLoading && leadsLength > 0 && !updatingLeadId && (
        <div className="absolute top-2 right-4 z-50 flex items-center gap-2 bg-indigo-50/80 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800 shadow-sm animate-fade-in pointer-events-none">
          <div className="w-3 h-3 rounded-full border border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Syncing background...</span>
        </div>
      )}

      {selectedLeadIds.length > 0 && selectedView === 'table' && (
        <div className="text-[10px] font-black text-indigo-600 pb-2 flex items-center justify-end gap-1.5 pr-1 uppercase tracking-wider">
          <span>You have selected {selectedLeadIds.length} leads for bulk assignment.</span>
        </div>
      )}

      {selectedView === 'kanban' ? (
        <KanbanView leads={filteredList} onSelectLead={onSelectLead} />
      ) : selectedView === 'table' ? (
        <div className="flex-1 min-h-[500px] h-[calc(100vh-280px)] flex flex-col min-w-0">
          <TableView leads={filteredList} selectedLeadIds={selectedLeadIds} onSelectAll={onSelectAll} onToggleLead={onToggleLead} onSelectLead={onSelectLead} />
        </div>
      ) : (
        <div className="flex-1 min-h-[500px] h-[calc(100vh-280px)] flex flex-col min-w-0">
          <CardsView leads={filteredList} onSelectLead={onSelectLead} />
        </div>
      )}
    </div>
  );
}
