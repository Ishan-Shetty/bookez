import { PrismaAdapter } from "@auth/prisma-adapter";

import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";
import { compare } from "bcryptjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "USER" | "ADMIN";
    hashedPassword?: string;
  }
}

// Ensure you have a strong, secure secret for production
// For development, we also provide a fallback, but ideally use NEXTAUTH_SECRET
const generateSecret = () => {
  const baseSecret = process.env.NEXTAUTH_SECRET;
  if (!baseSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("No NEXTAUTH_SECRET provided for production environment");
    } else {
      // Development fallback - still should use a real secret in .env.local
      console.warn("Warning: No NEXTAUTH_SECRET provided. Using an insecure default for development only.");
      return "DEVELOPMENT_SECRET_DO_NOT_USE_IN_PRODUCTION_PLEASE_SET_NEXTAUTH_SECRET";
    }
  }
  return baseSecret;
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
   GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
   }),
      

  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: generateSecret(),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin", // Error path redirects to sign-in
    verifyRequest: "/auth/verify-request",
  },
  debug: process.env.NODE_ENV === "development",
};

/**
 * Wrapper for getServerSession so that you don't need to import the authOptions in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async () => {
  return await getServerSession(authOptions);
};

export const getSession = () => getServerSession(authOptions);
