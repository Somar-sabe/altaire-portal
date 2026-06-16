/**
 * @file /app/modules/leads/hooks/useInteractionComments.ts
 * @description State and API handlers for lead interactions and comments.
 * @dependencies react, @/app/modules/leads/store
 * @workplan WP-030
 */
import { useState, useEffect, useCallback } from 'react';
import { LeadComment } from '../store';

export function useInteractionComments(leadId: string, currentUser: any) {
  const [comments, setComments] = useState<LeadComment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const loadComments = useCallback(async () => {
    if (!currentUser) return;
    setIsCommentsLoading(true);
    try {
      const res = await fetch(`/api/leads/${leadId}/comments?userId=${currentUser.id}&userRole=${encodeURIComponent(currentUser.role)}`);
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setComments(Array.isArray(data) ? data : []);
        } catch (parseError) {
          console.error('Failed to parse API response as JSON', parseError);
        }
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsCommentsLoading(false);
    }
  }, [leadId, currentUser]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const postComment = async (payload: { content: string; isReminder: boolean; reminderDate: string | null }) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/leads/${leadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser.id,
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          authorRole: currentUser.role,
          ...payload
        })
      });
      if (res.ok) {
        await loadComments();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const updateProjectCard = async (commentId: string, oldContent: string, newReply: string, newDecision: string) => {
    if (!currentUser) return;
    let updatedContent = oldContent.replace(/\*\*Client Reply:\*\*.*$/m, `**Client Reply:** ${newReply}`);
    updatedContent = updatedContent.replace(/\*\*Client Decision:\*\*.*$/m, `**Client Decision:** ${newDecision}`);

    try {
      const res = await fetch(`/api/leads/${leadId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent })
      });
      if (res.ok) {
        await loadComments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { comments, isCommentsLoading, postComment, updateProjectCard };
}
