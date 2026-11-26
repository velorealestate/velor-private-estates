import type { MetadataRoute } from 'next'
import { getPublishedListings } from '@/lib/listings/queries'
import { absoluteSiteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getPublishedListings()

  return [
    {
      url: absoluteSiteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteSiteUrl('/listings'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...listings.map((listing) => ({
      url: absoluteSiteUrl(`/listings/${listing.id}`),
      lastModified: listing.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
