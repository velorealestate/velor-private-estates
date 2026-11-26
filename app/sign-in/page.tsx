import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthScreen } from '@/components/auth/auth-screen'
import { getAuth } from '@/lib/auth/server'
import { DEFAULT_AUTH_REDIRECT, getSafeRedirectTo } from '@/lib/auth/redirect'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign In | VELOR Private Estates',
  description: 'Secure access to the VELOR private office.',
  robots: { index: false, follow: false },
}

type SignInPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams
  const auth = getAuth()
  const { data: session } = auth ? await auth.getSession() : { data: null }
  const redirectTo = getSafeRedirectTo(Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo)
  if (session?.user) redirect(redirectTo || DEFAULT_AUTH_REDIRECT)

  return <AuthScreen mode="sign-in" redirectTo={redirectTo} authEnabled={Boolean(auth)} />
}
