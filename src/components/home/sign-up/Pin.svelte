<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'

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
      dispatch('nextStep')

      // addNotification('Account created!', 'success')
    } catch (error) {
      console.error(error)
      addNotification('Failed to register account', 'error')
    }
    loading = false
  }
</script>

<div class="mt-auto text-body-lg text-center">
  <p>We emailed you an authentication code</p>
</div>

<form
  on:submit|preventDefault={handleSubmitPin}
  class="flex flex-col items-center gap-4"
>
  <Input maxWidth="372px" name="pin" label="Enter your code" type="text" />

  <button
    class="btn btn-primary btn-odd-purple-500 w-[189px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Continue
  </button>
</form>
