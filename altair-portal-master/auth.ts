import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserStatus } from "@prisma/client";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";

/**
 * =========================
 * TYPES
 * =========================
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    tokenVersion: number;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    tokenVersion: number;
  }

  // Move JWT augmentation inside the main next-auth module
  interface JWT {
    id?: string;
    role?: string;
    tokenVersion?: number;
  }
}


/**
 * =========================
 * NEXTAUTH
 * =========================
 */
export const { handlers, auth: originalAuth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await argon2.verify(
          user.passwordHash,
          credentials.password as string
        );

        if (!isValid) throw new Error("Invalid credentials");

        if (
          user.status === UserStatus.SUSPENDED ||
          user.status === UserStatus.INACTIVE
        ) {
          throw new Error("Invalid credentials");
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
        token.id = user.id;
        token.role = user.role;
        token.tokenVersion = user.tokenVersion;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },
});

export { originalAuth as auth };