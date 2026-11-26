import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthScreen } from '@/components/auth/auth-screen'
import { getAuth } from '@/lib/auth/server'
import { getSafeRedirectTo } from '@/lib/auth/redirect'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Create an Account | VELOR Private Estates',
  description: 'Create secure access to the VELOR private office.',
  robots: { index: false, follow: false },
}

type SignUpPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams
  const auth = getAuth()
  const { data: session } = auth ? await auth.getSession() : { data: null }
  const redirectTo = getSafeRedirectTo(Array.isArray(params.redirectTo) ? params.redirectTo[0] : params.redirectTo)
  if (session?.user) redirect(redirectTo)

  return <AuthScreen mode="sign-up" redirectTo={redirectTo} authEnabled={Boolean(auth)} />
}
