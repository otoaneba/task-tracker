import { useEffect, useState } from 'react'

type TaskVM = {
  id: string
  title: string
}

type DomainError = {
  message: string
}

type TaskListState =
  | {
      status: 'loading'
      tasks: TaskVM[] | null
      selectedSortId: string
      selectedFilterIds: string[]
      canGoNext: boolean
      canGoPrevious: boolean
    }
  | {
      status: 'success'
      tasks: TaskVM[]
      selectedSortId: string
      selectedFilterIds: string[]
      canGoNext: boolean
      canGoPrevious: boolean
    }
  | {
      status: 'error'
      tasks: TaskVM[] | null
      error: DomainError
      selectedSortId: string
      selectedFilterIds: string[]
      canGoNext: boolean
      canGoPrevious: boolean
    }

export function useListTasks() {
  const [state, setState] = useState<TaskListState>({
    status: 'loading',
    tasks: null,
    selectedSortId: 'createdDesc',
    selectedFilterIds: [],
    canGoNext: false,
    canGoPrevious: false,
  })

  function fetchTasks() {
    setTimeout(() => {
      setState(prev => ({
        status: 'success',
        tasks: [
          { id: '1', title: 'Learn frontend architecture' },
          { id: '2', title: 'Understand domain hooks' },
        ],
        selectedSortId: prev.selectedSortId,
        selectedFilterIds: prev.selectedFilterIds,
        canGoNext: true,
        canGoPrevious: false,
      }))
    }, 1000)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const actions = {
    changeSort(sortId: string) {
      setState(prev => ({
        status: 'loading',
        tasks: prev.tasks,
        selectedSortId: sortId,
        selectedFilterIds: prev.selectedFilterIds,
        canGoNext: prev.canGoNext,
        canGoPrevious: prev.canGoPrevious,
      }))

      fetchTasks()
    },

    refresh() {
      setState(prev => ({
        status: 'loading',
        tasks: prev.tasks,
        selectedSortId: prev.selectedSortId,
        selectedFilterIds: prev.selectedFilterIds,
        canGoNext: prev.canGoNext,
        canGoPrevious: prev.canGoPrevious,
      }))

      fetchTasks()
    },
  }

  return { state, actions }
}
