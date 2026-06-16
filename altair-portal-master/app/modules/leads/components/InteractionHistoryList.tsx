"use client";
/**
 * @file /app/modules/leads/components/InteractionHistoryList.tsx
 * @description List view for lead interaction feed (comments, tasks, projects).
 * @dependencies react, lucide-react
 * @workplan WP-030
 */

import React from 'react';
import { Clock } from 'lucide-react';
import { LeadComment } from '../store';

interface InteractionHistoryListProps {
  comments: LeadComment[];
  isCommentsLoading: boolean;
  activeTab: 'details' | 'notes' | 'projects';
  handleUpdateProjectCard: (id: string, oldContent: string, newReply: string, newDecision: string) => void;
}

export default function InteractionHistoryList({
  comments, isCommentsLoading, activeTab, handleUpdateProjectCard
}: InteractionHistoryListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin pb-40" id="interaction-comments-thread">
      <span className="text-xs font-black uppercase text-slate-400 block text-left">Timeline Interaction & Log (Interactive Log)</span>
      
      {isCommentsLoading ? (
        <div className="text-center py-10 text-xs text-slate-400 font-semibold uppercase animate-pulse">Retrieving lead interactions feed...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-14 text-xs text-slate-400 font-bold">No active comments or follow-up reminders recorded for this lead yet.</div>
      ) : (
        comments.filter(c => activeTab === 'projects' ? c.content.includes('__PROJECT_SENT__') : true).map((comm) => {
          const isProjectRecord = comm.content.includes('__PROJECT_SENT__');
          let displayContent = comm.content;
          let parsedReply = '';
          let parsedDecision = '';
          
          if (isProjectRecord) {
            const replyMatch = comm.content.match(/\*\*Client Reply:\*\*\s*(.*)$/m);
            const decisionMatch = comm.content.match(/\*\*Client Decision:\*\*\s*(.*)$/m);
            parsedReply = replyMatch ? replyMatch[1] : '';
            parsedDecision = decisionMatch ? decisionMatch[1] : '';
            
            displayContent = comm.content
              .replace('__PROJECT_SENT__\n', '')
              .replace(/\*\*Client Reply:\*\*.*$/m, '')
              .replace(/\*\*Client Decision:\*\*.*$/m, '')
              .trim();
          }

          return (
            <div 
              key={comm.id} 
              className={`p-2.5 rounded-[12px] text-left text-xs shadow-sm border ${
                comm.isReminder 
                  ? 'bg-amber-50/70 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/40 text-amber-900 dark:text-amber-200' 
                  : isProjectRecord
                  ? 'bg-indigo-50/50 border-indigo-200/50 dark:bg-indigo-950/20 dark:border-indigo-900/40'
                  : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-850'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  {comm.authorName} &middot; <span className="text-[8px] font-black uppercase tracking-wide text-slate-400">{comm.authorRole}</span>
                  {isProjectRecord && <span className="text-[8px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded ml-1">Sent Project</span>}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {new Date(comm.createdAt).toLocaleDateString()} &middot; {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed whitespace-pre-wrap mt-1">{displayContent}</p>
              
              {isProjectRecord && (
                <div className="mt-3 pt-2 border-t border-indigo-200/50 dark:border-indigo-900/40 flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400 w-24">Client Reply</span>
                     <input 
                       type="text" 
                       defaultValue={parsedReply}
                       onBlur={(e) => handleUpdateProjectCard(comm.id, comm.content, e.target.value, parsedDecision)}
                       placeholder="Not provided yet..." 
                       className="flex-1 bg-white/60 dark:bg-slate-900/40 border border-indigo-100 dark:border-indigo-900/30 rounded px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400"
                     />
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-400 w-24">Client Decision</span>
                     <select
                       defaultValue={parsedDecision}
                       onChange={(e) => handleUpdateProjectCard(comm.id, comm.content, parsedReply, e.target.value)}
                       className="flex-1 bg-white/60 dark:bg-slate-900/40 border border-indigo-100 dark:border-indigo-900/30 rounded px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400 cursor-pointer"
                     >
                        <option value="">Pending Decision...</option>
                        <option value="Approved">Approved</option>
                        <option value="Needs Revision">Needs Revision</option>
                        <option value="Rejected">Rejected</option>
                     </select>
                   </div>
                </div>
              )}

              {comm.isReminder && comm.reminderDate && (
                <div className="mt-2 pt-1 border-t border-amber-200/50 flex items-center justify-start gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400">
                  <Clock className="w-3 h-3" />
                  <span>Reminder Date: {comm.reminderDate}</span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
