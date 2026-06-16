"use client";
/**
 * @file /app/modules/company-feed/components/FeedTimeline.tsx
 */
import React from 'react';
import { useFeedStore } from '../store';
import PostCard from './PostCard';

export default function FeedTimeline() {
  const posts = useFeedStore(s => s.posts);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-[10px] shadow-sm">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
           <span className="text-2xl">🧊</span>
         </div>
         <h3 className="text-lg font-black text-slate-800">It's quiet in here...</h3>
         <p className="text-sm font-medium text-slate-500 mt-2">Be the first to post something to the company feed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
