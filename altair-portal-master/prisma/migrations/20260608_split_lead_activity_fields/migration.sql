-- Split ambiguous LrmLead.lastActivity into timestamp + display summary.
ALTER TABLE "LrmLead" ADD COLUMN "lastActivityAt" TIMESTAMP(3);
ALTER TABLE "LrmLead" ADD COLUMN "lastActivitySummary" TEXT;

UPDATE "LrmLead"
SET "lastActivityAt" = "lastActivity"
WHERE "lastActivity" IS NOT NULL;

ALTER TABLE "LrmLead" DROP COLUMN "lastActivity";
