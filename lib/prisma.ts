import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Support both SQLite (dev) and PostgreSQL (prod)
// For SQLite we still use adapter if DATABASE_URL not set or is file:
// But for simplicity in deploy, when using Postgres we use plain PrismaClient
const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql') || 
                   process.env.DATABASE_URL?.startsWith('postgres')

export const prisma =
  globalForPrisma.prisma ??
  (isPostgres
    ? new PrismaClient({ log: ['error', 'warn'] })
    : (() => {
        // SQLite dev path with adapter
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
        const path = require('path')
        const dbPath = path.join(process.cwd(), 'dev.db')
        const url = `file:${dbPath.replace(/\\/g, '/')}`
        const adapter = new PrismaBetterSqlite3({ url })
        return new PrismaClient({ adapter, log: ['error', 'warn'] })
      })())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
