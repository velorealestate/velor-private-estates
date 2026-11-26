import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const velorEnquiries = pgTable(
  'velor_enquiries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    fullName: varchar('full_name', { length: 120 }).notNull(),
    email: varchar('email', { length: 254 }).notNull(),
    telephone: varchar('telephone', { length: 40 }),
    enquiryType: varchar('enquiry_type', { length: 32 }).notNull(),
    residenceSlug: varchar('residence_slug', { length: 120 }),
    message: varchar('message', { length: 2400 }).notNull(),
    contactPreference: varchar('contact_preference', { length: 16 }).notNull(),
    privacyConsent: boolean('privacy_consent').notNull(),
    status: varchar('status', { length: 16 }).notNull().default('new'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      'velor_enquiries_enquiry_type_check',
      sql`${table.enquiryType} in ('viewing', 'property', 'seller', 'consultation')`,
    ),
    check(
      'velor_enquiries_contact_preference_check',
      sql`${table.contactPreference} in ('email', 'phone')`,
    ),
    check('velor_enquiries_privacy_consent_check', sql`${table.privacyConsent}`),
    check(
      'velor_enquiries_status_check',
      sql`${table.status} in ('new', 'contacted', 'closed')`,
    ),
  ],
)

export const velorListings = pgTable(
  'velor_listings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    title: varchar('title', { length: 180 }).notNull(),
    location: varchar('location', { length: 180 }).notNull(),
    propertyType: varchar('property_type', { length: 48 }).notNull(),
    status: varchar('status', { length: 16, enum: ['draft', 'published'] }).notNull().default('draft'),
    price: numeric('price', { precision: 14, scale: 2 }),
    currency: varchar('currency', { length: 3, enum: ['USD', 'EUR', 'GBP', 'CHF'] }).notNull().default('USD'),
    bedrooms: smallint('bedrooms'),
    bathrooms: smallint('bathrooms'),
    areaSqm: numeric('area_sqm', { precision: 12, scale: 2 }),
    coverImage: text('cover_image'),
    summary: varchar('summary', { length: 500 }).notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check('velor_listings_status_check', sql`${table.status} in ('draft', 'published')`),
    check(
      'velor_listings_currency_check',
      sql`${table.currency} in ('USD', 'EUR', 'GBP', 'CHF')`,
    ),
    index('velor_listings_owner_updated_idx').on(table.userId, table.updatedAt),
    index('velor_listings_public_updated_idx').on(table.status, table.updatedAt),
  ],
)
