<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import Input from '$components/form/Input.svelte'
  import StarSmall from '$components/icons/StarSmall.svelte'

  const dispatch = createEventDispatcher()

  let loading = false
  let username = null

  // Submit username to Fission server to register the account
  const handleSubmitUsername = async () => {
    loading = true
    try {
      // await register(encodedUsername)
      dispatch('nextStep')

      // addNotification({ msg: 'Account created!', type: 'success' })
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
