'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Building2, Globe2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingForm } from '@/components/dashboard/listing-form'
import { ListingTable } from '@/components/dashboard/listing-table'
import { createListing, deleteListing, setListingStatus, updateListing } from '@/app/actions/listings'
import type { ListingFormValues, ListingRecord } from '@/lib/listings/types'

export function ListingWorkspace({ listings }: { listings: ListingRecord[] }) {
  const router = useRouter()
  const [editingListing, setEditingListing] = useState<ListingRecord | null>(null)
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()
  const publishedCount = listings.filter((listing) => listing.status === 'published').length
  const draftCount = listings.length - publishedCount

  function saveListing(values: ListingFormValues) {
    setMessage('')
    startTransition(async () => {
      try {
        const result = editingListing
          ? await updateListing(editingListing.id, values)
          : await createListing(values)
        setMessage(result.message)
        if (result.ok) {
          setEditingListing(null)
          router.refresh()
        }
      } catch {
        setMessage('The listing could not be saved. Try again.')
      }
    })
  }

  function changeStatus(listing: ListingRecord) {
    const nextStatus = listing.status === 'published' ? 'draft' : 'published'
    if (nextStatus === 'draft' && !window.confirm(`Return “${listing.title}” to private draft?`)) return

    setMessage('')
    startTransition(async () => {
      try {
        const result = await setListingStatus(listing.id, nextStatus)
        setMessage(result.message)
        if (result.ok) router.refresh()
      } catch {
        setMessage('The listing could not be updated. Try again.')
      }
    })
  }

  function removeListing(listing: ListingRecord) {
    if (!window.confirm(`Permanently delete “${listing.title}”? This cannot be undone.`)) return

    setMessage('')
    startTransition(async () => {
      try {
        const result = await deleteListing(listing.id)
        setMessage(result.message)
        if (result.ok) {
          if (editingListing?.id === listing.id) setEditingListing(null)
          router.refresh()
        }
      } catch {
        setMessage('The listing could not be deleted. Try again.')
      }
    })
  }

  return (
    <div className="portal-dashboard-page">
      <div className="portal-page-heading">
        <div>
          <p className="portal-kicker">Property studio</p>
          <h1>Your listings</h1>
          <p className="portal-page-intro">A private register for the residences you represent.</p>
        </div>
        <Button className="portal-form-submit portal-new-listing" type="button" onClick={() => setEditingListing(null)}>
          <Plus data-icon="inline-start" aria-hidden="true" />New listing
        </Button>
      </div>

      <section className="portal-stat-grid" aria-label="Listing summary">
        <article className="portal-stat-card">
          <span className="portal-stat-icon"><Building2 aria-hidden="true" /></span>
          <span className="portal-stat-label">Total properties</span>
          <strong>{listings.length.toString().padStart(2, '0')}</strong>
          <span className="portal-stat-caption">In your register</span>
        </article>
        <article className="portal-stat-card">
          <span className="portal-stat-icon"><Globe2 aria-hidden="true" /></span>
          <span className="portal-stat-label">Published</span>
          <strong>{publishedCount.toString().padStart(2, '0')}</strong>
          <span className="portal-stat-caption">Visible in the directory</span>
        </article>
        <article className="portal-stat-card">
          <span className="portal-stat-icon"><Building2 aria-hidden="true" /></span>
          <span className="portal-stat-label">Private drafts</span>
          <strong>{draftCount.toString().padStart(2, '0')}</strong>
          <span className="portal-stat-caption">Only visible to you</span>
        </article>
      </section>

      {message && <p className="portal-action-message" role="status">{message}</p>}

      <div className="portal-workspace-grid">
        <section className="portal-card portal-editor-card" id="listing-editor" aria-labelledby="listing-editor-title">
          <div className="portal-card-heading">
            <div>
              <p className="portal-kicker">Listing editor</p>
              <h2 id="listing-editor-title" tabIndex={-1}>{editingListing ? 'Refine a residence' : 'Add a residence'}</h2>
            </div>
            <span className="portal-card-icon" aria-hidden="true"><Building2 /></span>
          </div>
          <ListingForm
            key={editingListing?.id ?? 'new-listing'}
            initialListing={editingListing}
            pending={pending}
            onSubmit={saveListing}
            onCancel={() => setEditingListing(null)}
          />
        </section>

        <section className="portal-card portal-register-card" aria-labelledby="register-title">
          <div className="portal-card-heading">
            <div>
              <p className="portal-kicker">Your collection</p>
              <h2 id="register-title">Property register</h2>
            </div>
            <span className="portal-card-count">{listings.length.toString().padStart(2, '0')} RECORDS</span>
          </div>
          <ListingTable
            listings={listings}
            pending={pending}
            onCreate={() => setEditingListing(null)}
            onEdit={setEditingListing}
            onToggleStatus={changeStatus}
            onDelete={removeListing}
          />
        </section>
      </div>
      <Link className="portal-back-link" href="/listings">Explore the public directory <ArrowUpRight aria-hidden="true" /></Link>
    </div>
  )
}
