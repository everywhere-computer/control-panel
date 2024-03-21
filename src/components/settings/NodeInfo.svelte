<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import { onDestroy, onMount } from 'svelte'

  import { addNotification } from '$lib/notifications'
  import { getHomestarClient } from '$lib/rpc'
  import ClipboardIcon from '$components/icons/ClipboardIcon.svelte'

  export let compressedView = false

  let nodeInfo = null
  let interval

  const handleCopyToClipboard = async (value: string): Promise<void> => {
    await clipboardCopy(value)
    addNotification({ msg: 'Copied to clipboard', type: 'success' })
  }

  onMount(async () => {
    const homestar = getHomestarClient()

    nodeInfo = (await homestar.node()).result

    // Poll until listener addresses are returned
    if (!nodeInfo?.dynamic?.listeners?.length) {
      interval = setInterval(async () => {
        nodeInfo = (await homestar.node()).result
        if (nodeInfo?.dynamic?.listeners?.length) {
          clearInterval(interval)
        }
      }, 200)
    }
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

{#if nodeInfo}
  {#if compressedView}
    <div class="flex flex-row items-center justify-between gap-10 w-full">
      <p class="text-label-sm whitespace-nowrap">Peer ID</p>
      <button
        class="text-input-sm truncate transition-opacity duration-200 ease-in-out hover:opacity-80"
        on:click={() => handleCopyToClipboard(nodeInfo.static.peer_id)}
      >
        {nodeInfo?.static?.peer_id}
      </button>
    </div>

    <div class="flex flex-row items-start justify-between gap-4 w-full">
      <p class="text-label-sm">Listener Addresses</p>
      <div class="flex flex-col items-end">
        {#each nodeInfo?.dynamic?.listeners as listener}
          <button
            class="text-input-sm transition-opacity duration-200 ease-in-out hover:opacity-80"
            on:click={() => handleCopyToClipboard(listener)}
          >
            {listener}
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div>
      <h3 class="text-heading-lg mb-4">Peer ID</h3>
      <div class="flex items-center">
        <p>
          {nodeInfo?.static?.peer_id}
        </p>
        <button
          class="pl-2 hover:text-neutral-500 transition-colors"
          on:click={() => handleCopyToClipboard(nodeInfo.static.peer_id)}
        >
          <ClipboardIcon />
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-heading-lg mb-4">Listener Addresses</h3>

      {#each nodeInfo?.dynamic?.listeners as listener}
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
{/if}
