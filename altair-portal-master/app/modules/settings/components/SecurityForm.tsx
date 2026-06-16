"use client";
/**
 * @file /app/modules/settings/components/SecurityForm.tsx
 * @description Security details and active session preferences settings panel.
 *
 * @dependencies
 * - react
 * - lucide-react: Key icon
 *
 * @relatedFiles
 * - /app/modules/settings/SettingsModule.tsx
 *
 * @exports
 * - SecurityForm
 *
 * @lastModified 2026-05-25
 * @workplan WP-008
 */

'use client';

import React from 'react';
import { Key } from 'lucide-react';

export function SecurityForm() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security Preferences</h2>
        <p className="text-sm text-slate-500 dark:text-slate-450 mt-1">Manage your passwords and session boundaries.</p>
      </div>

      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-[12px] p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0">
              <Key className="w-4.5 h-4.5 text-slate-600 dark:text-slate-350" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Password</div>
              <div className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">Last changed 3 months ago</div>
            </div>
          </div>
          <button className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-250 text-xs font-bold rounded-[8px] transition-colors shrink-0 cursor-pointer text-center">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
