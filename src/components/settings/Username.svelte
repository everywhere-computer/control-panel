<script lang="ts">
  import * as Bearer from '@fission-codes/ucan/bearer'
  import clipboardCopy from 'clipboard-copy'

  import { createUcanWithCaps } from '$lib/fission-server-utils'
  import { addNotification } from '$lib/notifications'
  import { sessionStore } from '$lib/stores'
  import ClipboardIcon from '$components/icons/ClipboardIcon.svelte'
  import EditIcon from '$components/icons/Edit.svelte'

  let isEditing = false
  let loading = false

  const handleCopyUsername = async (): Promise<void> => {
    await clipboardCopy($sessionStore.username)
    addNotification({ msg: 'Copied to clipboard', type: 'success' })
  }

  const handleEditUsername = async (event: Event): Promise<void> => {
    if (isEditing) {
      loading = true

      try {
        const formEl = event.target as HTMLFormElement
        const data = new FormData(formEl)
        const username = data.get('username')        
        const { store, ucan } = await createUcanWithCaps('account/manage')
        const headers = Bearer.encode(ucan, store)

        await fetch(
          `${import.meta.env.VITE_FISSION_SERVER_API_URI}/account/username/${username}`,
          {
            method: 'PATCH',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              ...headers,
            },
          }
        )    
        
        $sessionStore.username = username.toString()

        addNotification({ msg: 'Username updated', type: 'success' })

        isEditing = false
      } catch (err) {
        console.error(err)

        addNotification({ msg: 'Something went wrong', type: 'error' })
      }
      
      loading = false
    } else {
      isEditing = true
    }
  }
</script>

<div>
  <h3 class="text-heading-lg mb-4">Username</h3>
  <div class="flex items-center">
    {#if isEditing}
      <form on:submit|preventDefault={handleEditUsername}>
        <input 
          class="input !h-[38px]"
          name="username" 
          type="text" 
          required
          value={$sessionStore.username} 
        />
        <button
          class="pl-2 hover:text-neutral-500 transition-colors"
          type="submit"
        >
          <EditIcon />
        </button>        
      </form>
    {:else}
      <p>
        {$sessionStore.username}
      </p>
      <button
        class="pl-2 hover:text-neutral-500 transition-colors"
        on:click={handleEditUsername}
      >
        <EditIcon />
      </button>
      <button
        class="pl-2 hover:text-neutral-500 transition-colors"
        on:click={handleCopyUsername}
      >
        <ClipboardIcon />
      </button>
    {/if}
  </div>
</div>
