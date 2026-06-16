-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('view_leads', 'create_lead', 'edit_lead', 'delete_lead', 'assign_lead', 'export_leads', 'publish_to_feed', 'delete_feed_posts', 'comment_on_feed', 'view_team', 'invite_users', 'manage_roles', 'edit_users', 'delete_users', 'send_messages', 'view_all_messages', 'manage_campaigns', 'view_campaigns', 'view_reports', 'export_reports', 'view_overview', 'manage_company_settings', 'manage_billing');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('NEW', 'IN_PROGRESS', 'INTERESTED', 'NOT_INTERESTED', 'CONTACTED', 'FEEDBACK_REQ', 'BOOKED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "SpaceRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SpacePrivacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'INVITED');

-- CreateEnum
CREATE TYPE "FeedPostType" AS ENUM ('ANNOUNCEMENT', 'UPDATE', 'EVENT', 'POLL', 'DISCUSSION');

-- CreateEnum
CREATE TYPE "LeadActionType" AS ENUM ('CREATED', 'UPDATED', 'STAGE_CHANGED', 'ASSIGNED', 'COMMENTED', 'DELETED', 'RESTORED', 'EXPORTED', 'IMPORTED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRASH');

-- CreateTable
CREATE TABLE "LrmLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "targetProject" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "stage" "LeadStage" NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "altPhone" TEXT,
    "workPhone" TEXT,
    "workEmail" TEXT,
    "whatsapp" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL,
    "tags" TEXT[],
    "aiScore" SMALLINT NOT NULL,
    "lastActivity" TIMESTAMP(3),
    "notes" TEXT NOT NULL DEFAULT '',
    "avatarColor" TEXT NOT NULL DEFAULT '#000000',
    "lang" TEXT NOT NULL DEFAULT 'ar',
    "country" TEXT NOT NULL DEFAULT 'Worldwide',
    "dateCreated" TIMESTAMP(3),
    "assignedAgentId" TEXT,
    "adminInChargeId" TEXT,
    "assignedById" TEXT,
    "details" TEXT NOT NULL DEFAULT '[]',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletionReason" TEXT,
    "deletionActorId" TEXT,
    "deletionDate" TIMESTAMP(3),
    "lastInteractionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LrmLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadComment" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "isReminder" BOOLEAN NOT NULL DEFAULT false,
    "reminderDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actionType" "LeadActionType" NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "photoUrl" TEXT,
    "status" "UserStatus" NOT NULL,
    "lastActive" TIMESTAMP(3),
    "jobTitle" TEXT,
    "linkedInUrl" TEXT,
    "location" TEXT,
    "timezone" TEXT,
    "bio" TEXT,
    "joinedDate" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT NOT NULL,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "emailVerified" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "permissions" "Permission"[],
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceSpace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "privacy" "SpacePrivacy" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceMember" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SpaceRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceInvitation" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "spaceName" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "invitedByName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpaceInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "content" TEXT NOT NULL,
    "isRichText" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "type" "FeedPostType" NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedPollOption" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FeedPollOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LrmLead_deleted_assignedAgentId_idx" ON "LrmLead"("deleted", "assignedAgentId");

-- CreateIndex
CREATE INDEX "LrmLead_deleted_stage_idx" ON "LrmLead"("deleted", "stage");

-- CreateIndex
CREATE INDEX "LrmLead_stage_idx" ON "LrmLead"("stage");

-- CreateIndex
CREATE INDEX "LrmLead_createdAt_idx" ON "LrmLead"("createdAt");

-- CreateIndex
CREATE INDEX "LeadComment_leadId_idx" ON "LeadComment"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_createdAt_idx" ON "LeadActivity"("leadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "SpaceMember_spaceId_userId_idx" ON "SpaceMember"("spaceId", "userId");

-- CreateIndex
CREATE INDEX "SpaceInvitation_userId_status_idx" ON "SpaceInvitation"("userId", "status");

-- CreateIndex
CREATE INDEX "Message_spaceId_createdAt_idx" ON "Message"("spaceId", "createdAt");

-- CreateIndex
CREATE INDEX "FeedComment_postId_createdAt_idx" ON "FeedComment"("postId", "createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

