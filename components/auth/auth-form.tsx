'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/client'

type AuthFormProps = {
  mode: 'sign-in' | 'sign-up'
  redirectTo: string
}

export function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name: String(formData.get('name') ?? '').trim(),
            email,
            password,
          })
        : await authClient.signIn.email({ email, password })

      if (result.error) throw new Error('Authentication failed')
      router.replace(redirectTo)
      router.refresh()
    } catch {
      setError('We could not complete sign-in. Check your details and try again.')
      setPending(false)
    }
  }

  return (
    <form className="portal-auth-form" onSubmit={handleSubmit}>
      <FieldGroup>
        {isSignUp && (
          <Field>
            <FieldLabel htmlFor="auth-name">Full name</FieldLabel>
            <Input id="auth-name" name="name" autoComplete="name" required maxLength={120} />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="auth-email">Email address</FieldLabel>
          <Input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        </Field>
        <Field>
          <FieldLabel htmlFor="auth-password">Password</FieldLabel>
          <Input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            minLength={8}
            maxLength={128}
            required
          />
        </Field>
      </FieldGroup>
      {error && <p className="portal-form-error" role="alert">{error}</p>}
      <Button className="portal-auth-submit" type="submit" size="lg" disabled={pending}>
        {pending ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <ArrowRight data-icon="inline-end" aria-hidden="true" />}
        {pending ? 'Please wait' : isSignUp ? 'Create private account' : 'Sign in securely'}
      </Button>
    </form>
  )
}
