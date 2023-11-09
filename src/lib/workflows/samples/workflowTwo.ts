export default {
  name: 'sampleWorkflowTwo',
  workflow: {
    tasks: [
      {
        cause: null,
        meta: {
          memory: 4294967296,
          time: 100000
        },
        prf: [],
        run: {
          input: {
            args: [
              {
                '/':
                  'bafybeiejevluvtoevgk66plh5t6xiy3ikyuuxg3vgofuvpeckb6eadresm'
              },
              150,
              350,
              500,
              500
            ],
            func: 'crop'
          },
          nnc: '',
          op: 'wasm/run',
          rsc:
            'ipfs://bafybeichafzlolnoamugvfuyynjnj2gse7avstiqkeiuwuv2gyztap4qm4'
        }
      },
      {
        cause: null,
        meta: {
          memory: 4294967296,
          time: 100000
        },
        prf: [],
        run: {
          input: {
            args: [
              {
                'await/ok': {
                  '/':
                    'bafyrmigev36skyfjnslfswcez24rnrorzeaxkrpb3wci2arfkly5zcrepy'
                }
              }
            ],
            func: 'rotate90'
          },
          nnc: '',
          op: 'wasm/run',
          rsc:
            'ipfs://bafybeichafzlolnoamugvfuyynjnj2gse7avstiqkeiuwuv2gyztap4qm4'
        }
      },
      {
        cause: null,
        meta: {
          memory: 4294967296,
          time: 100000
        },
        prf: [],
        run: {
          input: {
            args: [
              {
                'await/ok': {
                  '/':
                    'bafyrmiegkif6ofatmowjjmw7yttm7mi5pjjituoxtp5qqsmc3fw65ypbm4'
                }
              }
            ],
            func: 'grayscale'
          },
          nnc: '',
          op: 'wasm/run',
          rsc:
            'ipfs://bafybeichafzlolnoamugvfuyynjnj2gse7avstiqkeiuwuv2gyztap4qm4'
        }
      }
    ]
  }
}
