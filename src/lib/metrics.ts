// import type { InferError } from '@fission-codes/homestar/types'

import { getHomestarClient } from '$lib/rpc'

type Metric = {
  data: Data[]
  help: string
  metric_name: string
  metric_type: string
}

type Data = {
  label: string
  type: string
  value: string
}

export const requestMetrics = async (): Promise<Metric> => {
  try {
    const homestar = getHomestarClient()
    const { error, result } = await homestar.metrics()

    if (error) {
      throw new Error(error)
    }

    return result
  } catch (error) {
    console.error(error)
  }
}
