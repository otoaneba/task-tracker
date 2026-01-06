// domain/tasks/mappers.ts
import { TaskDTO } from './dto'
import { TaskVM } from './types'

export function mapTaskDtoToVM(dto: TaskDTO): TaskVM {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    isDone: dto.status === 'done',
    dueDateLabel: dto.dueDate
      ? new Date(dto.dueDate).toLocaleDateString()
      : null,
    imageUrl: dto.imageUrl ?? null,

  }
}
