// src/api/tasks.ts
import { TaskDTO } from '../domain/tasks/dto'
import { getAuthHeaders } from '../shared/auth'

type FetchTasksParams = {
  page: number
  limit: number
  sortId: string
  filterIds: string[]
}

type FetchTasksResponse = {
  data: TaskDTO[]
  page: number
  limit: number
  hasMore: boolean
}

export async function fetchTasks(params: FetchTasksParams): Promise<FetchTasksResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    sort: params.sortId,
    filters: params.filterIds.join(','),
  })

  const res = await fetch(`/api/tasks?${query.toString()}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    // IMPORTANT: do NOT map errors here
    // Just throw — domain will interpret meaning
    const error = new Error('Request failed');
    (error as any).status = res.status
    throw error
  }

  return res.json()
}

export async function toggleTaskStatus(taskId: string, isDone: boolean) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status: isDone ? 'done' : 'todo' }),
  })

  if (!res.ok) {
    const err = new Error('Request failed')
    ;(err as any).status = res.status
    throw err
  }
}

