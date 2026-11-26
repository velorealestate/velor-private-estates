import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, Ruler } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { formatArea, formatListingPrice } from '@/lib/listings/format'
import { getPublishedListing } from '@/lib/listings/queries'
import { absoluteSiteUrl, resolvePublicImageUrl, SITE_NAME } from '@/lib/site'

export const dynamic = 'force-dynamic'

type PropertyPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await getPublishedListing(id)
  if (!listing) {
    return {
      title: 'Residence not found',
      robots: { index: false, follow: false },
    }
  }

  const image = resolvePublicImageUrl(listing.coverImage)
  const url = `/listings/${listing.id}`

  return {
    title: listing.title,
    description: listing.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: listing.title,
      description: listing.summary,
      images: [{ url: image, alt: listing.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: listing.summary,
      images: [image],
    },
  }
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params
  const listing = await getPublishedListing(id)
  if (!listing) notFound()

  const area = formatArea(listing.areaSqm)

  return (
    <main className="portal-theme public-property-detail">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteSiteUrl('/') },
              { '@type': 'ListItem', position: 2, name: 'Available Residences', item: absoluteSiteUrl('/listings') },
              { '@type': 'ListItem', position: 3, name: listing.title, item: absoluteSiteUrl(`/listings/${listing.id}`) },
            ],
          },
          {
            '@type': 'Residence',
            '@id': absoluteSiteUrl(`/listings/${listing.id}#residence`),
            name: listing.title,
            description: listing.summary,
            url: absoluteSiteUrl(`/listings/${listing.id}`),
            image: resolvePublicImageUrl(listing.coverImage),
          },
        ],
      }} />
      <header className="public-directory-header">
        <Link className="portal-auth-brand" href="/" aria-label="VELOR Private Estates home">
          <span>VELOR</span><small>PRIVATE ESTATES</small>
        </Link>
        <nav aria-label="Property navigation">
          <Link href="/listings">All residences</Link>
          <Link href="/sign-in">Client portal</Link>
        </nav>
      </header>
      <article className="public-property-detail-content">
        <Link className="portal-back-link" href="/listings"><ArrowLeft aria-hidden="true" /> Back to residences</Link>
        <div className="public-property-detail-grid">
          <figure className="public-property-detail-image">
            {listing.coverImage ? <img src={listing.coverImage} alt={`${listing.title}, located in ${listing.location}.`} /> : <span className="public-property-placeholder" aria-hidden="true"><BedDouble /></span>}
            <figcaption>VELOR / PRIVATE ESTATES</figcaption>
          </figure>
          <div className="public-property-detail-copy">
            <p className="portal-kicker">{listing.propertyType} / {listing.location}</p>
            <h1>{listing.title}</h1>
            <p className="public-property-detail-summary">{listing.summary}</p>
            <p className="public-property-detail-price">{formatListingPrice(listing.price, listing.currency)}</p>
            <div className="public-property-specs" aria-label="Property details">
              {listing.bedrooms !== null && <span><BedDouble aria-hidden="true" />{listing.bedrooms} bedrooms</span>}
              {listing.bathrooms !== null && <span><Bath aria-hidden="true" />{listing.bathrooms} bathrooms</span>}
              {area && <span><Ruler aria-hidden="true" />{area}</span>}
            </div>
            <div className="public-property-description">{listing.description.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            <Link className="portal-public-cta" href="/#contact">Request a private conversation <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>
      </article>
      <footer className="public-directory-footer">
        <span>© 2026 VELOR PRIVATE ESTATES</span>
        <Link href="/">Beyond the address.</Link>
        <Link href="/listings">Explore the collection</Link>
      </footer>
    </main>
  )
}
