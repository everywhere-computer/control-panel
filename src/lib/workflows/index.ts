import { workflow as workflowBuilder } from '@fission-codes/homestar/workflow'
import { base64 } from 'iso-base/rfc4648'
import { get as getStore } from 'svelte/store'

import type { Receipt, FunctionOperation, Meta } from '$lib/functions'
import { addNotification } from '$lib/notifications'
import { homestar } from '$lib/rpc'
import {
  workflowsStore,
} from '$lib/stores'

export type WorkflowsStore = {
  loading: boolean
  builder: Builder
  workflows: Workflow[]
}

export type Workflow = {
  id: string
  name: string
  status: string
  payload: Payload
  runs: Run[]
  savedImage: string
  requests?: number
  errors?: number
  lastRunTime?: number
  medianCPUTime?: string
  customDomains?: number
  routes?: number
  cronTriggers?: number
  emailTriggers?: number
  connectedWorkflows?: number
}

export type Run = {
  name: string
  label: string
  status: string
  payload: Payload
  receipts: Receipt[]
}

// export type SimplePayload = {
//   name: string
//   workflow: {
//     tasks: SimpleTask[]
//   }
// }
// type SimpleTask = {
//   name: string
//   data: string
//   args: number[]
// }

export type Payload = {
  name: string
  workflow: {
    tasks: Task[]
  }
}


type Task = {
  cause: null
  meta: {
    memory: number
    time: number
  }
  prf: []
  run: {
    input: {
      args: any
    }
    nnc: string
    op: string
    rsc: string
  }
}

export type Message = {
  metadata: {
    name: string
    replayed: boolean
    workflow: Record<'/', string>
  }
  receipt: RawReceipt
  receipt_cid: Record<'/', string>
}

type RawReceipt = {
  iss: string | null
  meta: Meta | null
  out: ['ok' | 'error', Record<'/', Record<'bytes', string>>]
  prf: string[]
  ran: Record<'/', string>
}

export type WorkflowState = {
  id: string
  tasks: FunctionOperation[]
  step: number
  failedPingCount: number
}

type Node = {
  functionName: string
  params: number[]
  id: string
  connections: string[]
  position: {
    x: number
    y: number
  }
  // This is a flag set when deleting a node. We can't remove the node from the array entirely because
  // svelvet will re-render the following node in the same position as this one
  deleted?: boolean
}

export type Builder = {
  name: string
  payload: Payload
  nodes: Node[]
  savedImage: string
}

const prepareWorkflow = async (payload: any, dataUrl: string) => {
  payload.workflow.tasks[0].run.input.args[0] = dataUrl

  const builtWorkflow = await workflowBuilder(payload)

  return builtWorkflow
}

/**
 * Run a workflow
 */
export const runWorkflow = async (workflowId: string, uploadedImage: string, runPayload = null, runStatus = null): Promise<void> => {
  try {
    const workflows = getStore(workflowsStore)
    const matchingWorkflow = workflows.workflows.find(
      ({ id }) => id === workflowId
    )
    const rawPayloadToRun = runPayload ?? matchingWorkflow?.payload
    const payloadToRun = await prepareWorkflow(rawPayloadToRun, uploadedImage)
    const runIndex = matchingWorkflow?.runs[0]?.status
      ? matchingWorkflow.runs.length
      : matchingWorkflow.runs.length + 1


    // Increment number in payload name to track the associated `run`
    const runName = payloadToRun?.name?.split('_')[1]
      ? matchingWorkflow?.runs[0].name
      : `${payloadToRun?.name}_${runIndex}`

    // Set workflow status to running
    workflowsStore.update(state => {
      const updatedWorkflows = state.workflows.map(workflow => {
        if (workflowId === workflow.id) {
          return {
            ...workflow,
            status: 'running',
            runs:
              runStatus === 'ready'
                // If a run is ready, modify it in place
                ? workflow.runs.map((r, i) => {
                    if (i === 0) {
                      return {
                        ...r,
                        status: 'running',
                        payload: {
                          ...r.payload,
                          ...rawPayloadToRun,
                          name: runName
                        }
                      }
                    }
                    return r
                  })
                // If a run has already been executed, add it to the top of the list
                : [
                    {
                      name: runName,
                      label: `run ${runIndex}`,
                      status: 'running',
                      payload: {
                        ...rawPayloadToRun,
                        name: runName
                      },
                      receipts: []
                    },
                    ...workflow.runs
                  ]
          }
        }

        return workflow
      })

      return {
        ...state,
        workflows: updatedWorkflows
      }
    })

    await homestar.runWorkflow(
      { ...payloadToRun, name: runName },
      async (data) => {
        if (data.error) {
          // @ts-ignore-next-line
          throw new Error(data.error)
        }

        // @ts-ignore-next-line
        await handleMessage(data.result)
      }
    )
  } catch (error) {
    console.error(error)
    // Set workflow status to working
    workflowsStore.update(state => {
      const updatedWorkflows = state.workflows.map(workflow => {
        if (workflowId === workflow.id) {
          return {
            ...workflow,
            status: 'failed',
            runs: workflow?.runs?.map((run, i) => {
              // Set the most recent run to status to failed
              if (i === 0) {
                return {
                  ...run,
                  status: 'failed',
                }
              }
              return run
            })
          }
        }

        return workflow
      })

      return {
        ...state,
        workflows: updatedWorkflows
      }
    })
  }
}

/**
 * Update workflow runs based on WS message
 */
export const handleMessage = async (message: Message): Promise<void> => {
  try {
    console.log('Received message from server: ', message)

    if (message.receipt !== undefined && message.receipt.meta !== undefined) {
      const receipt = parseReceipt(message.receipt)

      // // Log receipt
      // console.table(receipt)

      // Update runs in `workflows` store
      workflowsStore.update(state => {
        const updatedWorkflows = state.workflows?.map(workflow => {
          const steps = workflow?.payload?.workflow?.tasks?.length || 0
          const matchingRun = workflow.runs.find(
            run => run.name === message.metadata.name
          )
          let status = 'running'

          if (matchingRun) {
            const updatedRuns = workflow.runs.map(run => {
              if (run.name === matchingRun.name) {
                const updatedReceipts = [
                  ...(matchingRun?.receipts ?? []),
                  {
                    ...receipt,
                    replayed: message.metadata.replayed,
                    status: message.metadata.replayed ? 'from cache' : 'success'
                  }
                ]

                status = 'running'
                // If all steps have completed, determine the status of the workflow run
                if (updatedReceipts?.length === steps) {
                  status = updatedReceipts.find(r => !r.replayed)
                    ? 'completed'
                    : 'from cache'
                }

                return {
                  ...matchingRun,
                  status,
                  payload: {
                    ...matchingRun.payload
                  },
                  receipts: updatedReceipts,
                  ...(['completed', 'from cache'].includes(status) ? { lastRunTime: Date.now() } : {}),
                }
              }

              return run
            })

            return {
              ...workflow,
              status,
              runs: updatedRuns,
              ...(['completed', 'failed', 'from cache'].includes(status) ? { lastRunTime: Date.now() } : {}),
            }
          } else {
            return workflow
          }
        })

        return {
          ...state,
          workflows: updatedWorkflows
        }
      })
    } else {
      console.warn('Received an unexpected message', message)
    }
  } catch (error) {
    console.error(error)
    addNotification('Run failed', 'error')
  }
}

const parseReceipt = (raw: RawReceipt, cidImage = false): Receipt => {
  const outputImage = cidImage
    ? raw.out[1]['/'].bytes
    // @ts-ignore-next-line
    : `data:image/png;base64,${base64.encode(raw.out[1])}`

  return {
    iss: raw.iss,
    meta: raw.meta,
    out: [raw.out[0], outputImage],
    prf: raw.prf,
    ran: raw.ran['/']
  }
}
