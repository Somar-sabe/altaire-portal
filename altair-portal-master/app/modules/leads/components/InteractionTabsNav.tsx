"use client";
/**
 * @file /app/modules/leads/components/InteractionTabsNav.tsx
 * @purpose Renders the tab navigation for the lead interaction modal.
 */

import React from 'react';

interface InteractionTabsNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isMobile?: boolean;
}

export default function InteractionTabsNav({ activeTab, setActiveTab, isMobile }: InteractionTabsNavProps) {
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'notes', label: 'Agent Notes' },
    { id: 'projects', label: 'Sent Projects' }
  ];

  if (isMobile) {
    return (
      <div className="flex md:hidden items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
        {tabs.map(tab => (
          <button 
            key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === tab.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-500'}`}
          >
            {tab.label.split(' ')[tab.label.split(' ').length - 1]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
      {tabs.filter(t => t.id !== 'details').map(tab => (
        <button 
          key={tab.id} onClick={() => setActiveTab(tab.id)} 
          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === tab.id || (tab.id === 'notes' && activeTab === 'details') ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:bg-slate-50 border-b-2 border-transparent'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
