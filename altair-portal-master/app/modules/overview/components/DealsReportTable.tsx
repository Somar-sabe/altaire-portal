"use client";
/**
 * @file /app/modules/overview/components/DealsReportTable.tsx
 * @purpose Renders a table report of deals assigned, won, and lost per user.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface DealsReportTableProps {
  dealsReport: any[];
  itemVariants: any;
}

export default function DealsReportTable({
  dealsReport,
  itemVariants,
}: DealsReportTableProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 overflow-hidden text-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-sm">Deals Report Per User</h3>
        <div className="flex text-xs border border-slate-200 rounded-md overflow-hidden">
          {['Week', 'Month', 'Year'].map(t => (
            <button key={t} className={`px-2 py-1 ${t === 'Month' ? 'text-indigo-600 font-semibold border-indigo-200 bg-indigo-50/50' : 'text-slate-500'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-2 text-[11px] font-bold text-slate-800">ID</th>
              <th className="py-2 text-[11px] font-bold text-slate-800">User Name</th>
              <th className="py-2 text-[11px] font-bold text-slate-800 text-center">Total Deals Assigned</th>
              <th className="py-2 text-[11px] font-bold text-white text-center bg-emerald-500 rounded-l">Won</th>
              <th className="py-2 text-[11px] font-bold text-white text-center bg-rose-500 rounded-r">Lost</th>
            </tr>
          </thead>
          <tbody>
            {dealsReport.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 text-[12px] text-slate-500">{row.id}</td>
                <td className="py-2.5 text-[12px] font-medium text-slate-700">{row.name}</td>
                <td className="py-2.5 text-[12px] text-slate-600 text-center">{row.assigned}</td>
                <td className="py-2.5 text-[12px] font-semibold text-emerald-500 text-center">{row.won}</td>
                <td className="py-2.5 text-[12px] font-semibold text-rose-500 text-center">{row.lost}</td>
              </tr>
            ))}
            {dealsReport.length === 0 && (
              <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-400">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
