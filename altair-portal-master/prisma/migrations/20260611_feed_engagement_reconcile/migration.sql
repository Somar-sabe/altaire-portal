-- GPT-Codex (G) BEGIN: reconcile feed engagement schema left half-landed by prior agents.
ALTER TYPE "Permission" ADD VALUE IF NOT EXISTS 'edit_feed_posts';
ALTER TYPE "Permission" ADD VALUE IF NOT EXISTS 'react_to_feed';
ALTER TYPE "Permission" ADD VALUE IF NOT EXISTS 'delete_feed_comments';

ALTER TYPE "FeedPostType" ADD VALUE IF NOT EXISTS 'STAR';

CREATE TABLE IF NOT EXISTS "FeedPollVote" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedPollVote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "FeedPollVote_postId_userId_key" ON "FeedPollVote"("postId", "userId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FeedComment_postId_fkey'
    ) THEN
        ALTER TABLE "FeedComment"
        ADD CONSTRAINT "FeedComment_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "FeedPost"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FeedReaction_postId_fkey'
    ) THEN
        ALTER TABLE "FeedReaction"
        ADD CONSTRAINT "FeedReaction_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "FeedPost"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FeedPollOption_postId_fkey'
    ) THEN
        ALTER TABLE "FeedPollOption"
        ADD CONSTRAINT "FeedPollOption_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "FeedPost"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FeedPollVote_optionId_fkey'
    ) THEN
        ALTER TABLE "FeedPollVote"
        ADD CONSTRAINT "FeedPollVote_optionId_fkey"
        FOREIGN KEY ("optionId") REFERENCES "FeedPollOption"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FeedPollVote_postId_fkey'
    ) THEN
        ALTER TABLE "FeedPollVote"
        ADD CONSTRAINT "FeedPollVote_postId_fkey"
        FOREIGN KEY ("postId") REFERENCES "FeedPost"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
-- GPT-Codex (G) END: feed engagement migration now matches the source schema contract.
