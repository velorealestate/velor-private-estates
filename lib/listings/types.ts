import type { velorListings } from '@/lib/db/schema'

export const PROPERTY_TYPES = ['Estate', 'Residence', 'Villa', 'Apartment', 'Land'] as const
export const LISTING_STATUSES = ['draft', 'published'] as const
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF'] as const

export type PropertyType = (typeof PROPERTY_TYPES)[number]
export type ListingStatus = (typeof LISTING_STATUSES)[number]
export type ListingCurrency = (typeof CURRENCIES)[number]
export type ListingRecord = Omit<typeof velorListings.$inferSelect, 'userId'>

export type ListingFormValues = {
  title: string
  location: string
  propertyType: PropertyType
  status: ListingStatus
  price: string
  currency: ListingCurrency
  bedrooms: string
  bathrooms: string
  areaSqm: string
  coverImage: string
  summary: string
  description: string
}

export const EMPTY_LISTING_FORM: ListingFormValues = {
  title: '',
  location: '',
  propertyType: 'Residence',
  status: 'draft',
  price: '',
  currency: 'USD',
  bedrooms: '',
  bathrooms: '',
  areaSqm: '',
  coverImage: '',
  summary: '',
  description: '',
}
