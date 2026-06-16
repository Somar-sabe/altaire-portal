"use client";
/**
 * @file /app/modules/overview/components/RevenueWonChart.tsx
 * @purpose Renders a bar chart showing revenue won over time.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface RevenueWonChartProps {
  revenueMonths: number[];
  maxRev: number;
  itemVariants: any;
}

export default function RevenueWonChart({
  revenueMonths,
  maxRev,
  itemVariants,
}: RevenueWonChartProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-sm">Revenue Won</h3>
        <div className="flex text-xs border border-slate-200 rounded-md overflow-hidden">
          {['Week', 'Month', 'Year'].map(t => (
            <button 
              key={t} 
              className={`px-2 py-1 ${t === 'Month' ? 'text-indigo-600 font-semibold border-indigo-200 bg-indigo-50/50' : 'text-slate-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56 relative flex items-end">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 pb-6 w-10">
          <span>${maxRev}</span>
          <span>${Math.round(maxRev * 0.8)}</span>
          <span>${Math.round(maxRev * 0.6)}</span>
          <span>${Math.round(maxRev * 0.4)}</span>
          <span>${Math.round(maxRev * 0.2)}</span>
          <span>$0</span>
        </div>
        <div className="flex-1 ml-10 h-full flex items-end justify-between pb-6 relative">
           {revenueMonths.map((val, i) => (
              <div 
                key={i} 
                className="w-4 bg-purple-200 hover:bg-purple-400 transition-all duration-500 rounded-sm group relative" 
                style={{ height: `${Math.max(5, (val / maxRev) * 100)}%` }}
              >
                {val > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${val}
                  </div>
                )}
              </div>
           ))}
           <div className="absolute -bottom-1 left-0 right-0 flex justify-between text-[10px] text-slate-400">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
}
