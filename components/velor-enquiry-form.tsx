'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { residences } from '@/components/velor-content'

export type EnquiryType = 'viewing' | 'property' | 'seller' | 'consultation'
export type ContactPreference = 'email' | 'phone'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

type VelorEnquiryFormProps = {
  initialType: EnquiryType
  initialResidence?: string
  onClose: () => void
}

const enquiryOptions: { value: EnquiryType; label: string }[] = [
  { value: 'viewing', label: 'Private viewing' },
  { value: 'property', label: 'Property enquiry' },
  { value: 'seller', label: 'Seller enquiry' },
  { value: 'consultation', label: 'General consultation' },
]

export function VelorEnquiryForm({
  initialType,
  initialResidence,
  onClose,
}: VelorEnquiryFormProps) {
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(initialType)
  const [contactPreference, setContactPreference] = useState<ContactPreference>('email')
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')
  const [reference, setReference] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!privacyConsent) {
      setStatus('error')
      setFeedback('Please confirm the privacy notice before sending.')
      return
    }

    setStatus('sending')
    setFeedback('')

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        telephone: formData.get('telephone'),
        enquiryType,
        residenceSlug: formData.get('residenceSlug'),
        message: formData.get('message'),
        contactPreference,
        privacyConsent,
        website: formData.get('website'),
      }),
    }).catch(() => null)

    if (!response) {
      setStatus('error')
      setFeedback('We could not send your enquiry just now. Please try again shortly.')
      return
    }

    const result = await response.json().catch(() => null)
    if (!response.ok || !result?.ok) {
      setStatus('error')
      setFeedback(result?.message ?? 'We could not send your enquiry just now. Please try again shortly.')
      return
    }

    setReference(typeof result.reference === 'string' ? result.reference : '')
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <section className="enquiry-confirmation" aria-labelledby="experience-title" aria-live="polite">
        <span className="confirmation-mark" aria-hidden="true"><Check size={19} strokeWidth={1.2} /></span>
        <span className="eyebrow">Received with thanks</span>
        <h1 id="experience-title">A considered conversation begins here.</h1>
        <p>Your private enquiry has been received. A member of the VELOR team will be in touch using your preferred contact method.</p>
        {reference && <span className="enquiry-reference">Reference / {reference.slice(0, 8).toUpperCase()}</span>}
        <button className="experience-action experience-action--dark" type="button" onClick={onClose}>
          Return to the collection <ArrowRight aria-hidden="true" size={15} strokeWidth={1.2} />
        </button>
      </section>
    )
  }

  return (
    <section className="enquiry-form-content" aria-labelledby="experience-title">
      <div className="enquiry-introduction">
        <span className="eyebrow">A private conversation</span>
        <h1 id="experience-title">Begin with what matters to you.</h1>
        <p>Tell us a little about what brings you to VELOR. Your details will only be used to respond to this enquiry.</p>
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit} noValidate={false}>
        <FieldGroup className="enquiry-form-grid">
          <Field className="enquiry-field--wide">
            <FieldLabel htmlFor="fullName">Your name</FieldLabel>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              maxLength={120}
              placeholder="Full name"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder="name@example.com"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="telephone">Telephone</FieldLabel>
            <Input
              id="telephone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              placeholder="Optional"
              required={contactPreference === 'phone'}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="enquiryType">I am interested in</FieldLabel>
            <NativeSelect
              id="enquiryType"
              value={enquiryType}
              onChange={(event) => setEnquiryType(event.currentTarget.value as EnquiryType)}
              required
            >
              {enquiryOptions.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field>
            <FieldLabel htmlFor="contactPreference">Please contact me by</FieldLabel>
            <NativeSelect
              id="contactPreference"
              value={contactPreference}
              onChange={(event) => setContactPreference(event.currentTarget.value as ContactPreference)}
            >
              <NativeSelectOption value="email">Email</NativeSelectOption>
              <NativeSelectOption value="phone">Telephone</NativeSelectOption>
            </NativeSelect>
          </Field>

          <Field className="enquiry-field--wide">
            <FieldLabel htmlFor="residenceSlug">Residence of interest</FieldLabel>
            <NativeSelect
              id="residenceSlug"
              name="residenceSlug"
              defaultValue={initialResidence ?? ''}
            >
              <NativeSelectOption value="">Not tied to one residence</NativeSelectOption>
              {residences.map((residence) => (
                <NativeSelectOption key={residence.slug} value={residence.slug}>
                  {residence.name} / {residence.descriptor}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>

          <Field className="enquiry-field--wide">
            <FieldLabel htmlFor="message">A note for our team</FieldLabel>
            <Textarea
              id="message"
              name="message"
              minLength={10}
              maxLength={2400}
              placeholder="Share the details that would help us begin."
              rows={4}
              required
            />
            <FieldDescription>At least a sentence is helpful; there is no need to share anything you would prefer to discuss in person.</FieldDescription>
          </Field>

          <Field orientation="horizontal" className="enquiry-consent enquiry-field--wide">
            <Checkbox
              id="privacyConsent"
              checked={privacyConsent}
              aria-invalid={status === 'error' && !privacyConsent}
              aria-required="true"
              aria-describedby={status === 'error' && !privacyConsent ? 'enquiry-feedback' : undefined}
              onCheckedChange={(checked) => {
                const isChecked = checked === true
                setPrivacyConsent(isChecked)
                if (isChecked && feedback.includes('privacy')) {
                  setStatus('idle')
                  setFeedback('')
                }
              }}
            />
            <div className="enquiry-consent-copy">
              <FieldLabel htmlFor="privacyConsent">I agree that VELOR may use these details to respond to my enquiry.</FieldLabel>
              <FieldDescription>Your contact information is kept private and is not shown on the site.</FieldDescription>
            </div>
          </Field>
        </FieldGroup>

        <div className="enquiry-form-footer">
          <p className="enquiry-privacy-note">A discreet response, from a real person.</p>
          <Button type="submit" size="lg" className="enquiry-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending enquiry' : 'Send private enquiry'}
            {status !== 'sending' && <ArrowRight aria-hidden="true" data-icon="inline-end" />}
          </Button>
        </div>

        <FieldError id="enquiry-feedback" className="enquiry-feedback" role="alert">
          {status === 'error' ? feedback : null}
        </FieldError>

        <div className="enquiry-honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
        </div>
      </form>
    </section>
  )
}
