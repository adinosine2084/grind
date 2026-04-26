export type TaskStatus = 'todo' | 'urgent' | 'later' | 'done'

export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  created_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  profiles?: Profile
}

export interface Task {
  id: string
  workspace_id: string
  created_by: string
  assigned_to: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority_score: number
  due_date: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export interface TaskActivity {
  id: string
  task_id: string
  user_id: string
  action: string
  old_value: string | null
  new_value: string | null
  created_at: string
}
