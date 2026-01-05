import React from 'react'
import { TaskItem } from './TaskItem'
import { TaskVM } from '@/domain/tasks/types'

type Option = {
  id: string
  label: string
}

type TaskListProps = {
  tasks: TaskVM[]

  sortOptions: Option[]
  selectedSortId: string
  isSortDisabled: boolean

  filterOptions: Option[]
  selectedFilterIds: string[]
  isFilterDisabled: boolean

  onSortChange: (sortId: string) => void
  onFilterChange: (filterIds: string[]) => void

  onTaskSelect: (taskId: string) => void
  onTaskToggleComplete: (taskId: string, nextState: boolean) => void
  onTaskDelete: (taskId: string) => void
}

export function TaskList(props: TaskListProps) {
  const {
    tasks,
    sortOptions,
    selectedSortId,
    isSortDisabled,
    filterOptions,
    selectedFilterIds,
    isFilterDisabled,
    onSortChange,
    onFilterChange,
    onTaskSelect,
    onTaskToggleComplete,
    onTaskDelete,
  } = props

  function handleFilterToggle(filterId: string) {
    const isSelected = selectedFilterIds.includes(filterId)

    const nextFilters = isSelected
      ? selectedFilterIds.filter(id => id !== filterId)
      : [...selectedFilterIds, filterId]

    onFilterChange(nextFilters)
  }

  

  return (
    <section>
      {/* Sort controls */}
      <div style={{ marginBottom: '12px' }}>
        <label>
          Sort:{' '}
          <select
            value={selectedSortId}
            onChange={e => onSortChange(e.target.value)}
            disabled={isSortDisabled}
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Filter controls */}
      <div style={{ marginBottom: '12px' }}>
        {filterOptions.map(option => (
          <label key={option.id} style={{ marginRight: '8px' }}>
            <input
              type="checkbox"
              checked={selectedFilterIds.includes(option.id)}
              disabled={isFilterDisabled}
              onChange={() => handleFilterToggle(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>

      {/* Task list */}
      <div role="list">
        {tasks.length === 0 && (
          <div style={{ color: '#666' }}>No tasks available.</div>
        )}

        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onTaskToggleComplete}
            onSelect={onTaskSelect}
            onDelete={onTaskDelete}
          />
        ))}
      </div>
    </section>
  )
}
