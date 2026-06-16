# INC-001: Cross-Post Poll Voting Vulnerability

## Problem
A security audit revealed that the `/api/feed/[id]/vote` endpoint did not verify if the provided `optionId` actually belonged to the `postId` specified in the URL. A malicious user could increment the vote count for any poll option in the database by sending a POST request to a different post's vote endpoint.

## Root Cause
The API logic only checked for a valid `optionId` and whether the user had already voted on the `postId`. It did not validate the relationship between `optionId` and `postId`.

## Fix Applied
Added a `prisma.feedPollOption.findFirst` check to ensure that the `optionId` belongs to the `postId` before processing the vote.
```typescript
const option = await prisma.feedPollOption.findFirst({
  where: { id: body.optionId, postId }
});
if (!option) return NextResponse.json({ error: 'Invalid option' }, { status: 422 });
```

## Prevention
Implement strict relationship verification in all dynamic route APIs where multiple related IDs are involved (e.g., comments on posts, messages in spaces).

## Affected Files
- `basic-crm/app/api/feed/[id]/vote/route.ts`

## Business Rules
- BR-FEED-001: A user may only vote for options that belong to the post they are interacting with.
