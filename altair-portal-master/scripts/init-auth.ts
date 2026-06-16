import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  // GPT-Codex (G) BEGIN: require explicit seed passwords and block accidental production auth initialization.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_AUTH_INIT !== 'true') {
    throw new Error('Refusing to initialize auth in production without ALLOW_PRODUCTION_AUTH_INIT=true.');
  }

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
  const userPassword = process.env.INITIAL_USER_PASSWORD;

  if (!adminEmail || !adminPassword || !userPassword) {
    throw new Error('INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD, and INITIAL_USER_PASSWORD are required.');
  }
  
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (!user.passwordHash || user.passwordHash === '') {
      const plainPassword = user.email === adminEmail ? adminPassword : userPassword;
      const hash = await argon2.hash(plainPassword, { type: argon2.argon2id });
      
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hash },
      });
      console.log(`Updated password for ${user.email}`);
    }
  }
  // GPT-Codex (G) END: no password value is inferred by this script.
  console.log('Init auth script completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
