import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardShell from './DashboardShell';

// GPT-Codex (G) BEGIN: protected dashboard routes must stay dynamic because this layout reads Auth.js session state.
export const dynamic = 'force-dynamic';
// GPT-Codex (G) END: Next build should not statically collect authenticated dashboard pages.

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
