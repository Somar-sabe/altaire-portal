-- GPT-Codex (G) BEGIN: Wave 3 data-integrity constraints after clean orphan/duplicate audit.
INSERT INTO "User" (
  "id",
  "firstName",
  "lastName",
  "mobileNumber",
  "email",
  "department",
  "role",
  "status",
  "jobTitle",
  "passwordHash",
  "permissions",
  "createdAt",
  "updatedAt"
)
VALUES (
  'SYSTEM',
  'System',
  'Automation',
  '0000000000',
  'system@altair.local',
  'Platform',
  'SUPER_ADMIN',
  'SUSPENDED',
  'Automation Actor',
  '$argon2id$v=19$m=65536,t=3,p=4$KaPkeDI62K4XLt72hS53/w$o3Ewj9x31ZVKSd+8jF2BFUrypRLsIl5uq2i1w6gp5Qk',
  ARRAY[]::"Permission"[],
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO UPDATE
SET
  "status" = 'SUSPENDED',
  "updatedAt" = NOW();

UPDATE "LrmLead"
SET "assignedById" = 'SYSTEM'
WHERE "assignedById" = 'SYSTEM_ROTATION_4_DAYS';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LrmLead_assignedAgentId_fkey') THEN
    ALTER TABLE "LrmLead" ADD CONSTRAINT "LrmLead_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LrmLead_adminInChargeId_fkey') THEN
    ALTER TABLE "LrmLead" ADD CONSTRAINT "LrmLead_adminInChargeId_fkey" FOREIGN KEY ("adminInChargeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LrmLead_assignedById_fkey') THEN
    ALTER TABLE "LrmLead" ADD CONSTRAINT "LrmLead_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LrmLead_deletionActorId_fkey') THEN
    ALTER TABLE "LrmLead" ADD CONSTRAINT "LrmLead_deletionActorId_fkey" FOREIGN KEY ("deletionActorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadComment_leadId_fkey') THEN
    ALTER TABLE "LeadComment" ADD CONSTRAINT "LeadComment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "LrmLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadComment_authorId_fkey') THEN
    ALTER TABLE "LeadComment" ADD CONSTRAINT "LeadComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadActivity_leadId_fkey') THEN
    ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "LrmLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LeadActivity_actorId_fkey') THEN
    ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceMember_spaceId_fkey') THEN
    ALTER TABLE "SpaceMember" ADD CONSTRAINT "SpaceMember_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "WorkspaceSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceMember_userId_fkey') THEN
    ALTER TABLE "SpaceMember" ADD CONSTRAINT "SpaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceInvitation_spaceId_fkey') THEN
    ALTER TABLE "SpaceInvitation" ADD CONSTRAINT "SpaceInvitation_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "WorkspaceSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceInvitation_invitedById_fkey') THEN
    ALTER TABLE "SpaceInvitation" ADD CONSTRAINT "SpaceInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceInvitation_userId_fkey') THEN
    ALTER TABLE "SpaceInvitation" ADD CONSTRAINT "SpaceInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Message_spaceId_fkey') THEN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "WorkspaceSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Message_senderId_fkey') THEN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Message_receiverId_fkey') THEN
    ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessageReaction_messageId_fkey') THEN
    ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessageReaction_userId_fkey') THEN
    ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FeedPost_authorId_fkey') THEN
    ALTER TABLE "FeedPost" ADD CONSTRAINT "FeedPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FeedComment_authorId_fkey') THEN
    ALTER TABLE "FeedComment" ADD CONSTRAINT "FeedComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FeedReaction_userId_fkey') THEN
    ALTER TABLE "FeedReaction" ADD CONSTRAINT "FeedReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FeedPollVote_userId_fkey') THEN
    ALTER TABLE "FeedPollVote" ADD CONSTRAINT "FeedPollVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceMember_spaceId_userId_key') THEN
    ALTER TABLE "SpaceMember" ADD CONSTRAINT "SpaceMember_spaceId_userId_key" UNIQUE ("spaceId", "userId");
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FeedReaction_postId_userId_emoji_key') THEN
    ALTER TABLE "FeedReaction" ADD CONSTRAINT "FeedReaction_postId_userId_emoji_key" UNIQUE ("postId", "userId", "emoji");
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessageReaction_messageId_userId_emoji_key') THEN
    ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_userId_emoji_key" UNIQUE ("messageId", "userId", "emoji");
  END IF;
END $$;
-- GPT-Codex (G) END: FK and uniqueness constraints now match the clean audited data set.
