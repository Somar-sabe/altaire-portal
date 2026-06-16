/**
 * @file /app/hooks/useSidebarState.ts
 * @purpose Custom hook to handle sidebar navigation state, dynamic badges, and dnd logic.
 */

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Grid, Mail, Radio, Megaphone, PieChart, MessageSquare, Users } from 'lucide-react';
import { 
  useSensors, useSensor, PointerSensor, KeyboardSensor, 
  DragEndEvent 
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useAuthStore } from '@/app/modules/team/authStore';

export function useSidebarState(pipelineAlertCount: number, suspiciousAlertCount: number, setIsMobileOpen?: (val: boolean) => void) {
  const { currentUser, logout } = useAuthStore();
  const pathname = usePathname();
  const activeTab = pathname === '/' ? 'overview' : pathname.split('/')[1] || 'overview';
  
  const [navItems, setNavItems] = useState([
    { id: 'overview', label: 'Overview', icon: Grid, badge: null },
    { id: 'leads', label: 'Leads', icon: Mail, badge: pipelineAlertCount > 0 ? pipelineAlertCount : null },
    { id: 'feed', label: 'Company Feed', icon: Radio, badge: null },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, badge: null },
    { id: 'reports', label: 'Reports', icon: PieChart, badge: null },
    { id: 'workspace', label: 'Workspace', icon: MessageSquare, badge: 3 },
    { id: 'team', label: 'Team', icon: Users, badge: suspiciousAlertCount > 0 ? suspiciousAlertCount : null }
  ]);

  useEffect(() => {
    setNavItems(prev => prev.map(item => {
      if (item.id === 'leads') return { ...item, badge: pipelineAlertCount > 0 ? pipelineAlertCount : null };
      if (item.id === 'team') return { ...item, badge: suspiciousAlertCount > 0 ? suspiciousAlertCount : null };
      if (item.id === 'workspace') return { ...item, badge: 3 };
      return item;
    }));
  }, [pipelineAlertCount, suspiciousAlertCount]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setNavItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleItemClick = (tabId: string) => { if (setIsMobileOpen) setIsMobileOpen(false); };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return {
    navItems, sensors, handleDragEnd, activeTab, currentUser, logout, isMounted, handleItemClick
  };
}
