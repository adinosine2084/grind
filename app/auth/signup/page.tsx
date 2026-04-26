'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup() {
    if (!name || !email || !password) { setError('All fields required.'); return }
    if (password.length < 8) { setError('Password must be 8+ characters.'); return }
    setLoading(true); setError('')

    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })

    if (error) { setError(error.message); setLoading(false) }
    else router.push('/app/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 py-4 border-b-2 border-ink flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-xl tracking-tight">
          <span className="bg-accent px-1">GR</span>IND
        </Link>
        <Link href="/auth/login" className="text-xs font-bold uppercase tracking-widest hover:underline">
          Have an account? Log in →
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="tag mb-5">Free — no credit card</div>
          <h1 className="font-display font-extrabold text-4xl tracking-tight mb-2">Start grinding.</h1>
          <p className="text-xs text-[#888] uppercase tracking-widest mb-8">Create your account</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="input-brutal"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-brutal"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="8+ characters"
                className="input-brutal"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-[#FF4C29] border-2 border-[#FF4C29] px-3 py-2">{error}</p>
            )}

            <button onClick={handleSignup} disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </div>

          <p className="text-xs text-[#aaa] mt-5 leading-relaxed">
            By signing up, you agree to our{' '}
            <a href="#" className="underline">Terms</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
