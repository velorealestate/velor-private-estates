const DEFAULT_SITE_ORIGIN = 'https://velor-private-estates-branding.vercel.app'

function getSiteOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configuredOrigin) return DEFAULT_SITE_ORIGIN

  try {
    return new URL(configuredOrigin).origin
  } catch {
    return DEFAULT_SITE_ORIGIN
  }
}

export const SITE_ORIGIN = getSiteOrigin()
export const SITE_NAME = 'VELOR Private Estates'
export const SITE_DESCRIPTION = 'An architecture-led collection of exceptional private residences, selected for character, craftsmanship, and a sense of place. Explore currently published properties and request a private conversation.'

export function absoluteSiteUrl(path: string) {
  return new URL(path, `${SITE_ORIGIN}/`).toString()
}

export function resolvePublicImageUrl(image: string | null) {
  if (image?.startsWith('/') && !image.startsWith('//') && !image.split('/').includes('..')) {
    return absoluteSiteUrl(image)
  }

  if (image) {
    try {
      const url = new URL(image)
      if (url.protocol === 'https:' && !url.username && !url.password) return url.toString()
    } catch {
      return absoluteSiteUrl('/images/velor-private-courtyard.png')
    }
  }

  return absoluteSiteUrl('/images/velor-private-courtyard.png')
}

export const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': absoluteSiteUrl('/#organization'),
      name: SITE_NAME,
      url: SITE_ORIGIN,
      description: SITE_DESCRIPTION,
      logo: {
        '@type': 'ImageObject',
        url: absoluteSiteUrl('/icon.svg'),
      },
      image: absoluteSiteUrl('/images/velor-private-courtyard.png'),
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      knowsAbout: ['Private estates', 'Luxury residences', 'Residential architecture', 'Property and place'],
    },
    {
      '@type': 'WebSite',
      '@id': absoluteSiteUrl('/#website'),
      url: SITE_ORIGIN,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': absoluteSiteUrl('/#organization') },
    },
  ],
} as const
