import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
}

export const db = globalForPrisma.prisma;
