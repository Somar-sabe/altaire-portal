"use client";
/**
 * @file /app/modules/settings/components/AccountForm.tsx
 * @description Account details management form with fully supported responsive design and dark mode themes.
 *
 * @dependencies
 * - react
 * - lucide-react: Sun, Moon icons
 *
 * @relatedFiles
 * - /app/modules/settings/SettingsModule.tsx: Parent container
 *
 * @exports
 * - AccountForm
 *
 * @lastModified 2026-05-25
 * @workplan WP-008
 */

'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { TeamUser } from '../../team/types';

interface AccountFormProps {
  currentUser: TeamUser;
  theme: 'light' | 'dark';
  onThemeChange: (newTheme: 'light' | 'dark') => void;
}

export function AccountForm({ currentUser, theme, onThemeChange }: AccountFormProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
        <p className="text-sm text-slate-500 dark:text-slate-450 mt-1">Update your email and basic details.</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">First Name</label>
            <input 
              type="text" 
              defaultValue={currentUser.firstName} 
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Last Name</label>
            <input 
              type="text" 
              defaultValue={currentUser.lastName} 
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all" 
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">Email Address</label>
          <input 
            type="email" 
            defaultValue={currentUser.email} 
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all" 
          />
        </div>
        
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/85">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Interface Theme</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 mb-4 font-medium">Choose how the Altair platform looks to you.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => onThemeChange('light')}
              className={`p-4 rounded-[12px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                theme === 'light' 
                  ? 'border-emerald-500 bg-emerald-50/5 dark:bg-emerald-500/5 ring-2 ring-emerald-500/10' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className={`w-5 h-5 mt-0.5 shrink-0 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Light Mode</div>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-medium leading-normal">Clean, elegant high-contrast administration layout.</p>
              </div>
            </button>

            <button 
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`p-4 rounded-[12px] border text-left transition-all flex items-start gap-3 cursor-pointer ${
                theme === 'dark' 
                  ? 'border-slate-900 bg-slate-950 text-white ring-2 ring-white/10' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className={`w-5 h-5 mt-0.5 shrink-0 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Mode</div>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-medium leading-normal">Immersive, dark cosmic interface with soft shadows.</p>
              </div>
            </button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/85 flex justify-end">
          <button className="w-full sm:w-auto bg-black dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-[10px] text-xs font-bold shadow-sm transition-colors cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
