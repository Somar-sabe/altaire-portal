"use client";
/**
 * @file /app/modules/leads/components/TableColumnHeader.tsx
 * @purpose Renders a resizable table header column.
 */

import React from 'react';

interface TableColumnHeaderProps {
  label: string;
  width: number;
  onResize: (e: React.MouseEvent) => void;
  className?: string;
}

export default function TableColumnHeader({ label, width, onResize, className = "" }: TableColumnHeaderProps) {
  return (
    <th className={`p-3 relative group ${className}`} style={{ width }}>
      <span className="truncate block pr-2">{label}</span>
      <div 
        onMouseDown={onResize} 
        className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-slate-300 dark:hover:bg-slate-700 z-20 group-hover:bg-slate-200/55 dark:group-hover:bg-slate-800/40 transition-colors" 
      />
    </th>
  );
}
