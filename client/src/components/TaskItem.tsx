import React from 'react'
import { useToggleTask } from '@/domain/tasks/useToggleTask'
import { TaskVM } from '../domain/tasks/types'

type TaskItemProps = {
  task: TaskVM

  onToggleComplete: (taskId: string, nextState: boolean) => void
  onSelect: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export function TaskItem({task, onToggleComplete, onSelect, onDelete }: TaskItemProps) {
  const { state, toggle, reset } = useToggleTask(() => {
    onToggleComplete(task.id, !task.isDone)
    reset()
  })

  function handleToggleComplete() {
    toggle(task.id, !task.isDone)
  }

  return (
    <div
      role="listitem"
      onClick={() => onSelect(task.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
      }}
    >

    <input
      type="checkbox"
      checked={task.isDone}
      disabled={state.status === 'loading'}
      onChange={handleToggleComplete}
      onClick={e => e.stopPropagation()}
    />
    
    {state.status === 'error' && (
      <div style={{ color: 'red', fontSize: '0.8em' }}>
        Failed to update. Try again.
      </div>
    )}


      <div style={{ flex: 1 }}>
        <div
          style={{
            textDecoration: task.isDone ? 'line-through' : 'none',
            fontWeight: 500,
          }}
        >
          {task.title}
        </div>

        {task.dueDateLabel && (
          <div style={{ fontSize: '0.85em', color: '#666' }}>
            {task.dueDateLabel}
          </div>
        )}

        {state.status === 'error' && (
          <div style={{ color: 'red', fontSize: '0.8em' }}>
            Failed to update. Try again.
          </div>
        )}
      </div>

      <button
        onClick={e => {
          e.stopPropagation()
          onDelete(task.id)
        }}
      >
        Delete
      </button>
    </div>
  )
}
