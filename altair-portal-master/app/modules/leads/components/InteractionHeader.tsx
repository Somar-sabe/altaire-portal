"use client";
/**
 * @file /app/modules/leads/components/InteractionHeader.tsx
 * @description Header for the interaction modal.
 * @dependencies react, lucide-react
 * @workplan WP-030
 */
import React from 'react';
import { LrmLead } from '../store';
import { X, BellRing } from 'lucide-react';
import { STAGE_LABELS } from '../constants';

interface InteractionHeaderProps {
  lead: LrmLead;
  STAGE_OPTIONS: string[];
  QUALITY_OPTIONS: string[];
  handleQuickTask: () => void;
  handleStageChangeInHeader: (newStage: string) => void;
  handleQualityChangeInHeader: (newQuality: string) => void;
  onClose: () => void;
}

export default function InteractionHeader({
  lead, STAGE_OPTIONS, QUALITY_OPTIONS, handleQuickTask, handleStageChangeInHeader, handleQualityChangeInHeader, onClose
}: InteractionHeaderProps) {
  return (
    <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 bg-white dark:bg-slate-900 shrink-0 relative z-10" id="interaction-header">
      {/* Top Row: Name, ID, Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap h-[32px]">
          <h2 className="text-lg font-black text-slate-950 dark:text-slate-50 tracking-tight uppercase leading-none">
            {lead.name}
          </h2>
          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-custom-gray text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-[4px] font-bold">
            #{lead.id.substring(0, 8).toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-2 h-[32px]">
           <button 
             onClick={handleQuickTask}
             className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 rounded-[8px] text-xs font-black px-3 py-1 transition-colors cursor-pointer hidden md:flex items-center gap-1.5 h-full"
             title="Create quick reminder for tomorrow"
           >
             <BellRing className="w-4 h-4" /> 
             <span>Quick Task</span>
           </button>
           <button
             onClick={onClose}
             className="flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-[8px] px-2.5 h-full transition-colors cursor-pointer shrink-0"
             title="Close Dialog"
           >
             <X className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Bottom Row: Stage and Quality vs Source */}
      <div className="flex items-center justify-between flex-wrap w-full gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800/80 rounded-[8px] px-2 py-1">
             <span className="text-xs md:text-sm font-black uppercase text-slate-400 tracking-wider">Stage:</span>
             <select
               value={lead.stage}
               onChange={(e) => handleStageChangeInHeader(e.target.value)}
               className="bg-transparent text-xs md:text-sm font-black text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
             >
               {STAGE_OPTIONS.map((stg) => (
                 <option key={stg} value={stg}>{STAGE_LABELS[stg] || stg}</option>
               ))}
             </select>
          </div>
          
          <div className="flex items-center gap-1 bg-emerald-50/50 hover:bg-emerald-100/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/80 rounded-[8px] px-2 py-1">
             <span className="text-xs md:text-sm font-black uppercase text-emerald-500/80 tracking-wider">Quality:</span>
             <select
               value={(lead.tags || [])[0] || 'Unassigned'}
               onChange={(e) => handleQualityChangeInHeader(e.target.value)}
               className="bg-transparent text-xs md:text-sm font-black text-emerald-700 dark:text-emerald-400 focus:outline-none cursor-pointer"
             >
               {QUALITY_OPTIONS.map((q) => (
                 <option key={q} value={q}>{q}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1">
           <span className="text-xs md:text-sm font-black uppercase text-slate-400 tracking-wider">Source: <span className="text-slate-700 dark:text-slate-300 ml-1">{lead.source || 'Unknown'}</span></span>
        </div>
      </div>
    </header>
  );
}
