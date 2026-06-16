/**
 * @file /app/modules/workspace/hooks/useSpaceCreateFlow.ts
 * @purpose Custom hook to handle multi-step workspace space creation logic.
 */

import { useState, useMemo } from 'react';
import { useWorkspaceStore } from '../store';
import { useAuthStore } from '../../team/authStore';

export function useSpaceCreateFlow(onClose: () => void) {
  const { spaces, setSpaces, setActiveSpace, members } = useWorkspaceStore();
  const currentUser = useAuthStore(s => s.currentUser);

  const [step, setStep] = useState<1 | 2>(1);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);
  const [inviteSearch, setInviteSearch] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fillableMembers = useMemo(() => {
    if (!members || !currentUser) return [];
    return members.filter(m => m.id !== currentUser.id);
  }, [members, currentUser]);

  const filteredMembers = useMemo(() => {
    const q = inviteSearch.toLowerCase().trim();
    if (!q) return fillableMembers;
    return fillableMembers.filter(m => 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.department && m.department.toLowerCase().includes(q))
    );
  }, [fillableMembers, inviteSearch]);

  const toggleInviteWord = (id: string) => {
    setInvitedUserIds(prev => prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]);
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!spaceName.trim()) { setErrorText('Please enter a space name'); return; }
    setIsSubmitting(true); setErrorText('');
    try {
      const res = await fetch('/api/workspace/spaces', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: spaceName.trim(), description: spaceDescription.trim() || null, privacy, invitedUserIds,
          creatorId: currentUser?.id, creatorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : null
        })
      });
      if (res.ok) {
        const newSpace = await res.json();
        setSpaces([...spaces, newSpace]); setActiveSpace(newSpace.id);
        setSpaceName(''); setSpaceDescription(''); setPrivacy('public'); setInvitedUserIds([]); setStep(1);
        onClose();
      } else {
        const errData = await res.json();
        setErrorText(errData?.error || 'Failed to create workspace space');
      }
    } catch (err) {
      console.error('Error creating space:', err);
      setErrorText('An unexpected network error occurred');
    } finally { setIsSubmitting(false); }
  };

  return {
    step, setStep, spaceName, setSpaceName, spaceDescription, setSpaceDescription,
    privacy, setPrivacy, invitedUserIds, setInvitedUserIds, inviteSearch, setInviteSearch,
    isSubmitting, errorText, setErrorText, fillableMembers, filteredMembers,
    toggleInviteWord, handleCreateSpace
  };
}
