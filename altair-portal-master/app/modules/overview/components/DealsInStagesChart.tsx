"use client";
/**
 * @file /app/modules/overview/components/DealsInStagesChart.tsx
 * @purpose Renders a bar chart showing deals distributed by stages.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DealsInStagesChartProps {
  stagesCount: Record<string, number>;
  maxStageCount: number;
  itemVariants: any;
}

export default function DealsInStagesChart({
  stagesCount,
  maxStageCount,
  itemVariants,
}: DealsInStagesChartProps) {
  const [timeframe, setTimeframe] = useState('Week');

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 text-sm">Deals in stages</h3>
        <div className="flex text-xs border border-slate-200 rounded-md overflow-hidden">
          {['Week', 'Month', 'Year'].map(t => (
            <button 
              key={t} 
              onClick={() => setTimeframe(t)} 
              className={`px-2 py-1 ${timeframe === t ? 'text-indigo-600 font-semibold border-indigo-200 bg-indigo-50/50' : 'text-slate-500'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-end gap-3 h-48 pl-8 relative">
        {/* Y-axis mock */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 py-2">
          <span>{maxStageCount}</span>
          <span>{Math.round(maxStageCount*0.8)}</span>
          <span>{Math.round(maxStageCount*0.6)}</span>
          <span>{Math.round(maxStageCount*0.4)}</span>
          <span>{Math.round(maxStageCount*0.2)}</span>
          <span>0</span>
        </div>
        {/* Dynamic Bars */}
        <div className="w-6 bg-purple-200 rounded-t-sm transition-all duration-500" style={{ height: `${Math.max(5, (stagesCount['Negotiation'] / maxStageCount) * 100)}%` }}></div>
        <div className="w-6 bg-pink-200 rounded-t-sm transition-all duration-500" style={{ height: `${Math.max(5, (stagesCount['Contract'] / maxStageCount) * 100)}%` }}></div>
        <div className="w-6 bg-blue-100 rounded-t-sm transition-all duration-500" style={{ height: `${Math.max(5, (stagesCount['Qualified'] / maxStageCount) * 100)}%` }}></div>
        <div className="w-6 bg-orange-100 rounded-t-sm transition-all duration-500" style={{ height: `${Math.max(5, (stagesCount['Demo Scheduled'] / maxStageCount) * 100)}%` }}></div>
        
        {/* Legend */}
        <div className="absolute right-0 top-10 flex flex-col gap-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-200 rounded-sm"></div> Negotiation Started</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-200 rounded-sm"></div> Contract Made</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-100 rounded-sm"></div> Qualified</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-100 rounded-sm"></div> Demo Scheduled</div>
        </div>
      </div>
    </motion.div>
  );
}
