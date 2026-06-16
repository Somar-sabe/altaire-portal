/**
 * @file /app/hooks/useLoginFlow.ts
 * @purpose Custom hook to handle login logic, invitation flows, and state management.
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../modules/team/authStore';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';

export function useLoginFlow() {
  const [loginMode, setLoginMode] = useState<'registered' | 'new'>('registered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [step, setStep] = useState<'input' | 'submitting'>('input');
  const [newAccountStep, setNewAccountStep] = useState<1 | 2>(1);
  const [invitedUser, setInvitedUser] = useState<any>(null);
  
  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const authLoading = useAuthStore((s) => s.isLoading);

  const [activeStage, setActiveStage] = useState(0);
  const stages = [
    "Checking session clearance...",
    "Authorizing user registry credentials...",
    "Resolving profile configuration state..."
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const inviteEmail = params.get('inviteEmail');
      const token = params.get('inviteToken');
      if (inviteEmail && token) {
        setEmail(inviteEmail);
        setLoginMode('new');
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'submitting') {
      setActiveStage(0);
      interval = setInterval(() => {
        setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [step, stages.length]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setStep('submitting');
    useAuthStore.setState({ error: null });
    setTimeout(async () => {
      const success = await login(email.trim(), password);
      if (!success) setStep('input');
    }, 1200);
  };

  const handleNewAccountVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep('submitting');
    useAuthStore.setState({ error: null });
    try {
      // GPT-Codex (G) BEGIN: query invitation registry through paginated team users.
      const users = await fetchPaginatedCollection<any>('/api/team/users');
      // GPT-Codex (G) END: invitation lookup still scans a flat in-memory array.
      const user = users.find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
      if (!user) {
        useAuthStore.setState({ error: 'No active invitation found for this email.' });
        setStep('input'); return;
      }
      if (user.status !== 'INVITED') {
        useAuthStore.setState({ error: 'Account already active. Please sign in normally.' });
        setStep('input'); return;
      }
      setTimeout(() => {
        setInvitedUser(user);
        setFirstName(user.firstName === 'INVITED' ? '' : user.firstName);
        setLastName(user.lastName === 'User' ? '' : user.lastName);
        setNewAccountStep(2); setStep('input');
      }, 1000);
    } catch (err: any) {
      useAuthStore.setState({ error: err.message });
      setStep('input');
    }
  };

  const handleNewAccountCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !newPassword.trim() || !firstName.trim() || !lastName.trim()) return;
    setStep('submitting');
    useAuthStore.setState({ error: null });
    try {
      if (!invitedUser?.id) throw new Error('Missing user reference.');
      const updateRes = await fetch(`/api/team/users/${invitedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim(), password: newPassword, status: 'ACTIVE' }),
      });
      if (!updateRes.ok) throw new Error('Failed to create profile details.');
      const success = await login(email.trim(), newPassword);
      if (!success) { setStep('input'); return; }
      localStorage.setItem(`altair_onboarded_${invitedUser?.id}`, 'true');
    } catch (err: any) {
      useAuthStore.setState({ error: err.message });
      setStep('input');
    }
  };

  return {
    loginMode, setLoginMode, email, setEmail, password, setPassword,
    newPassword, setNewPassword, firstName, setFirstName, lastName, setLastName,
    step, setStep, newAccountStep, setNewAccountStep, invitedUser,
    error, authLoading, activeStage, stages,
    handlePasswordSubmit, handleNewAccountVerifyEmail, handleNewAccountCreateProfile
  };
}
