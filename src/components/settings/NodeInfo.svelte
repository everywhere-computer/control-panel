<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import { onDestroy, onMount } from 'svelte'

  import { requestHealth } from '$lib/health'
  import { addNotification } from '$lib/notifications'
  import ClipboardIcon from '$components/icons/ClipboardIcon.svelte'

  let health = null
  let interval

  const handleCopyToClipboard = async (value: string): Promise<void> => {
    await clipboardCopy(value)
    addNotification('Copied to clipboard', 'success')
  }

  onMount(async () => {
    health = await requestHealth()

    // Poll until listener addresses are returned
    if (!health?.nodeInfo?.dynamic?.listeners?.length) {
      interval = setInterval(async () => {
        health = await requestHealth()
        if (health?.nodeInfo?.dynamic?.listeners?.length) {
          clearInterval(interval)
        }
      }, 200)
    }
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

{#if health}
  <div>
    <h3 class="text-heading-lg mb-4">Peer ID</h3>
    <div class="flex items-center">
      <p>
        {health.nodeInfo.static.peer_id}
      </p>
      <button
        class="pl-2 hover:text-neutral-500 transition-colors"
        on:click={() => handleCopyToClipboard(health.nodeInfo.static.peer_id)}
      >
        <ClipboardIcon />
      </button>
    </div>
  </div>

  <div>
    <h3 class="text-heading-lg mb-4">Listener Addresses</h3>

    {#each health.nodeInfo.dynamic.listeners as listener}
      <div class="flex items-center">
        <p>
          {listener}
        </p>
        <button
          class="pl-2 hover:text-neutral-500 transition-colors"
          on:click={() => handleCopyToClipboard(listener)}
        >
          <ClipboardIcon />
        </button>
      </div>
    {/each}
  </div>
{/if}
