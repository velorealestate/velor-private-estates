import { boolean, check, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

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
