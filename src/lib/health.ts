// import type { InferError } from '@fission-codes/homestar/types'

import { homestar } from '$lib/rpc'

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

export const requestHealth = async (): Promise<Metric> => {
  try {
    const { error, result } = await homestar.health()
    if (error) {
      throw new Error(error)
    }

    return result
  } catch (error) {
    console.error(error)
  }
}
