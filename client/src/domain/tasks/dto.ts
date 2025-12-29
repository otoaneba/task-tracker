export type TaskDTO = {
  id: string
  title: string
  description: string
  status: 'todo' | 'done'
  dueDate: string | null
  imageUrl: string | null
}
