"use client";
/**
 * @file /app/modules/workspace/components/SpaceCreateModal.tsx
 * @purpose Dialog modal managing 2-step Workspace Space compilation with privacy options and user invitation dispatching.
 */

import React from 'react';
import { Users, X, ChevronLeft } from 'lucide-react';

// Sub-components
import SpaceBasicConfigStep from './SpaceBasicConfigStep';
import SpaceInviteMembersStep from './SpaceInviteMembersStep';

// Hooks
import { useSpaceCreateFlow } from '../hooks/useSpaceCreateFlow';

interface SpaceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpaceCreateModal({ isOpen, onClose }: SpaceCreateModalProps) {
  const {
    step, setStep, spaceName, setSpaceName, spaceDescription, setSpaceDescription,
    privacy, setPrivacy, invitedUserIds, inviteSearch, setInviteSearch,
    isSubmitting, errorText, setErrorText, filteredMembers, toggleInviteWord, handleCreateSpace
  } = useSpaceCreateFlow(onClose);

  if (!isOpen) return null;

  return (
    <div id="modal_step_creation_overlay" className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-left">
      <div id="modal_step_creation_dialog" className="bg-white rounded-xl shadow-xl w-full max-w-[420px] border border-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5 text-left">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-700 transition" title="Go Back">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Users className="w-4 h-4" /></div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{step === 1 ? 'Create a Space' : 'Invite Team Members'}</h3>
              <p className="text-[11px] font-semibold text-slate-400">Step {step} of 2</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-all"><X className="w-4 h-4" /></button>
        </div>

        {errorText && <div className="mx-4 mt-3 p-2.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-lg">{errorText}</div>}

        {step === 1 ? (
          <SpaceBasicConfigStep 
            spaceName={spaceName} setSpaceName={setSpaceName} spaceDescription={spaceDescription} setSpaceDescription={setSpaceDescription} privacy={privacy} setPrivacy={setPrivacy} 
            onNext={(e) => { e.preventDefault(); if (!spaceName.trim()) { setErrorText('Please specify a space title.'); return; } setErrorText(''); setStep(2); }} onClose={onClose} 
          />
        ) : (
          <SpaceInviteMembersStep 
            inviteSearch={inviteSearch} setInviteSearch={setInviteSearch} filteredMembers={filteredMembers} invitedUserIds={invitedUserIds} onToggleInvite={toggleInviteWord} onConfirm={(e) => handleCreateSpace(e)} onBack={() => setStep(1)} isSubmitting={isSubmitting} 
          />
        )}
      </div>
    </div>
  );
}
