# Module: Company Feed (@feed)
# Status: Audited & Hardened (Phase 1)
# Team: Logic / UI / Security

## Overview
The Company Feed is a Yammer-style internal social platform for announcements, discussions, events, recognition (Stars), and polls.

## Domain Concepts
- **FeedPost**: Central entity for all feed content.
- **FeedPostType**: `ANNOUNCEMENT`, `UPDATE`, `EVENT`, `POLL`, `DISCUSSION`, `STAR`.
- **Engagement**: Comments and emoji reactions (Hearts).
- **Polls**: Multi-option voting with unique constraints.

## Security (Hardened)
- **Permissions**:
  - `view_feed`: View posts, reactions, and comments.
  - `publish_to_feed`: Create new posts.
  - `comment_on_feed`: Add replies to posts.
  - `react_to_feed`: Add/remove emoji reactions.
  - `delete_feed_posts`: Super Admin only.
- **RBAC Enforcement**: All APIs verified with `requirePermission`.
- **Vulnerability Patch (INC-001)**: Fixed cross-post voting where `optionId` was not verified against `postId`.
- **Identity Integrity**: `authorId` is strictly sourced from the session, never from client input.

## API Endpoints
- `GET /api/feed`: Returns latest posts with nested comments, reactions, and poll results.
- `POST /api/feed`: Create a new post.
- `POST /api/feed/[id]/vote`: Vote on a poll post (toggle logic).
- `POST /api/feed/[id]/comments`: Add a reply.
- `POST /api/feed/[id]/react`: Toggle a heart reaction.

## Implementation Notes
- **Optimistic UI**: Voting and Reactions use optimistic updates with error reversal.
- **STAR Posts**: Recognition posts are restricted to Managers and Admins.
- **Real-time**: (Planned) Integration with Supabase Realtime for live feed updates.

## Known Limitations
- Sidebars ("Upcoming", "Trending") are currently static placeholders.
- PII Masking: User IDs are exposed in reactions/votes (acceptable for internal tool).
