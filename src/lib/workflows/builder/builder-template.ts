import { get as getStore } from 'svelte/store'

import { camelCase } from '$lib/utils'
import type { Builder, WorkflowsStore } from '$lib/workflows'
import generateFunction, {
  DEFAULT_PARAMS
} from '$lib/workflows/builder/function-template'
import defaultWorkflows from '$routes/workflows/lib/workflow-mocks'

const generateBuilderTemplate = (store = null, functionName = 'blur'): Builder => {
  const numberOfWorkflows = store
    ? (getStore(store) as WorkflowsStore)?.workflows?.length
    : defaultWorkflows.length

  const workflowName = `New Workflow #${numberOfWorkflows + 1}`

  const defaultBuilderTemplate = {
    name: workflowName,
    nodes: [
      {
        functionName,
        params: Object.values(DEFAULT_PARAMS[functionName]),
        id: '1',
        connections: [],
        position: {
          x: 189,
          y: 26
        }
      }
    ],
    payload: {
      name: camelCase(workflowName),
      workflow: {
        tasks: [
          generateFunction({
            functionName,
            label: `${functionName}64`,
            base64: true
          })
        ]
      }
    },
    savedImage: null
  }

  return defaultBuilderTemplate
}

export default generateBuilderTemplate
