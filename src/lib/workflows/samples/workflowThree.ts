import * as Workflow from '@fission-codes/homestar/workflow'

export default {
  name: 'sampleWorkflowThree',
  workflow: {
    tasks: [
      Workflow.blurBase64({
        name: 'blur64',
        resource: import.meta.env.VITE_WORKFLOW_RESOURCE,
        args: {
          // @ts-ignore-next-line
          data: '',
          sigma: 20
        }
      }),
      Workflow.rotate90({
        name: 'rotate90',
        needs: 'blur64',
        resource: import.meta.env.VITE_WORKFLOW_RESOURCE,
        args: {
          data: '{{needs.blur64.output}}',
        }
      })
    ]
  }
}
