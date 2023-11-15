// import type { InferError } from '@fission-codes/homestar/types'

import {
  // homestar,
  rpcClient
} from '$lib/rpc'

type Health = {
  healthy: boolean
  nodeInfo: {
    dynamic: {
      listeners: string[]
    }
    static: {
      peer_id: string
    }
  }
}

type Data = {
  label: string
  type: string
  value: string
}

export const requestHealth = async (): Promise<Health> => {
  try {
    const result = await rpcClient.request({ method: 'health' })
    // const { error, result } = await homestar.health()
    // if (error) {
    //   throw new Error(error)
    // }
    return result
  } catch (error) {
    console.error(error)
  }
}
