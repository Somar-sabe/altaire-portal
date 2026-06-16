"use client";
/**
 * @file /app/modules/company-feed/components/FeedComposer.tsx
 */
import React, { useState } from 'react';
import { useAuthStore } from '../../team/authStore';
import { useFeedStore } from '../store';
import { MessageSquare, Calendar, HelpCircle, Star, Send, BarChart2, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedComposer() {
  const currentUser = useAuthStore(s => s.currentUser);
  const { addPost } = useFeedStore();
  const [content, setContent] = useState('');
  const [type, setType] = useState('POST'); // POST, EVENT, QUESTION, STAR, ANNOUNCEMENT
  
  const [eventDate, setEventDate] = useState('');
  const [title, setTitle] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const isManagerOrAdmin = currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

  const isValid = () => {
    if (type === 'POST' || type === 'QUESTION' || type === 'ANNOUNCEMENT') return !!content.trim();
    if (type === 'POLL') return !!title.trim() && pollOptions.filter(o => o.trim()).length >= 2;
    if (type === 'EVENT') return !!title.trim() && !!eventDate && !!content.trim();
    if (type === 'STAR') return !!title.trim() && !!content.trim();
    return false;
  };

  const handlePost = async () => {
    if (!isValid()) return;

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'QUESTION' ? 'DISCUSSION' : type,
          content: content.trim() ? content : ' ',
          title: title || null,
          eventDate: eventDate || null,
          pollOptions: type === 'POLL' ? pollOptions.filter(o => o.trim() !== '') : undefined
        })
      });

      if (res.ok) {
        const newPost = await res.json();
        addPost(newPost);
        setContent('');
        setTitle('');
        setEventDate('');
        setType('POST');
        setPollOptions(['', '']);
      }
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white border text-sm border-slate-200 rounded-[10px] shadow-sm mb-6 overflow-hidden">
       {/* Type Selector Tabs */}
       <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setType('POST')}
            className={cn("flex-1 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors", type === 'POST' ? "text-blue-600 border-b-2 border-blue-600 bg-white" : "text-slate-400 hover:bg-slate-100")}
          >
            <MessageSquare className="w-4 h-4" /> Post
          </button>
          
          {isManagerOrAdmin && (
            <button 
              onClick={() => setType('ANNOUNCEMENT')}
              className={cn("flex-1 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors", type === 'ANNOUNCEMENT' ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-slate-400 hover:bg-slate-100")}
            >
              <Megaphone className="w-4 h-4" /> Announcement
            </button>
          )}

          <button 
            onClick={() => setType('POLL')}
            className={cn("flex-1 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors", type === 'POLL' ? "text-purple-600 border-b-2 border-purple-600 bg-white" : "text-slate-400 hover:bg-slate-100")}
          >
            <BarChart2 className="w-4 h-4" /> Poll
          </button>
          
          <button 
            onClick={() => setType('EVENT')}
            className={cn("flex-1 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors", type === 'EVENT' ? "text-rose-600 border-b-2 border-rose-600 bg-white" : "text-slate-400 hover:bg-slate-100")}
          >
            <Calendar className="w-4 h-4" /> Event
          </button>
          
          <button 
            onClick={() => setType('QUESTION')}
            className={cn("flex-1 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors", type === 'QUESTION' ? "text-amber-600 border-b-2 border-amber-600 bg-white" : "text-slate-400 hover:bg-slate-100")}
          >
            <HelpCircle className="w-4 h-4" /> Question
          </button>
          
          {isManagerOrAdmin && (
            <button 
              onClick={() => setType('STAR')}
              className={cn("flex-1 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors", type === 'STAR' ? "text-emerald-600 border-b-2 border-emerald-600 bg-white" : "text-slate-400 hover:bg-slate-100")}
            >
              <Star className="w-4 h-4" /> Star
            </button>
          )}
       </div>

       <div className="p-4">
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center shrink-0">
               {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
             </div>
             <div className="flex-1">
                {(type === 'EVENT' || type === 'ANNOUNCEMENT') && (
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      placeholder={type === 'EVENT' ? "Event Title..." : "Announcement Title..."}
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:outline-none focus:border-slate-400"
                    />
                    {type === 'EVENT' && (
                      <input 
                        type="date"
                        value={eventDate}
                        onChange={e => setEventDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:outline-none focus:border-slate-400"
                      />
                    )}
                  </div>
                )}
                {type === 'STAR' && (
                  <div className="mb-3">
                    <input 
                      type="text" 
                      placeholder="Who are you recognizing?"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:outline-none focus:border-slate-400"
                    />
                  </div>
                )}
                {type === 'POLL' && (
                  <div className="mb-3 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="Poll Question..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:outline-none focus:border-slate-400"
                    />
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={e => {
                            const newOpts = [...pollOptions];
                            newOpts[i] = e.target.value;
                            setPollOptions(newOpts);
                          }}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-slate-400"
                        />
                        {i >= 2 && (
                          <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="text-red-500 font-bold px-2 text-xs">X</button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 5 && (
                      <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-xs font-bold text-blue-600 text-left w-fit mt-1">+ Add Option</button>
                    )}
                  </div>
                )}
                <textarea 
                  placeholder={
                    type === 'POST' ? "What's happening?" :
                    type === 'EVENT' ? "Describe the event details..." :
                    type === 'QUESTION' ? "What do you want to ask the company?" :
                    type === 'POLL' ? "Add any additional context for the poll..." :
                    type === 'ANNOUNCEMENT' ? "Provide details for the announcement..." :
                    "Why are they getting a star?"
                  }
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 resize-none min-h-[60px] text-sm font-medium outline-none p-0 mb-4"
                />
                
                <div className="flex justify-end">
                   <button 
                     onClick={handlePost}
                     disabled={!isValid()}
                     className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2"
                   >
                     <span>Post</span>
                     <Send className="w-3 h-3" />
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
