"use client";
/**
 * @file /app/modules/leads/components/InteractionNotesForm.tsx
 * @description Form to submit new notes and reminder tasks.
 * @dependencies react, lucide-react
 * @workplan WP-030
 */

import React from 'react';
import { Send } from 'lucide-react';

interface InteractionNotesFormProps {
  newCommentText: string;
  setNewCommentText: (val: string) => void;
  isReminder: boolean;
  setIsReminder: (val: boolean) => void;
  reminderDate: string;
  setReminderDate: (val: string) => void;
  handlePostComment: (e: React.FormEvent) => void;
}

export default function InteractionNotesForm({
  newCommentText, setNewCommentText,
  isReminder, setIsReminder,
  reminderDate, setReminderDate,
  handlePostComment
}: InteractionNotesFormProps) {
  return (
    <form onSubmit={handlePostComment} className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-150 bg-white dark:bg-slate-900 flex flex-col gap-2 shrink-0 z-10 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] text-left" id="interaction-post-form">
      <textarea
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
        placeholder="Write a new comment, log details, or set reminders..."
        rows={2}
        className="w-full text-left text-xs font-semibold p-2 border border-slate-200 dark:border-slate-800 rounded-[10px] focus:outline-none focus:border-slate-400 bg-transparent resize-none"
      />

      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-400">
            <input 
              type="checkbox" 
              checked={isReminder}
              onChange={(e) => setIsReminder(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-transparent focus:outline-none cursor-pointer" 
            />
            <span>Set as Follow-up Task Reminder</span>
          </label>
          {isReminder && (
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="border border-slate-200 dark:border-slate-800 rounded-[6px] px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!newCommentText.trim()}
          className="px-4 py-1.5 bg-slate-950 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-[8px] text-xs font-black flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Post Comment
        </button>
      </div>
    </form>
  );
}
