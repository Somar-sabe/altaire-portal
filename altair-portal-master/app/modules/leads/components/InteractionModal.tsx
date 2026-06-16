"use client";
/**
 * @file /app/modules/leads/components/InteractionModal.tsx
 * @purpose Detail interaction modal managing lead parameters, communication history, and CRM actions.
 */

import React from 'react';
import { LrmLead } from '../store';
import { useAuthStore } from '../../team/authStore';
import InteractionHistoryList from './InteractionHistoryList';
import InteractionNotesForm from './InteractionNotesForm';
import SentProjectsTab from './SentProjectsTab';
import LeadDetailsPanel from './LeadDetailsPanel';
import InteractionHeader from './InteractionHeader';
import QuickTaskModal from './QuickTaskModal';
import InteractionTabsNav from './InteractionTabsNav';

// Hooks
import { useInteractionModalFlow } from '../hooks/useInteractionModalFlow';
import { STAGE_OPTIONS, QUALITY_OPTIONS } from '../constants';

interface InteractionModalProps {
  lead: LrmLead;
  onClose: () => void;
  onOpenDelete: (lead: LrmLead) => void;
}

export default function InteractionModal({ lead, onClose, onOpenDelete }: InteractionModalProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const {
    comments, isCommentsLoading, updateProjectCard, activeTab, setActiveTab,
    newCommentText, setNewCommentText, isReminder, setIsReminder, reminderDate, setReminderDate,
    isProjectModalOpen, setIsProjectModalOpen, projectName, setProjectName, dateSent, setDateSent, brochure, setBrochure, projectNotes, setProjectNotes,
    isQuickTaskOpen, setIsQuickTaskOpen, taskTitle, setTaskTitle, taskDate, setTaskDate, taskDescription, setTaskDescription,
    handlePostComment, handlePostProject, openQuickTask, handleSaveQuickTask, handleStageChange, handleQualityChange, handleExport
  } = useInteractionModalFlow(lead, currentUser, onClose);

  const QUALITY_OPTIONS_WITH_UNASSIGNED = [...QUALITY_OPTIONS, 'Unassigned'];

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 sm:p-6 backdrop-blur-[3px] bg-slate-900/40 dark:bg-black/60 animate-in fade-in zoom-in-95" id="interaction-slide-modal">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-[24px] flex flex-col border border-slate-200/60 dark:border-slate-800/80 shadow-2xl overflow-hidden ring-1 ring-black/5">
        <InteractionHeader 
          lead={lead} STAGE_OPTIONS={STAGE_OPTIONS} QUALITY_OPTIONS={QUALITY_OPTIONS_WITH_UNASSIGNED}
          handleQuickTask={openQuickTask} handleStageChangeInHeader={handleStageChange} handleQualityChangeInHeader={handleQualityChange} onClose={onClose} 
        />

        <InteractionTabsNav activeTab={activeTab} setActiveTab={setActiveTab} isMobile />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden" id="interaction-split-body">
          <LeadDetailsPanel lead={lead} activeTab={activeTab} handleExportPDF={handleExport} onOpenDelete={onOpenDelete} />

          <div className={`relative flex-col h-full bg-slate-50/20 dark:bg-slate-950/10 overflow-hidden text-left md:flex ${activeTab !== 'details' ? 'flex' : 'hidden'}`}>
            <InteractionTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <InteractionHistoryList comments={comments} isCommentsLoading={isCommentsLoading} activeTab={activeTab} handleUpdateProjectCard={updateProjectCard} />

            {activeTab !== 'projects' ? (
              <InteractionNotesForm newCommentText={newCommentText} setNewCommentText={setNewCommentText} isReminder={isReminder} setIsReminder={setIsReminder} reminderDate={reminderDate} setReminderDate={setReminderDate} handlePostComment={handlePostComment} />
            ) : (
              <SentProjectsTab isProjectModalOpen={isProjectModalOpen} setIsProjectModalOpen={setIsProjectModalOpen} projectName={projectName} setProjectName={setProjectName} dateSent={dateSent} setDateSent={setDateSent} brochure={brochure} setBrochure={setBrochure} projectNotes={projectNotes} setProjectNotes={setProjectNotes} handlePostProject={handlePostProject} />
            )}
          </div>
        </div>
      </div>

      <QuickTaskModal 
        isOpen={isQuickTaskOpen} onClose={() => setIsQuickTaskOpen(false)} taskTitle={taskTitle} setTaskTitle={setTaskTitle} 
        taskDate={taskDate} setTaskDate={setTaskDate} taskDescription={taskDescription} setTaskDescription={setTaskDescription} onSave={handleSaveQuickTask} 
      />
    </div>
  );
}
