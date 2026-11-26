import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AccountSettings } from '@/components/account/account-settings'
import { getAuth } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Account Settings | VELOR Private Office',
  robots: { index: false, follow: false },
}

export default async function AccountSettingsPage() {
  const auth = getAuth()
  if (!auth) redirect('/sign-in?redirectTo=%2Fdashboard%2Faccount')

  const { data: session } = await auth.getSession()
  if (!session?.user) redirect('/sign-in?redirectTo=%2Fdashboard%2Faccount')

  return (
    <div className="portal-dashboard-page">
      <div className="portal-page-heading">
        <div>
          <p className="portal-kicker">Member details</p>
          <h1>Account settings</h1>
          <p className="portal-page-intro">Keep your profile and sign-in details current.</p>
        </div>
      </div>
      <AccountSettings name={session.user.name ?? ''} email={session.user.email} />
    </div>
  )
}
