import { UCAN } from '@fission-codes/ucan'
import type { Capabilities } from '@fission-codes/ucan/dist/src/types'
import { RSASigner } from 'iso-signatures/signers/rsa'
import { DIDKey } from 'iso-did/key'
import localforage from 'localforage'

export type Session = {
  id?: number
  username: string
  loading: boolean
}

export const IDB_ACCOUNT_DID_LABEL = 'control-panel/v1/account/did'

export const IDB_ACCOUNT_ID_LABEL = 'control-panel/v1/account/id'

export const IDB_PRIVATE_KEY_LABEL = 'control-panel/v1/agent/signing-keypair'

export const IDB_UCAN_LABEL = 'control-panel/v1/ucan'

/**
 * Fetch capabilities from fission-server
 * Note: this will be used once we have passkey auth enabled
 */
export const getCapabilities = async (): Promise<void> => {
  const serverDid = await (
    await fetch('http://localhost:3000/api/v0/server-did')
  ).text()
  const audience = DIDKey.fromString(serverDid)

  const principal = await RSASigner.import(
    await localforage.getItem(IDB_PRIVATE_KEY_LABEL)
  )
  const pucan = await UCAN.create({
    issuer: principal,
    audience,
    ttl: 60, // A rough estimate that accounts for clock drift
    capabilities: ({
      [principal.did.toString()]: { 'capability/fetch': [{}] }
    } as unknown) as Capabilities
  })

  const res = await fetch('http://localhost:3000/api/v0/capabilities', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pucan.toString()}`
    }
  })

  const capabilitiesRes = await res.json()
  console.log('principal did', principal.did.toString())
  console.log('capabilities res', capabilitiesRes)
  console.log(
    'capabilities res ucan count',
    Object.keys(capabilitiesRes.ucans).length
  )
}
