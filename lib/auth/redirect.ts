export const DEFAULT_AUTH_REDIRECT = '/dashboard/listings'

export function getSafeRedirectTo(value: unknown) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return DEFAULT_AUTH_REDIRECT
  }

  return value
}
