import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { getPublishedListing, getPublishedListings } from '@/lib/listings/queries'
import { PROPERTY_TYPES, type ListingRecord } from '@/lib/listings/types'
import { absoluteSiteUrl } from '@/lib/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function toPublicResidence(listing: ListingRecord) {
  return {
    id: listing.id,
    title: listing.title,
    location: listing.location,
    propertyType: listing.propertyType,
    price: listing.price,
    currency: listing.currency,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    areaSqm: listing.areaSqm,
    coverImage: listing.coverImage,
    summary: listing.summary,
    description: listing.description,
    url: absoluteSiteUrl(`/listings/${listing.id}`),
  }
}

function addCorsHeaders(response: Response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Accept, Content-Type, Mcp-Protocol-Version')
  headers.set('Access-Control-Expose-Headers', 'Mcp-Protocol-Version, Mcp-Session-Id')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const mcpHandler = createMcpHandler((server) => {
  server.registerTool(
    'search_published_residences',
    {
      title: 'Search published residences',
      description: 'Search VELOR residences that their owners have explicitly published to the public directory. Draft and private listings are never returned.',
      inputSchema: z.object({
        query: z.string().trim().min(1).max(120).optional().describe('Search titles, locations, summaries, or public descriptions.'),
        location: z.string().trim().min(1).max(120).optional().describe('Filter by a location name or phrase.'),
        propertyType: z.enum(PROPERTY_TYPES).optional().describe('Filter by the published property type.'),
        limit: z.number().int().min(1).max(20).optional().describe('Maximum results to return. Defaults to 10.'),
      }),
    },
    async ({ query, location, propertyType, limit }) => {
      const listings = await getPublishedListings()
      const normalizedQuery = query?.toLowerCase()
      const normalizedLocation = location?.toLowerCase()
      const matches = listings.filter((listing) => {
        if (propertyType && listing.propertyType !== propertyType) return false
        if (normalizedLocation && !listing.location.toLowerCase().includes(normalizedLocation)) return false
        if (!normalizedQuery) return true

        const searchableText = [listing.title, listing.location, listing.propertyType, listing.summary, listing.description]
          .join(' ')
          .toLowerCase()
        return searchableText.includes(normalizedQuery)
      })
      const residences = matches.slice(0, limit ?? 10).map(toPublicResidence)

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ count: residences.length, residences }, null, 2),
        }],
      }
    },
  )

  server.registerTool(
    'get_published_residence',
    {
      title: 'Get a published residence',
      description: 'Retrieve the public details for one VELOR residence by its listing ID. Returns no private or draft listing data.',
      inputSchema: z.object({
        id: z.string().uuid().describe('The UUID from a published residence URL.'),
      }),
    },
    async ({ id }) => {
      const listing = await getPublishedListing(id)
      if (!listing) {
        return {
          isError: true,
          content: [{ type: 'text', text: 'No published residence was found for that ID.' }],
        }
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(toPublicResidence(listing), null, 2) }],
      }
    },
  )
}, {
  serverInfo: {
    name: 'VELOR Private Estates',
    version: '1.0.0',
  },
})

export async function GET(request: Request) {
  return addCorsHeaders(await mcpHandler(request))
}

export async function POST(request: Request) {
  return addCorsHeaders(await mcpHandler(request))
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Accept, Content-Type, Mcp-Protocol-Version',
      'Access-Control-Max-Age': '86400',
    },
  })
}
