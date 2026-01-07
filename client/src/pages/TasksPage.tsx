import { useListTasks } from '../domain/tasks/useListTasks'
import { TaskList } from '../components/TaskList'
import { LoginPrompt } from '@/components/LoginPrompt'
import { RetryView } from '@/components/RetryView'
import { ErrorView } from '@/components/ErrorView'
//import { Spinner } from '../components/Spinner'
//import { ErrorView } from '../components/ErrorView'

const SORT_OPTIONS = [
  { id: 'createdDesc', label: 'Created date (newest first)' },
  { id: 'createdAsc', label: 'Created date (oldest first)' },
]

const FILTER_OPTIONS = [
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' },
]

export function TasksPage() {
  const { state, actions } = useListTasks()

  /**
   * 1. Initial loading: nothing exists yet
   */
  if (state.status === 'loading' && state.data === null) {
    return <div>spinner</div>
  }

  /**
   * 2. Initial error: nothing exists yet
   */
  if (state.status === 'error' && state.data === null) {
    switch (state.error.kind) {
      case 'unauthorized':
        return <LoginPrompt />
      case 'network':
        return <RetryView onRetry={actions.refresh} />
      default:
        return <ErrorView />
    }
  }
  

  /**
   * 3. Normal rendering (success, refresh-loading, refresh-error)
   */
  return (
    <>
      {/* Overlay states */}
      {state.status === 'loading' && <div>spinner</div>}
      {state.status === 'error' && state.data !== null && (
        <RetryView onRetry={actions.refresh} />
      )}

      {/* Main content */}
      {state.data && (
        <TaskList
          tasks={state.data.tasks}

          sortOptions={SORT_OPTIONS}
          selectedSortId={state.selectedSortId}
          isSortDisabled={state.status === 'loading'}

          filterOptions={FILTER_OPTIONS}
          selectedFilterIds={state.selectedFilterIds}
          isFilterDisabled={state.status === 'loading'}

          onSortChange={actions.changeSort}
          onFilterChange={() => {
            /* filtering not implemented yet */
          }}

          onTaskSelect={(taskId) => {
            console.log('Selected task', taskId)
          }}

          onTaskToggleComplete={(taskId, nextState) => {
            actions.applyTaskToggle(taskId, nextState)
          }}

          onTaskDelete={(taskId) => {
            console.log('Delete task', taskId)
          }}
        />
      )}
    </>
  )
}
