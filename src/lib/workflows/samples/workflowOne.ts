import * as Workflow from '@fission-codes/homestar/workflow'

export default {
  name: 'sampleWorkflowOne',
  workflow: {
    tasks: [
      Workflow.cropBase64({
        name: 'crop64',
        resource:
          import.meta.env.VITE_WORKFLOW_RESOURCE,
        args: {
          // @ts-ignore-next-line
          data: '',
          height: 100,
          width: 100,
          x: 100,
          y: 100
        }
      }),
      Workflow.blur({
        name: 'blur',
        needs: 'crop64',
        resource:
          import.meta.env.VITE_WORKFLOW_RESOURCE,
        args: {
          data: '{{needs.crop64.output}}',
          sigma: 0.1
        }
      })
    ]
  }
}
