"use client";
/**
 * @file /app/modules/settings/components/WorkspaceForm.tsx
 * @description Workspace settings and custom sub-domains configuration page.
 *
 * @dependencies
 * - react
 *
 * @relatedFiles
 * - /app/modules/settings/SettingsModule.tsx
 *
 * @exports
 * - WorkspaceForm
 *
 * @lastModified 2026-05-25
 * @workplan WP-008
 */

'use client';

import React from 'react';

export function WorkspaceForm() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Workspace Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-450 mt-1">Manage organization wide permissions and properties.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Company Name</label>
          <input 
            type="text" 
            defaultValue="Acme Corp" 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Base Domain</label>
          <div className="flex rounded-[10px] overflow-hidden border border-slate-200 dark:border-slate-700">
            <span className="bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-755 leading-normal shrink-0">
              https://
            </span>
            <input 
              type="text" 
              defaultValue="acme.altair.io" 
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:outline-none flex-1" 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/85 flex justify-end">
          <button className="w-full sm:w-auto bg-black dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-[10px] text-xs font-bold shadow-sm transition-colors cursor-pointer">
            Save Context
          </button>
        </div>
      </div>
    </div>
  );
}
