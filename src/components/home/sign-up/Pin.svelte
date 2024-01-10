<script lang="ts">
  import posthog from 'posthog-js'
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'

  const dispatch = createEventDispatcher()

  let loading = false

  export let email = null

  // Submit pin code to Fission server to register the account
  const handleSubmitPin = async (event: Event) => {
    loading = true

    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)
      const pin = data.get('pin')

      // TODO: Is this correct? Should we perhaps only emit this on the next step?
      posthog.capture('Account created')

      dispatch('nextStep', { email, pin })

      // addNotification({ msg: 'Account created!', type: 'success' })
    } catch (error) {
      console.error(error)
      addNotification({ msg: 'Failed to register account', type: 'error' })
    }

    loading = false
  }

  const handleResendEmail = async () => {
    try {
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
      addNotification({ msg: 'Email sent!', type: 'success' })
    } catch (error) {
      console.error('error')
      addNotification({ msg: 'Failed to re-send email', type: 'error' })
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmitPin}
  class="relative flex flex-col items-center gap-4 w-full max-w-[450px] md:max-w-full mt-auto py-10 px-8 bg-base-200"
>
  <div
    class="absolute bottom-[calc(100%+32px)] left-1/2 -translate-x-1/2 flex flex-row w-full w-[311px] m-auto p-4 bg-odd-green-200 rounded-sm text-body-lg text-center"
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

  <Input name="pin" label="Enter the one-time code" type="text" required />

  <button
    class="btn btn-primary btn-odd-purple-500 w-full max-w-[311px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Authenticate
  </button>
</form>
