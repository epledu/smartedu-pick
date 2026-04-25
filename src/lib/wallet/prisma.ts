/**
 * Singleton Prisma client for Next.js.
 *
 * In development, Next.js HMR can create multiple PrismaClient instances,
 * exhausting the database connection pool. We store the client on the global
 * object so it is reused across hot-reloads.
 *
 * Prisma v7 requires datasourceUrl to be passed explicitly when the
 * schema datasource block does not contain a url.
 */
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => new PrismaClient();

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
