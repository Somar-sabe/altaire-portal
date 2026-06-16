/**
 * @file /app/modules/leads/components/LeadsInsights.tsx
 * @purpose Main component for real-time dynamic CRM pipeline intelligence.
 */
'use client';

import React from 'react';
import { useLeadsStore } from '../store';
import { calculateInsights } from '../utils/insightsAlgorithm';
import { Sparkles } from 'lucide-react';

// Sub-components
import InsightsDonutChart from './InsightsDonutChart';
import InsightsAlertSection from './InsightsAlertSection';
import InsightsMetricsRow from './InsightsMetricsRow';

export default function LeadsInsights() {
  const { leads } = useLeadsStore();
  const insights = calculateInsights(leads);
  const { totalCount, stageStats, highValueAlert, conversionAlert, docAlert, totalPipelineValue, averageLeadValue, topLeadSource } = insights;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[12px] p-6 mb-6 shadow-sm flex flex-col justify-between" id="leads-insights-container">
      <header className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5 text-left">
        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center border border-violet-200/20"><Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
        <div>
          <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">CogniAI Pipeline Engine</span>
          <h2 className="text-sm font-black text-slate-900 dark:text-slate-50 uppercase tracking-wider">Leads Insights</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <InsightsDonutChart totalCount={totalCount} stageStats={stageStats} />
        <div className="lg:col-span-8 space-y-4">
          <InsightsAlertSection highValueAlert={highValueAlert} conversionAlert={conversionAlert} docAlert={docAlert} />
          <InsightsMetricsRow totalValue={totalPipelineValue} avgValue={averageLeadValue} topSource={topLeadSource} />
        </div>
      </div>

      <footer className="flex items-center justify-between flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Report Generated: Live Data Feed</span>
        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Analyzed {totalCount} Pipelines
        </span>
      </footer>
    </div>
  );
}
