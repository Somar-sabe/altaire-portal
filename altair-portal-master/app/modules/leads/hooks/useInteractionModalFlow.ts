/**
 * @file /app/modules/leads/hooks/useInteractionModalFlow.ts
 * @purpose Custom hook to handle interaction logic, comments, and project state within the lead interaction modal.
 */

import { useState } from 'react';
import { useLeadsStore } from '../store';
import { useInteractionComments } from '../hooks/useInteractionComments';
import { exportLeadPDF } from '../utils/exportLeadPDF';

export function useInteractionModalFlow(lead: any, currentUser: any, onClose: () => void) {
  const updateLead = useLeadsStore((s) => s.updateLead);
  const { comments, isCommentsLoading, postComment, updateProjectCard } = useInteractionComments(lead.id, currentUser);
  
  const [newCommentText, setNewCommentText] = useState('');
  const [isReminder, setIsReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');

  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'projects'>('details');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [dateSent, setDateSent] = useState('');
  const [brochure, setBrochure] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const success = await postComment({ content: newCommentText, isReminder, reminderDate: isReminder ? reminderDate : null });
    if (success) { setNewCommentText(''); setIsReminder(false); setReminderDate(''); }
  };

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    const content = `__PROJECT_SENT__\n**Project Name:** ${projectName}\n**Date Sent:** ${dateSent || new Date().toISOString().split('T')[0]}\n**Brochure:** ${brochure}\n**Notes:** ${projectNotes}\n**Client Reply:** \n**Client Decision:** `;
    const success = await postComment({ content, isReminder: false, reminderDate: null });
    if (success) { setProjectName(''); setDateSent(''); setBrochure(''); setProjectNotes(''); setIsProjectModalOpen(false); }
  };

  const openQuickTask = () => {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    setTaskDate(tomorrow.toISOString().slice(0, 16)); setTaskTitle(''); setTaskDescription(''); setIsQuickTaskOpen(true);
  };

  const handleSaveQuickTask = async () => {
    if (!taskTitle.trim() || !taskDate) return;
    let content = `**Task:** ${taskTitle}`;
    if (taskDescription.trim()) content += `\n**Description:** ${taskDescription}`;
    const success = await postComment({ content, isReminder: true, reminderDate: taskDate });
    if (success) { setIsQuickTaskOpen(false); setActiveTab('notes'); }
  };

  const handleStageChange = async (newStage: string) => {
    await updateLead(lead.id, { stage: newStage, updaterId: currentUser?.id, updaterName: `${currentUser?.firstName} ${currentUser?.lastName}` });
  };

  const handleQualityChange = async (newQuality: string) => {
    await updateLead(lead.id, { tags: newQuality === 'Unassigned' ? [] : [newQuality], updaterId: currentUser?.id, updaterName: `${currentUser?.firstName} ${currentUser?.lastName}` });
  };

  const handleExport = () => {
    const isSA = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';
    exportLeadPDF(lead, comments, isSA, currentUser);
  };

  return {
    comments, isCommentsLoading, updateProjectCard, activeTab, setActiveTab,
    newCommentText, setNewCommentText, isReminder, setIsReminder, reminderDate, setReminderDate,
    isProjectModalOpen, setIsProjectModalOpen, projectName, setProjectName, dateSent, setDateSent, brochure, setBrochure, projectNotes, setProjectNotes,
    isQuickTaskOpen, setIsQuickTaskOpen, taskTitle, setTaskTitle, taskDate, setTaskDate, taskDescription, setTaskDescription,
    handlePostComment, handlePostProject, openQuickTask, handleSaveQuickTask, handleStageChange, handleQualityChange, handleExport
  };
}
