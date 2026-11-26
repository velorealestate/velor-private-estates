'use client'

import Link from 'next/link'
import { ArrowUpRight, Building2, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatListingPrice } from '@/lib/listings/format'
import type { ListingRecord } from '@/lib/listings/types'

type ListingTableProps = {
  listings: ListingRecord[]
  pending: boolean
  onCreate: () => void
  onEdit: (listing: ListingRecord) => void
  onToggleStatus: (listing: ListingRecord) => void
  onDelete: (listing: ListingRecord) => void
}

export function ListingTable({ listings, pending, onCreate, onEdit, onToggleStatus, onDelete }: ListingTableProps) {
  if (listings.length === 0) {
    return (
      <div className="portal-empty-state">
        <span className="portal-empty-mark" aria-hidden="true"><Building2 /></span>
        <p className="portal-kicker">A considered beginning</p>
        <h3>Your property register is ready.</h3>
        <p>Add a residence to keep its details in one private place. Nothing is public until you choose to publish it.</p>
        <Button className="portal-form-submit" type="button" onClick={onCreate}>Add your first listing <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></Button>
      </div>
    )
  }

  return (
    <div className="portal-table-wrap">
      <table className="portal-listings-table">
        <thead>
          <tr>
            <th scope="col">Residence</th>
            <th scope="col">Status</th>
            <th scope="col">Price</th>
            <th scope="col"><span className="sr-only">Listing actions</span></th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id}>
              <td>
                <div className="portal-listing-identity">
                  <span className="portal-listing-thumb">
                    {listing.coverImage ? <img src={listing.coverImage} alt="" loading="lazy" /> : <Building2 aria-hidden="true" />}
                  </span>
                  <span className="portal-listing-copy">
                    <strong>{listing.title}</strong>
                    <span>{listing.location} · {listing.propertyType}</span>
                  </span>
                </div>
              </td>
              <td><span className={`portal-status portal-status--${listing.status}`}>{listing.status === 'published' ? 'Published' : 'Draft'}</span></td>
              <td className="portal-listing-price">{formatListingPrice(listing.price, listing.currency)}</td>
              <td>
                <div className="portal-row-actions">
                  {listing.status === 'published' && (
                    <Link className="portal-icon-link" href={`/listings/${listing.id}`} aria-label={`View ${listing.title}`}>
                      <Eye aria-hidden="true" />
                    </Link>
                  )}
                  <Button variant="ghost" size="icon-sm" aria-label={`Edit ${listing.title}`} onClick={() => onEdit(listing)} disabled={pending}>
                    <Pencil aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label={listing.status === 'published' ? `Unpublish ${listing.title}` : `Publish ${listing.title}`} onClick={() => onToggleStatus(listing)} disabled={pending}>
                    <ArrowUpRight aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label={`Delete ${listing.title}`} onClick={() => onDelete(listing)} disabled={pending}>
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="portal-table-note">Publish to include a residence in the public directory. <Link href="/listings">View directory</Link></p>
    </div>
  )
}
