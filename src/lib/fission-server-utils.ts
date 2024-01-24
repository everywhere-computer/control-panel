import { UCAN } from '@fission-codes/ucan'
import type { Capabilities } from '@fission-codes/ucan/dist/src/types'
import { DIDKey } from 'iso-did/key'
import type { DID } from 'iso-did/types'
import { RSASigner } from 'iso-signatures/signers/rsa'
import localforage from 'localforage'

import {
  IDB_ACCOUNT_DID_LABEL,
  IDB_ACCOUNT_UCANS_LABEL,
  IDB_PRIVATE_KEY_LABEL
} from '$lib/session'

/**
 * Fetch server DID using dns-query
 * NOTE: the `localhost` segment of the string will need to become dynamic once the server is hosted
 */
export const getServerDid = async (): Promise<string> => {
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

  return serverDid
}

/**
 * Fetch an account DID using dns-query
 * NOTE: the `localhost` segment of the string will need to become dynamic once the server is hosted
 */
export const getAccountDid = async (username: string): Promise<string> => {
  const accountDid = await (
    await (
      await fetch(
        `${
          import.meta.env.VITE_FISSION_SERVER_HOST_ORIGIN
        }/dns-query?name=_did.${username}.localhost&type=TXT`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/dns-json'
          }
        }
      )
    ).json()
  ).Answer[0].data

  return accountDid
}

/**
 * Get the UCAN audience(Fission server) DID
 */
export const getAudience = async (): Promise<DID> => {
  const serverDid = await getServerDid()
  const audience = DIDKey.fromString(serverDid)

  return audience.did
}

/**
 * Get parsed account UCANs
 */
export const getParsedUcans = async (): Promise<{ parsedUcans: UCAN[]; store: Map<any, any> }> => {
  const accountUcans: string[] = await localforage.getItem(
    IDB_ACCOUNT_UCANS_LABEL
  )

  // If there is no saved accountUcan, there's no active session
  if (!accountUcans) {
    throw new Error('Could not find account UCANs')
  }

  const parsedUcans = await Promise.all(
    accountUcans.map(async (ucan: `${string}.${string}.${string}`) =>
      UCAN.fromUcan(ucan)
    )
  )

  const store = new Map()
  store.set(parsedUcans[0].cid.toString(), parsedUcans[0])
  store.set(parsedUcans[1].cid.toString(), parsedUcans[1])

  return {
    store,
    parsedUcans,
  }
}

/**
 * Get principal keypair from indexedDB or create a new one if it doesn't exist
 */
export const getPrincipal = async (): Promise<RSASigner> => {
  let principal
  const keyPair: CryptoKeyPair = await localforage.getItem(
    IDB_PRIVATE_KEY_LABEL
  )

  if(keyPair) {
    principal = await RSASigner.import(keyPair)
  } else {
    principal = await RSASigner.generate()

    // Persist/overwrite private key in IndexedDB
    await localforage.setItem(IDB_PRIVATE_KEY_LABEL, principal.export())
  }


  return principal
}

/**
 * Create a UCAN with specific capabilities to make requests to the Fission server
 */
export const createUcanWithCaps = async (
  capabilities: 'account/info' | 'capability/fetch'
): Promise<{ store: Map<any, any>; ucan: UCAN }> => {
  if (!capabilities) {
    throw new Error('Must specify capabilities')
  }

  const accountDid: string = await localforage.getItem(IDB_ACCOUNT_DID_LABEL)

  // If there is no saves accountDid, there's no active session
  if (!accountDid) {
    throw new Error('Could not find account DID')
  }

  const audience = await getAudience()
  const principal = await getPrincipal()
  const { parsedUcans, store } = await getParsedUcans()

  const ucan = await UCAN.create({
    issuer: principal,
    audience,
    ttl: 60,
    capabilities: ({
      [accountDid]: { [capabilities]: [{}] }
    } as unknown) as Capabilities,
    proofs: [parsedUcans[0].cid, parsedUcans[1].cid]
  })

  return {
    store,
    ucan
  }
}

/**
 * Create a new account by posting the email, pin and username
 */
export const createAccount = async ({ email, pin, username }: { email: string; pin: string; username: string }): Promise<void> => {
  const audience = await getAudience()
  const principal = await RSASigner.generate()

  // Persist/overwrite private key in IndexedDB
  await localforage.setItem(IDB_PRIVATE_KEY_LABEL, principal.export())

  const ucan = await UCAN.create({
    issuer: principal,
    audience,
    ttl: 60, // A rough estimate that accounts for clock drift
    capabilities: ({
      [principal.did.toString()]: { 'account/create': [{}] }
    } as unknown) as Capabilities
  })

  const response = await fetch(
    `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ucan.toString()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: pin,
        email,
        username
      })
    }
  )

  // HTTP status code 201 CREATED
  if (response.status != 201) {
    throw new Error(await response.text())
  }

  // Now we have some info on the account & UCANs
  const { account, ucans } = await response.json()

  await localforage.setItem(IDB_ACCOUNT_DID_LABEL, account.did)
  await localforage.setItem(IDB_ACCOUNT_UCANS_LABEL, ucans)
}

/**
 * Link an existing account using an account DID and pin code
 */
export const linkAccount = async (pin: string): Promise<string[]> => {
  const accountDid: string = await localforage.getItem(
    IDB_ACCOUNT_DID_LABEL
  )
  const audience = await getAudience()
  const principal = await getPrincipal()

  const ucan = await UCAN.create({
    issuer: principal,
    audience,
    ttl: 60,
    capabilities: ({
      [principal.did.toString()]: { 'account/link': [{}] }
    } as unknown) as Capabilities
  })

  const response = await fetch(
    `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account/${accountDid}/link`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ucan.toString()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: pin.toString() })
    }
  )
  const { ucans } = await response.json()

  await localforage.setItem(IDB_ACCOUNT_UCANS_LABEL, ucans)

  return ucans
}

/**
 * Check if we're using the account linking flow
 */
export const isAccountLinkingFlow = (): boolean => import.meta.env.VITE_ACCOUNT_LINKING_FLOW === 'true'
