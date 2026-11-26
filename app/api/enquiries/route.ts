import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { velorEnquiries } from '@/lib/db/schema'

export const runtime = 'nodejs'

const enquiryTypes = new Set(['viewing', 'property', 'seller', 'consultation'])
const contactPreferences = new Set(['email', 'phone'])
const requestWindowMs = 15 * 60 * 1000
const requestLimit = 5
const requestsByAddress = new Map<string, { count: number; expiresAt: number }>()

function cleanText(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
}

function isRateLimited(address: string) {
  const now = Date.now()
  if (requestsByAddress.size > 500) {
    for (const [storedAddress, request] of requestsByAddress) {
      if (request.expiresAt <= now) requestsByAddress.delete(storedAddress)
    }
    while (requestsByAddress.size > 1_000) {
      const oldestAddress = requestsByAddress.keys().next().value
      if (!oldestAddress) break
      requestsByAddress.delete(oldestAddress)
    }
  }

  const current = requestsByAddress.get(address)

  if (!current || current.expiresAt <= now) {
    requestsByAddress.set(address, { count: 1, expiresAt: now + requestWindowMs })
    return false
  }

  current.count += 1
  return current.count > requestLimit
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 12_000) {
    return NextResponse.json({ message: 'The enquiry is too large to submit.' }, { status: 413 })
  }

  const address =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim()

  if (address && isRateLimited(address)) {
    return NextResponse.json(
      { message: 'Please wait a little before sending another enquiry.' },
      { status: 429 },
    )
  }

  let payload: unknown
  try {
    const body = await request.text()
    if (body.length > 12_000) {
      return NextResponse.json({ message: 'The enquiry is too large to submit.' }, { status: 413 })
    }
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ message: 'Please review the form and try again.' }, { status: 400 })
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ message: 'Please review the form and try again.' }, { status: 400 })
  }

  const fields = payload as Record<string, unknown>
  if (cleanText(fields.website)) {
    return NextResponse.json({ ok: true }, { status: 202 })
  }

  const fullName = cleanText(fields.fullName)
  const email = cleanText(fields.email).toLowerCase()
  const telephone = cleanText(fields.telephone)
  const enquiryType = cleanText(fields.enquiryType)
  const residenceSlug = cleanText(fields.residenceSlug)
  const message = cleanText(fields.message)
  const contactPreference = cleanText(fields.contactPreference)
  const privacyConsent = fields.privacyConsent === true

  if (fullName.length < 2 || fullName.length > 120) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 })
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (telephone.length > 40 || (contactPreference === 'phone' && telephone.length < 5)) {
    return NextResponse.json(
      { message: 'Please provide a telephone number for a phone response.' },
      { status: 400 },
    )
  }

  if (!enquiryTypes.has(enquiryType) || !contactPreferences.has(contactPreference)) {
    return NextResponse.json({ message: 'Please choose an enquiry type and contact preference.' }, { status: 400 })
  }

  if (residenceSlug && !/^[a-z0-9-]{1,120}$/.test(residenceSlug)) {
    return NextResponse.json({ message: 'Please review the residence selection.' }, { status: 400 })
  }

  if (message.length < 10 || message.length > 2400) {
    return NextResponse.json({ message: 'Please add a little more detail to your message.' }, { status: 400 })
  }

  if (!privacyConsent) {
    return NextResponse.json({ message: 'Please confirm the privacy notice before sending.' }, { status: 400 })
  }

  const database = getDatabase()
  if (!database) {
    return NextResponse.json(
      { message: 'Enquiry submission is unavailable in this deployment.' },
      { status: 503 },
    )
  }

  try {
    const [createdEnquiry] = await database
      .insert(velorEnquiries)
      .values({
        fullName,
        email,
        telephone: telephone || null,
        enquiryType,
        residenceSlug: residenceSlug || null,
        message,
        contactPreference,
        privacyConsent,
      })
      .returning({ id: velorEnquiries.id })

    return NextResponse.json({ ok: true, reference: createdEnquiry.id }, { status: 201 })
  } catch {
    console.error('[velor] Enquiry persistence failed')
    return NextResponse.json(
      { message: 'We could not receive your enquiry just now. Please try again shortly.' },
      { status: 503 },
    )
  }
}
