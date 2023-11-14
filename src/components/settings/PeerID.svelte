<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import { onMount } from 'svelte'

  import { requestHealth } from '$lib/health'
  import { addNotification } from '$lib/notifications'
  import ClipboardIcon from '$components/icons/ClipboardIcon.svelte'

  let health = null

  const handleCopyPeerID = async (): Promise<void> => {
    await clipboardCopy(health?.nodeInfo?.peer_id)
    addNotification('Copied to clipboard', 'success')
  }

  onMount(async () => {
    health = await requestHealth()
  })
</script>

{#if health}
  <div>
    <h3 class="text-heading-lg mb-4">Peer ID</h3>
    <div class="flex items-center">
      <p>
        {health.nodeInfo.peer_id}
      </p>
      <button
        class="pl-2 hover:text-neutral-500 transition-colors"
        on:click={handleCopyPeerID}
      >
        <ClipboardIcon />
      </button>
    </div>
  </div>
{/if}
