

export type ProjectsStore = {
  loading: boolean
  projects: Project[]
}

export type Project = {
  id: string
  name: string
  slug: string
  description: string
  teams: string[]
  uri: string
  lastModifiedTime: string
}
