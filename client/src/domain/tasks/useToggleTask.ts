// domain/tasks/useToggleTask.ts
import { useState } from 'react'
import { toggleTaskStatus } from '../../api/tasks'
import { DomainError } from '../../shared/state' // your existing type

type MutationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; error: DomainError }

export function useToggleTask(onSuccess?: () => void) {
  const [state, setState] = useState<MutationState>({ status: 'idle' })

  async function toggle(taskId: string, nextIsDone: boolean) {
    setState({ status: 'loading' })

    try {
      await toggleTaskStatus(taskId, nextIsDone)
      setState({ status: 'success' })
      onSuccess?.()
    } catch (err: any) {
      let error: DomainError =
        err.status === 401
          ? { kind: 'unauthorized' }
          : !navigator.onLine
          ? { kind: 'network' }
          : { kind: 'unknown' }

      setState({ status: 'error', error })
    }
  }

  function reset() {
    setState({ status: 'idle' })
  }

  return { state, toggle, reset }
}
