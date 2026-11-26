import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PortalNavigation } from '@/components/dashboard/portal-navigation'
import { SignOutButton } from '@/components/dashboard/sign-out-button'

export function PortalFrame({ children, displayName }: { children: React.ReactNode; displayName: string }) {
  return (
    <div className="portal-theme portal-layout">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-brand" aria-label="VELOR Private Estates home">
          <span>VELOR</span>
          <small>PRIVATE ESTATES</small>
        </Link>
        <div className="portal-sidebar-rule" aria-hidden="true" />
        <p className="portal-sidebar-label">Private office</p>
        <PortalNavigation />
        <div className="portal-sidebar-bottom">
          <div className="portal-help-card">
            <span className="portal-help-kicker">A personal conversation</span>
            <p>For discreet guidance, our private office is here to help.</p>
            <Link href="/#contact">Contact VELOR <ArrowUpRight aria-hidden="true" /></Link>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className="portal-main">
        <header className="portal-topbar">
          <div>
            <span className="portal-topbar-eyebrow">Member workspace</span>
            <span className="portal-topbar-name">Welcome, {displayName}</span>
          </div>
          <Link className="portal-site-link" href="/">Visit VELOR <ArrowUpRight aria-hidden="true" /></Link>
        </header>
        <div className="portal-content">{children}</div>
      </main>
    </div>
  )
}
