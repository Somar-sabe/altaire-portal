"use client";
/**
 * @file /app/components/LoginScreen.tsx
 * @purpose Minimal, clean light-themed login lockscreen representing both registered access and pending invitations.
 */
'use client';

import React from 'react';
import { useAuthStore } from '../modules/team/authStore';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sub-components
import LoginForm from './LoginForm';
import InviteVerifyStep from './InviteVerifyStep';
import InviteProfileStep from './InviteProfileStep';
import LoginSubmittingState from './LoginSubmittingState';

// Hooks
import { useLoginFlow } from '../hooks/useLoginFlow';

interface LoginScreenProps {
  onBackToLanding?: () => void;
}

export default function LoginScreen({ onBackToLanding }: LoginScreenProps) {
  const {
    loginMode, setLoginMode, email, setEmail, password, setPassword,
    newPassword, setNewPassword, firstName, setFirstName, lastName, setLastName,
    step, newAccountStep, error, authLoading, activeStage, stages,
    handlePasswordSubmit, handleNewAccountVerifyEmail, handleNewAccountCreateProfile
  } = useLoginFlow();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 relative select-none antialiased text-slate-800">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
      
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full max-w-sm bg-white border border-slate-205 rounded-[12px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] z-10 relative">
        {onBackToLanding && step === 'input' && (
          <button type="button" onClick={onBackToLanding} className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition-colors p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
        )}

        <div className="text-center mb-6">
          <div className="text-2xl font-black tracking-tight text-slate-900 mb-1 flex items-center justify-center gap-0.5">altair<span className="text-emerald-500 font-extrabold">:</span></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Enterprise Unified Administration</p>
        </div>

        {step === 'input' && (
          <div className="flex bg-slate-50 border border-slate-200/60 p-1 rounded-[10px] mb-6">
            <button type="button" onClick={() => { setLoginMode('registered'); useAuthStore.setState({ error: null }); }} className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${loginMode === 'registered' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}>Registered Account</button>
            <button type="button" onClick={() => { setLoginMode('new'); useAuthStore.setState({ error: null }); }} className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${loginMode === 'new' ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}>New Account</button>
          </div>
        )}

        {error && step === 'input' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3.5 bg-rose-50 border border-rose-100/80 rounded-lg flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-rose-900 block">Access Restricted</span>
              <p className="text-xs font-semibold text-rose-600 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 'submitting' ? (
            <LoginSubmittingState stages={stages} activeStage={activeStage} />
          ) : loginMode === 'registered' ? (
            <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} authLoading={authLoading} onSubmit={handlePasswordSubmit} />
          ) : newAccountStep === 1 ? (
            <InviteVerifyStep email={email} setEmail={setEmail} authLoading={authLoading} onSubmit={handleNewAccountVerifyEmail} />
          ) : (
            <InviteProfileStep firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} newPassword={newPassword} setNewPassword={setNewPassword} authLoading={authLoading} onSubmit={handleNewAccountCreateProfile} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
