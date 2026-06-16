import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database data...');

  const userCount = await prisma.user.count();
  console.log(`User Count: ${userCount}`);

  if (userCount > 0) {
    const users = await prisma.user.findMany({
      select: { email: true, role: true, status: true, createdAt: true },
      take: 5
    });
    console.table(users);
  }

  const leadCount = await prisma.lrmLead.count();
  console.log(`Lead Count: ${leadCount}`);

  const workspaceCount = await prisma.workspaceSpace.count();
  console.log(`Workspace Count: ${workspaceCount}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
