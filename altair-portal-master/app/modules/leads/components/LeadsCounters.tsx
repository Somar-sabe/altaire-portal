"use client";
import React from 'react';
import { Users, FileSpreadsheet, CheckSquare, X, Target, Wallet, Flame, AlertTriangle } from 'lucide-react';
import { LrmLead } from '../types';
import { motion } from 'framer-motion';

interface LeadsCountersProps {
  leads: LrmLead[];
}

export default function LeadsCounters({ leads }: LeadsCountersProps) {
  const metrics = [
    { label: 'Total Leads', value: leads.length, icon: <Users className="w-3.5 h-3.5" />, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { label: 'New', value: leads.filter(l => l.stage === 'NEW').length, icon: <FileSpreadsheet className="w-3.5 h-3.5" />, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Hot Qualified', value: leads.filter(l => l.tags?.some(t => t.toLowerCase().includes('hot'))).length, icon: <Flame className="w-3.5 h-3.5" />, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
    { label: 'Qualified', value: leads.filter(l => l.tags?.some(t => t.toLowerCase().includes('qualified'))).length, icon: <CheckSquare className="w-3.5 h-3.5" />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { label: 'Responsive', value: leads.filter(l => l.tags?.some(t => t.toLowerCase().includes('responsive'))).length, icon: <Target className="w-3.5 h-3.5" />, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
    { label: 'Low Budget', value: leads.filter(l => l.tags?.some(t => t.toLowerCase().includes('low budget'))).length, icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { label: 'Converted', value: leads.filter(l => l.stage === 'CONVERTED').length, icon: <Wallet className="w-3.5 h-3.5" />, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
    { label: 'Lost', value: leads.filter(l => l.stage === 'LOST').length, icon: <X className="w-3.5 h-3.5" />, color: 'text-slate-500', bg: 'bg-slate-100 border-slate-200' },
  ];

  return (
    <div className="flex flex-wrap gap-2.5 mb-6">
      {metrics.map((m, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${m.bg} shadow-sm hover:shadow-md transition-shadow cursor-default group`}
        >
          <div className={`${m.color} group-hover:scale-110 transition-transform`}>
            {m.icon}
          </div>
          <span className={`text-[11px] font-semibold ${m.color}`}>{m.label}</span>
          <span className="text-[11px] font-bold text-slate-700 ml-1 bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100">{m.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
