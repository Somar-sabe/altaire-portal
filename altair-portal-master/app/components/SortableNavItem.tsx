/**
 * @file /app/components/SortableNavItem.tsx
 * @purpose Renders a draggable navigation item in the sidebar.
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from '@/lib/utils';

export default function SortableNavItem({ id, item, isActive, isCollapsed, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      title={isCollapsed ? item.label : undefined}
      className={cn("w-full block", isDragging ? "cursor-grabbing" : "cursor-pointer")}
    >
      <Link
        href={item.href || `/${item.id === 'overview' ? '' : item.id}`}
        onClick={onClick}
        aria-label={item.label}
        className={cn(
          "w-full text-left flex items-center rounded-[10px] transition-all gap-4 outline-none font-medium text-xs select-none group relative",
          isActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
          isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
        )}
      >
        <Icon className={cn("w-4.5 h-4.5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
        {!isCollapsed && <span className="flex-1 font-sans animate-fade-in">{item.label}</span>}
        {item.badge && (
          isCollapsed ? (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          ) : (
            <span className={cn("px-1.5 py-0.5 rounded text-xs shrink-0 font-bold", isActive ? "bg-white text-slate-950" : "bg-indigo-50 text-indigo-600")}>
              {item.badge}
            </span>
          )
        )}
      </Link>
    </div>
  );
}
