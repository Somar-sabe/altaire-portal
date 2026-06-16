"use client";
/**
 * @file /app/modules/overview/components/MonthlyOverviewChart.tsx
 * @purpose Renders a smooth curve chart for monthly deals overview.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface MonthlyOverviewChartProps {
  itemVariants: any;
}

export default function MonthlyOverviewChart({ itemVariants }: MonthlyOverviewChartProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-sm">Monthly Deals Overview</h3>
        <div className="flex text-xs border border-slate-200 rounded-md overflow-hidden">
          <button className="px-2 py-1 text-slate-500">Week</button>
          <button className="px-2 py-1 text-indigo-600 font-semibold border-indigo-200 bg-indigo-50/50">Month</button>
          <button className="px-2 py-1 text-slate-500">Year</button>
        </div>
      </div>
      <div className="h-48 relative flex items-end">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 pb-6">
          <span>600</span><span>500</span><span>400</span><span>300</span><span>200</span><span>100</span>
        </div>
        <div className="w-full h-full ml-6 relative">
          <svg viewBox="0 0 400 150" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
            <path d="M0,130 C40,90 60,110 100,100 C140,90 150,20 200,80 C230,120 250,130 300,70 C350,10 380,80 400,20 L400,150 L0,150 Z" fill="url(#purpleGradient)" opacity="0.3" />
            <path d="M0,130 C40,90 60,110 100,100 C140,90 150,20 200,80 C230,120 250,130 300,70 C350,10 380,80 400,20" fill="none" stroke="#8b5cf6" strokeWidth="3" />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
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
