<script lang="ts">
  import Plausible from 'plausible-tracker'
  import { createEventDispatcher } from 'svelte'
  import { UCAN } from '@fission-codes/ucan'
  import { webcrypto } from 'iso-web/crypto'
  import localforage from 'localforage'
  import { RsaKeypair } from '@ucans/default-plugins'


  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'

  const { trackEvent } = Plausible({
    trackLocalhost: false
  })

  const dispatch = createEventDispatcher()

  let loading = false

  // Submit pin code to Fission server to register the account
  const handleSubmitPin = async (event: Event) => {
    loading = true
    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)
      const pin = data.get('pin')

      // await register(encodedUsername)

      trackEvent('Account created', {
        // callback: () => console.log('done'),
        props: {
          email: '' // enter user account email
        }
      })

      // hehe. The keykey
      // TODO: This needs to be stored in a way that's structured better.
      const kiki = `myprivatekey`

      // TODO(matheus23): Replace this with a proper DoH DNS
      // lookup of _did.localhost once iso-web DoH stuff is exposed.
      const serverDid = await (await fetch("http://localhost:3000/api/v0/server-did")).text()

      let keypair: CryptoKeyPair = await localforage.getItem(kiki)

      if (keypair == null) {
        keypair = await webcrypto.subtle.generateKey(
          {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
          },
          false,
          ['sign', 'verify']
        )

        console.log("generated keypair", keypair)

        await localforage.setItem(kiki, keypair)
      }

      const publicKey = await webcrypto.subtle.exportKey('spki', keypair.publicKey)

      // We need to use ts-ucan for this, because iso-did doesn't expose utilities to
      // create a DID from a webcrypto keypair. It doesn't have the spki encoding -> RsaPublicKeyInfo encoding functions.
      const rsaKeypair = new RsaKeypair(keypair, new Uint8Array(publicKey), false)
      const ourDid = rsaKeypair.did()
      const sign = rsaKeypair.sign.bind(rsaKeypair)

      const ucan = await UCAN.create({
        issuer: { did: ourDid, sign } as any, // principal isn't properly exposed from the @fission-codes/ucan lib yet
        audience: serverDid as any, // same here
        ttl: 60, // A rough estimate that accounts for clock drift
        capabilities: {
          [ourDid]: { 'account/create': [{}] }
        } as any, // Unfortunately, it both doesn't pick up ourDid as a valid key (fixable), but it also doesn't allow 'account/create', only '*' for some reason.
      })

      console.log('Requesting with UCAN', ucan.toString())

      const response = await fetch('http://localhost:3000/api/v0/account', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ucan.toString()}`
        },
        body: JSON.stringify({
          code: Number.parseInt(pin.toString(), 10),
          email: 'philipp@fission.codes', // This is the email I did my testing with.
          username: 'control-panel1', // TODO this needs to somehow all happen at the next step, where the username will be entered.
        })
      })

      console.log(await response.json())

      dispatch('nextStep')

      // addNotification('Account created!', 'success')
    } catch (error) {
      console.error(error)
      addNotification('Failed to register account', 'error')
    }
    loading = false
  }

  const handleResendEmail = async () => {
    addNotification('Email sent!', 'success')
  }
</script>

<div
  class="flex flex-row w-full max-w-[316px] box-content m-auto p-4 bg-odd-green-200 rounded-sm text-body-lg text-center"
>
  <p class="text-input-sm text-left">
    We’ve sent a one-time access code to your email.
  </p>
  <button
    class="w-[110px] text-input-sm text-primary-focus text-right jutify-self-end self-end"
    on:click={handleResendEmail}
  >
    Resend it
  </button>
</div>

<form
  on:submit|preventDefault={handleSubmitPin}
  class="flex flex-col items-center gap-4 w-full max-w-[450px] mt-auto py-10 px-8 bg-base-200"
>
  <Input
    maxWidth="372px"
    name="pin"
    label="Enter the one-time code"
    type="text"
    required
  />

  <button
    class="btn btn-primary btn-odd-purple-500 w-full max-w-[400px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Authenticate
  </button>
</form>
