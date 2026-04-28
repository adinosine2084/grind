'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router    = useRouter()
  const [supabase] = useState(() => createClient())

  async function handleLogin() {
    if (!email || !password) { setError('Fill in both fields.'); return }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/app')
    }
  }

  return (
    <>
      <Cursor />
      <div className="min-h-screen flex flex-col">
        <nav className="px-6 py-4 border-b-2 border-ink flex items-center justify-between">
          <Link href="/" className="font-display font-extrabold text-xl tracking-tight no-underline text-ink">
            <span className="bg-accent px-1">GR</span>IND
          </Link>
          <Link href="/auth/signup" className="text-xs font-bold uppercase tracking-widest hover:underline text-ink">
            No account? Sign up →
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <h1 className="font-display font-extrabold text-4xl tracking-tight mb-2">Welcome back.</h1>
            <p className="text-xs text-[#888] uppercase tracking-widest mb-8">Log in to your workspace</p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="you@company.com"
                  className="input-brutal"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="input-brutal"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-[#FF4C29] border-2 border-[#FF4C29] px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="btn btn-primary w-full mt-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Logging in...' : 'Log In →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
