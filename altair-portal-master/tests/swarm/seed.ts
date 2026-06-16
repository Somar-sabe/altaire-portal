import argon2 from 'argon2';
import { prisma } from '../../lib/prisma';
import { SWARM_PASSWORD, SWARM_PERSONAS } from './personas';

async function seedSwarmPersonas() {
  const passwordHash = await argon2.hash(SWARM_PASSWORD, { type: argon2.argon2id });

  for (const persona of SWARM_PERSONAS) {
    await prisma.user.upsert({
      where: { email: persona.email },
      update: {
        firstName: persona.firstName,
        lastName: persona.lastName,
        role: persona.role,
        department: persona.department,
        permissions: persona.permissions,
        status: 'ACTIVE',
        passwordHash,
      },
      create: {
        id: persona.seedId,
        firstName: persona.firstName,
        lastName: persona.lastName,
        email: persona.email,
        mobileNumber: '+97100000000',
        department: persona.department,
        role: persona.role,
        status: 'ACTIVE',
        passwordHash,
        permissions: persona.permissions,
      },
    });
  }
}

async function main() {
  await seedSwarmPersonas();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});

export { seedSwarmPersonas };
