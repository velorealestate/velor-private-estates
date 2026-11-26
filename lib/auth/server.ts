import { createNeonAuth } from '@neon/auth/next/server'

let authInstance: ReturnType<typeof createNeonAuth> | null = null

export function getAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET

  if (!baseUrl || !cookieSecret || cookieSecret.length < 32) return null

  authInstance ??= createNeonAuth({
    baseUrl,
    cookies: { secret: cookieSecret },
  })

  return authInstance
}
