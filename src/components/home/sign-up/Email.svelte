<script lang="ts">
  import posthog from 'posthog-js'
  import { createEventDispatcher, onMount } from 'svelte'

  import { addNotification, removeNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'

  const dispatch = createEventDispatcher()

  export let error = null
  export let savedEmail = null

  let loading = false
  let inputProps = {}

  $: notificationId = null

  // Submit email to Fission server to register the account
  const handleSubmitEmail = async (event: Event) => {
    loading = true

    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)
      const email = data.get('email')

      posthog.capture('Email validation sent')

      await fetch(
        `${import.meta.env.VITE_FISSION_SERVER_URI}/auth/email/verify`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email.toString() })
        }
      )

      dispatch('nextStep', { email: email, nextStep: 3 })

      if (notificationId) {
        removeNotification(notificationId)
      }
    } catch (e) {
      console.error(e)
      addNotification({ msg: 'Failed to register account', type: 'error' })
    }

    loading = false
  }

  // Remove error state onInput
  const handleOnInput = () => {
    inputProps = {}
  }

  if (error) {
    inputProps = {
      error: true,
      validationMessage: `${savedEmail} is already registered. You can link this device from any device on which that account is currently connected. If you need help, please post in the Beta Forum.`
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmitEmail}
  class="flex flex-col items-center gap-4 w-full max-w-[450px] md:max-w-full mt-auto py-10 px-8 bg-base-200"
>
  <Input
    name="email"
    label="Provide your email"
    type="email"
    onInput={handleOnInput}
    required
    {...inputProps}
  />

  <button
    class="btn btn-primary btn-odd-purple-500 w-full max-w-[311px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Connect
  </button>
</form>
