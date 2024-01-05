<script lang="ts">
  import posthog from 'posthog-js'
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'

  const dispatch = createEventDispatcher()

  let loading = false

  // Submit email to Fission server to register the account
  const handleSubmitEmail = async (event: Event) => {
    loading = true
    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)
      const email = data.get('email')

      posthog.capture('Email validation sent')

      dispatch('nextStep', { email })

      // addNotification({ msg: 'Account created!', type: 'success'})
    } catch (error) {
      console.error(error)
      addNotification({ msg: 'Failed to register account', type: 'error' })
    }
    loading = false
  }
</script>

<form
  on:submit|preventDefault={handleSubmitEmail}
  class="flex flex-col items-center gap-4 w-full max-w-[450px] md:max-w-full mt-auto py-10 px-8 bg-base-200"
>
  <Input name="email" label="Provide your email" type="email" required />

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
