"use client";
/**
 * @file /app/modules/leads/components/ManualLeadDetailsSection.tsx
 * @description Sub-component for managing key-value custom details during manual lead registration.
 *
 * @dependencies
 * - react
 * - lucide-react: Trash, Plus
 *
 * @exports
 * - ManualLeadDetailsSection: Sub-module rendering dynamic attribute fields
 *
 * @lastModified 2026-05-30
 * @workplan WP-051
 */

import React, { useState } from 'react';
import { Trash, Plus } from 'lucide-react';

interface DetailItem {
  title: string;
  content: string;
}

interface DetailsSectionProps {
  detailsList: DetailItem[];
  setDetailsList: React.Dispatch<React.SetStateAction<DetailItem[]>>;
  newDetailTitle: string;
  setNewDetailTitle: (val: string) => void;
  newDetailContent: string;
  setNewDetailContent: (val: string) => void;
}

export default function ManualLeadDetailsSection({
  detailsList,
  setDetailsList,
  newDetailTitle,
  setNewDetailTitle,
  newDetailContent,
  setNewDetailContent,
}: DetailsSectionProps) {
  const handleAddDetail = () => {
    if (newDetailTitle.trim() && newDetailContent.trim()) {
      setDetailsList([...detailsList, { title: newDetailTitle.trim(), content: newDetailContent.trim() }]);
      setNewDetailTitle('');
      setNewDetailContent('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    setDetailsList(detailsList.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-xs font-black uppercase text-slate-900 dark:text-slate-100 mb-1 tracking-widest">
        Custom Metadata Details
      </h4>
      
      {detailsList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          {detailsList.map((dt, idx) => (
            <div key={dt.title + idx} className="flex flex-col gap-1 relative group">
              <label className="uppercase tracking-wider text-sm text-slate-500">{dt.title}</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center h-10 truncate leading-none">
                  {dt.content}
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveDetail(idx)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[8px] transition-colors cursor-pointer shrink-0 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-sm text-slate-500">New Field Name</label>
          <input
            type="text"
            value={newDetailTitle}
            onChange={(e) => setNewDetailTitle(e.target.value)}
            placeholder="Key (e.g. Channel)"
            className="h-10 p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDetail();
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="uppercase tracking-wider text-sm text-slate-500">Value</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newDetailContent}
              onChange={(e) => setNewDetailContent(e.target.value)}
              placeholder="Value (e.g. WhatsApp)"
              className="h-10 flex-1 p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDetail();
                }
              }}
            />
            <button 
              type="button"
              onClick={handleAddDetail}
              disabled={!newDetailTitle.trim() || !newDetailContent.trim()}
              className="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-[8px] border border-indigo-200 dark:border-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
