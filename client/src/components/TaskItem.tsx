import React from 'react';
import { TaskVM } from '../domain/tasks/types'

type TaskItemProps = {
  task: TaskVM
  onToggleDone: (taskId: string) => void
  onEdit: (taskId: string) => void
}

export function TaskItem({
  task,
  onToggleDone,
  onEdit,
}: TaskItemProps) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={() => onToggleDone(task.id)}
        />
        <span>{task.title}</span>
      </label>

      <div>
        <small>{task.dueDateLabel}</small>
      </div>

      <button type="button" onClick={() => onEdit(task.id)}>
        Edit
      </button>
    </li>
  )
}
