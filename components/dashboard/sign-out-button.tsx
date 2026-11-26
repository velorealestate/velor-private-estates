'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth/client'

export function SignOutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function signOut() {
    setPending(true)
    setError('')

    try {
      const result = await authClient.signOut()
      if (result.error) throw new Error('Sign-out failed')
      router.replace('/')
      router.refresh()
    } catch {
      setError('Sign-out could not be completed. Try again.')
      setPending(false)
    }
  }

  return (
    <div className="portal-signout-wrap">
      <Button className="portal-signout" variant="ghost" type="button" onClick={signOut} disabled={pending}>
        {pending ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <LogOut data-icon="inline-start" aria-hidden="true" />}
        {pending ? 'Signing out' : 'Sign out'}
      </Button>
      {error && <p className="portal-signout-error" role="status">{error}</p>}
    </div>
  )
}
