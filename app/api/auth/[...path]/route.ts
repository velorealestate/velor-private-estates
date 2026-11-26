import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth/server'

export const runtime = 'nodejs'

type AuthMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type AuthRouteContext = { params: Promise<{ path: string[] }> }

function createAuthHandler(method: AuthMethod) {
  return async (request: Request, context: AuthRouteContext) => {
    const auth = getAuth()
    if (!auth) {
      return NextResponse.json(
        { message: 'Authentication is not enabled for this deployment.' },
        { status: 503 },
      )
    }

    return auth.handler()[method](request, context)
  }
}

export const GET = createAuthHandler('GET')
export const POST = createAuthHandler('POST')
export const PUT = createAuthHandler('PUT')
export const DELETE = createAuthHandler('DELETE')
export const PATCH = createAuthHandler('PATCH')
