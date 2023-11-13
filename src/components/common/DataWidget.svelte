<script lang="ts">
  import XIcon from '$components/icons/XIcon.svelte'
  // import { clickOutside } from '$lib/utils'

  let widgetOpen = false

  const handleOpenWidget = () => (widgetOpen = !widgetOpen)

  // I'm not going to add this yet, because I think we may want the widget to stay open as the user clicks around
  // const handleClickOutside = () => (widgetOpen = false)
</script>

{#if widgetOpen}
  <!-- use:clickOutside
on:click_outside={handleClickOutside} -->
  <div
    class="fixed right-4 bottom-24 z-50 p-4 max-w-[320px] pt-8 bg-odd-gray-0 dark:bg-base-100 border-odd-gray-400 border rounded-2xl text-body-sm"
  >
    <button class="absolute top-4 right-4" on:click={handleOpenWidget}>
      <XIcon />
    </button>
    <h4 class="mb-4 text-heading-sm">Here's a Data™ widget 👋</h4>
    <p class="mb-2 text-odd-gray-400">
      We'll eventually show some data related to running workflows here.
    </p>
  </div>
{/if}

<button
  class="toggle-trigger fixed right-4 bottom-4 z-[60] w-16 h-16 hover:opacity-[.92] transition duration-200 ease-in-out"
  on:click={handleOpenWidget}
>
  <img
    class="toggle-trigger w-full h-auto"
    src={`${window.location.origin}/star@2x.png`}
    srcset={`${window.location.origin}/star.png 1x, ${window.location.origin}/star@2x.png 2x`}
    alt="data widget"
  />
</button>
