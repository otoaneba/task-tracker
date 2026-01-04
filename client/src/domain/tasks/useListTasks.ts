import { useEffect, useState } from 'react'
import { TaskVM } from './types'

type DomainError =
  | { kind: 'network' }
  | { kind: 'unauthorized' }
  | { kind: 'unknown'; message?: string }

type TaskListData = {
  tasks: TaskVM[]
  page: number
  limit: number
  hasMore: boolean
}

type TaskListState =
  | {
      status: 'loading'
      data: TaskListData | null
      selectedSortId: string
      selectedFilterIds: string[]
    }
  | {
      status: 'success'
      data: TaskListData
      selectedSortId: string
      selectedFilterIds: string[]
    }
  | {
      status: 'error'
      data: TaskListData | null
      error: DomainError
      selectedSortId: string
      selectedFilterIds: string[]
    }

export function useListTasks() {
  const [state, setState] = useState<TaskListState>({
    status: 'loading',
    data: null,
    selectedSortId: 'createdDesc',
    selectedFilterIds: [],
  })

  function mockFetchTasks(page: number, limit: number) {
    return new Promise<{
      data: TaskVM[]
      page: number
      limit: number
      hasMore: boolean
    }>((resolve) => {
      setTimeout(() => {
        const tasks: TaskVM[] = [
          {
            id: '1',
            title: 'Learn frontend architecture',
            description: 'Study modern frontend patterns and architecture',
            isDone: false,
            dueDateLabel: 'Today',
            imageUrl: null,
          },
          {
            id: '2',
            title: 'Understand domain hooks',
            description: 'Learn how to structure domain-specific hooks',
            isDone: false,
            dueDateLabel: null,
            imageUrl: null,
          },
        ]
  
        resolve({
          data: tasks,
          page,
          limit,
          hasMore: tasks.length === limit,
        })
      }, 1000)
    })
  }

  async function loadTasks(page: number) {
    setState(prev => ({
      status: 'loading',
      data: prev.data, // keep stale data if it exists
      selectedSortId: prev.selectedSortId,
      selectedFilterIds: prev.selectedFilterIds,
    }))
  
    try {
      const result = await mockFetchTasks(page, 10)
  
      setState(prev => ({
        status: 'success',
        data: {
          tasks: result.data,
          page: result.page,
          limit: result.limit,
          hasMore: result.hasMore,
        },
        selectedSortId: prev.selectedSortId,
        selectedFilterIds: prev.selectedFilterIds,
      }))
    } catch {
      setState(prev => ({
        status: 'error',
        data: prev.data,
        error: { kind: 'unknown' },
        selectedSortId: prev.selectedSortId,
        selectedFilterIds: prev.selectedFilterIds,
      }))
    }
  }
  

  useEffect(() => {
    loadTasks(1)
  }, [state.selectedSortId, state.selectedFilterIds])

  const actions = {
    changeSort(sortId: string) {
      setState(prev => ({
        ...prev,
        selectedSortId: sortId,
      }))
    },

    refresh() {
      setState(prev => {
        const page = prev.data?.page ?? 1
        loadTasks(page)
        return prev
      })
    },
  }

  const canGoNext = state.status === 'success' && state.data.hasMore
  const canGoPrevious = state.status === 'success' && state.data.page > 1

  return { state, actions, canGoNext, canGoPrevious }
}
