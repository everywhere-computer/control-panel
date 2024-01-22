<script lang="ts">
  import { UCAN } from '@fission-codes/ucan'
  import * as Bearer from '@fission-codes/ucan/bearer'
  import type { Capabilities } from '@fission-codes/ucan/dist/src/types'
  import { DIDKey } from 'iso-did/key'
  import { RSASigner } from 'iso-signatures/signers/rsa'
  import localforage from 'localforage'
  import { onMount } from 'svelte'

  import {
    IDB_ACCOUNT_DID_LABEL,
    IDB_ACCOUNT_UCANS_LABEL,
    IDB_PRIVATE_KEY_LABEL
  } from '$lib/session'
  import { sessionStore } from '$lib/stores'

  onMount(async () => {
    try {
      const accountDid: string = await localforage.getItem(
        IDB_ACCOUNT_DID_LABEL
      )
      const savedUcans: string[] = await localforage.getItem(
        IDB_ACCOUNT_UCANS_LABEL
      )
      const keyPair: CryptoKeyPair = await localforage.getItem(
        IDB_PRIVATE_KEY_LABEL
      )
      const principal = await RSASigner.import(keyPair)

      const parsedUcans = await Promise.all(
        savedUcans.map(async (ucan: `${string}.${string}.${string}`) =>
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
        `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account/member-number`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...headers
          }
        }
      )
      const { memberNumber } = await response.json()
      $sessionStore.memberNumber = memberNumber
    } catch (error) {
      console.error(error)
    }
  })
</script>

{#if $sessionStore.memberNumber}
  <slot />
{/if}
