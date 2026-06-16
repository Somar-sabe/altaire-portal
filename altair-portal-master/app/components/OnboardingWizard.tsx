"use client";
/**
 * @file /app/components/OnboardingWizard.tsx
 * @purpose Simplified 1-step onboarding for new users.
 */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../modules/team/authStore';
import { Laptop, Sparkles } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [isFinishing, setIsFinishing] = useState(false);

  if (!currentUser) return null;

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative select-none antialiased text-slate-800">
      {/* Soft light grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      {/* Main Card wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative z-10 flex flex-col p-8 text-center"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <Sparkles className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">Welcome to Altair, {currentUser.firstName}</h1>
        <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto mb-8">
          Your profile is ready. You have been granted <span className="text-slate-800 font-bold">{currentUser.role}</span> access to the workspace.
        </p>

        <button
          type="button"
          disabled={isFinishing}
          onClick={handleFinish}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isFinishing ? (
            'Preparing Workspace...'
          ) : (
            <>
              Launch Workspace <Laptop className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
