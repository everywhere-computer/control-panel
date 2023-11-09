import * as Workflow from '@fission-codes/homestar/workflow'

export default {
  name: 'sampleWorkflowOne',
  workflow: {
    tasks: [
      Workflow.cropBase64({
        name: 'crop64',
        resource:
          'ipfs://bafybeiczefaiu7464ehupezpzulnti5jvcwnvdalqrdliugnnwcdz6ljia',
        args: {
          // @ts-ignore-next-line
          data: '',
          height: 100,
          width: 100,
          x: 100,
          y: 100
        }
      }),
      Workflow.blurBase64({
        name: 'blur64',
        needs: 'crop64',
        resource:
          'ipfs://bafybeiczefaiu7464ehupezpzulnti5jvcwnvdalqrdliugnnwcdz6ljia',
        args: {
          data: '{{needs.crop64.output}}',
          sigma: 0.1
        }
      })
    ]
  }
}
