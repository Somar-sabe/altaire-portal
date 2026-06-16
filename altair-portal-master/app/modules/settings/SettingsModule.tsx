"use client";
/**
 * @file /app/modules/settings/SettingsModule.tsx
 * @description Central system settings dashboard tab managing responsive panel tabs and dark/light modes.
 *
 * @dependencies
 * - react
 * - lucide-react: Shield, Bell, User, Building2
 * - /app/modules/team/authStore: currentUser getter
 *
 * @relatedFiles
 * - /app/modules/settings/components/AccountForm.tsx: Child panel
 * - /app/modules/settings/components/SecurityForm.tsx: Child panel
 * - /app/modules/settings/components/WorkspaceForm.tsx: Child panel
 * - /app/modules/settings/components/NotificationsForm.tsx: Child panel
 *
 * @exports
 * - SettingsModule (default)
 *
 * @lastModified 2026-05-25
 * @workplan WP-008
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Bell, User, Building2 } from 'lucide-react';
import { useAuthStore } from '../team/authStore';

// Modular child components
import { AccountForm } from './components/AccountForm';
import { SecurityForm } from './components/SecurityForm';
import { WorkspaceForm } from './components/WorkspaceForm';
import { NotificationsForm } from './components/NotificationsForm';

export default function SettingsModule() {
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications' | 'workspace'>('account');
  const currentUser = useAuthStore(s => s.currentUser);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('altair_theme') as 'light' | 'dark') || 'light';
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('altair_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 md:bg-white/50 dark:md:bg-slate-900/40 border-0 md:border md:border-slate-200/60 dark:md:border-slate-800 rounded-none md:rounded-[10px] shadow-none md:shadow-xs min-h-0 relative transition-colors duration-200">
      
      {/* Desktop Header */}
      <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 sticky top-0 z-10 hidden md:block">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage infrastructure, security, and personal preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
        
        {/* Settings Sidebar (Desktop) */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/85 bg-slate-50/50 dark:bg-slate-950/20 p-4 shrink-0 overflow-y-auto hidden md:block">
          <nav className="flex md:flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors w-full cursor-pointer ${
                activeTab === 'account' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Account Details
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors w-full cursor-pointer ${
                activeTab === 'security' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" /> Security & Access
            </button>
            <button 
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors w-full cursor-pointer ${
                activeTab === 'workspace' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" /> Organization
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors w-full cursor-pointer ${
                activeTab === 'notifications' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700/60' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" /> Notifications
            </button>
          </nav>
        </div>

        {/* Mobile Tab Scroller */}
        <div className="md:hidden w-full overflow-x-auto border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 px-4 py-3 shrink-0 no-scrollbar">
           <div className="flex space-x-2">
             {[
               { id: 'account' as const, label: 'Account' },
               { id: 'security' as const, label: 'Security' },
               { id: 'workspace' as const, label: 'Organization' },
               { id: 'notifications' as const, label: 'Notifications' }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                   activeTab === tab.id
                     ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-sm'
                     : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                 }`}
               >
                 {tab.label}
               </button>
             ))}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900 min-h-[400px]">
          <div className="max-w-2xl mx-auto">
            {activeTab === 'account' && (
              <AccountForm currentUser={currentUser} theme={theme} onThemeChange={handleThemeChange} />
            )}
            {activeTab === 'security' && (
              <SecurityForm />
            )}
            {activeTab === 'workspace' && (
              <WorkspaceForm />
            )}
            {activeTab === 'notifications' && (
              <NotificationsForm />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
