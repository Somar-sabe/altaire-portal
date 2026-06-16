"use client";
/**
 * @file /app/modules/leads/components/DetailsDynamicDetails.tsx
 * @purpose Renders the custom dynamic fields for a lead with add/remove capability.
 */

import React from 'react';
import { Plus, Hash, Trash2 } from 'lucide-react';

interface DetailsDynamicDetailsProps {
  lead: any;
  isAddingDetail: boolean;
  setIsAddingDetail: (v: boolean) => void;
  newDetailKey: string; setNewDetailKey: (v: string) => void;
  newDetailValue: string; setNewDetailValue: (v: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

export default function DetailsDynamicDetails({
  lead, isAddingDetail, setIsAddingDetail, newDetailKey, setNewDetailKey, newDetailValue, setNewDetailValue, onAdd, onRemove
}: DetailsDynamicDetailsProps) {
  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dynamic Details</span>
        <button onClick={() => setIsAddingDetail(!isAddingDetail)} className="text-[10px] font-black uppercase bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-[6px] transition-colors flex items-center gap-1 cursor-pointer"><Plus className="w-3 h-3" /> Add Detail</button>
      </div>

      {isAddingDetail && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[8px] p-2 mb-2 flex flex-col gap-2">
          <input type="text" placeholder="Title..." value={newDetailKey} onChange={(e) => setNewDetailKey(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400" />
          <input type="text" placeholder="Content..." value={newDetailValue} onChange={(e) => setNewDetailValue(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none placeholder:text-slate-400" />
          <button onClick={onAdd} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase py-1.5 rounded-[6px] transition-colors mt-0.5 cursor-pointer">Save Detail</button>
        </div>
      )}

      {(lead.details && lead.details !== '[]') ? (
        <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-2 rounded-[8px] space-y-2 max-h-[200px] overflow-y-auto no-scrollbar">
          {JSON.parse(lead.details).map((it: any, index: number) => (
            <div key={index} className="flex items-start justify-between group p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{it.key}</span>
                <span className="text-xs text-slate-900 dark:text-slate-200 font-bold">{it.value}</span>
              </div>
              <button onClick={() => onRemove(index)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-all shrink-0 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] p-4 text-center">
          <span className="text-[10px] font-black uppercase text-slate-400 gap-2 flex items-center justify-center"><Hash className="w-3 h-3" /> No additional details yet.</span>
        </div>
      )}
    </div>
  );
}
