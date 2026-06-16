import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lead = await prisma.lrmLead.findFirst({
    select: { tags: true }
  });
  console.log('Lead tags:', lead?.tags);
  console.log('Type of tags:', typeof lead?.tags);
  console.log('Is Array:', Array.isArray(lead?.tags));
  await prisma.$disconnect();
}

main();
