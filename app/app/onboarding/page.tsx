'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Cursor from '@/components/Cursor'
import { useRouter } from 'next/navigation'

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)
}

export default function OnboardingPage() {
  const [name,    setName]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const router     = useRouter()
  const [supabase] = useState(() => createClient())

  async function createWorkspace() {
    if (!name.trim()) { setError('Give your workspace a name.'); return }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const slug = slugify(name) + '-' + Math.random().toString(36).slice(2, 7)

    const { data: ws, error: wsErr } = await supabase
      .from('workspaces')
      .insert({ name: name.trim(), slug, owner_id: user.id })
      .select()
      .single()

    if (wsErr) { setError(wsErr.message); setLoading(false); return }

    const { error: memErr } = await supabase
      .from('workspace_members')
      .insert({ workspace_id: ws.id, user_id: user.id, role: 'owner' })

    if (memErr) { setError(memErr.message); setLoading(false); return }

    router.push('/app')
  }

  return (
    <>
      <Cursor />
      <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-paper">
        <div className="w-full max-w-sm">
          <div className="tag bg-accent border-ink mb-6">Step 1 of 1</div>
          <h1 className="font-display font-extrabold text-4xl tracking-tight mb-2">Name your workspace.</h1>
          <p className="text-xs text-[#888] uppercase tracking-widest mb-8">This is where your team grinds.</p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest block mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createWorkspace()}
                placeholder="Acme Corp, My Team..."
                className="input-brutal text-base"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-[#FF4C29] border-2 border-[#FF4C29] px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={createWorkspace}
              disabled={loading}
              className="btn btn-primary w-full mt-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Creating...' : 'Create Workspace →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
