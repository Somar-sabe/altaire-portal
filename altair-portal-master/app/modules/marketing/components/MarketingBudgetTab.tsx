"use client";
/**
 * @file /app/modules/marketing/components/MarketingBudgetTab.tsx
 * @purpose Renders the marketing budget allocation table.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { containerVariants, budgetData } from '../marketingConstants';

export default function MarketingBudgetTab() {
  return (
    <motion.div key="budget" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-6 text-left">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Q4 Budget Allocation</h3>
          <button className="flex items-center gap-1.5 text-xs text-indigo-600 font-black hover:text-indigo-800 uppercase tracking-wider transition-colors"><DollarSign className="w-3.5 h-3.5"/> Add Funds</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="py-3 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</th>
                <th className="py-3 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocated</th>
                <th className="py-3 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Spent</th>
                <th className="py-3 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</th>
                <th className="py-3 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. ROI</th>
                <th className="py-3 px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgetData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-5 text-sm font-bold text-slate-800">{row.channel}</td>
                  <td className="py-4 px-5 text-sm font-medium text-slate-600">{row.allocated}</td>
                  <td className="py-4 px-5 text-sm font-bold text-slate-800">{row.spent}</td>
                  <td className={`py-4 px-5 text-sm font-black ${row.remaining.includes('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{row.remaining}</td>
                  <td className="py-4 px-5 text-sm font-bold text-indigo-600 bg-indigo-50/30">{row.roi}</td>
                  <td className="py-4 px-5 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border 
                      ${row.status === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        row.status === 'Over Budget' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                        'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
