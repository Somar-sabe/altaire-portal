/**
 * @file /app/modules/company-feed/store.ts
 */
import { create } from 'zustand';
import { FeedStore } from './types';

export const useFeedStore = create<FeedStore>((set) => ({
  posts: [],
  comments: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));
