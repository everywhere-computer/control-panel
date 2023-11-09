import * as HSWorkflow from '@fission-codes/homestar/workflow'
import { get as getStore } from 'svelte/store'

import { camelCase } from '$lib/utils'
import type { WorkflowsStore } from '$lib/workflows'
import defaultWorkflows from '$routes/workflows/lib/workflow-mocks'

const generateBuilderTemplate = (store = null) => {
  const numberOfWorkflows = store
    ? (getStore(store) as WorkflowsStore)?.workflows?.length
    : defaultWorkflows.length

  const workflowName = `New Workflow #${numberOfWorkflows + 1}`

  const defaultBuilderTemplate = {
    name: workflowName,
    nodes: [
      {
        functionName: 'crop',
        params: [],
        id: '1',
        connections: [],
        position: {
          x: 189,
          y: 26
        }
      }
    ],
    functions: [
      {
        name: 'crop',
        params: [],
        image: null
      }
    ],
    payload: {
      name: camelCase(workflowName),
      workflow: {
        tasks: [
          HSWorkflow.cropBase64({
            name: 'crop64',
            resource:
              'ipfs://bafybeiczefaiu7464ehupezpzulnti5jvcwnvdalqrdliugnnwcdz6ljia',
            args: {
              // @ts-ignore-next-line
              data: null,
              height: 100,
              width: 100,
              x: 100,
              y: 100
            }
          })
        ]
      }
    },
    connections: []
  }

  return defaultBuilderTemplate
}

export default generateBuilderTemplate
