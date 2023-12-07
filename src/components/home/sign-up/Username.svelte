<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'

  const dispatch = createEventDispatcher()

  let loading = false

  // Submit username to Fission server to register the account
  const handleSubmitUsername = async (event: Event) => {
    loading = true
    try {
      const formEl = event.target as HTMLFormElement
      const data = new FormData(formEl)
      const username = data.get('username')

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
  <p>Welcome!</p>
  <p>Let's create your account</p>
</div>

<form
  on:submit|preventDefault={handleSubmitUsername}
  class="flex flex-col items-center gap-4"
>
  <Input
    maxWidth="372px"
    name="username"
    label="Enter your username"
    type="text"
  />

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
