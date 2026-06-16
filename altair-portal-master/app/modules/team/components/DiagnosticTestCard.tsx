"use client";
/**
 * @file /app/modules/team/components/DiagnosticTestCard.tsx
 * @purpose Renders an individual test case card with its status and logs.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import type { TestResult } from '../hooks/useDiagnosticsFlow';

interface DiagnosticTestCardProps {
  test: TestResult;
  onRun: () => void;
}

export default function DiagnosticTestCard({ test, onRun }: DiagnosticTestCardProps) {
  return (
    <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 p-4 rounded-[12px] space-y-3 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            {test.name}
            {test.executionTime !== undefined && (
              <span className="text-xs font-mono text-slate-400 px-1 border border-slate-100 dark:border-slate-800 rounded">{test.executionTime}ms</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-normal font-medium">{test.description}</div>
        </div>

        <div>
          {test.status === 'passed' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Passed
            </span>
          )}
          {test.status === 'failed' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-150 dark:border-rose-900/50 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Failed
            </span>
          )}
          {test.status === 'running' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-150 dark:border-amber-900/50 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> In Progress
            </span>
          )}
          {test.status === 'idle' && (
            <button onClick={onRun} className="px-2.5 py-1 rounded-[6px] text-xs font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">Run</button>
          )}
        </div>
      </div>

      {test.log.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-[8px] font-mono text-[10px] leading-relaxed text-slate-550 dark:text-slate-400 border border-slate-100 dark:border-slate-800 max-h-32 overflow-y-auto no-scrollbar">
          {test.log.map((line, idx) => (
            <div key={idx} className={line.startsWith('❌') ? 'text-rose-500' : line.startsWith('✓') ? 'text-emerald-500 font-bold' : ''}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
