import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { email: { contains: '@altair.dev' } },
    select: { email: true, role: true, status: true }
  });
  console.log(users);
  await prisma.$disconnect();
}

main();
