"use client";
/**
 * @file /app/components/LandingDashboardCard.tsx
 * @purpose Renders the polished dashboard visual for the landing page.
 */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Activity } from 'lucide-react';

interface LandingDashboardCardProps {
  activeMetricValue: number;
  serverPing: number;
}

export default function LandingDashboardCard({
  activeMetricValue, serverPing
}: LandingDashboardCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="lg:col-span-5 relative h-fit w-full hidden lg:block"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-[0_20px_40px_rgba(15,23,42,0.03)] flex flex-col gap-4">
        
        {/* Fake UI Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
           <div className="flex items-center gap-2.5">
             <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">A</div>
             <div className="text-left">
               <div className="h-3 w-20 bg-slate-200 rounded mb-1" />
               <div className="h-2 w-10 bg-slate-100 rounded" />
             </div>
           </div>
           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live Sync</span>
        </div>

        {/* Grid content mock */}
        <div className="space-y-3 text-left">
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-700">Platform Integrity Check</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">{activeMetricValue}%</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Central API Tunnel</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">{serverPing}ms latency</span>
          </div>

          <div className="p-3 bg-slate-55 border border-dashed border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-400 tracking-widest">
            ⚡ Role matrices & access controls validated.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
