import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '@/lib/db/schema'

type DatabaseGlobal = typeof globalThis & {
  velorDatabasePool?: Pool
}

const globalForDatabase = globalThis as DatabaseGlobal

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return null

  const pool =
    globalForDatabase.velorDatabasePool ??
    (globalForDatabase.velorDatabasePool = new Pool({
      connectionString: databaseUrl,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    }))

  return drizzle(pool, { schema })
}
