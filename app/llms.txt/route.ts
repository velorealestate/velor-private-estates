import { getPublishedListings } from '@/lib/listings/queries'
import { absoluteSiteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

export const dynamic = 'force-dynamic'

function plainLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

export async function GET() {
  const listings = await getPublishedListings()
  const featuredListings = listings.slice(0, 40)
  const listingLines = featuredListings.map((listing) => {
    const url = absoluteSiteUrl(`/listings/${listing.id}`)
    return `- ${plainLine(listing.title)} — ${plainLine(listing.location)}: ${url}. ${plainLine(listing.summary)}`
  })

  const content = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    '## Canonical pages',
    `- Home: ${absoluteSiteUrl('/')}`,
    `- Published residences: ${absoluteSiteUrl('/listings')}`,
    `- XML sitemap: ${absoluteSiteUrl('/sitemap.xml')}`,
    '',
    '## MCP access',
    `- Read-only Model Context Protocol endpoint: ${absoluteSiteUrl('/api/mcp')}`,
    '- Available tools search published residences and retrieve a single published residence. Only listings explicitly marked published are exposed.',
    '',
    '## Content guidance',
    '- The homepage collection gallery contains illustrative architectural studies; those concepts are not active property listings.',
    '- Treat the public listings directory and individual published residence pages as the source of truth for availability.',
    '- The sitemap includes the homepage, directory, and currently published residence pages.',
    '',
    '## Currently published residences',
    ...(listingLines.length > 0 ? listingLines : ['- No residences are currently published.']),
    ...(listings.length > featuredListings.length
      ? [`- Additional published residences are listed in the sitemap: ${absoluteSiteUrl('/sitemap.xml')}`]
      : []),
    '',
  ].join('\n')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=900',
    },
  })
}
