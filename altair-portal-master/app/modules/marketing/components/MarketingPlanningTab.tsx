"use client";
/**
 * @file /app/modules/marketing/components/MarketingPlanningTab.tsx
 * @purpose Renders the campaign planning kanban board.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { containerVariants, itemVariants, planningColumns } from '../marketingConstants';

export default function MarketingPlanningTab() {
  return (
    <motion.div key="planning" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="flex gap-6 overflow-x-auto pb-4 h-[600px] text-left">
      {planningColumns.map((col, idx) => (
        <motion.div key={idx} variants={itemVariants} className="min-w-[280px] flex-1 bg-slate-100/50 rounded-xl border border-slate-200 p-3 flex flex-col">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-slate-700 text-sm">{col.title} <span className="text-slate-400 ml-1 text-xs font-medium">({col.items.length})</span></h3>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
            {col.items.map((item, i) => (
              <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-grab hover:border-orange-300 transition-all hover:shadow-md">
                <p className="font-bold text-slate-800 text-xs mb-2 leading-relaxed">{item}</p>
                <div className="flex items-center justify-between">
                   <div className="flex -space-x-2">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${item}&backgroundColor=ffedd5&textColor=ea580c`} alt="avatar" className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                   </div>
                   <span className="text-[9px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">Marketing</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
