'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, CircleUserRound, Compass } from 'lucide-react'

const links = [
  { href: '/dashboard/listings', label: 'My listings', icon: Building2 },
  { href: '/dashboard/account', label: 'Account settings', icon: CircleUserRound },
  { href: '/listings', label: 'Public directory', icon: Compass },
]

export function PortalNavigation() {
  const pathname = usePathname()

  return (
    <nav className="portal-navigation" aria-label="Private office">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/listings' && pathname.startsWith(`${href}/`))
        return (
          <Link href={href} key={href} aria-current={active ? 'page' : undefined}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
