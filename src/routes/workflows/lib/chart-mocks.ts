export type Metric = {
  name: string
  datasets: DataSet[]
}

type DataSet = {
  label: string
  backgroundColor: string
  data: number[]
}

const generateDataSetData = (max = 70, n = 6) => {
  let data = []
  for (let index = 0; index < n; index++) {
    data = [...data, Math.floor(10 + Math.random() * (max - 10 + 1))]
  }
  return data
}

export const metrics = [
  {
    name: 'Runs',
    datasets: [
      {
        label: 'computed',
        backgroundColor: '#119163',
        data: generateDataSetData(100)
      },
      {
        label: 'from network',
        backgroundColor: '#2863D8',
        data: generateDataSetData()
      },
      {
        label: 'failed',
        backgroundColor: '#BA2F41',
        data: generateDataSetData()
      }
    ]
  },
  {
    name: 'Runs',
    datasets: [
      {
        label: 'computed',
        backgroundColor: '#119163',
        data: generateDataSetData(100)
      },
      {
        label: 'from network',
        backgroundColor: '#2863D8',
        data: generateDataSetData()
      },
      {
        label: 'failed',
        backgroundColor: '#BA2F41',
        data: generateDataSetData()
      }
    ]
  },
  {
    name: 'Runs',
    datasets: [
      {
        label: 'computed',
        backgroundColor: '#119163',
        data: generateDataSetData(100)
      },
      {
        label: 'from network',
        backgroundColor: '#2863D8',
        data: generateDataSetData()
      },
      {
        label: 'failed',
        backgroundColor: '#BA2F41',
        data: generateDataSetData()
      }
    ]
  },
]
