"use client";
/**
 * @file /app/modules/marketing/components/MarketingDashboardTab.tsx
 * @purpose Renders the marketing dashboard with KPIs and live campaigns.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { containerVariants, itemVariants, campaigns } from '../marketingConstants';

export default function MarketingDashboardTab() {
  const metrics = [
    { label: 'Total Sessions', value: '45.2k', trend: '+12%', color: 'from-blue-500/10 to-cyan-500/10', text: 'text-blue-600' },
    { label: 'New Leads', value: '1,248', trend: '+8%', color: 'from-orange-500/10 to-rose-500/10', text: 'text-orange-600' },
    { label: 'Avg Cost Per Lead', value: '$12.40', trend: '-4%', color: 'from-emerald-500/10 to-teal-500/10', text: 'text-emerald-600' },
    { label: 'Marketing ROI', value: '284%', trend: '+24%', color: 'from-purple-500/10 to-pink-500/10', text: 'text-purple-600' },
  ];

  return (
    <motion.div key="dashboard" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }} className="space-y-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div key={i} variants={itemVariants} className={`p-5 rounded-xl border border-slate-200 bg-gradient-to-br ${metric.color} bg-white shadow-sm`}>
            <p className="text-sm font-medium text-slate-600 mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold ${metric.text}`}>{metric.value}</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{metric.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="font-bold text-slate-800 text-lg mt-4 mb-2">Live Campaigns</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {campaigns.map((camp) => {
          const Icon = camp.icon;
          return (
            <motion.div key={camp.id} variants={itemVariants} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <div className={`p-2.5 rounded-lg shrink-0 ${camp.color}`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{camp.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{camp.date}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1 transition-colors"><MoreVertical className="w-4 h-4" /></button>
              </div>
              <div className="p-5 grid grid-cols-3 gap-4 bg-slate-50/50">
                <div><div className="text-[11px] text-slate-500 mb-1">Open Rate</div><div className="font-bold text-slate-800 text-xs">{camp.metrics.openRate}</div></div>
                <div><div className="text-[11px] text-slate-500 mb-1">CTR</div><div className="font-bold text-slate-800 text-xs">{camp.metrics.ctr}</div></div>
                <div><div className="text-[11px] text-slate-500 mb-1">Spend</div><div className="font-bold text-slate-800 text-xs">{camp.metrics.spend}</div></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
