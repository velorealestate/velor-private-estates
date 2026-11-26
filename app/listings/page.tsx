import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PropertyCard } from '@/components/listings/property-card'
import { getPublishedListings } from '@/lib/listings/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Available Residences | VELOR Private Estates',
  description: 'Explore the residences currently published by VELOR Private Estates.',
}

export default async function PublicListingsPage() {
  const listings = await getPublishedListings()

  return (
    <main className="portal-theme public-directory">
      <header className="public-directory-header">
        <Link className="portal-auth-brand" href="/" aria-label="VELOR Private Estates home">
          <span>VELOR</span><small>PRIVATE ESTATES</small>
        </Link>
        <nav aria-label="Directory navigation">
          <Link href="/">The estate</Link>
          <Link href="/sign-in">Client portal</Link>
        </nav>
      </header>
      <section className="public-directory-intro" aria-labelledby="directory-title">
        <p className="portal-kicker">VELOR / The collection</p>
        <h1 id="directory-title">Residences <em>available.</em></h1>
        <p>Exceptional properties, considered with care. Each residence is presented by its owner through the VELOR private office.</p>
        <span className="public-directory-count">{listings.length.toString().padStart(2, '0')} PUBLISHED RESIDENCES</span>
      </section>
      {listings.length > 0 ? (
        <section className="public-property-grid" aria-label="Published residences">
          {listings.map((listing, index) => <PropertyCard key={listing.id} listing={listing} index={index} />)}
        </section>
      ) : (
        <section className="public-directory-empty" aria-labelledby="directory-empty-title">
          <span className="portal-kicker">The next address is yet to be revealed</span>
          <h2 id="directory-empty-title">A considered collection,<br />in its own time.</h2>
          <p>No residences are currently published. For a private conversation about an upcoming opportunity, our team would be pleased to hear from you.</p>
          <Link className="portal-public-cta" href="/#contact">Speak with the private office <ArrowUpRight aria-hidden="true" /></Link>
        </section>
      )}
      <footer className="public-directory-footer">
        <span>© 2026 VELOR PRIVATE ESTATES</span>
        <Link href="/">Beyond the address.</Link>
        <Link href="/sign-up">Represent a property <ArrowUpRight aria-hidden="true" /></Link>
      </footer>
    </main>
  )
}
