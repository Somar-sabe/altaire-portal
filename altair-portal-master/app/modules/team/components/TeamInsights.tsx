"use client";
/**
 * @file /app/modules/team/components/TeamInsights.tsx
 * @purpose Renders the right sidebar with AI insights about the team with interactive unit test diagnostic controls.
 */

'use client';

import React from "react";
import { Sparkles, ShieldAlert, Activity, TrendingUp } from "lucide-react";

export default function TeamInsights() {

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
        <Sparkles className="w-5 h-5 text-slate-750 dark:text-emerald-450" />
        <h2 className="text-base font-bold tracking-tight">AI Insights</h2>
      </div>

      <div className="space-y-4 flex-1">
        {/* Insight Card 1 */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-[10px] p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Security Notice
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                Tyler Durden accessed from a new IP in London. Access level
                verified, but marked for monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Insight Card 2 */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-[10px] p-4">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                High Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                Sales team activity is up 14% this week. Elena Rostov is leading
                with 45 conversions.
              </p>
            </div>
          </div>
        </div>

        {/* Insight Card 3 */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-[10px] p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Optimization Suggestion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                Consider scaling support team coverage during EU morning hours
                based on recent ticket trends.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
