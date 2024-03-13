<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { themeStore, workflowsStore } from '$lib/stores'
  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'

  const dispatch = createEventDispatcher()

  export let key: string
  export let replayed: boolean
  export let final: boolean
  export let title: string

  // Toggle the highlighted state of the function associated with this result
  const handleMouseEnter = (): void => {
    $workflowsStore.highlightedFunction = key
  }
  const handleMouseLeave = (): void => {
    $workflowsStore.highlightedFunction = null
  }
</script>

<div
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  class="{final
    ? 'sticky'
    : 'relative'} rounded-sm max-w-full min-w-48 h-auto px-2 pb-2 bg-base-100 border {$themeStore.selectedTheme ===
  'light'
    ? 'border-odd-gray-400'
    : 'border-odd-gray-500'} shadow-sm transition hover:shadow-md hover:!border-primary"
>
  <p
    class="absolute bottom-[calc(100%+1px)] right-2  px-1 {STATUS_COLOURS[
      replayed ? 'from cache' : 'success'
    ]} text-code-sm font-mono border rounded-t-sm capitalize"
  >
    {replayed ? 'from cache' : 'success'}
  </p>
  <h4
    class="relative py-2 mb-2 border-b {$themeStore.selectedTheme === 'light'
      ? 'border-odd-gray-400'
      : 'border-odd-gray-500'} text-label-m capitalize"
  >
    {title}
    {#if final}<p
        class="absolute top-1/2 right-0 -translate-y-1/2 px-1 {STATUS_COLOURS[
          'final'
        ]} text-code-sm font-mono border rounded-t-sm"
      >
        Final Output
      </p>{/if}
  </h4>
  <slot />
</div>
