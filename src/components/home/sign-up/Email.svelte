<script lang="ts">
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

<form
  on:submit|preventDefault={handleSubmitEmail}
  class="flex flex-col items-center gap-4 mt-auto"
>
  <Input maxWidth="372px" name="email" label="Enter your email" type="email" />

  <button
    class="btn btn-primary btn-odd-purple-500 w-[189px] h-10 !text-label-l {loading
      ? 'opacity-80'
      : ''} gap-2"
    disabled={loading}
    type="submit"
  >
    Connect
  </button>
</form>
