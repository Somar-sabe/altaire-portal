"use client";
/**
 * @file /app/components/Sidebar.tsx
 * @purpose Renders the elegant, high-contrast, minimalist white sidebar navigation matching the app mockup.
 */

'use client';

import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

// Sub-components
import SortableNavItem from './SortableNavItem';
import SidebarBottomSection from './SidebarBottomSection';

// Hooks
import { useSidebarState } from '../hooks/useSidebarState';

interface SidebarProps {
  pipelineAlertCount?: number;
  suspiciousAlertCount?: number;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ 
  pipelineAlertCount = 0, suspiciousAlertCount = 0, isCollapsed, setIsCollapsed, isMobileOpen = false, setIsMobileOpen
}: SidebarProps) {
  const { navItems, sensors, handleDragEnd, activeTab, currentUser, isMounted, handleItemClick } = useSidebarState(pipelineAlertCount, suspiciousAlertCount, setIsMobileOpen);
  const dndId = React.useId();
  const effectiveCollapsed = isMobileOpen ? false : isCollapsed;

  return (
    <>
      {isMobileOpen && <div onClick={() => setIsMobileOpen?.(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 md:hidden animate-fade-in" />}

      <aside className={cn(
        "bg-white text-slate-800 flex flex-col font-sans px-2 transition-all duration-300 select-none justify-between rounded-[10px] shadow-md fixed top-[calc(4rem+10px)] h-[calc(100vh-4rem-20px)] border border-slate-100 z-45 md:left-[10px] md:flex",
        isCollapsed ? "md:w-20 md:min-w-[5rem] md:max-w-[5rem]" : "md:w-[260px] md:min-w-[260px] md:max-w-[320px]",
        "left-2 w-60 md:translate-x-0", isMobileOpen ? "translate-x-0" : "-translate-x-[110%]"
      )}>
        <div>
          <div className={cn("hidden md:flex flex-row-reverse pb-4 mb-2 shrink-0", isCollapsed ? "justify-center" : "")}>
            <button type="button" onClick={() => setIsCollapsed(!isCollapsed)} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-50 rounded-[10px] cursor-pointer shrink-0">
              <ChevronLeft className={cn("w-4 h-4", isCollapsed && "rotate-180")} />
            </button>
          </div>

          <div className="flex md:hidden justify-end py-3 px-2">
            <button type="button" onClick={() => setIsMobileOpen?.(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-[10px]"><X className="w-5 h-5" /></button>
          </div>

          <nav className="space-y-0.5">
            {isMounted ? (
              <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={navItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {navItems.map((item) => (
                    <SortableNavItem key={item.id} id={item.id} item={item} isActive={activeTab === item.id} isCollapsed={effectiveCollapsed} onClick={() => handleItemClick(item.id)} />
                  ))}
                </SortableContext>
              </DndContext>
            ) : navItems.map((item) => (
              <SortableNavItem key={item.id} id={item.id} item={item} isActive={activeTab === item.id} isCollapsed={effectiveCollapsed} onClick={() => handleItemClick(item.id)} />
            ))}
          </nav>
        </div>

        <SidebarBottomSection activeTab={activeTab} isCollapsed={effectiveCollapsed} currentUser={currentUser} handleItemClick={handleItemClick} />
      </aside>
    </>
  );
}
