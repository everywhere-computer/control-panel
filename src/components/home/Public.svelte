<script lang="ts">
  import {
    createDID,
    prepareUsername,
    register,
    USERNAME_STORAGE_KEY
  } from '$lib/auth/account'
  import { addNotification } from '$lib/notifications'
  import { sessionStore, themeStore } from '$lib/stores'
  import Alert from '$components/icons/Alert.svelte'
  import Connect from '$components/icons/Connect.svelte'

  let loading = false

  // Automatically generate a username and register an account
  const handleRegisterAccount = async () => {
    loading = true
    try {
      const {
        program: {
          components: { crypto, storage }
        }
      } = $sessionStore

      /**
       * Create a new DID for the user, which will be appended to their username, concatenated
       * via a `#`, hashed and encoded to ensure uniqueness
       */
      const did = await createDID(crypto)
      const fullUsername = `ec-anon#${did}`
      await storage.setItem(USERNAME_STORAGE_KEY, fullUsername)

      const encodedUsername = await prepareUsername(fullUsername)

      await register(encodedUsername)
    } catch (error) {
      console.error(error)
      addNotification('Failed to register account', 'error')
    }
    loading = false
  }
</script>

<div
  class="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-248px)] md:min-h-[calc(100vh-160px)] w-full"
>
  <div class="logo relative max-w-[60vmin] max-h-[60vmin]">
    <img
      class="logo-bg w-full animate-rotateAnimation"
      src={`${window.location.origin}/logo-bg${
        $themeStore.selectedTheme === 'dark' ? '-dark' : ''
      }.svg`}
      alt="logo backgroud"
    />
    <img
      class="logo-mg absolute z-20 top-[11.8%] left-[11.8%] w-[76.4%] h-[76.4%] object-cover"
      src={`${window.location.origin}/logo-mg.gif`}
      alt="logo spinning lines"
    />
    <img
      class="logo-fg absolute top-0 left-0 z-10 w-full"
      src={`${window.location.origin}/logo-fg.svg`}
      alt="logo foreground"
    />
  </div>

  {#if $sessionStore.error === 'Unsupported Browser'}
    <div class="p-4 rounded-lg bg-base-content text-base-100">
      <h3 class="flex items-center gap-2 text-base">
        <span class="-translate-y-[2px]"><Alert /></span>
        Unsupported device
      </h3>
      <p>
        It appears this device isn’t supported. ODD requires IndexedDB in order
        to function. This browser doesn’t appear to implement this API. Are you
        in a Firefox private window?
      </p>
    </div>
  {:else}
    <div class="flex flex-col items-start gap-4">
      <button
        class="btn btn-odd-gray-900 gap-2"
        on:click={handleRegisterAccount}
        disabled={loading}
      >
        <Connect /> Connect this device
      </button>
    </div>
  {/if}
</div>
