'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/app/components/Header';
import OnboardingWizard from '@/app/components/OnboardingWizard';
import Sidebar from '@/app/components/Sidebar';
import UserProfile from '@/app/modules/team/components/UserProfile';
import { useAuthStore } from '@/app/modules/team/authStore';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSelfProfileOpen, setIsSelfProfileOpen] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  const currentUser = useAuthStore((s) => s.currentUser);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const pathname = usePathname();

  useEffect(() => {
    setIsSelfProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('altair_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const isDone = localStorage.getItem(`altair_onboarded_${currentUser.id}`);
      setIsOnboarded(isDone === 'true');
    } else {
      setIsOnboarded(null);
    }
  }, [currentUser]);

  if (!currentUser || isOnboarded === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center select-none antialiased">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-4 animate-pulse">Initializing Security Session...</span>
      </div>
    );
  }

  if (isOnboarded === false) {
    return (
      <OnboardingWizard
        onComplete={() => {
          localStorage.setItem(`altair_onboarded_${currentUser.id}`, 'true');
          setIsOnboarded(true);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 flex flex-col font-sans select-none antialiased text-slate-800 max-w-[100vw]">
      <Header
        currentRole={currentUser.role}
        onRoleChange={() => undefined}
        onOpenProfile={() => setIsSelfProfileOpen(true)}
        onOpenSettings={() => {
          setIsSelfProfileOpen(false);
        }}
        onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        className="fixed top-0 left-0 w-full z-50"
      />

      <div className="flex flex-1 pt-16 min-w-0 w-full h-[calc(100vh-4rem)] overflow-hidden">
        <Sidebar
          pipelineAlertCount={0}
          suspiciousAlertCount={0}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        <main className="flex-1 min-w-0 h-full overflow-hidden flex flex-col transition-all duration-300 ml-0 md:ml-[calc(5rem+10px)]">
          <div className="flex-1 w-full px-2 sm:px-4 md:px-5 py-2 md:py-3 container mx-auto max-w-[1800px] flex min-w-0 h-full overflow-hidden">
            {isSelfProfileOpen ? (
              <div className="flex-1 w-full p-2.5 sm:p-4 h-full overflow-y-auto">
                <UserProfile userId={currentUser.id} onBack={() => setIsSelfProfileOpen(false)} />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
