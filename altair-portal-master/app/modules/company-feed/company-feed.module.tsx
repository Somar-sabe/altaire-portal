/**
 * @file /app/modules/company-feed/company-feed.module.tsx
 */
'use client';
import React, { useEffect } from 'react';
import FeedComposer from './components/FeedComposer';
import FeedTimeline from './components/FeedTimeline';
import { useFeedStore } from './store';
import { Bell, Hash } from 'lucide-react';
import { fetchPaginatedCollection } from '@/lib/paginated-fetch';
import type { FeedPost } from './types';

export default function CompanyFeedModule() {
  const setPosts = useFeedStore(s => s.setPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // GPT-Codex (G) BEGIN: load feed timeline through cursor pages.
        const data = await fetchPaginatedCollection<FeedPost>('/api/feed');
        setPosts(data);
        // GPT-Codex (G) END: timeline state continues to receive a flat post array.
      } catch(e) {
        console.error("Failed to fetch posts", e);
      }
    };
    fetchPosts();
  }, [setPosts]);

  return (
    <div className="flex w-full max-w-[1024px] mx-auto gap-6 max-h-[calc(100vh-8rem)]">
       {/* Left/Center Column - Main Feed */}
       <div className="flex-[2] max-w-3xl overflow-y-auto pr-2 pb-12 scrollbar-thin">
          <FeedComposer />
          <FeedTimeline />
       </div>
       
       {/* Right panel trending/sidebar */}
       <div className="flex-1 hidden lg:block sticky top-0">
          <div className="bg-white border border-slate-200 rounded-[10px] shadow-sm p-5 mb-4">
             <h3 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
               <Bell className="w-4 h-4 text-slate-400" /> Upcoming
             </h3>
             <ul className="space-y-3">
               <li className="text-sm font-medium text-slate-600 block">End of Q2 All Hands</li>
               <li className="text-sm font-medium text-slate-600 block">Product Launch Sync</li>
             </ul>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[10px] shadow-sm p-5">
             <h3 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
               <Hash className="w-4 h-4 text-slate-400" /> Trending Topics
             </h3>
             <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded cursor-pointer hover:bg-slate-200 transition-colors">#Engineering</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded cursor-pointer hover:bg-slate-200 transition-colors">#Updates</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded cursor-pointer hover:bg-slate-200 transition-colors">#Praise</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded cursor-pointer hover:bg-slate-200 transition-colors">#Offsite2026</span>
             </div>
          </div>
       </div>
    </div>
  );
}
