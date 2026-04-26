import type { TaskStatus } from './types'

const URGENT_PATTERNS = [
  /\burgent\b/i, /\basap\b/i, /\bcritical\b/i, /\bfix\b/i,
  /\bcrash\b/i, /\bdown\b/i, /\bbroken\b/i, /\bbug\b/i,
  /\bblocking\b/i, /\bhotfix\b/i, /\bproduction\b/i, /\bprod\b/i,
  /\btoday\b/i, /\bnow\b/i, /\bimmediately\b/i, /\bemergency\b/i,
  /!!/, /🔥/, /🚨/, /⚡/
]

const LATER_PATTERNS = [
  /\blater\b/i, /\bsomeday\b/i, /\beventually\b/i, /\bmaybe\b/i,
  /\bidea\b/i, /\bwould be nice\b/i, /\bwhen possible\b/i,
  /\bbacklog\b/i, /\bv2\b/i, /\bfuture\b/i, /\blow priority\b/i
]

export function routeTask(title: string): TaskStatus {
  const t = title.trim()
  if (URGENT_PATTERNS.some(p => p.test(t))) return 'urgent'
  if (LATER_PATTERNS.some(p => p.test(t))) return 'later'
  return 'todo'
}

export function getPriorityScore(status: TaskStatus): number {
  const scores: Record<TaskStatus, number> = {
    urgent: 100,
    todo: 50,
    later: 10,
    done: 0,
  }
  return scores[status]
}
