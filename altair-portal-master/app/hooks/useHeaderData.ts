/**
 * @file /app/hooks/useHeaderData.ts
 * @purpose Custom hook to handle header state, notifications, and accounting logic.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/app/modules/team/authStore';

export function useHeaderData() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'system' | 'user' | 'security'>('all');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Array<any>>([
    { id: '1', title: 'New User Registered', desc: 'Liam Carter joined Engineering department.', type: 'user', time: '10m ago', read: false },
    { id: '2', title: 'Database Backup Complete', desc: 'Automated sqlite recovery point snapshot successful.', type: 'system', time: '1h ago', read: false },
    { id: '3', title: 'Security Advisory', desc: 'A custom session active key verification occurred from 192.168.1.5.', type: 'security', time: '3h ago', read: false },
    { id: '4', title: 'Campaign Status Complete', desc: 'Marketing newsletter dispatched with positive ratings.', type: 'system', time: '1d ago', read: true },
  ]);

  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => setNotifications([]);

  const filteredNotifications = useMemo(() => {
    if (notificationFilter === 'all') return notifications;
    return notifications.filter(n => n.type === notificationFilter);
  }, [notifications, notificationFilter]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchInvites = async () => {
      try {
        const res = await fetch(`/api/workspace/invitations?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          const inviteNotifications = data.map((inv: any) => ({
            id: inv.id, title: 'Space Group Invitation', desc: `@${inv.invitedByName} invited you to join space channel "${inv.spaceName}"`,
            type: 'user', time: 'Just now', read: false, isInvitation: true, spaceId: inv.spaceId,
          }));
          setNotifications(prev => [...inviteNotifications, ...prev.filter(n => !n.isInvitation)]);
        }
      } catch (e) { console.error('Error fetching invitations:', e); }
    };
    fetchInvites();
  }, [currentUser?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAcceptInvite = async (invitationId: string) => {
    try {
      const res = await fetch('/api/workspace/invitations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invitationId, action: 'ACCEPT' }) });
      if (res.ok) setNotifications(prev => prev.filter(n => n.id !== invitationId));
    } catch (err) { console.error('Error accepting invitation:', err); }
  };

  const handleIgnoreInvite = async (invitationId: string) => {
    try {
      const res = await fetch('/api/workspace/invitations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ invitationId, action: 'IGNORE' }) });
      if (res.ok) setNotifications(prev => prev.filter(n => n.id !== invitationId));
    } catch (err) { console.error('Error ignoring invitation:', err); }
  };

  return {
    isDropdownOpen, setIsDropdownOpen, isNotificationsOpen, setIsNotificationsOpen,
    notificationFilter, setNotificationFilter, dropdownRef, notificationsRef,
    notifications, filteredNotifications, currentUser, logout,
    toggleRead, deleteNotification, clearAllNotifications, handleAcceptInvite, handleIgnoreInvite
  };
}
