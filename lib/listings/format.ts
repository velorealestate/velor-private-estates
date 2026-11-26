export function formatListingPrice(price: string | null, currency: string) {
  if (price === null || !Number.isFinite(Number(price))) return 'Price on request'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

export function formatArea(areaSqm: string | null) {
  if (areaSqm === null || !Number.isFinite(Number(areaSqm))) return null

  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(areaSqm))} m²`
}
