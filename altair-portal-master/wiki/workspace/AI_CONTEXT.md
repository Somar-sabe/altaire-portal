# AI Context: Workspace Module

## Module Purpose
The Workspace Module implements a Realtime Messages Hub, mimicking an enterprise communication platform (like Slack or Microsoft Teams). It allows CRM users and administrators to communicate in either public "Spaces" (channels) or private "Direct Messages" (1-to-1 conversations).

## Entities
1. **WorkspaceSpace**: A public channel for team-wide cooperation.
2. **SpaceMember**: Maps users to spaces with custom roles (ADMIN, MEMBER).
3. **Message**: Contains sender, content (HTML/rich-text supported), creation date, and targets either a `spaceId` or a `receiverId`.

## Business Rules & Logic
- **Tabbed Layout**: The workspace sidebar is split into two primary tabs: `Spaces` and `Direct Messages`.
- **Unread Tracking**: Unread counts are computed clientside by contrasting the message timestamp `createdAt` with the user's `lastViewed` epoch persisted in local state (`localStorage`).
- **Auto-Read Sync**: Viewing a specific space or user dialogue updates the associated `lastViewed` timestamp to the present time, instantly clearing active unread indicators.

## System Dependencies
- **Zustand Store**: `/app/modules/workspace/store.ts` orchestrates active selections, message logs, and space lists.
- **Client Polling**: `/app/modules/workspace/workspace.module.tsx` runs an active 3-second cycle pulling updates from `/api/workspace/messages`.
