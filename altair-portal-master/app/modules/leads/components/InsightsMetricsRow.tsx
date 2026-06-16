"use client";
/**
 * @file /app/modules/leads/components/InsightsMetricsRow.tsx
 * @purpose Renders the additional metrics row (Value, Avg Size, Source) for leads insights.
 */

import React from 'react';

interface InsightsMetricsRowProps {
  totalValue: number;
  avgValue: number;
  topSource: string;
}

export default function InsightsMetricsRow({
  totalValue, avgValue, topSource
}: InsightsMetricsRowProps) {
  const metrics = [
    { label: 'Total Pipeline Value', val: `$${totalValue.toLocaleString()}`, border: 'border-t-indigo-500', text: 'text-indigo-600' },
    { label: 'Average Deal Size', val: `$${avgValue.toLocaleString()}`, border: 'border-t-violet-500', text: 'text-violet-600' },
    { label: 'Top Lead Source', val: topSource, border: 'border-t-emerald-500', text: 'text-emerald-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      {metrics.map((m, i) => (
        <div key={i} className={`border border-slate-100 dark:border-slate-800 rounded-[10px] p-4 bg-white dark:bg-slate-900 border-t-[3px] ${m.border}`}>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{m.label}</span>
          <span className={`text-xl md:text-2xl font-black ${m.text} dark:text-slate-200 truncate block`}>{m.val}</span>
        </div>
      ))}
    </div>
  );
}
