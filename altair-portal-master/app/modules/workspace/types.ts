/**
 * @file /app/modules/workspace/types.ts
 * @description Types for Workspace module
 */

import { TeamUser as User } from '../team/types';

export interface Message {
  id: string;
  spaceId: string | null;
  senderId: string;
  receiverId: string | null;
  content: string;
  isRichText: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
}

export interface WorkspaceSpace {
  id: string;
  name: string;
  description: string | null;
  privacy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceMember {
  id: string;
  spaceId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export interface WorkspaceStore {
  spaces: WorkspaceSpace[];
  activeSpaceId: string | null;
  activeDirectUserId: string | null;
  messages: Message[];
  members: User[];
  setActiveSpace: (spaceId: string | null) => void;
  setActiveDirectUser: (userId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setSpaces: (spaces: WorkspaceSpace[]) => void;
  setMembers: (members: User[]) => void;
}
