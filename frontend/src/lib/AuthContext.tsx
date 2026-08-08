import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { useClosetStore } from '../store/closetStore'

interface AuthContextValue {
  user: User | null
  session: Session | null
  /** True until the initial session check completes. */
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * supabase-js falls back to `JSON.stringify(rawErrorBody)` when the Auth API
 * rejects a request without a readable `message`/`error` field — typically a
 * gateway-level rate limit, not a normal auth failure. That shows up as a
 * useless "{}" in the UI, so swap it for something a user can act on.
 */
function friendlyAuthError(message: string | null | undefined): string | null {
  if (!message) return null
  if (message.trim().startsWith('{')) {
    return 'Something went wrong. Please wait a moment and try again.'
  }
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      if (data.session) useClosetStore.getState().fetchAll()
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession((prev) => {
        // Only re-fetch/reset on an actual sign-in/sign-out, not on every
        // token refresh (which fires the same event with the same user).
        if (newSession?.user.id !== prev?.user.id) {
          if (newSession) useClosetStore.getState().fetchAll()
          else useClosetStore.getState().reset()
        }
        return newSession
      })
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInWithPassword(email: string, password: string) {
    if (!supabase) return { error: 'Authentication is not configured for this deployment.' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: friendlyAuthError(error?.message) }
  }

  async function signUp(email: string, password: string) {
    if (!supabase)
      return {
        error: 'Authentication is not configured for this deployment.',
        needsEmailConfirmation: false,
      }
    const { data, error } = await supabase.auth.signUp({ email, password })
    // If Supabase's "Confirm email" setting is on, signUp succeeds but
    // returns no session until the user clicks the emailed confirmation link.
    return {
      error: friendlyAuthError(error?.message),
      needsEmailConfirmation: !error && !data.session,
    }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signInWithPassword,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
