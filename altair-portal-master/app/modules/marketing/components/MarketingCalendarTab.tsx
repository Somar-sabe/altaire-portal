"use client";
/**
 * @file /app/modules/marketing/components/MarketingCalendarTab.tsx
 * @purpose Renders the marketing content calendar view.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { containerVariants } from '../marketingConstants';

export default function MarketingCalendarTab() {
  return (
    <motion.div key="calendar" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px] text-left">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">October 2026</h3>
        <div className="flex gap-2">
          {['Today', 'Month', 'Week'].map(t => (
            <button key={t} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 rounded-[6px] shadow-xs hover:bg-slate-50 transition-colors ${t === 'Month' ? 'text-orange-600 border-orange-200' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 flex items-center justify-center flex-col text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">Content Calendar Engine</p>
        <p className="text-[11px] font-medium mt-2 max-w-xs text-center leading-relaxed text-slate-400">Full content calendar visualization will render here. Connects with HubSpot / Social Media schedules.</p>
      </div>
    </motion.div>
  );
}
