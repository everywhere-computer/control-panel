// import { UCAN } from '@fission-codes/ucan'
// import type { Capabilities } from '@fission-codes/ucan/dist/src/types'
// import { RSASigner } from 'iso-signatures/signers/rsa'
// import { DIDKey } from 'iso-did/key'
import localforage from 'localforage'

import { IDB_ACCOUNT_DID_LABEL, IDB_ACCOUNT_ID_LABEL, IDB_UCAN_LABEL } from '$lib/session'
import { sessionStore } from '$lib/stores'

export const initialize = async (): Promise<void> => {
  try {
    const accountDid = await localforage.getItem(IDB_ACCOUNT_DID_LABEL)
    const accountId = await localforage.getItem(IDB_ACCOUNT_ID_LABEL) as number
    const ucan = await localforage.getItem(IDB_UCAN_LABEL)

    // If there is no save accountDid or ucan, there's no active session
    if (!accountDid || !ucan) {
      sessionStore.set({
        id: null,
        username: null,
        loading: false
      })
      return
    }

    // const serverDid = await(
    //   await fetch('http://localhost:3000/api/v0/server-did')
    // ).text()
    // const audience = DIDKey.fromString(serverDid)

    // const idbPrivateKeyLabel = 'control-panel/v1/agent/signing-keypair'

    // // TODO: This is using an old version of iso-signatures, @fission-codes/stack needs to be updated
    // const principal = await RSASigner.generate()

    // const keyPair = await localforage.getItem(idbPrivateKeyLabel)

    // const ucan = await UCAN.create({
    //   issuer: principal,
    //   audience,
    //   ttl: 60, // A rough estimate that accounts for clock drift
    //   capabilities: ({
    //     [principal.did.toString()]: { 'capability/fetch': [{}] }
    //   } as unknown) as Capabilities
    // })

    // const response = await fetch('http://localhost:3000/api/v0/capabilities', {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${ucan.toString()}`
    //   }
    // })

    // const ucan = await UCAN.create({
    //   issuer: DIDKey.fromString(accountDid),
    //   audience,
    //   ttl: 60, // A rough estimate that accounts for clock drift
    //   capabilities: ({
    //     [accountDid]: { 'account/info': [{}] }
    //   } as unknown) as Capabilities
    // })

    const response = await fetch(
      `http://localhost:3000/api/v0/account/${accountDid}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ucan.toString()}`
        }
      }
    )

    const { username } = await response.json()

    sessionStore.set({
      id: accountId,
      username,
      loading: false,
    })
  } catch (error) {
    sessionStore.set({
      username: null,
      loading: false,
    })

    console.error(error)
  }
}
