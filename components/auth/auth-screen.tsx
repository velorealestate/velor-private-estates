import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

type AuthScreenProps = {
  mode: 'sign-in' | 'sign-up'
  redirectTo: string
  authEnabled: boolean
}

export function AuthScreen({ mode, redirectTo, authEnabled }: AuthScreenProps) {
  const isSignUp = mode === 'sign-up'

  return (
    <main className="portal-theme portal-auth-screen">
      <header className="portal-auth-header">
        <Link className="portal-auth-brand" href="/" aria-label="VELOR Private Estates home">
          <span>VELOR</span>
          <small>PRIVATE ESTATES</small>
        </Link>
        <Link className="portal-auth-return" href="/">Return to the estate</Link>
      </header>
      <div className="portal-auth-layout">
        <section className="portal-auth-content" aria-labelledby="auth-title">
          <p className="portal-kicker">The VELOR private office</p>
          <h1 id="auth-title">{isSignUp ? 'A more personal way to manage your properties.' : 'Welcome to your private office.'}</h1>
          <p className="portal-auth-intro">
            {isSignUp
              ? 'Create an account to curate property details, keep drafts private, and share published residences with the VELOR collection.'
              : 'Sign in to manage your property listings and account details.'}
          </p>
          {authEnabled ? (
            <AuthForm mode={mode} redirectTo={redirectTo} />
          ) : (
            <p className="portal-form-error" role="status">
              Account access is unavailable because authentication is not configured for this deployment.
            </p>
          )}
          <p className="portal-auth-switch">
            {isSignUp ? 'Already have an account?' : 'New to the private office?'}{' '}
            <Link href={`${isSignUp ? '/sign-in' : '/sign-up'}?redirectTo=${encodeURIComponent(redirectTo)}`}>
              {isSignUp ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
          <p className="portal-auth-footnote">Your drafts remain private. Only listings you publish appear in the public directory.</p>
        </section>
        <figure className="portal-auth-visual">
          <img
            src="/images/velor-private-courtyard.png"
            alt="A secluded limestone residence courtyard at blue hour, with a reflecting pool and warm interior light."
          />
          <figcaption>
            <span>VELOR / PRIVATE ESTATES</span>
            <span>Beyond the address.</span>
          </figcaption>
        </figure>
      </div>
    </main>
  )
}
