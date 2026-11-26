'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getAuth } from '@/lib/auth/server'
import { getDatabase } from '@/lib/db'
import { velorListings } from '@/lib/db/schema'
import {
  CURRENCIES,
  LISTING_STATUSES,
  PROPERTY_TYPES,
  type ListingCurrency,
  type ListingStatus,
  type PropertyType,
} from '@/lib/listings/types'

export type ListingActionResult = { ok: true; message: string } | { ok: false; message: string }

type ListingValues = {
  title: string
  location: string
  propertyType: PropertyType
  status: ListingStatus
  price: string | null
  currency: ListingCurrency
  bedrooms: number | null
  bathrooms: number | null
  areaSqm: string | null
  coverImage: string | null
  summary: string
  description: string
}

type ParseResult = { ok: true; value: ListingValues } | { ok: false; message: string }

async function getCurrentUserId() {
  const auth = getAuth()
  if (!auth) return null

  const { data: session } = await auth.getSession()
  return session?.user?.id ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredText(value: unknown, minimum: number, maximum: number) {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length >= minimum && normalized.length <= maximum ? normalized : null
}

function optionalDecimal(value: unknown, integerDigits: number): string | null | undefined {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' && typeof value !== 'number') return undefined

  const raw = String(value).trim()
  const pattern = new RegExp(`^\\d{1,${integerDigits}}(?:\\.\\d{1,2})?$`)
  if (!pattern.test(raw)) return undefined

  const amount = Number(raw)
  return Number.isFinite(amount) ? amount.toFixed(2) : undefined
}

function optionalInteger(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' && typeof value !== 'number') return undefined

  const raw = String(value).trim()
  if (!/^\d{1,2}$/.test(raw)) return undefined
  const amount = Number(raw)
  return amount <= 50 ? amount : undefined
}

function optionalImageReference(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') return undefined

  const image = value.trim()
  if (!image || image.length > 2048 || image.includes('\\')) return undefined

  if (image.startsWith('/') && !image.startsWith('//') && !image.split('/').includes('..')) {
    return image
  }

  try {
    const url = new URL(image)
    if (url.protocol === 'https:' && !url.username && !url.password) return url.toString()
  } catch {
    return undefined
  }

  return undefined
}

function parseListing(input: unknown): ParseResult {
  if (!isRecord(input)) {
    return { ok: false, message: 'Check the listing details and try again.' }
  }

  const title = requiredText(input.title, 3, 180)
  const location = requiredText(input.location, 2, 160)
  const summary = requiredText(input.summary, 12, 500)
  const description = requiredText(input.description, 20, 8000)
  const propertyType = input.propertyType
  const status = input.status
  const currency = input.currency
  const price = optionalDecimal(input.price, 12)
  const bedrooms = optionalInteger(input.bedrooms)
  const bathrooms = optionalInteger(input.bathrooms)
  const areaSqm = optionalDecimal(input.areaSqm, 10)
  const coverImage = optionalImageReference(input.coverImage)

  if (!title || !location || !summary || !description) {
    return { ok: false, message: 'Complete the title, location, summary, and description.' }
  }
  if (typeof propertyType !== 'string' || !PROPERTY_TYPES.includes(propertyType as PropertyType)) {
    return { ok: false, message: 'Choose a valid property type.' }
  }
  if (typeof status !== 'string' || !LISTING_STATUSES.includes(status as ListingStatus)) {
    return { ok: false, message: 'Choose draft or published status.' }
  }
  if (typeof currency !== 'string' || !CURRENCIES.includes(currency as ListingCurrency)) {
    return { ok: false, message: 'Choose a supported currency.' }
  }
  if (price === undefined || bedrooms === undefined || bathrooms === undefined || areaSqm === undefined) {
    return { ok: false, message: 'Enter valid price, room, and area values.' }
  }
  if (coverImage === undefined) {
    return { ok: false, message: 'Use a secure image URL or a site image path.' }
  }

  return {
    ok: true,
    value: {
      title,
      location,
      propertyType: propertyType as PropertyType,
      status: status as ListingStatus,
      price,
      currency: currency as ListingCurrency,
      bedrooms,
      bathrooms,
      areaSqm,
      coverImage,
      summary,
      description,
    },
  }
}

function revalidateListingPages(id?: string) {
  revalidatePath('/dashboard/listings')
  revalidatePath('/listings')
  if (id) revalidatePath(`/listings/${id}`)
}

export async function createListing(input: unknown): Promise<ListingActionResult> {
  const userId = await getCurrentUserId()
  if (!userId) return { ok: false, message: 'Sign in again to manage listings.' }

  const parsed = parseListing(input)
  if (!parsed.ok) return parsed

  const database = getDatabase()
  if (!database) {
    return { ok: false, message: 'Listing storage is not configured for this deployment.' }
  }

  try {
    await database.insert(velorListings).values({ userId, ...parsed.value })
    revalidateListingPages()
    return { ok: true, message: 'Listing created.' }
  } catch (error) {
    console.error('[velor:listings] Could not create listing.', error)
    return { ok: false, message: 'The listing could not be saved. Try again.' }
  }
}

export async function updateListing(id: string, input: unknown): Promise<ListingActionResult> {
  const userId = await getCurrentUserId()
  if (!userId) return { ok: false, message: 'Sign in again to manage listings.' }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { ok: false, message: 'This listing could not be found.' }
  }

  const parsed = parseListing(input)
  if (!parsed.ok) return parsed

  const database = getDatabase()
  if (!database) {
    return { ok: false, message: 'Listing storage is not configured for this deployment.' }
  }

  try {
    const [updated] = await database
      .update(velorListings)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(and(eq(velorListings.id, id), eq(velorListings.userId, userId)))
      .returning({ id: velorListings.id })

    if (!updated) return { ok: false, message: 'This listing could not be found.' }
    revalidateListingPages(id)
    return { ok: true, message: 'Listing updated.' }
  } catch (error) {
    console.error('[velor:listings] Could not update listing.', error)
    return { ok: false, message: 'The listing could not be saved. Try again.' }
  }
}

export async function setListingStatus(id: string, status: ListingStatus): Promise<ListingActionResult> {
  const userId = await getCurrentUserId()
  if (!userId) return { ok: false, message: 'Sign in again to manage listings.' }
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
    !LISTING_STATUSES.includes(status)
  ) {
    return { ok: false, message: 'This listing could not be updated.' }
  }

  const database = getDatabase()
  if (!database) {
    return { ok: false, message: 'Listing storage is not configured for this deployment.' }
  }

  try {
    const [updated] = await database
      .update(velorListings)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(velorListings.id, id), eq(velorListings.userId, userId)))
      .returning({ id: velorListings.id })

    if (!updated) return { ok: false, message: 'This listing could not be found.' }
    revalidateListingPages(id)
    return { ok: true, message: status === 'published' ? 'Listing published.' : 'Listing returned to draft.' }
  } catch (error) {
    console.error('[velor:listings] Could not update listing status.', error)
    return { ok: false, message: 'The listing could not be updated. Try again.' }
  }
}

export async function deleteListing(id: string): Promise<ListingActionResult> {
  const userId = await getCurrentUserId()
  if (!userId) return { ok: false, message: 'Sign in again to manage listings.' }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { ok: false, message: 'This listing could not be found.' }
  }

  const database = getDatabase()
  if (!database) {
    return { ok: false, message: 'Listing storage is not configured for this deployment.' }
  }

  try {
    const [deleted] = await database
      .delete(velorListings)
      .where(and(eq(velorListings.id, id), eq(velorListings.userId, userId)))
      .returning({ id: velorListings.id })

    if (!deleted) return { ok: false, message: 'This listing could not be found.' }
    revalidateListingPages(id)
    return { ok: true, message: 'Listing deleted.' }
  } catch (error) {
    console.error('[velor:listings] Could not delete listing.', error)
    return { ok: false, message: 'The listing could not be deleted. Try again.' }
  }
}
