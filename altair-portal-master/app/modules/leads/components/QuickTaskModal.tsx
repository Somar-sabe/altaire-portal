"use client";
/**
 * @file /app/modules/leads/components/QuickTaskModal.tsx
 * @purpose Renders the mini modal to create a quick reminder task for a lead.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface QuickTaskModalProps {
  isOpen: boolean; onClose: () => void;
  taskTitle: string; setTaskTitle: (v: string) => void;
  taskDate: string; setTaskDate: (v: string) => void;
  taskDescription: string; setTaskDescription: (v: string) => void;
  onSave: () => void;
}

export default function QuickTaskModal({
  isOpen, onClose, taskTitle, setTaskTitle, taskDate, setTaskDate, taskDescription, setTaskDescription, onSave
}: QuickTaskModalProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() && taskDate) onSave();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-4 shadow-xl border border-slate-200 dark:border-slate-800 text-left animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Quick Task</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Task Title</label>
            <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none placeholder:text-slate-400" placeholder="E.g., Call back regarding pricing" autoFocus />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Date & Time</label>
            <input type="datetime-local" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Description</label>
            <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows={3} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none resize-none placeholder:text-slate-400" placeholder="(Optional) Task details..." />
          </div>
          <button type="submit" disabled={!taskTitle.trim() || !taskDate} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-md shadow-indigo-600/20 cursor-pointer">Create Task</button>
        </form>
      </div>
    </div>
  );
}
