"use client";
/**
 * @file /app/modules/overview/components/UsersByCountry.tsx
 * @purpose Renders a table showing user distribution by country.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface UsersByCountryProps {
  userCountries: any[];
  itemVariants: any;
}

export default function UsersByCountry({
  userCountries,
  itemVariants,
}: UsersByCountryProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 overflow-hidden text-left">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-sm">User Count Per Country</h3>
        <select className="text-xs border border-slate-200 rounded-md px-2 py-1 text-slate-600 outline-none">
          <option>All Countries</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-2 text-[11px] font-bold text-slate-800">ID</th>
              <th className="py-2 text-[11px] font-bold text-slate-800">Country</th>
              <th className="py-2 text-[11px] font-bold text-slate-800 text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            {userCountries.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 text-[12px] text-slate-500">{row.id}</td>
                <td className="py-2.5 text-[12px] font-medium text-slate-700 flex items-center gap-2">
                  <span className="text-lg leading-none">{row.flag}</span> {row.country}
                </td>
                <td className="py-2.5 text-[12px] text-slate-600 text-right">{row.count}</td>
              </tr>
            ))}
            {userCountries.length === 0 && (
              <tr><td colSpan={3} className="py-4 text-center text-xs text-slate-400">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
