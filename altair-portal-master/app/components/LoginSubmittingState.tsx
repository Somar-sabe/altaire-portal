"use client";
/**
 * @file /app/components/LoginSubmittingState.tsx
 * @purpose Renders the loading/submitting state animation for the login screen.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface LoginSubmittingStateProps {
  stages: string[];
  activeStage: number;
}

export default function LoginSubmittingState({
  stages,
  activeStage,
}: LoginSubmittingStateProps) {
  return (
    <motion.div 
      key="submitting"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-6 space-y-5"
    >
      <div className="w-10 h-10 rounded-full border-3 border-emerald-500/10 border-t-emerald-500 animate-spin mx-auto" />
      <div className="space-y-1">
        <h3 className="text-xs font-black text-slate-900 tracking-tight">Unified Access System</h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse pt-1">
          {stages[activeStage]}
        </p>
      </div>
    </motion.div>
  );
}
