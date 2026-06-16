'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './modules/team/authStore';
import LoginScreen from './components/LoginScreen';
import LandingScreen from './components/LandingScreen';

export default function Home() {
  const [viewState, setViewState] = useState<'landing' | 'login'>('landing');
  const currentUser = useAuthStore((s) => s.currentUser);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (currentUser) {
      router.push('/overview');
    }
  }, [currentUser, router]);

  if (currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center select-none antialiased">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-4 animate-pulse">Entering Dashboard...</span>
      </div>
    );
  }

  if (viewState === 'landing') {
    return <LandingScreen onGoToLogin={() => setViewState('login')} />;
  }
  return <LoginScreen onBackToLanding={() => setViewState('landing')} />;
}
