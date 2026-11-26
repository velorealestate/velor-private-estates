import Link from 'next/link'
import { ArrowUpRight, Building2 } from 'lucide-react'
import { formatArea, formatListingPrice } from '@/lib/listings/format'
import type { ListingRecord } from '@/lib/listings/types'

export function PropertyCard({ listing, index }: { listing: ListingRecord; index: number }) {
  const area = formatArea(listing.areaSqm)

  return (
    <article className="public-property-card">
      <Link className="public-property-image" href={`/listings/${listing.id}`} aria-label={`View ${listing.title} in ${listing.location}`}>
        {listing.coverImage ? (
          <img src={listing.coverImage} alt="" loading="lazy" />
        ) : (
          <span className="public-property-placeholder" aria-hidden="true"><Building2 /></span>
        )}
        <span className="public-property-index">Residence / {String(index + 1).padStart(2, '0')}</span>
        <span className="public-property-open"><ArrowUpRight aria-hidden="true" /></span>
      </Link>
      <div className="public-property-caption">
        <div>
          <span className="public-property-type">{listing.propertyType}</span>
          <h2><Link href={`/listings/${listing.id}`}>{listing.title}</Link></h2>
          <p>{listing.location}</p>
        </div>
        <div className="public-property-meta">
          <strong>{formatListingPrice(listing.price, listing.currency)}</strong>
          {area && <span>{area}</span>}
          {listing.bedrooms !== null && <span>{listing.bedrooms} bedrooms</span>}
        </div>
      </div>
      <p className="public-property-summary">{listing.summary}</p>
    </article>
  )
}
