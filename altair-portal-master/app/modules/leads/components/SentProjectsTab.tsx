"use client";
/**
 * @file /app/modules/leads/components/SentProjectsTab.tsx
 * @description Tab contents and sub-modal for sending a project.
 * @dependencies react, lucide-react
 * @workplan WP-030
 */

import React from 'react';
import { Send, X } from 'lucide-react';

interface SentProjectsTabProps {
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (val: boolean) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  dateSent: string;
  setDateSent: (val: string) => void;
  brochure: string;
  setBrochure: (val: string) => void;
  projectNotes: string;
  setProjectNotes: (val: string) => void;
  handlePostProject: (e: React.FormEvent) => void;
}

export default function SentProjectsTab({
  isProjectModalOpen, setIsProjectModalOpen,
  projectName, setProjectName,
  dateSent, setDateSent,
  brochure, setBrochure,
  projectNotes, setProjectNotes,
  handlePostProject
}: SentProjectsTabProps) {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 z-10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] border-t border-slate-150">
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[8px] text-sm font-black cursor-pointer transition-colors"
        >
          Create Sent Project Record
        </button>
      </div>

      {isProjectModalOpen && (
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm z-20 flex justify-center items-end md:items-center">
          <div className="w-full h-full md:h-auto md:max-w-md bg-white dark:bg-slate-950 p-6 md:rounded-[14px] shadow-2xl flex flex-col gap-4 border border-slate-200 dark:border-slate-800 relative animate-in slide-in-from-bottom-5">
            <button onClick={() => setIsProjectModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
               <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send New Project</h3>
            <form onSubmit={handlePostProject} className="flex flex-col gap-3">
              <input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] focus:outline-none focus:border-indigo-400 bg-transparent" />
              <input type="date" value={dateSent} onChange={(e) => setDateSent(e.target.value)} className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] focus:outline-none focus:border-indigo-400 bg-transparent text-slate-500" title="Date Sent" />
              <div className="relative overflow-hidden w-full h-[40px] border border-slate-200 dark:border-slate-800 rounded-[8px] flex items-center justify-start bg-transparent focus-within:border-indigo-400">
                 <span className="absolute left-3 text-sm text-slate-500 font-bold pointer-events-none">{brochure ? brochure : 'Upload Brochure / Project Files (Click anywhere)'}</span>
                 <input type="file" onChange={(e) => setBrochure(e.target.files?.[0]?.name || '')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <textarea placeholder="Additional Project Notes" value={projectNotes} onChange={(e) => setProjectNotes(e.target.value)} rows={3} className="w-full text-xs font-semibold p-2.5 border border-slate-200 dark:border-slate-800 rounded-[8px] focus:outline-none focus:border-indigo-400 bg-transparent resize-none" />
              <button
                type="submit"
                disabled={!projectName.trim()}
                className="mt-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[8px] text-sm font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Add Sent Project
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
