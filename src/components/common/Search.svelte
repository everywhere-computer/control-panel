<script lang="ts">
  import Search from '$components/icons/Search.svelte'
  import { themeStore } from '$lib/stores'

  export let searchTerm: string = ''
  export let placeholder: string = ''

  const handleClearSearch = () => (searchTerm = '')
</script>

<div class="flex flex-row relative w-full sm:max-w-[343px]">
  <div class="absolute z-10 top-1/2 left-4 -translate-y-1/2">
    <Search />
  </div>
  <input
    type="text"
    {placeholder}
    class="input border focus:outline-[#50F1C9] bg-base-100 text-input-m {$themeStore.selectedTheme ===
    'light'
      ? 'text-odd-gray-500 placeholder-odd-gray-500 border-odd-gray-200'
      : 'text-odd-gray-300 placeholder-odd-gray-300 border-base-300'} w-full h-8 pl-10 relative z-0 rounded-full"
    bind:value={searchTerm}
    on:keydown={event => {
      if (event.key === 'Escape') {
        handleClearSearch()
      }
    }}
  />
  <!-- <button
      on:click={handleClearSearch}
      class="absolute z-10 top-1/2 right-4 -translate-y-1/2 font-bold"
    >
      x
    </button> -->
</div>
