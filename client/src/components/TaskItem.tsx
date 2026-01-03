import React from 'react'

type TaskItemProps = {
  taskId: string
  title: string
  isDone: boolean
  dueDateLabel?: string | null

  onToggleComplete: (taskId: string, nextState: boolean) => void
  onSelect: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export function TaskItem(props: TaskItemProps) {
  const {
    taskId,
    title,
    isDone,
    dueDateLabel,
    onToggleComplete,
    onSelect,
    onDelete,
  } = props

  function handleToggleComplete() {
    onToggleComplete(taskId, !isDone)
  }

  function handleSelect() {
    onSelect(taskId)
  }

  function handleDelete() {
    onDelete(taskId)
  }

  return (
    <div
      role="listitem"
      onClick={handleSelect}
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
        checked={isDone}
        onChange={handleToggleComplete}
        onClick={e => e.stopPropagation()}
      />

      <div style={{ flex: 1 }}>
        <div
          style={{
            textDecoration: isDone ? 'line-through' : 'none',
            fontWeight: 500,
          }}
        >
          {title}
        </div>

        {dueDateLabel && (
          <div style={{ fontSize: '0.85em', color: '#666' }}>
            {dueDateLabel}
          </div>
        )}
      </div>

      <button
        onClick={e => {
          e.stopPropagation()
          handleDelete()
        }}
      >
        Delete
      </button>
    </div>
  )
}
