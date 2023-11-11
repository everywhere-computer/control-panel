import * as Workflow from '@fission-codes/homestar/workflow'

export default {
  name: 'sampleWorkflowTwo',
  workflow: {
    tasks: [
      Workflow.rotate90Base64({
        name: 'rotate9064',
        resource: import.meta.env.VITE_WORKFLOW_RESOURCE,
        args: {
          // @ts-ignore-next-line
          data: '',
        }
      }),
      Workflow.grayscale({
        name: 'grayscale',
        needs: 'rotate9064',
        resource: import.meta.env.VITE_WORKFLOW_RESOURCE,
        args: {
          data: '{{needs.rotate9064.output}}',
        }
      })
    ]
  }
}
