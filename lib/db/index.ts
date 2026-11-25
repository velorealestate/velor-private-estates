import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/lib/db/schema'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to store VELOR enquiries.')
}

type DatabaseGlobal = typeof globalThis & {
  velorDatabasePool?: Pool
}

const globalForDatabase = globalThis as DatabaseGlobal

export const pool =
  globalForDatabase.velorDatabasePool ??
  new Pool({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForDatabase.velorDatabasePool = pool
}

export const db = drizzle(pool, { schema })
