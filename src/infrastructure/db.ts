/** [LAYER: INFRASTRUCTURE] */
// Prisma client singleton — database adapter.

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let dbInstance: PrismaClient;

if (globalForPrisma.prisma) {
  dbInstance = globalForPrisma.prisma;
} else {
  // Use SQLite driver adapter in Prisma 7
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  
  dbInstance = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = dbInstance;
  }
}

export const db = dbInstance;