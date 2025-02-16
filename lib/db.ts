// db.ts
import { PrismaClient } from "@prisma/client";

// Check if there's already an instance of PrismaClient
// This prevents multiple instances during development (with hot-reloading)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
