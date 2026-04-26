'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { routeTask, getPriorityScore } from '@/lib/routing'
import type { Task, Workspace, WorkspaceMember } from '@/lib/types'
import { useRouter } from 'next/navigation'

const STATUS_ORDER = ['urgent', 'todo', 'later', 'done'] as const
const STATUS_LABELS: Record<string, string> = { urgent: '🔥 Urgent', todo: '○ Todo', later: '↓ Later', done: '✓ Done' }

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [activeWs, setActiveWs] = useState<Workspace | null>(null)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [wsMenuOpen, setWsMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // Load initial data
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserEmail(user.email ?? '')

      const { data: members } = await supabase
        .from('workspace_members')
        .select('workspace_id, workspaces(*)')
        .eq('user_id', user.id)

      if (!members || members.length === 0) {
        router.push('/app/onboarding'); return
      }

      const wsList = members.map((m: any) => m.workspaces).filter(Boolean) as Workspace[]
      setWorkspaces(wsList)

      const ws = wsList[0]
      setActiveWs(ws)
      await loadTasks(ws.id)
      await loadMembers(ws.id)
      setLoading(false)
    }
    load()
  }, [])

  async function loadTasks(wsId: string) {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', wsId)
      .order('priority_score', { ascending: false })
      .order('created_at', { ascending: false })
    setTasks(data ?? [])
  }

  async function loadMembers(wsId: string) {
    const { data } = await supabase
      .from('workspace_members')
      .select('*, profiles(full_name, avatar_url)')
      .eq('workspace_id', wsId)
    setMembers(data ?? [])
  }

  // Realtime
  useEffect(() => {
    if (!activeWs) return
    const channel = supabase
      .channel(`tasks:${activeWs.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'tasks',
        filter: `workspace_id=eq.${activeWs.id}`,
      }, () => loadTasks(activeWs.id))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [activeWs?.id])

  async function addTask() {
    const title = input.trim()
    if (!title || !activeWs) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const status = routeTask(title)
    const priority_score = getPriorityScore(status)

    // Optimistic update
    const optimistic: Task = {
      id: 'opt-' + Date.now(),
      workspace_id: activeWs.id,
      created_by: user.id,
      assigned_to: null,
      title,
      description: null,
      status,
      priority_score,
      due_date: null,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTasks(prev => [optimistic, ...prev])
    setInput('')

    const { data, error } = await supabase.from('tasks').insert({
      workspace_id: activeWs.id,
      created_by: user.id,
      title, status, priority_score,
    }).select().single()

    if (error) {
      setTasks(prev => prev.filter(t => t.id !== optimistic.id))
    } else {
      setTasks(prev => prev.map(t => t.id === optimistic.id ? data : t))
    }
  }

  async function updateStatus(taskId: string, status: string) {
    const priority_score = getPriorityScore(status as any)
    const completed_at = status === 'done' ? new Date().toISOString() : null

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: status as any, priority_score, completed_at } : t
    ))

    await supabase.from('tasks')
      .update({ status, priority_score, completed_at })
      .eq('id', taskId)
  }

  async function deleteTask(taskId: string) {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    await supabase.from('tasks').delete().eq('id', taskId)
  }

  async function switchWorkspace(ws: Workspace) {
    setActiveWs(ws)
    setWsMenuOpen(false)
    setLoading(true)
    await loadTasks(ws.id)
    await loadMembers(ws.id)
    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter)

  const grouped = STATUS_ORDER.map(s => ({
    status: s,
    tasks: filteredTasks.filter(t => t.status === s),
  })).filter(g => g.tasks.length > 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="font-display font-extrabold text-2xl tracking-tight animate-pulse">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* TOP NAV */}
      <nav className="border-b-2 border-ink px-5 py-3 flex items-center justify-between sticky top-0 bg-paper z-40">
        <div className="flex items-center gap-4">
          <span className="font-display font-extrabold text-lg tracking-tight">
            <span className="bg-accent px-1">GR</span>IND
          </span>

          {/* Workspace switcher */}
          <div className="relative">
            <button
              onClick={() => setWsMenuOpen(!wsMenuOpen)}
              className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-2"
            >
              {activeWs?.name}
              <span className="text-[10px]">▾</span>
            </button>
            {wsMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-paper border-2 border-ink shadow-brutal min-w-[180px] z-50">
                {workspaces.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => switchWorkspace(ws)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-accent border-b border-[#e0e0e0] last:border-0 ${ws.id === activeWs?.id ? 'bg-accent' : ''}`}
                  >
                    {ws.name}
                  </button>
                ))}
                <button
                  onClick={() => router.push('/app/onboarding')}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#888] hover:bg-[#f0f0f0]"
                >
                  + New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Member avatars */}
          <div className="flex -space-x-1.5">
            {members.slice(0, 4).map((m, i) => (
              <div key={i} title={m.profiles?.full_name ?? ''}
                className="w-7 h-7 border-2 border-ink bg-accent flex items-center justify-center text-xs font-black">
                {(m.profiles?.full_name ?? '?')[0].toUpperCase()}
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-7 h-7 border-2 border-ink bg-[#eee] flex items-center justify-center text-xs font-bold">
                +{members.length - 4}
              </div>
            )}
          </div>

          <span className="text-xs text-[#888] hidden md:block">{userEmail}</span>
          <button onClick={logout} className="btn btn-secondary py-1.5 px-3 text-xs">Logout</button>
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">

        {/* TASK INPUT */}
        <div className="flex gap-0 mb-8">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask() }}
            placeholder="Add a task... (Enter to add, type 'fix' or 'urgent' for auto-routing)"
            className="input-brutal flex-1 text-sm"
            autoFocus
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="btn btn-primary border-l-0 px-5 disabled:opacity-40"
          >
            Add
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['all', ...STATUS_ORDER].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`btn py-1 px-3 text-xs flex-shrink-0 ${filter === s ? 'btn-dark' : 'btn-secondary'}`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
              <span className="ml-1.5 text-[10px] opacity-60">
                {s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* TASK GROUPS */}
        {filteredTasks.length === 0 ? (
          <div className="border-2 border-ink border-dashed p-12 text-center">
            <p className="font-display font-extrabold text-2xl mb-2">Nothing here.</p>
            <p className="text-xs text-[#888] uppercase tracking-widest">Start typing above to add your first task.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {grouped.map(({ status, tasks: groupTasks }) => (
              <div key={status}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#888]">{STATUS_LABELS[status]}</span>
                  <span className="text-xs text-[#bbb]">{groupTasks.length}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {groupTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onStatus={updateStatus}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TaskRow({
  task,
  onStatus,
  onDelete,
}: {
  task: Task
  onStatus: (id: string, s: string) => void
  onDelete: (id: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isDone = task.status === 'done'

  return (
    <div className={`task-row group flex items-center gap-3 px-3 py-2.5 border-2 border-ink transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal ${isDone ? 'opacity-50' : ''}`}>
      {/* Done toggle */}
      <button
        onClick={() => onStatus(task.id, isDone ? 'todo' : 'done')}
        className={`w-5 h-5 border-2 border-ink flex-shrink-0 flex items-center justify-center text-xs font-black transition-colors ${isDone ? 'bg-accent' : 'hover:bg-accent'}`}
      >
        {isDone ? '✓' : ''}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm ${isDone ? 'line-through text-[#999]' : ''}`}>
        {task.title}
      </span>

      {/* Status badge */}
      <span className={`tag tag-${task.status} hidden sm:inline-block`}>{task.status}</span>

      {/* Status menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="opacity-0 group-hover:opacity-100 text-xs font-bold text-[#aaa] hover:text-ink px-1 transition-opacity"
        >
          ···
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 bg-paper border-2 border-ink shadow-brutal z-30 min-w-[120px]">
            {STATUS_ORDER.filter(s => s !== task.status).map(s => (
              <button
                key={s}
                onClick={() => { onStatus(task.id, s); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-accent border-b border-[#eee] last:border-0"
              >
                → {s}
              </button>
            ))}
            <button
              onClick={() => { onDelete(task.id); setMenuOpen(false) }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-[#FF4C29] hover:bg-[#FF4C29] hover:text-white uppercase tracking-wide"
            >
              ✕ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
