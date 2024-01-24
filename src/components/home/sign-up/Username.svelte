<script lang="ts">
  import localforage from 'localforage'
  import posthog from 'posthog-js'
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import {
    createAccount,
    getAccountDid,
    isAccountLinking
  } from '$lib/fission-server-utils'
  import { IDB_ACCOUNT_DID_LABEL } from '$lib/session'
  import { sessionStore } from '$lib/stores'
  import Input from '$components/form/Input.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'
  import { goto } from '$app/navigation'

  const dispatch = createEventDispatcher()

  export let email = null
  export let pin = null

  let loading = false

  $: error = false
  $: validationMessage = null

  // Submit username to Fission server to register the account
  const handleSubmitUsername = async (event: Event) => {
    loading = true
    const formEl = event.target as HTMLFormElement
    const data = new FormData(formEl)
    const username = data.get('username')

    // If the user is accessing an existing account, we can fetch the DID for their username first
    if (isAccountLinking()) {
      try {
        const accountDid = await getAccountDid(username.toString())

        await localforage.setItem(IDB_ACCOUNT_DID_LABEL, accountDid)

        dispatch('nextStep', {
          nextStep: 3,
          username
        })
      } catch (err) {
        console.error(err)
        error = true
        validationMessage = 'Cannot find account for username'
      }
    } else {
      try {
        await createAccount({ email, pin, username: username.toString() })

        $sessionStore.username = username.toString()

        posthog.capture('Account created')

        goto('/onboarding/welcome')
      } catch (err) {
        console.error(err)
        const errors = JSON.parse(err?.message).errors

        if (errors?.find(e => e?.detail.includes('unique_email'))) {
          dispatch('nextStep', {
            nextStep: 2,
            savedEmail: email,
            error: true
          })
          return
        }
        if (errors?.find(e => e?.detail.includes('unique_username'))) {
          loading = false
          error = true
          validationMessage = 'Username must be unique'
          return
        }

        addNotification({ msg: 'Failed to register account', type: 'error' })
      }
    }

    loading = false
  }

  // Remove error state onInput
  const handleOnInput = () => {
    error = false
    validationMessage = null
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
    onInput={handleOnInput}
    required
    bind:error
    bind:validationMessage
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
