<script lang="ts">
  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'
  import { goto } from '$app/navigation'
  import { sessionStore } from '$lib/stores'
  import { RSASigner } from 'iso-signatures/signers/rsa'
  import { DIDKey } from 'iso-did/key'
  import localforage from 'localforage'
  import { UCAN } from '@fission-codes/ucan'
  import type { Capabilities } from '@fission-codes/ucan/dist/src/types'

  let loading = false

  export let email = null
  export let pin = null

  // Submit username to Fission server to register the account
  const handleSubmitUsername = async () => {
    loading = true

    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)
      const username = data.get('username')

      // TODO(matheus23): Replace this with a proper DoH DNS
      // lookup of _did.localhost once iso-web DoH stuff is exposed.
      const serverDid = await (
        await fetch('http://localhost:3000/api/v0/server-did')
      ).text()

      const audience = DIDKey.fromString(serverDid)

      const idbPrivateKeyLabel = 'control-panel/v1/agent/signing-keypair'
      // TODO: This is using an old version of iso-signatures, @fission-codes/stack needs to be updated
      const principal = await RSASigner.generate()
      // Persist/overwrite private key in IndexedDB
      await localforage.setItem(idbPrivateKeyLabel, principal.export())

      const ucan = await UCAN.create({
        issuer: principal,
        audience,
        ttl: 60, // A rough estimate that accounts for clock drift
        capabilities: { [principal.did.toString()]: { 'account/create': [{}] } } as unknown as Capabilities
      })

      console.log('Requesting with UCAN', ucan.toString())

      const response = await fetch('http://localhost:3000/api/v0/account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ucan.toString()}`
        },
        body: JSON.stringify({
          code: pin,
          email,
          username
        })
      })

      // HTTP status code 201 CREATED
      if (response.status != 201) {
        throw new Error(await response.text())
      }

      // Now we have some info on the account & UCANs
      const { account, ucans } = await response.json()

      // @ts-ignore-next-line
      $sessionStore.username = username
      goto('/onboarding/welcome')
    } catch (error) {
      console.error(error)
      addNotification({ msg: 'Failed to register account', type: 'error' })
    }

    loading = false
  }
</script>

<form
  on:submit|preventDefault={handleSubmitUsername}
  class="relative flex flex-col items-center gap-4 w-full max-w-[450px] md:max-w-full mt-auto py-10 px-8 bg-base-200"
>
  <div
    class="absolute bottom-[calc(100%+32px)] left-1/2 -translate-x-1/2 flex flex-row items-center justify-center gap-2 w-[311px] m-auto p-4 bg-base-200 text-center rounded-[88px]"
  >
    <StarSmall />
    <StarSmall />
    <p class="mx-6 text-input-sm text-primary">Fresh applicant detected</p>
    <StarSmall />
    <StarSmall />
  </div>

  <Input
    name="username"
    label="Choose your username"
    textToAppend=".e9c7.name"
    type="text"
    required
  />

  <button
    class="btn btn-primary btn-odd-purple-500 w-full max-w-[311px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Create Account
  </button>
</form>
