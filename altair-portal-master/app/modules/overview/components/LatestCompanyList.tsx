"use client";
/**
 * @file /app/modules/overview/components/LatestCompanyList.tsx
 * @purpose Renders a list of the latest companies added to the CRM.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

interface LatestCompanyListProps {
  companies: any[];
  itemVariants: any;
}

export default function LatestCompanyList({
  companies,
  itemVariants,
}: LatestCompanyListProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col text-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-sm">Latest Company</h3>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
      </div>
      <div className="flex-1 space-y-4">
        {companies.length > 0 ? companies.map((comp) => (
          <div key={comp.id} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
              0{comp.id}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-slate-800 truncate">{comp.name}</h4>
              <p className="text-[11px] text-slate-500">Owner : {comp.owner}</p>
            </div>
            <a 
              href={`https://${comp.domain}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] text-blue-600 hover:underline truncate w-32 hidden sm:block"
            >
              {comp.domain}
            </a>
            <div className="p-1 rounded bg-teal-50 text-teal-600">
              <Linkedin className="w-3.5 h-3.5" />
            </div>
          </div>
        )) : (
          <div className="text-xs text-slate-400 flex items-center justify-center h-full">No companies imported yet</div>
        )}
      </div>
    </motion.div>
  );
}
