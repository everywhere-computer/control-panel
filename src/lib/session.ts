import * as Bearer from '@fission-codes/ucan/bearer'

import { createUcanWithCaps } from '$lib/fission-server-utils'

export type Session = {
  memberNumber?: number
  email: string
  username: string
  loading: boolean
}

export const IDB_ACCOUNT_DID_LABEL = 'control-panel/v1/account/did'

export const IDB_ACCOUNT_UCANS_LABEL = 'control-panel/v1/account/ucans'

export const IDB_PRIVATE_KEY_LABEL = 'control-panel/v1/agent/signing-keypair'

/**
 * Fetch capabilities from fission-server
 * Note: this will be used once we have passkey auth enabled
 */
export const getCapabilities = async (): Promise<{ revoked: string[]; ucans: {[did: string]: string} }> => {
  try {
    const { store, ucan } = await createUcanWithCaps('capability/fetch')
    const headers = Bearer.encode(ucan, store)

    const res = await fetch(
      `${import.meta.env.VITE_FISSION_SERVER_API_URI}/capabilities`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        }
      }
    )

    const capabilitiesRes = await res.json()

    return capabilitiesRes
  } catch (error) {
    console.error(error)
  }
}
