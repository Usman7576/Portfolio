import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/lib/generated/prisma/client";

// One client per server instance; reused across hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  }
  return globalForPrisma.prisma;
}
