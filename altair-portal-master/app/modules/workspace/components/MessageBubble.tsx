"use client";
/**
 * @component MessageBubble
 * @description Renders a single message bubble (flat style like Snapchat)
 */
import React from 'react';
import { Message } from '../types';
import { useAuthStore } from '../../team/authStore';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

export default function MessageBubble({ message }: { message: Message }) {
  const currentUser = useAuthStore(s => s.currentUser);
  const isMe = message.senderId === currentUser?.id;
  const sender = message.sender;

  return (
    <div className={cn("flex w-full px-4 mb-1 group hover:bg-slate-50 py-1 transition-colors")}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 mt-1 mr-3 flex items-center justify-center text-xs font-bold text-slate-500">
           {sender?.photoUrl ? (
             /* eslint-disable-next-line @next/next/no-img-element */
             <img src={sender.photoUrl} alt="" className="w-full h-full object-cover" />
           ) : (
             <User className="w-4 h-4" />
           )}
        </div>
      )}
      
      <div className={cn("flex flex-col flex-1", isMe ? "items-end" : "items-start")}>
        {!isMe && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-bold text-slate-900 leading-none">
              {sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown User'}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
        
        {isMe && (
          <div className="flex items-center gap-2 mb-1">
             <span className="text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
               {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
             <span className="text-[13px] font-bold text-slate-900 leading-none">Me</span>
          </div>
        )}

        <div className={cn(
            "text-sm font-medium",
            isMe ? "bg-blue-50 text-blue-900 px-3 py-2 rounded-2xl rounded-tr-sm" : "bg-white border border-slate-100 text-slate-800 px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm"
        )}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
