<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { themeStore } from '$lib/stores'
  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'

  const dispatch = createEventDispatcher()

  export let key: string
  export let replayed: boolean
  export let title: string

  const handleMouseEnter = (): void => {
    dispatch('mouseEnterResult', key)
  }
</script>

<div
  on:mouseenter={handleMouseEnter}
  class="relative rounded-sm max-w-full min-w-48 h-auto px-2 pb-2 bg-base-100 border {$themeStore.selectedTheme ===
  'light'
    ? 'border-odd-gray-400'
    : 'border-odd-gray-500'} shadow-sm"
>
  <p
    class="absolute bottom-[calc(100%+1px)] right-1  px-1 {STATUS_COLOURS[
      replayed ? 'from cache' : 'success'
    ]} text-code-sm font-mono border rounded-t-sm capitalize"
  >
    {replayed ? 'from cache' : 'success'}
  </p>
  <h4
    class="py-2 mb-2 border-b {$themeStore.selectedTheme === 'light'
      ? 'border-odd-gray-400'
      : 'border-odd-gray-500'} text-label-m capitalize"
  >
    {title}
  </h4>
  <slot />
</div>
