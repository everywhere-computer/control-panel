
export type WorkflowsStore = {
  loading: boolean
  workflows: Workflow[]
}

export type Workflow = {
  id: string
  name: string
  requests: number
  errors: number
  lastModifiedTime: string
  medianCPUTime: string
  customDomains: number
  routes: number
  cronTriggers: number
  emailTriggers: number
  connectedWorkflows: number
}
