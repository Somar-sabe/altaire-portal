"use client";
/**
 * @file /app/modules/settings/components/NotificationsForm.tsx
 * @description Notification preferences form managing Delivery Channels and Topic Subscriptions.
 *
 * @dependencies
 * - react
 * - lucide-react: Mail, Smartphone, Volume2, Layers
 *
 * @relatedFiles
 * - /app/modules/settings/SettingsModule.tsx
 *
 * @exports
 * - NotificationsForm
 *
 * @lastModified 2026-05-25
 * @workplan WP-008
 */

'use client';

import React, { useState } from 'react';
import { Mail, Smartphone, Volume2, Layers } from 'lucide-react';

export function NotificationsForm() {
  const [channels, setChannels] = useState({
    emailAlerts: true,
    pushNotifications: true,
    soundEffects: false,
    weeklyDigests: true,
  });

  const [topics, setTopics] = useState({
    securityAlerts: true,
    systemLogs: true,
    teamMentions: false,
  });

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTopic = (key: keyof typeof topics) => {
    setTopics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-white">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
        <p className="text-sm text-slate-500 dark:text-slate-450 mt-1">Configure delivery channels and preference topics for activity alerts.</p>
      </div>

      {/* Section 1: Delivery Channels */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/85 pb-2">Delivery Channels</h3>
        <div className="space-y-4">
          {[
            {
              key: 'emailAlerts' as const,
              title: 'Email Notifications',
              desc: 'Receive important updates directly in your mailbox.',
              icon: <Mail className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
              active: channels.emailAlerts
            },
            {
              key: 'pushNotifications' as const,
              title: 'Push Alerts',
              desc: 'Render instant browser indicators and soundless floating banners.',
              icon: <Smartphone className="w-5 h-5 text-emerald-500 dark:text-emerald-450" />,
              active: channels.pushNotifications
            },
            {
              key: 'soundEffects' as const,
              title: 'Audio Chime',
              desc: 'Play a subtle notification sound when a live message appears.',
              icon: <Volume2 className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
              active: channels.soundEffects
            },
            {
              key: 'weeklyDigests' as const,
              title: 'Weekly Summaries',
              desc: 'Compile logs, user counts, and system metrics in a weekend digest.',
              icon: <Layers className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
              active: channels.weeklyDigests
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-[12px] transition-all gap-4">
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-[8px] border border-slate-100 dark:border-slate-700 shadow-xs shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-normal">{item.desc}</div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => toggleChannel(item.key)}
                className={`w-10 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${item.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-1 left-1 bg-white dark:bg-slate-100 w-4 h-4 rounded-full transition-transform ${item.active ? 'translate-x-4' : 'translate-x-0'}`}></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Subscriptions & Topics */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800/85 pb-2">Subscription Contexts</h3>
        <div className="space-y-4">
          {[
            {
              key: 'securityAlerts' as const,
              title: 'Security and Authentication Triggers',
              desc: 'Triggered by user status changes, 2FA setup access, or manager updates.',
              active: topics.securityAlerts
            },
            {
              key: 'systemLogs' as const,
              title: 'System Operational Snapshots',
              desc: 'Triggered by database migration completion, cache resets, and scheduled events.',
              active: topics.systemLogs
            },
            {
              key: 'teamMentions' as const,
              title: 'Managerial & Colleague Action Alerts',
              desc: 'Triggered when sub-employees invoke details changes or task assignments.',
              active: topics.teamMentions
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-[12px] transition-all gap-4">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-normal">{item.desc}</div>
              </div>
              <button 
                type="button"
                onClick={() => toggleTopic(item.key)}
                className={`w-10 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${item.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-1 left-1 bg-white dark:bg-slate-100 w-4 h-4 rounded-full transition-transform ${item.active ? 'translate-x-4' : 'translate-x-0'}`}></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/85 flex justify-end">
        <button className="w-full sm:w-auto bg-black dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white px-5 py-2.5 rounded-[10px] text-xs font-bold shadow-sm transition-colors cursor-pointer">
          Save Preference
        </button>
      </div>
    </div>
  );
}
