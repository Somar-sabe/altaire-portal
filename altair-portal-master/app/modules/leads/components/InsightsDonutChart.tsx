"use client";
/**
 * @file /app/modules/leads/components/InsightsDonutChart.tsx
 * @purpose Renders the stage classification donut chart for leads insights.
 */

import React from 'react';

interface InsightsDonutChartProps {
  totalCount: number;
  stageStats: any;
}

export default function InsightsDonutChart({ totalCount, stageStats }: InsightsDonutChartProps) {
  const pFeed = stageStats.feedbackReq.percentage;
  const pProg = stageStats.inProgress.percentage;
  const pCont = stageStats.contacted.percentage;
  const pNoAns = stageStats.noAnswer.percentage;
  const pNew = stageStats.newCold.percentage;

  const offsetFeed = 0;
  const offsetProg = -pFeed;
  const offsetCont = -(pFeed + pProg);
  const offsetNoAns = -(pFeed + pProg + pCont);
  const offsetNew = -(pFeed + pProg + pCont + pNoAns);

  const segments = [
    { label: 'Feedback Req.', percentage: pFeed, color: 'bg-emerald-500', stroke: '#10b981', offset: offsetFeed },
    { label: 'In Progress', percentage: pProg, color: 'bg-violet-500', stroke: '#8b5cf6', offset: offsetProg },
    { label: 'Contacted', percentage: pCont, color: 'bg-blue-500', stroke: '#3b82f6', offset: offsetCont },
    { label: 'No Answer', percentage: pNoAns, color: 'bg-orange-500', stroke: '#f97316', offset: offsetNoAns },
    { label: 'New / Cold', percentage: pNew, color: 'bg-slate-400', stroke: '#94a3b8', offset: offsetNew },
  ];

  return (
    <div className="lg:col-span-4 flex flex-col justify-between h-full bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-[10px] border border-slate-100 dark:border-slate-850 text-left">
      <span className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-300 tracking-widest block mb-4">Stage Classification</span>

      <div className="flex flex-row items-center justify-center gap-10 mt-2 px-2 pb-2">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3.2" />
            {segments.map((s, i) => (
              <circle key={i} cx="18" cy="18" r="15.915" fill="none" stroke={s.stroke} strokeWidth="3.2" strokeDasharray={`${s.percentage} ${100 - s.percentage}`} strokeDashoffset={s.offset} />
            ))}
          </svg>
          <div className="absolute text-center flex flex-col">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-50 leading-none">{totalCount}</span>
            <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mt-1 pt-1 border-t border-slate-200 dark:border-slate-800">Total</span>
          </div>
        </div>

        <div className="space-y-1.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${s.color} inline-block`} />{s.label}</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
