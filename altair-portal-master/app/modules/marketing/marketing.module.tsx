"use client";
'use client';

/**
 * @file /app/modules/marketing/marketing.module.tsx
 * @purpose Main entry point for the Marketing Hub, managing tabs and layouts.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, LayoutDashboard, Target, Calendar, DollarSign, Library, Flame
} from 'lucide-react';

// Sub-components
import MarketingDashboardTab from './components/MarketingDashboardTab';
import MarketingPlanningTab from './components/MarketingPlanningTab';
import MarketingCalendarTab from './components/MarketingCalendarTab';
import MarketingBudgetTab from './components/MarketingBudgetTab';
import MarketingSwipeFilesTab from './components/MarketingSwipeFilesTab';

export default function MarketingModule() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planning', label: 'Campaign Planning', icon: Target },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'swipe-files', label: 'Swipe Files', icon: Library },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-1 md:p-2 bg-slate-50/30">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 text-left">
        <div className="flex justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-500 tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" /> Marketing Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1">Plan, execute, and track your inbound campaigns.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95">
            <Plus className="w-4 h-4" /> Create Asset
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-px no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap uppercase tracking-wider ${
                  isActive ? 'border-orange-500 text-orange-600 bg-orange-50/50 rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Tab Content Areas */}
      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <MarketingDashboardTab />}
          {activeTab === 'planning' && <MarketingPlanningTab />}
          {activeTab === 'calendar' && <MarketingCalendarTab />}
          {activeTab === 'budget' && <MarketingBudgetTab />}
          {activeTab === 'swipe-files' && <MarketingSwipeFilesTab />}
        </AnimatePresence>
      </div>
    </div>
  );
}
