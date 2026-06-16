"use client";
/**
 * @file /app/modules/leads/components/DeleteLeadModal.tsx
 * @description Safe Delete modal enforcing 3-step confirmation (sure prompt, justification input, and exact name match).
 * @dependencies react, @/app/modules/leads/store, @/app/modules/team/authStore
 * @workplan WP-011
 */

'use client';

import React, { useState } from 'react';
import { LrmLead, useLeadsStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import { AlertOctagon, X } from 'lucide-react';

interface DeleteModalProps {
  lead: LrmLead;
  onClose: () => void;
  onDeletedSuccessfully: () => void;
}

export default function DeleteLeadModal({ lead, onClose, onDeletedSuccessfully }: DeleteModalProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const deleteLead = useLeadsStore((s) => s.deleteLead);

  // States for 3-steps
  const [isCheckedOne, setIsCheckedOne] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [verifyName, setVerifyName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCheckedOne || !reasonText.trim() || verifyName !== lead.name || !currentUser) return;

    setIsDeleting(true);
    setErrorMessage('');
    try {
      const isSuccess = await deleteLead(
        lead.id,
        currentUser.id,
        `${currentUser.firstName} ${currentUser.lastName}`,
        reasonText
      );

      if (isSuccess) {
        onDeletedSuccessfully();
      } else {
        setErrorMessage('An error occurred while connecting to the server to delete the contact.');
        setIsDeleting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'The secure deletion attempt failed.');
      setIsDeleting(false);
    }
  };

  const isFormValid = isCheckedOne && reasonText.trim().length > 5 && verifyName === lead.name;

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-[3px]" id="delete-lead-modal-wrapper">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 w-full max-w-md rounded-[12px] overflow-hidden shadow-2xl p-5 text-left flex flex-col gap-4" id="delete-modal-box">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-600 font-sans">
            <AlertOctagon className="w-4 h-4" />
            <span className="text-xs font-black">Secure Deletion Verification</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content warning */}
        <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/50 p-3 rounded-[8px] text-xs text-rose-700 leading-relaxed font-bold">
          Security Alert: You are permanently deleting lead ({lead.name}) from the systems pipeline and logging your session as the supervisor. An immediate secure alert email will be sent to Super Admin Ghanem.
        </div>

        {/* Form Steps */}
        <form onSubmit={handleDeleteSubmit} className="space-y-4" id="delete-3step-form">
          {/* Step 1 */}
          <div className="flex items-center justify-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input 
              id="confirm-one"
              type="checkbox" 
              checked={isCheckedOne}
              onChange={(e) => setIsCheckedOne(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="confirm-one" className="cursor-pointer">Yes, I am certain I want to permanently destroy and delete this lead.</label>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-black text-slate-500 uppercase">1. Reason & Justification for Deletion (Required - minimum 6 characters):</label>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Write the deletion reasons clearly to document this audit trail for Ghanem..."
              rows={2}
              className="w-full text-left text-xs font-semibold p-2 border border-slate-200 dark:border-slate-850 rounded-[8px] focus:outline-none focus:border-rose-400 bg-transparent"
              required
            />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-black text-slate-500 uppercase">
              2. To confirm, type the lead's exact name here (<span className="text-slate-900 font-bold font-mono">{lead.name}</span>):
            </label>
            <input
              type="text"
              value={verifyName}
              onChange={(e) => setVerifyName(e.target.value)}
              placeholder="Type full matching name here..."
              className="w-full text-left text-xs font-semibold p-2 border border-slate-200 dark:border-slate-850 rounded-[8px] focus:outline-none focus:border-rose-400 font-mono"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-xs font-black text-rose-600 text-center">{errorMessage}</div>
          )}

          {/* Footer controls */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 rounded-[8px] text-xs font-bold text-slate-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isDeleting}
              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-100 disabled:opacity-50 text-white rounded-[8px] text-xs font-black transition-all cursor-pointer"
            >
              {isDeleting ? 'Processing deletion & email alert...' : 'Permanently Delete Lead Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
