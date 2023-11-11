import workflowOne from '$lib/workflows/samples/workflowOne'
import workflowTwo from '$lib/workflows/samples/workflowTwo'
import workflowThree from '$lib/workflows/samples/workflowThree'

export default [
  {
    id: 'sampleWorkflowOne',
    name: 'Sample Workflow #1',
    requests: 124,
    errors: 1,
    lastRunTime: null,
    medianCPUTime: '0.3ms',
    customDomains: 0,
    routes: 1,
    cronTriggers: 0,
    emailTriggers: 0,
    connectedWorkflows: 0,
    payload: workflowOne,
    runs: [],
    status: 'ready',
    savedImage: null
  },
  {
    id: 'sampleWorkflowTwo',
    name: 'Sample Workflow #2',
    requests: 482,
    errors: 0,
    lastRunTime: null,
    medianCPUTime: '0.6ms',
    customDomains: 0,
    routes: 1,
    cronTriggers: 0,
    emailTriggers: 0,
    connectedWorkflows: 0,
    payload: workflowTwo,
    runs: [],
    status: 'ready',
    savedImage: null
  },
  {
    id: 'sampleWorkflowThree',
    name: 'Sample Workflow #3',
    requests: 17,
    errors: 0,
    lastRunTime: null,
    medianCPUTime: '0.1ms',
    customDomains: 0,
    routes: 1,
    cronTriggers: 0,
    emailTriggers: 0,
    connectedWorkflows: 0,
    payload: workflowThree,
    runs: [],
    status: 'ready',
    savedImage: null
  }
]
