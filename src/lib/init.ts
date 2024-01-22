import { UCAN } from '@fission-codes/ucan'
import * as Bearer from '@fission-codes/ucan/bearer'
import type { Capabilities } from '@fission-codes/ucan/dist/src/types'
import { DIDKey } from 'iso-did/key'
import { RSASigner } from 'iso-signatures/signers/rsa'
import localforage from 'localforage'

import { IDB_ACCOUNT_DID_LABEL, IDB_ACCOUNT_UCANS_LABEL, IDB_PRIVATE_KEY_LABEL } from '$lib/session'
import { sessionStore } from '$lib/stores'

export const initialize = async (): Promise<void> => {
  try {
    const accountDid: string = await localforage.getItem(IDB_ACCOUNT_DID_LABEL)
    const accountUcans: string[] = await localforage.getItem(IDB_ACCOUNT_UCANS_LABEL)

    // If there is no save accountDid or ucan, there's no active session
    if (!accountDid || !accountUcans) {
      sessionStore.set({
        email: null,
        username: null,
        loading: false
      })
      return
    }

    const keyPair: CryptoKeyPair = await localforage.getItem(
      IDB_PRIVATE_KEY_LABEL
    )
    const principal = await RSASigner.import(keyPair)

    const parsedUcans = await Promise.all(
      accountUcans.map(async (ucan: `${string}.${string}.${string}`) =>
        UCAN.fromUcan(ucan)
      )
    )

    const serverDid = await (
      await (
        await fetch(
          `${
            import.meta.env.VITE_FISSION_SERVER_HOST_ORIGIN
          }/dns-query?name=_did.localhost&type=TXT`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/dns-json'
            }
          }
        )
      ).json()
    ).Answer[0].data

    const audience = DIDKey.fromString(serverDid)

    const store = new Map()

    store.set(parsedUcans[0].cid.toString(), parsedUcans[0])
    store.set(parsedUcans[1].cid.toString(), parsedUcans[1])

    const ucan = await UCAN.create({
      issuer: principal,
      audience: audience.did,
      ttl: 60,
      capabilities: ({
        [accountDid]: { 'account/info': [{}] }
      } as unknown) as Capabilities,
      proofs: [parsedUcans[0].cid, parsedUcans[1].cid]
    })

    const headers = Bearer.encode(ucan, store)

    const response = await fetch(
      `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        }
      }
    )

    const { email, username } = await response.json()

    sessionStore.set({
      email,
      username: username.split('.')[0],
      loading: false
    })
  } catch (error) {
    sessionStore.set({
      email: null,
      username: null,
      loading: false
    })

    console.error(error)
  }
}
