import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Add a named export for db to use in trpc.ts
export const db = prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
