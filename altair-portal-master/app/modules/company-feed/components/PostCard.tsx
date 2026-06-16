"use client";
/**
 * @file /app/modules/company-feed/components/PostCard.tsx
 */
import React, { useState } from 'react';
import { FeedPost } from '../types';
import { Calendar, MessageSquare, Star, HelpCircle, Heart, User, BarChart2, Megaphone, Send } from 'lucide-react';
import { useAuthStore } from '../../team/authStore';

export default function PostCard({ post }: { post: FeedPost }) {
  const currentUser = useAuthStore(s => s.currentUser);
  const [pollData, setPollData] = useState(post.pollOptions || []);
  const [reactions, setReactions] = useState(post.reactions || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isReacting, setIsReacting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const isEvent = post.type === 'EVENT';
  const isQuestion = post.type === 'QUESTION' || post.type === 'DISCUSSION';
  const isStar = post.type === 'STAR';
  const isPoll = post.type === 'POLL';
  const isAnnouncement = post.type === 'ANNOUNCEMENT';

  const userReacted = reactions.some(r => r.userId === currentUser?.id);

  const handleReact = async () => {
    if (!currentUser || isReacting) return;
    setIsReacting(true);

    // Optimistic UI
    const emoji = '❤️';
    if (userReacted) {
      setReactions(prev => prev.filter(r => r.userId !== currentUser.id));
    } else {
      setReactions(prev => [...prev, { id: 'temp', postId: post.id, userId: currentUser.id, emoji, createdAt: new Date().toISOString() }]);
    }

    try {
      const res = await fetch(`/api/feed/${post.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      });
      if (!res.ok) throw new Error('Failed to react');
    } catch (e) {
      console.error(e);
      // Revert optimistic UI
      setReactions(post.reactions || []);
    } finally {
      setIsReacting(false);
    }
  };

  const handleCommentLike = (commentId: string, isReply = false, parentId?: string) => {
    if (!currentUser) return;
    setComments(prev => prev.map(c => {
      if (!isReply && c.id === commentId) {
        const likes = c.likes || [];
        const hasLiked = likes.includes(currentUser.id);
        return { ...c, likes: hasLiked ? likes.filter(id => id !== currentUser.id) : [...likes, currentUser.id] };
      }
      if (isReply && c.id === parentId) {
        return {
          ...c,
          replies: c.replies?.map(r => {
            if (r.id === commentId) {
              const likes = r.likes || [];
              const hasLiked = likes.includes(currentUser.id);
              return { ...r, likes: hasLiked ? likes.filter(id => id !== currentUser.id) : [...likes, currentUser.id] };
            }
            return r;
          })
        };
      }
      return c;
    }));
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim() || isCommenting) return;
    setIsCommenting(true);

    try {
      const res = await fetch(`/api/feed/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim(), replyingTo })
      });
      
      let newComment;
      if (res.ok) {
        newComment = await res.json();
      } else {
        newComment = {
          id: Math.random().toString(36).substring(2, 9),
          postId: post.id,
          authorId: currentUser.id,
          authorName: `${currentUser.firstName} ${currentUser.lastName}`,
          content: commentText.trim(),
          createdAt: new Date().toISOString(),
          likes: [],
          replies: []
        };
      }

      setComments(prev => {
        if (replyingTo) {
          return prev.map(c => {
            if (c.id === replyingTo) {
              return { ...c, replies: [...(c.replies || []), newComment] };
            }
            return c;
          });
        }
        return [...prev, newComment];
      });
      setCommentText('');
      setReplyingTo(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!currentUser) return;
    
    // Optimistic UI
    const currentVote = pollData.find(opt => opt.votesList?.some(v => v.userId === currentUser.id));
    if (currentVote?.id === optionId) return;

    setPollData(prev => prev.map(opt => {
      let newOpt = { ...opt };
      // Remove old vote
      if (opt.id === currentVote?.id) {
        newOpt.votes = Math.max(0, opt.votes - 1);
        newOpt.votesList = opt.votesList?.filter(v => v.userId !== currentUser.id);
      }
      // Add new vote
      if (opt.id === optionId) {
        newOpt.votes += 1;
        newOpt.votesList = [...(opt.votesList || []), { id: 'temp', postId: post.id, optionId, userId: currentUser.id, createdAt: new Date().toISOString() }];
      }
      return newOpt;
    }));

    try {
      const res = await fetch(`/api/feed/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId })
      });
      if (!res.ok) throw new Error('Vote failed');
    } catch(e) {
      console.error(e);
      // Revert in case of error
      setPollData(post.pollOptions || []);
    }
  };

  const totalVotes = pollData.reduce((sum, opt) => sum + opt.votes, 0);
  const userVotedOption = pollData.find(opt => opt.votesList?.some(v => v.userId === currentUser?.id));
  
  return (
    <div className="bg-white border border-slate-200 rounded-[10px] shadow-sm mb-4 overflow-hidden">
       <div className="p-4 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-black text-xs flex items-center justify-center">
               <User className="w-5 h-5"/>
             </div>
             <div>
                <h4 className="font-bold text-slate-800 leading-tight">{post.authorName}</h4>
                <div className="text-sm font-medium text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center">
            {isEvent && <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Event</span>}
            {isQuestion && <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Discussion</span>}
            {isStar && <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1"><Star className="w-3 h-3" /> Recognition</span>}
            {isPoll && <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1"><BarChart2 className="w-3 h-3" /> Poll</span>}
            {isAnnouncement && <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-black uppercase tracking-wider flex items-center gap-1"><Megaphone className="w-3 h-3" /> Announcement</span>}
          </div>
       </div>
       
       <div className="p-4">
          {isAnnouncement && (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded p-4 mb-4">
               <h3 className="text-indigo-900 font-bold text-lg">{post.title || 'Important Announcement'}</h3>
            </div>
          )}
          
          {isEvent && (
            <div className="bg-rose-50/50 border border-rose-100 rounded p-4 mb-4">
               <h3 className="text-rose-900 font-bold text-lg">{post.title || 'Company Event'}</h3>
               <p className="text-rose-700/80 font-bold text-xs mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {post.eventDate ? new Date(post.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
               </p>
            </div>
          )}
          
          {isStar && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded p-4 mb-4 flex items-center gap-4">
               <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                 <Star className="w-6 h-6 text-emerald-600" />
               </div>
               <div>
                 <p className="text-emerald-900 font-black">Shoutout to {post.title || 'a teammate'}!</p>
               </div>
            </div>
          )}
          
          {isPoll && (
            <div className="bg-purple-50/50 border border-purple-100 rounded p-4 mb-4">
               <h3 className="text-purple-900 font-bold text-lg mb-3">{post.title || 'Poll'}</h3>
               <div className="space-y-2">
                 {pollData.map(opt => {
                   const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                   const isSelected = userVotedOption?.id === opt.id;
                   
                   return (
                     <div 
                       key={opt.id} 
                       onClick={() => handleVote(opt.id)}
                       className={`relative overflow-hidden rounded-lg border p-3 cursor-pointer transition-colors ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                     >
                       <div 
                         className="absolute top-0 left-0 bottom-0 bg-purple-100/50 transition-all duration-500 z-0"
                         style={{ width: `${percentage}%` }}
                       />
                       <div className="relative z-10 flex justify-between items-center">
                         <span className={`text-sm font-bold ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>{opt.text}</span>
                         {userVotedOption && (
                           <span className="text-xs font-bold text-slate-500">{percentage}% ({opt.votes})</span>
                         )}
                       </div>
                     </div>
                   );
                 })}
               </div>
               <p className="text-xs font-bold text-purple-700/60 mt-3">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</p>
            </div>
          )}
          
          {post.content && <p className="text-slate-700 text-sm whitespace-pre-wrap font-medium">{post.content}</p>}
       </div>
       
       <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
          <button 
            onClick={handleReact}
            className={`flex items-center gap-1.5 transition-colors text-xs font-bold ${userReacted ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'}`}
          >
            <Heart className={`w-4 h-4 ${userReacted ? 'fill-rose-600' : ''}`} /> {reactions.length} 
          </button>
          <button 
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`flex items-center gap-1.5 transition-colors text-xs font-bold ${isCommentsOpen ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
          >
            <MessageSquare className="w-4 h-4" /> {comments.length}
          </button>
       </div>

       {isCommentsOpen && (
         <div className="bg-white border-t border-slate-100 p-4 space-y-4">
            <div className="space-y-4">
               {comments.map(comment => (
                 <div key={comment.id} className="flex flex-col gap-2">
                    <div className="flex gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                       </div>
                       <div className="flex-1">
                          <div className="flex items-start justify-between">
                             <p className="text-sm font-medium text-slate-800 leading-snug">
                                <span className="font-bold mr-2 text-slate-900">{comment.authorName}</span>
                                {comment.content}
                             </p>
                             <button 
                               onClick={() => handleCommentLike(comment.id)} 
                               className="ml-2 mt-0.5 shrink-0"
                             >
                               <Heart className={`w-3.5 h-3.5 transition-colors ${comment.likes?.includes(currentUser?.id || '') ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-slate-600'}`} />
                             </button>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                             <span className="text-[11px] font-medium text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                             {comment.likes && comment.likes.length > 0 && (
                               <span className="text-[11px] font-bold text-slate-500">{comment.likes.length} {comment.likes.length === 1 ? 'like' : 'likes'}</span>
                             )}
                             <button 
                               onClick={() => setReplyingTo(comment.id)} 
                               className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                             >
                               Reply
                             </button>
                          </div>
                       </div>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-11 space-y-3 mt-1">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex gap-3">
                             <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                <User className="w-3 h-3 text-slate-500" />
                             </div>
                             <div className="flex-1">
                                <div className="flex items-start justify-between">
                                   <p className="text-sm font-medium text-slate-800 leading-snug">
                                      <span className="font-bold mr-2 text-slate-900">{reply.authorName}</span>
                                      {reply.content}
                                   </p>
                                   <button 
                                     onClick={() => handleCommentLike(reply.id, true, comment.id)} 
                                     className="ml-2 mt-0.5 shrink-0"
                                   >
                                     <Heart className={`w-3.5 h-3.5 transition-colors ${reply.likes?.includes(currentUser?.id || '') ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-slate-600'}`} />
                                   </button>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                   <span className="text-[11px] font-medium text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                   {reply.likes && reply.likes.length > 0 && (
                                     <span className="text-[11px] font-bold text-slate-500">{reply.likes.length} {reply.likes.length === 1 ? 'like' : 'likes'}</span>
                                   )}
                                   <button 
                                     onClick={() => setReplyingTo(comment.id)} 
                                     className="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                                   >
                                     Reply
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               ))}
            </div>

            <form onSubmit={handleComment} className="flex flex-col gap-2 mt-4 relative border-t border-slate-100 pt-4">
               {replyingTo && (
                 <div className="flex items-center justify-between bg-slate-100 rounded-md px-3 py-1.5 text-xs font-bold text-slate-600">
                   <span>Replying to comment...</span>
                   <button type="button" onClick={() => setReplyingTo(null)} className="hover:text-slate-900">Cancel</button>
                 </div>
               )}
               <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                     <span className="text-[10px] font-black text-white">{currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}</span>
                  </div>
                  <div className="flex-1 relative">
                     <input 
                       type="text" 
                       placeholder="Add a comment..."
                       value={commentText}
                       onChange={e => setCommentText(e.target.value)}
                       className="w-full bg-transparent border-0 py-2 text-sm font-medium focus:outline-none focus:ring-0 placeholder-slate-400 pr-10"
                     />
                     <button 
                       type="submit"
                       disabled={!commentText.trim() || isCommenting}
                       className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500 disabled:text-slate-300 transition-colors font-bold text-sm"
                     >
                        Post
                     </button>
                  </div>
               </div>
            </form>
         </div>
       )}
    </div>
  );
}
