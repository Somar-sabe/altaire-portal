-- Add Permission enum values that exist in schema.prisma but were omitted
-- from the initial migration. Safe for databases that already applied 0_init.
ALTER TYPE "Permission" ADD VALUE IF NOT EXISTS 'view_feed';
ALTER TYPE "Permission" ADD VALUE IF NOT EXISTS 'view_workspace';
ALTER TYPE "Permission" ADD VALUE IF NOT EXISTS 'create_space';
