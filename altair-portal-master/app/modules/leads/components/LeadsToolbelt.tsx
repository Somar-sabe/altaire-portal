"use client";
/**
 * @file /app/modules/leads/components/LeadsToolbelt.tsx
 * @description The Sticky search and layout controls toolbelt.
 * @dependencies react, lucide-react
 * @workplan WP-030
 */

import React from 'react';
import { Grid, Table2, Kanban, Search, Download } from 'lucide-react';

interface LeadsToolbeltProps {
  filterStage: string;
  setFilterStage: (val: string) => void;
  filterTag: string;
  setFilterTag: (val: string) => void;
  selectedView: 'kanban' | 'table' | 'grid';
  setView: (view: 'kanban' | 'table' | 'grid') => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isSuperAdminOrAdmin: boolean;
  onExportClick: () => void;
}

export default function LeadsToolbelt({
  filterStage, setFilterStage,
  filterTag, setFilterTag,
  selectedView, setView,
  searchQuery, setSearchQuery,
  isSuperAdminOrAdmin, onExportClick
  }: LeadsToolbeltProps) {
  return (
    <section className="shrink-0 bg-white/100 dark:bg-slate-950/100 flex flex-col gap-3 sticky top-[-1px] md:top-[-1px] z-40 mb-3 py-3 px-4 md:px-6 -mx-4 md:-mx-6 border-b border-slate-200 dark:border-slate-800/60 shadow-sm transition-all duration-200" id="leads-toolbelt-bar">
      
      {/* Row 1: STAGE, QUALITY, and BOARDS VIEWS (on the SAME row on phone or desktop) */}
      <div className="flex items-center justify-between gap-1.5 md:gap-2.5 w-full flex-nowrap min-w-0 overflow-x-auto scrollbar-none" id="leads-toolbelt-row-1">
        
        {/* Filters Group (Stage & Quality) */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-grow min-w-0">
          {/* Filter Stage Selector */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-900/45 border border-slate-200/50 dark:border-slate-800/80 rounded-[8px] px-2.5 py-1 min-w-0 shrink-0">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-transparent text-xs font-extrabold focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer pr-1 max-w-[110px] md:max-w-[150px] truncate"
            >
              <option value="All">All Stages</option>
              <option value="New">New</option>
              <option value="In progress">In Progress</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Booked">Booked</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Quality Selectors */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-900/45 border border-slate-200/50 dark:border-slate-800/80 rounded-[8px] px-2.5 py-1 min-w-0 shrink-0">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="bg-transparent text-xs font-extrabold focus:outline-none text-slate-800 dark:text-slate-200 cursor-pointer pr-1 max-w-[120px] md:max-w-[150px] truncate"
            >
              <option value="All">All Quality Options</option>
              <option value="Hot Qualified">Hot</option>
              <option value="Qualified">Qualified</option>
              <option value="Responsive">Responsive</option>
              <option value="Low Budget">Low Budget</option>
              <option value="Not Qualified">Disqualified</option>
              <option value="Trash">Trash</option>
            </select>
          </div>
        </div>

        {/* View toggle layouts icons/tabs */}
        <div className="bg-slate-100/85 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800 rounded-[8px] p-0.5 flex items-center gap-0.5 shadow-inner shrink-0" id="view-tabs-switcher">
          <button
            onClick={() => setView('grid')}
            className={`p-1 px-2 rounded-[6px] cursor-pointer transition-all flex items-center gap-1 ${selectedView === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'}`}
            title="Grid view"
            aria-label="Grid view"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-wider font-bold hidden md:inline">Grid</span>
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-1 px-2 rounded-[6px] cursor-pointer transition-all flex items-center gap-1 ${selectedView === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'}`}
            title="Table view"
            aria-label="Table view"
          >
            <Table2 className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-wider font-bold hidden md:inline">Table</span>
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`p-1 px-2 rounded-[6px] cursor-pointer transition-all flex items-center gap-1 ${selectedView === 'kanban' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'}`}
            title="Kanban view"
            aria-label="Kanban view"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-wider font-bold hidden md:inline">Kanban</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search Input and Export Button */}
      <div className="flex items-center gap-2 w-full" id="leads-toolbelt-row-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full text-left bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[8px] text-xs pl-7.5 pr-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 focus:border-indigo-500 font-sans text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all font-bold"
          />
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
        
        {isSuperAdminOrAdmin && (
          <button
            onClick={onExportClick}
            className="p-1 px-3 bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 text-indigo-600 hover:text-indigo-700 text-xs font-black rounded-[8px] flex items-center gap-1.5 cursor-pointer transition-all shadow-xs shrink-0 h-[28px]"
            title="Export Lead Data"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        )}
      </div>

    </section>
  );
}
