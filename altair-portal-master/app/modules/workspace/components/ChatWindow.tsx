"use client";
/**
 * @component ChatWindow
 * @description The active chat frame
 */
import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../store';
import { useAuthStore } from '../../team/authStore';
import MessageBubble from './MessageBubble';
import { Send, Image as ImageIcon, Paperclip } from 'lucide-react';

export default function ChatWindow() {
  const { activeSpaceId, activeDirectUserId, messages, spaces, members, addMessage } = useWorkspaceStore();
  const currentUser = useAuthStore(s => s.currentUser);
  
  const [inputText, setInputText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeSpaceId && !activeDirectUserId) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center rounded-r-[10px]">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
           <Send className="w-6 h-6 text-slate-300" />
         </div>
         <h3 className="text-lg font-black text-slate-800">Your Workspace</h3>
         <p className="text-sm font-medium text-slate-500 mt-2">Select a space or conversation to start messaging</p>
      </div>
    );
  }

  const isDirect = !!activeDirectUserId;
  const activeEntity = isDirect 
    ? members.find(m => m.id === activeDirectUserId)
    : spaces.find(s => s.id === activeSpaceId);

  const headerTitle = isDirect 
    ? (activeEntity ? `${(activeEntity as any).firstName} ${(activeEntity as any).lastName}` : '...')
    : (activeEntity ? (activeEntity as any).name : '...');

  // Filter messages
  const filteredMessages = messages.filter(m => {
    if (isDirect) {
      return (m.senderId === currentUser?.id && m.receiverId === activeDirectUserId) ||
             (m.senderId === activeDirectUserId && m.receiverId === currentUser?.id);
    } else {
      return m.spaceId === activeSpaceId;
    }
  }).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSend = async () => {
    if (!inputText.trim() || !currentUser) return;

    try {
      const parentIdStr = isDirect ? `receiverId=${activeDirectUserId}` : `spaceId=${activeSpaceId}`;
      const res = await fetch(`/api/workspace/messages?${parentIdStr}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText.trim() })
      });
      if (res.ok) {
        const newMsg = await res.json();
        // Optimistic add (if not polling fast enough)
        addMessage(newMsg);
        setInputText("");
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full rounded-r-[10px]">
       {/* Header */}
       <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)] z-10">
         <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-[15px]">{headerTitle}</span>
            </div>
         </div>
       </div>

       {/* Messages area */}
       <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2">
         {filteredMessages.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <p className="text-sm font-medium">No messages yet. Say hello!</p>
           </div>
         ) : (
           filteredMessages.map(msg => <MessageBubble key={msg.id} message={msg} />)
         )}
         <div ref={endRef} />
       </div>

       {/* Composer */}
       <div className="p-4 bg-white border-t border-slate-100">
         <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-[16px] p-2 focus-within:bg-white focus-within:border-slate-300 transition-colors shadow-sm">
           <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 shrink-0 mb-0.5">
             <Paperclip className="w-5 h-5" />
           </button>
           <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 shrink-0 mb-0.5 hidden sm:flex">
             <ImageIcon className="w-5 h-5" />
           </button>
           
           <textarea
             value={inputText}
             onChange={e => setInputText(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder={isDirect ? `Message ${headerTitle}...` : `Message #${headerTitle}...`}
             className="flex-1 bg-transparent border-none focus:ring-0 resize-none min-h-[40px] max-h-[120px] py-2.5 px-2 text-sm font-medium outline-none scrollbar-thin overflow-y-auto"
             rows={1}
           />

           <button 
             onClick={handleSend}
             disabled={!inputText.trim()}
             className="p-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors rounded-full shrink-0 mb-0.5 shadow-sm"
           >
             <Send className="w-4 h-4 ml-0.5" />
           </button>
         </div>
       </div>
    </div>
  );
}
