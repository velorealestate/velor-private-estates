'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, LoaderCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { CURRENCIES, EMPTY_LISTING_FORM, PROPERTY_TYPES, type ListingFormValues, type ListingRecord } from '@/lib/listings/types'

function valuesFromListing(listing: ListingRecord | null): ListingFormValues {
  if (!listing) return { ...EMPTY_LISTING_FORM }

  return {
    title: listing.title,
    location: listing.location,
    propertyType: listing.propertyType as ListingFormValues['propertyType'],
    status: listing.status,
    price: listing.price ?? '',
    currency: listing.currency,
    bedrooms: listing.bedrooms?.toString() ?? '',
    bathrooms: listing.bathrooms?.toString() ?? '',
    areaSqm: listing.areaSqm ?? '',
    coverImage: listing.coverImage ?? '',
    summary: listing.summary,
    description: listing.description,
  }
}

type ListingFormProps = {
  initialListing: ListingRecord | null
  pending: boolean
  onSubmit: (values: ListingFormValues) => void
  onCancel: () => void
}

export function ListingForm({ initialListing, pending, onSubmit, onCancel }: ListingFormProps) {
  const [values, setValues] = useState(() => valuesFromListing(initialListing))

  function update<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="portal-listing-form" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="portal-form-grid">
          <Field>
            <FieldLabel htmlFor="listing-title">Property title</FieldLabel>
            <Input id="listing-title" value={values.title} onChange={(event) => update('title', event.target.value)} maxLength={180} required />
          </Field>
          <Field>
            <FieldLabel htmlFor="listing-location">Location</FieldLabel>
            <Input id="listing-location" value={values.location} onChange={(event) => update('location', event.target.value)} maxLength={160} placeholder="Coast, city or region" required />
          </Field>
        </div>
        <div className="portal-form-grid">
          <Field>
            <FieldLabel htmlFor="listing-type">Property type</FieldLabel>
            <NativeSelect id="listing-type" className="portal-select" value={values.propertyType} onChange={(event) => update('propertyType', event.target.value as ListingFormValues['propertyType'])}>
              {PROPERTY_TYPES.map((type) => <NativeSelectOption key={type} value={type}>{type}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="listing-status">Visibility</FieldLabel>
            <NativeSelect id="listing-status" className="portal-select" value={values.status} onChange={(event) => update('status', event.target.value as ListingFormValues['status'])}>
              <NativeSelectOption value="draft">Private draft</NativeSelectOption>
              <NativeSelectOption value="published">Published publicly</NativeSelectOption>
            </NativeSelect>
          </Field>
        </div>
        <div className="portal-form-grid portal-form-grid--three">
          <Field>
            <FieldLabel htmlFor="listing-price">Price</FieldLabel>
            <Input id="listing-price" type="number" min="0" step="0.01" inputMode="decimal" value={values.price} onChange={(event) => update('price', event.target.value)} placeholder="On request" />
          </Field>
          <Field>
            <FieldLabel htmlFor="listing-currency">Currency</FieldLabel>
            <NativeSelect id="listing-currency" className="portal-select" value={values.currency} onChange={(event) => update('currency', event.target.value as ListingFormValues['currency'])}>
              {CURRENCIES.map((currency) => <NativeSelectOption key={currency} value={currency}>{currency}</NativeSelectOption>)}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel htmlFor="listing-area">Area (m²)</FieldLabel>
            <Input id="listing-area" type="number" min="0" step="0.01" inputMode="decimal" value={values.areaSqm} onChange={(event) => update('areaSqm', event.target.value)} />
          </Field>
        </div>
        <div className="portal-form-grid portal-form-grid--three">
          <Field>
            <FieldLabel htmlFor="listing-bedrooms">Bedrooms</FieldLabel>
            <Input id="listing-bedrooms" type="number" min="0" max="50" step="1" value={values.bedrooms} onChange={(event) => update('bedrooms', event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="listing-bathrooms">Bathrooms</FieldLabel>
            <Input id="listing-bathrooms" type="number" min="0" max="50" step="1" value={values.bathrooms} onChange={(event) => update('bathrooms', event.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="listing-image">Cover image</FieldLabel>
            <Input id="listing-image" type="text" inputMode="url" value={values.coverImage} onChange={(event) => update('coverImage', event.target.value)} placeholder="https://… or /images/…" maxLength={2048} />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="listing-summary">Short description</FieldLabel>
          <Textarea id="listing-summary" value={values.summary} onChange={(event) => update('summary', event.target.value)} maxLength={500} rows={2} required />
        </Field>
        <Field>
          <FieldLabel htmlFor="listing-description">Full description</FieldLabel>
          <Textarea id="listing-description" value={values.description} onChange={(event) => update('description', event.target.value)} maxLength={8000} rows={5} required />
        </Field>
      </FieldGroup>
      <div className="portal-form-actions">
        {initialListing && <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}><X data-icon="inline-start" aria-hidden="true" />Cancel</Button>}
        <Button className="portal-form-submit" type="submit" disabled={pending}>
          {pending ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <ArrowRight data-icon="inline-end" aria-hidden="true" />}
          {pending ? 'Saving' : initialListing ? 'Save changes' : 'Create listing'}
        </Button>
      </div>
    </form>
  )
}
