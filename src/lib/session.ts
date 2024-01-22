import { UCAN } from '@fission-codes/ucan'
import type { Capabilities } from '@fission-codes/ucan/dist/src/types'
import { RSASigner } from 'iso-signatures/signers/rsa'
import { DIDKey } from 'iso-did/key'
import localforage from 'localforage'

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
    const serverDid = await (
      await fetch(`${import.meta.env.VITE_FISSION_SERVER_API_URI}/server-did`)
    ).text()
    const audience = DIDKey.fromString(serverDid)

    const principal = await RSASigner.import(
      await localforage.getItem(IDB_PRIVATE_KEY_LABEL)
    )
    const pucan = await UCAN.create({
      issuer: principal,
      audience: audience.did,
      ttl: 60, // A rough estimate that accounts for clock drift
      capabilities: ({
        [principal.did.toString()]: { 'capability/fetch': [{}] }
      } as unknown) as Capabilities
    })

    const res = await fetch(
      `${import.meta.env.VITE_FISSION_SERVER_API_URI}/capabilities`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pucan.toString()}`
        }
      }
    )

    const capabilitiesRes = await res.json()

    return capabilitiesRes
  } catch (error) {
    console.error(error)
  }
}
