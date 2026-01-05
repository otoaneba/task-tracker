import { useEffect, useState } from 'react'
import { TaskVM } from './types'
import { fetchTasks } from '../../api/tasks'
import { mapTaskDtoToVM } from './mappers'

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


  async function loadTasks(page: number) {
    setState(prev => ({
      status: 'loading',
      data: prev.data, // keep stale data if it exists
      selectedSortId: prev.selectedSortId,
      selectedFilterIds: prev.selectedFilterIds,
    }))
  
    try {
      const result = await fetchTasks({
        page,
        limit: 10,
        sortId: state.selectedSortId,
        filterIds: state.selectedFilterIds,
      })
  
      const tasks = result.data.map(mapTaskDtoToVM)
  
      setState(prev => ({
        status: 'success',
        data: {
          tasks,
          page: result.page,
          limit: result.limit,
          hasMore: result.hasMore,
        },
        selectedSortId: prev.selectedSortId,
        selectedFilterIds: prev.selectedFilterIds,
      }))
    } catch (err: any) {
      let domainError: DomainError
    
      if (err.status === 401) {
        domainError = { kind: 'unauthorized' }
      } else if (!navigator.onLine) {
        domainError = { kind: 'network' }
      } else {
        domainError = { kind: 'unknown' }
      }
    
      setState(prev => ({
        status: 'error',
        data: prev.data,
        error: domainError,
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

    goNext() {
      if (!canGoNext) return
      loadTasks(state.data!.page + 1)
    },
    
    goPrevious() {
      if (!canGoPrevious) return
      loadTasks(state.data!.page - 1)
    },
     applyTaskToggle(taskId: string, nextState: boolean) {
      setState(prev => {
        if (prev.status !== 'success') return prev
    
        return {
          ...prev,
          data: {
            ...prev.data,
            tasks: prev.data.tasks.map(task =>
              task.id === taskId
                ? { ...task, isDone: nextState }
                : task
            ),
          },
        }
      })
    }
    
  }

  const canGoNext = state.status === 'success' && state.data.hasMore
  const canGoPrevious = state.status === 'success' && state.data.page > 1

  return { state, actions, canGoNext, canGoPrevious }
}
