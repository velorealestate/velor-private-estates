'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, LoaderCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth/client'

type AccountSettingsProps = {
  name: string
  email: string
}

export function AccountSettings({ name, email }: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(name)
  const [profileState, setProfileState] = useState('')
  const [profilePending, setProfilePending] = useState(false)
  const [passwordState, setPasswordState] = useState('')
  const [passwordPending, setPasswordPending] = useState(false)

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileState('')
    setProfilePending(true)

    try {
      const result = await authClient.updateUser({ name: displayName.trim() })
      if (result.error) throw new Error('Profile update failed')
      setProfileState('Your profile has been updated.')
    } catch {
      setProfileState('We could not update your profile. Try again.')
    } finally {
      setProfilePending(false)
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordState('')
    setPasswordPending(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const currentPassword = String(formData.get('currentPassword') ?? '')
    const newPassword = String(formData.get('newPassword') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (newPassword !== confirmPassword) {
      setPasswordState('The new passwords do not match.')
      setPasswordPending(false)
      return
    }

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (result.error) throw new Error('Password update failed')
      form.reset()
      setPasswordState('Your password has been changed. Other sessions have been signed out.')
    } catch {
      setPasswordState('We could not change your password. Check the current password and try again.')
    } finally {
      setPasswordPending(false)
    }
  }

  return (
    <div className="portal-settings-grid">
      <section className="portal-card portal-settings-card" aria-labelledby="profile-title">
        <div className="portal-card-heading">
          <div>
            <p className="portal-kicker">Personal details</p>
            <h2 id="profile-title">Your profile</h2>
          </div>
          <span className="portal-card-icon" aria-hidden="true"><ShieldCheck /></span>
        </div>
        <form onSubmit={updateProfile}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="account-name">Full name</FieldLabel>
              <Input
                id="account-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                maxLength={120}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-email">Email address</FieldLabel>
              <Input id="account-email" value={email} disabled readOnly />
              <p className="portal-field-note">Your email is used for sign-in and cannot be changed here.</p>
            </Field>
          </FieldGroup>
          {profileState && <p className="portal-form-notice" role="status">{profileState}</p>}
          <Button className="portal-form-submit" type="submit" disabled={profilePending || !displayName.trim()}>
            {profilePending ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <ArrowRight data-icon="inline-end" aria-hidden="true" />}
            Save profile
          </Button>
        </form>
      </section>

      <section className="portal-card portal-settings-card" aria-labelledby="security-title">
        <div className="portal-card-heading">
          <div>
            <p className="portal-kicker">Security</p>
            <h2 id="security-title">Change password</h2>
          </div>
          <span className="portal-card-icon" aria-hidden="true"><ShieldCheck /></span>
        </div>
        <form onSubmit={updatePassword}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input id="current-password" name="currentPassword" type="password" autoComplete="current-password" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input id="new-password" name="newPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
              <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required />
            </Field>
          </FieldGroup>
          {passwordState && <p className="portal-form-notice" role="status">{passwordState}</p>}
          <Button className="portal-form-submit" type="submit" disabled={passwordPending}>
            {passwordPending ? <LoaderCircle className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : <ArrowRight data-icon="inline-end" aria-hidden="true" />}
            Update password
          </Button>
        </form>
      </section>
    </div>
  )
}
