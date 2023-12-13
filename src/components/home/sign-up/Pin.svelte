<script lang="ts">
  import Plausible from 'plausible-tracker'
  import { createEventDispatcher } from 'svelte'

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
