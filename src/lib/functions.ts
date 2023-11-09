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

  workflowId: string
  operation: FunctionOperation
  selected: boolean
  status: FunctionStatus
  message: string
  receipt?: Receipt
}

export type Receipt = {
  iss: string | null
  meta: Meta | null
  out: ['ok' | 'error', string]
  prf: string[]
  ran: string
  replayed?: boolean
}

export type Meta = {
  op: string
  workflow: string
}

export type FunctionStatus = 'ready' | 'replayed' | 'executed' | 'failure'

export type FunctionOperation = 'crop' | 'rotate90' | 'blur' | 'grayscale'
