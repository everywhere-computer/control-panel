

export type FunctionsStore = {
  loading: boolean
  functions: Func[]
}

export type Func = {
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
