"use client";
/**
 * @file /app/modules/leads/components/DetailsPersonalModule.tsx
 * @purpose Renders the personal overview (budget, locale) for a lead.
 */

import React from 'react';
import { Globe, Wallet, Check, Flag, MapPin } from 'lucide-react';

interface DetailsPersonalModuleProps {
  lead: any;
  isEditingBudget: boolean;
  setIsEditingBudget: (v: boolean) => void;
  budgetValue: string;
  setBudgetValue: (v: string) => void;
  onBudgetSave: () => void;
}

export default function DetailsPersonalModule({
  lead, isEditingBudget, setIsEditingBudget, budgetValue, setBudgetValue, onBudgetSave
}: DetailsPersonalModuleProps) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Globe className="w-3 h-3" /> Personal Overview</span>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 text-left">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5 whitespace-nowrap">Exp. Budget</span>
          <div className="flex items-center gap-2">
            <Wallet className="w-3 h-3 text-indigo-500 shrink-0" />
            {isEditingBudget ? (
              <div className="flex items-center gap-1 w-full max-w-[80px]">
                <input type="number" value={budgetValue} onChange={(e) => setBudgetValue(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:outline-none" autoFocus />
                <button onClick={onBudgetSave} className="p-0.5 bg-indigo-600 rounded text-white hover:bg-indigo-700"><Check className="w-2.5 h-2.5" /></button>
              </div>
            ) : (
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer" onClick={() => setIsEditingBudget(true)}>${lead.value.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 text-left">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Language</span>
          <div className="flex items-center gap-2">
            <Flag className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{lead.lang || 'English'}</span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[8px] px-3 py-2 text-left">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Country</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{lead.country || 'Worldwide'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
