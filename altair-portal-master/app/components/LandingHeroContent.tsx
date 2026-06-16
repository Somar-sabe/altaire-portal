"use client";
/**
 * @file /app/components/LandingHeroContent.tsx
 * @purpose Renders the text and buttons for the hero section of the landing screen.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LandingHeroContentProps {
  onGoToLogin: () => void;
  containerVariants: any;
  itemVariants: any;
}

export default function LandingHeroContent({
  onGoToLogin, containerVariants, itemVariants
}: LandingHeroContentProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6 lg:col-span-7 text-left z-10">
      <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/50 text-xs font-bold uppercase tracking-wider text-emerald-800 w-fit">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Altair Platform Active</span>
      </motion.div>
      
      <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900">
        Unified platform for <span className="text-emerald-600 font-extrabold">Altair Real Estate.</span>
      </motion.h1>
      
      <motion.p variants={itemVariants} className="text-sm text-slate-500 font-semibold max-w-lg leading-relaxed">
        Brilliant organizational directories, fine-tuned roles permission schema matrices, real-time activity metrics logging, and team communication in a clean single dashboard.
      </motion.p>
      
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-3">
        <button 
          onClick={onGoToLogin}
          className="px-6 py-3 bg-slate-900 text-white rounded-[10px] font-black text-xs hover:bg-slate-800 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          Access Dashboard <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
        <button 
          onClick={onGoToLogin}
          className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-[10px] font-bold text-xs hover:text-slate-800 transition-all cursor-pointer"
        >
          Sandbox Demo
        </button>
      </motion.div>
    </motion.div>
  );
}
