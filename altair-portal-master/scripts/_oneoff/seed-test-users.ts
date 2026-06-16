import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // GPT-Codex (G) BEGIN: require explicit one-off test credentials and block production execution.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed test users in production.');
  }

  const testPassword = process.env.TEST_USER_PASSWORD;
  if (!testPassword || testPassword.length < 12) {
    throw new Error('TEST_USER_PASSWORD is required and must be at least 12 characters.');
  }

  console.log('Seeding test users (RESTRICTED_AGENT and FULL_AGENT)...');

  const passwordHash = await argon2.hash(testPassword, { type: argon2.argon2id });
  // GPT-Codex (G) END: no hardcoded password is written by this one-off script.

  // 1. RESTRICTED_AGENT (Has view_team but lacks view_leads)
  await prisma.user.upsert({
    where: { email: 'restricted@altair.dev' },
    update: {
      permissions: ['view_overview', 'view_team']
    },
    create: {
      id: 'test-restricted-001',
      firstName: 'Restricted',
      lastName: 'User',
      email: 'restricted@altair.dev',
      mobileNumber: '0000000001',
      department: 'Operations',
      role: 'AGENT',
      status: 'ACTIVE',
      passwordHash,
      permissions: ['view_overview', 'view_team'],
    }
  });

  // 2. FULL_AGENT (Has view_leads)
  await prisma.user.upsert({
    where: { email: 'agent@altair.dev' },
    update: {},
    create: {
      id: 'test-agent-001',
      firstName: 'Agent',
      lastName: 'User',
      email: 'agent@altair.dev',
      mobileNumber: '0000000002',
      department: 'Sales',
      role: 'AGENT',
      status: 'ACTIVE',
      passwordHash,
      permissions: [
        "view_leads", "create_lead", "edit_lead",
        "publish_to_feed", "comment_on_feed",
        "view_team",
        "send_messages",
        "view_overview"
      ],
    }
  });

  console.log('Test users seeded successfully.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
