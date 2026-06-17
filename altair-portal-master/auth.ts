import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserStatus, Role } from '@prisma/client';
import argon2 from 'argon2';
import { prisma } from '@/lib/prisma';

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
    } & DefaultSession["user"]
  }
}

// Augment @auth/core/types directly to avoid the TS2310 recursive-reference
// bug that occurs when augmenting next-auth's re-exported User in v5 beta.


// GPT-Codex (G) BEGIN: keep Auth.js on the shared Prisma singleton and avoid credential/session enumeration.
export const { handlers, auth: originalAuth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const invalidCredentials = new Error('Invalid credentials');

        if (!credentials?.email || !credentials?.password) {
          throw invalidCredentials;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          throw invalidCredentials;
        }

        const isValid = await argon2.verify(
          user.passwordHash,
          credentials.password as string
        );

        if (!isValid) {
          throw invalidCredentials;
        }

        if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.INACTIVE) {
          throw invalidCredentials;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
          tokenVersion: user.tokenVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.tokenVersion = user.tokenVersion;
      } else if (token.id) {
        // verify tokenVersion is still valid
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { tokenVersion: true },
        });
        if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
          return null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});

// NOTE: No dev auth bypass. Use real credentials in all environments to avoid
// accidentally shipping a backdoor to production.
export { originalAuth as auth };
// GPT-Codex (G) END: auth failures are generic and revoked JWTs terminate without throwing.
