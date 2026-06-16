/**
 * @file /app/modules/company-feed/types.ts
 */
export interface FeedPollVote {
  id: string;
  postId: string;
  optionId: string;
  userId: string;
  createdAt: string;
}

export interface FeedPollOption {
  id: string;
  postId: string;
  text: string;
  votes: number;
  votesList?: FeedPollVote[];
}

export interface FeedReaction {
  id: string;
  postId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  type: string;
  title: string | null;
  content: string;
  eventDate: string | null;
  createdAt: string;
  updatedAt: string;
  pollOptions?: FeedPollOption[];
  comments?: FeedComment[];
  reactions?: FeedReaction[];
  _count?: {
    comments: number;
    reactions: number;
  };
}

export interface FeedComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes?: string[];
  replies?: FeedComment[];
}

export interface FeedStore {
  posts: FeedPost[];
  comments: FeedComment[];
  setPosts: (posts: FeedPost[]) => void;
  addPost: (post: FeedPost) => void;
}
