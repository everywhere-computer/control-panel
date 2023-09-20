

export type TasksStore = {
  loading: boolean
  tasks: Task[]
}

export type Task = {
  id: string
  name: string
  slug: string
  description: string
  version: string
  license: string
  repository: string
  numberOfProjectsUsing: number
  lastModifiedTime: string
}
