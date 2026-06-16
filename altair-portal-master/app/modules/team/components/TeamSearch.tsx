"use client";
/**
 * @file /app/modules/team/components/TeamSearch.tsx
 * @purpose Renders the search bar and filter toggle for the team members list.
 */

import React from "react";
import { Search, Filter, LayoutGrid, List as ListIcon } from "lucide-react";

interface TeamSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilters: () => void;
  isFilterActive: boolean;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export default function TeamSearch({
  searchQuery,
  setSearchQuery,
  onOpenFilters,
  isFilterActive,
  viewMode,
  setViewMode,
}: TeamSearchProps) {
  return (
    <div className="flex items-center gap-2 mb-4 w-full">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 h-10"
        />
      </div>
      <button 
        onClick={onOpenFilters}
        className={`h-10 w-10 border rounded-[10px] transition-colors shrink-0 relative flex items-center justify-center ${
          isFilterActive
            ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        {isFilterActive && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          title="Grid View"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          title="List View"
        >
          <ListIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
