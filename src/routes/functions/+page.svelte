<script lang="ts">
  import { functionsStore } from '$src/stores'
  import Search from '$components/common/Search.svelte'

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
    <p class="text-body-sm text-odd-gray-500 w-auto">
      {functions?.length} Function{functions?.length === 1 ? '' : 's'}
    </p>

    <Search bind:searchTerm placeholder="Find a function..." />
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
    {#each functions as func}
      <div
        class="flex flex-col border border-neutral-700 bg-odd-gray-0 text-odd-gray-500 transition-colors hover:bg-odd-blue-100"
      >
        <a href={`/functions/${func?.id}`}>
          <div class="p-6">
            <h3 class="mb-4 font-semibold text-heading-m">{func?.name}</h3>

            <div class="flex flex-col items-center text-body-sm w-full mt-auto">
              <div class="flex flex-row items-center justify-between w-full">
                <p class="text-odd-gray-300 font-[550]">Version</p>
                <p>{func?.version}</p>
              </div>
              <div class="flex flex-row items-center justify-between w-full">
                <p class="text-odd-gray-300 font-[550]">Used by</p>
                <p>{func?.numberOfProjectsUsing} workflows</p>
              </div>
              <div class="flex flex-row items-center justify-between w-full">
                <p class="text-odd-gray-300 font-[550]">Last published</p>
                <p>{func?.lastModifiedTime}</p>
              </div>
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</div>
