<script lang="ts">
  import { functionsStore, themeStore } from '$lib/stores'
  import Search from '$components/common/Search.svelte'
  import FunctionCard from '$routes/functions/components/FunctionCard.svelte'

  let searchTerm = ''
  $: functions = searchTerm
    ? $functionsStore?.functions?.filter(func =>
        func?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $functionsStore?.functions
</script>

<div class="w-full max-w-[800px] m-auto">
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
  >
    <p
      class="text-label-m {$themeStore.selectedTheme === 'light'
        ? 'text-odd-gray-700'
        : 'text-odd-gray-300'} w-auto"
    >
      {functions?.length} Function{functions?.length === 1 ? '' : 's'}
    </p>

    <Search bind:searchTerm placeholder="Find a function..." />
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each functions as func, i}
      <FunctionCard {func} index={i} />
    {/each}
  </div>
</div>
