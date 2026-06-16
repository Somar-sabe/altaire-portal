"use client";

/**
 * @file /app/modules/overview/components/LatestActivityList.tsx
 * @purpose Renders a list of the latest activities in the CRM.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LatestActivityListProps {
  activities: any[];
  itemVariants: any;
}

export default function LatestActivityList({
  activities,
  itemVariants,
}: LatestActivityListProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-left">
      <div className="flex justify-between items-center mb-4">
         <h3 className="font-bold text-slate-800 text-sm">Latest Activity</h3>
         <div className="flex items-center gap-3">
           <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
           <span className="text-xs text-slate-500">Today</span>
         </div>
      </div>
      <div className="space-y-0">
        {activities.length > 0 ? activities.map((act, i) => (
          <div key={act.id} className={`py-3 flex items-start gap-3 ${i !== activities.length - 1 ? 'border-b border-slate-100' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 shrink-0 overflow-hidden mt-1">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${act.owner}&backgroundColor=e0e7ff&textColor=4f46e5`} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-slate-800 truncate">{act.title}</h4>
              <p className="text-[11px] text-slate-500 mb-1">Owner : {act.owner}</p>
            </div>
            <div className="flex-1 hidden sm:block">
              <p className="text-[12px] font-medium text-slate-700">{act.action}</p>
              <p className="text-[11px] text-slate-400">{act.time}</p>
            </div>
            <div className={`text-[11px] font-semibold ${act.status === 'Stage' ? 'text-purple-600' : act.status === 'Call' ? 'text-rose-500' : act.status === 'Deal' ? 'text-emerald-500' : 'text-teal-500'}`}>
               {act.status}
            </div>
          </div>
        )) : (
           <div className="text-xs text-slate-400 flex items-center justify-center h-full py-10">No recent activity detected.</div>
        )}
      </div>
    </motion.div>
  );
}
