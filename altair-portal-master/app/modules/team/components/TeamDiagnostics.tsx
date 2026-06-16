"use client";
/**
 * @file /app/modules/team/components/TeamDiagnostics.tsx
 * @purpose Interactive visual unit test suite and diagnostics panel for the Team and Users module.
 */

'use client';

import React from 'react';
import { Shield, X, RefreshCw, Play } from 'lucide-react';

// Sub-components
import DiagnosticTestCard from './DiagnosticTestCard';

// Hooks
import { useDiagnosticsFlow } from '../hooks/useDiagnosticsFlow';

export default function TeamDiagnostics({ onClose }: { onClose: () => void }) {
  const { tests, isRunningAll, runTest, runAllTests } = useDiagnosticsFlow();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[16px] w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">Team & Users Test Suite</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5 font-medium uppercase tracking-wider">Phase 4 Visual Diagnostics</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-755 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 p-4 rounded-[12px] flex items-center justify-between gap-4 text-left">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Continuous Integration Diagnostics</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">Runs unit mock assertions verifying boundary constraints and hierarchical locks.</p>
            </div>
            <button onClick={runAllTests} disabled={isRunningAll} className="px-4 py-2 bg-slate-950 dark:bg-emerald-600 hover:bg-slate-850 dark:hover:bg-emerald-700 disabled:bg-slate-250 text-white text-[11px] font-bold rounded-[8px] flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs transition-colors">
              {isRunningAll ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running...</> : <><Play className="w-3.5 h-3.5 fill-current" /> Run All Tests</>}
            </button>
          </div>

          <div className="space-y-4">
            {tests.map(test => (
              <DiagnosticTestCard key={test.id} test={test} onRun={() => runTest(test.id)} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/10 flex justify-end">
          <button type="button" onClick={onClose} className="bg-black dark:bg-slate-850 text-white dark:text-slate-300 md:hover:bg-slate-800 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-[8px] text-xs font-bold transition-all cursor-pointer shadow-sm">Close Suite</button>
        </div>
      </div>
    </div>
  );
}
