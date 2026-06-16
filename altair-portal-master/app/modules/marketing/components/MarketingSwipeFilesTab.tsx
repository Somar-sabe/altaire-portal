"use client";
/**
 * @file /app/modules/marketing/components/MarketingSwipeFilesTab.tsx
 * @purpose Renders the swipe files inspiration gallery.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, FileText, Image as ImageIcon, LayoutDashboard, Mail, Target } from 'lucide-react';
import { containerVariants, itemVariants, swipeFiles } from '../marketingConstants';

export default function MarketingSwipeFilesTab() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'FileText': return <FileText className="w-3.5 h-3.5 text-slate-400" />;
      case 'ImageIcon': return <ImageIcon className="w-3.5 h-3.5 text-slate-400" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />;
      case 'Mail': return <Mail className="w-3.5 h-3.5 text-slate-400" />;
      case 'Target': return <Target className="w-3.5 h-3.5 text-slate-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <motion.div key="swipe" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-6 text-left">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search inspiration..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"><Filter className="w-3.5 h-3.5"/> Filters</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {swipeFiles.map((file) => (
          <motion.div key={file.id} variants={itemVariants} className="group cursor-pointer bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
            <div className="w-full h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
               {/* GPT-Codex (G) BEGIN: remove external placeholder imagery so production CSP can stay self-only. */}
               <div className="w-full h-full bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                 <ImageIcon className="w-10 h-10 text-orange-200" aria-hidden="true" />
               </div>
               {/* GPT-Codex (G) END: swipe file cards no longer depend on remote placeholder media. */}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                 <span className="text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><Heart className="w-3 h-3 text-rose-400 fill-rose-400"/> {file.likes} Saves</span>
               </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-widest font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{file.category}</span>
                {getIcon(file.type)}
              </div>
              <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-relaxed">{file.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
