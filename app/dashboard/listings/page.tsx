import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ListingWorkspace } from '@/components/dashboard/listing-workspace'
import { getAuth } from '@/lib/auth/server'
import { getListingsForUser } from '@/lib/listings/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Your Listings | VELOR Private Office',
  robots: { index: false, follow: false },
}

export default async function ListingsDashboardPage() {
  const auth = getAuth()
  if (!auth) redirect('/sign-in?redirectTo=%2Fdashboard%2Flistings')

  const { data: session } = await auth.getSession()
  if (!session?.user) redirect('/sign-in?redirectTo=%2Fdashboard%2Flistings')

  const listings = await getListingsForUser(session.user.id)
  return <ListingWorkspace listings={listings} />
}
