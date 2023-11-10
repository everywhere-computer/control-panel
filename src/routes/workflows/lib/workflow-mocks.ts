import workflowOne from '$lib/workflows/samples/workflowOne'
import workflowTwo from '$lib/workflows/samples/workflowTwo'
import workflowThree from '$lib/workflows/samples/workflowThree'

export default [
  {
    id: 'sampleWorkflowOne',
    name: 'hello-world-driving-crooner-f6bf',
    requests: 124,
    errors: 1,
    lastModifiedTime: '2 hours',
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
    name: 'image-compression-adventure-365-a4vd',
    requests: 482,
    errors: 0,
    lastModifiedTime: '1 hour',
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
    name: 'weather-tracking-sloppy-steaks-h8sd',
    requests: 17,
    errors: 0,
    lastModifiedTime: '50 minutes',
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
