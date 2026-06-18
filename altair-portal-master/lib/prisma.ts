import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Prevent structural evaluation failures if environment variables are missing during compile
if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.warn("⚠️ DATABASE_URL is missing during build time initialization.");
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
