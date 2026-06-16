# Workspace Module Wiki

## Overview
The Workspace Module manages asynchronous, near-realtime context collaboration. It forms the communication backbone of the CRM, enabling team coordinates and direct, ad-hoc chat lines.

## Business Goals
- **Enhance Operations Speed**: Allow team members to share immediate updates regarding active customer leads or platform alerts.
- **Isolate Conversations**: Separate systemic room logs from private personal correspondences.

## Domain Concepts
- **Space (Channel)**: A shared thread where anyone assigned can read and post.
- **Direct Conversation**: A locked dialogue between exactly two members.
- **Unread Count**: The tally of incoming messages sent by others since the current user last loaded that specific room or user chat.

## Entities
### WorkspaceSpace
- **Purpose**: Represents a chat room.
- **Fields**: `id`, `name`, `description`, `createdAt`, `updatedAt`

### Message
- **Purpose**: Individual chat transcript blocks.
- **Fields**: `id`, `spaceId`, `senderId`, `receiverId`, `content`, `isRichText`, `createdAt`, `updatedAt`

## Business Rules
1. **Unread Increment**: Any new message where `senderId !== currentUserId` and `createdAt > lastViewedTimestamp` increments the unread total for that item.
2. **Current View Safety**: If a Space or Direct Chat is active on-screen, its unread tally is forced to 0, updating its `lastViewedTimestamp` to `Date.now()`.
3. **Tabbed Sidebar Navigation**: Workspace Sidebar is divided into:
   - **Spaces Tab**: Shows room lists and their individual counters.
   - **Direct Tab**: Shows member circles and private thread counts.
   - Tab buttons display cumulative unread sums.

## User Workflows
1. **Toggle Tab**: User selects "Spaces" or "Direct" tab at the top.
2. **Read Chat**: Selecting a thread updates active view state, clears unread counts, and reveals previous conversation history.

## UI Screens
- **Workspace Sidebar**: Handles division parameters and tabs.
- **Chat Window**: Core interface displaying room titles, messaging feed, and composer.
