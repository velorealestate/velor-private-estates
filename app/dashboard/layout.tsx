import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PortalFrame } from '@/components/dashboard/portal-frame'
import { getAuth } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Private Office | VELOR Private Estates',
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const auth = getAuth()
  if (!auth) redirect('/sign-in?redirectTo=%2Fdashboard%2Flistings')

  const { data: session } = await auth.getSession()
  if (!session?.user) redirect('/sign-in?redirectTo=%2Fdashboard%2Flistings')

  return <PortalFrame displayName={session.user.name || session.user.email}>{children}</PortalFrame>
}
