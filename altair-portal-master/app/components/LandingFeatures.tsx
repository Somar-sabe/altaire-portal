"use client";
/**
 * @file /app/components/LandingFeatures.tsx
 * @purpose Renders the features grid for the landing page.
 */

import React from 'react';
import { Workflow, Lock, Zap } from 'lucide-react';

export default function LandingFeatures() {
  const features = [
    { title: 'Unified Hub', icon: <Workflow className="w-4 h-4 text-slate-700" />, desc: 'Consolidate workflow status trackers, directories, and secure communications into one unified, low-latency pane.' },
    { title: 'Tiered Auth', icon: <Lock className="w-4 h-4 text-slate-700" />, desc: 'Granular permission models with automatic compliance rules. Protect system properties securely using built-in security features.' },
    { title: 'Instant Sync', icon: <Zap className="w-4 h-4 text-emerald-600" />, desc: 'Changes propagate in real-time. Administrative updates have instant effect across all client active sessions.' }
  ];

  return (
    <div className="py-20 bg-white border-t border-slate-200/60 relative">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col gap-3 text-left p-6 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-all hover:shadow-sm">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-xs">
              {f.icon}
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{f.title}</h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-wider">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
