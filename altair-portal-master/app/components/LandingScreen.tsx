/**
 * @file /app/components/LandingScreen.tsx
 * @purpose Immersive, highly polished minimal landing page for Altair Workspace.
 */
'use client';

import React, { useState, useEffect } from 'react';

// Sub-components
import LandingNav from './LandingNav';
import LandingHeroContent from './LandingHeroContent';
import LandingDashboardCard from './LandingDashboardCard';
import LandingFeatures from './LandingFeatures';

interface LandingScreenProps {
  onGoToLogin: () => void;
}

export default function LandingScreen({ onGoToLogin }: LandingScreenProps) {
  const [activeMetricValue, setActiveMetricValue] = useState(99.4);
  const [serverPing, setServerPing] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetricValue(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
      setServerPing(prev => Math.max(8, Math.min(18, Math.round(prev + (Math.random() * 2 - 1)))));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, bounce: 0, duration: 0.6 } } };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 overflow-x-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      <LandingNav onGoToLogin={onGoToLogin} />

      <div className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center">
          <LandingHeroContent onGoToLogin={onGoToLogin} containerVariants={containerVariants} itemVariants={itemVariants} />
          <LandingDashboardCard activeMetricValue={activeMetricValue} serverPing={serverPing} />
        </div>
      </div>

      <LandingFeatures />
    </div>
  );
}
