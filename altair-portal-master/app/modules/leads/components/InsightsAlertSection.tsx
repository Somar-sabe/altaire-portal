"use client";
/**
 * @file /app/modules/leads/components/InsightsAlertSection.tsx
 * @purpose Renders the analytical and risk alerts section for leads insights.
 */

import React from 'react';
import { AlertCircle, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';

interface InsightsAlertSectionProps {
  highValueAlert: any;
  conversionAlert: any;
  docAlert: any;
}

export default function InsightsAlertSection({
  highValueAlert, conversionAlert, docAlert
}: InsightsAlertSectionProps) {
  return (
    <div className="lg:col-span-8 space-y-4">
      {/* High Value Alert */}
      <div className="border border-amber-200 bg-amber-500/5 rounded-[10px] p-4 flex items-start gap-4 text-left">
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
        <div className="flex-grow space-y-3">
          <div>
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">Cognitive Alert: High Value At Risk</span>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-350 leading-relaxed mt-1">{highValueAlert ? highValueAlert.desc : 'No major deal metrics currently at risk within active stages.'}</p>
          </div>
          {highValueAlert && (
            <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-slate-850 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm">
              <span>Draft Email</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conversion Target */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-[10px] p-4 flex gap-3 bg-slate-50/20 dark:bg-slate-950/20 text-left">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/20 flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
          <div className="flex-grow space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Target</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded tracking-tighter">{conversionAlert ? `+${conversionAlert.percentage}%` : 'Stable'}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-350 leading-normal">{conversionAlert ? conversionAlert.desc : 'All conversion protocols indicate normal activity.'}</p>
          </div>
        </div>

        {/* Documentation Alert */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-[10px] p-4 flex gap-3 bg-slate-50/20 dark:bg-slate-950/20 text-left">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center shrink-0"><CheckCircle className="w-4 h-4 text-blue-600" /></div>
          <div className="flex-grow space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documentation</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 text-blue-700 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded cursor-pointer transition-colors uppercase tracking-widest">{docAlert ? docAlert.actionTag : 'Healthy'}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-350 leading-normal">{docAlert ? docAlert.desc : 'Essential profiles are completely in sync.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
