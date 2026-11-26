import 'server-only'

import { desc, eq, and } from 'drizzle-orm'
import { getDatabase } from '@/lib/db'
import { velorListings } from '@/lib/db/schema'
import type { ListingRecord } from '@/lib/listings/types'

const listingFields = {
  id: velorListings.id,
  title: velorListings.title,
  location: velorListings.location,
  propertyType: velorListings.propertyType,
  status: velorListings.status,
  price: velorListings.price,
  currency: velorListings.currency,
  bedrooms: velorListings.bedrooms,
  bathrooms: velorListings.bathrooms,
  areaSqm: velorListings.areaSqm,
  coverImage: velorListings.coverImage,
  summary: velorListings.summary,
  description: velorListings.description,
  createdAt: velorListings.createdAt,
  updatedAt: velorListings.updatedAt,
}

export async function getListingsForUser(userId: string): Promise<ListingRecord[]> {
  const database = getDatabase()
  if (!database) return []

  return database
    .select(listingFields)
    .from(velorListings)
    .where(eq(velorListings.userId, userId))
    .orderBy(desc(velorListings.updatedAt))
}

export async function getPublishedListings(): Promise<ListingRecord[]> {
  const database = getDatabase()
  if (!database) return []

  return database
    .select(listingFields)
    .from(velorListings)
    .where(eq(velorListings.status, 'published'))
    .orderBy(desc(velorListings.updatedAt))
}

export async function getPublishedListing(id: string): Promise<ListingRecord | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null
  }

  const database = getDatabase()
  if (!database) return null

  const [listing] = await database
    .select(listingFields)
    .from(velorListings)
    .where(and(eq(velorListings.id, id), eq(velorListings.status, 'published')))
    .limit(1)

  return listing ?? null
}
