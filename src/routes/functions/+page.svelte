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

<div
  class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
>
  <p class="text-body-sm text-odd-gray-500 w-auto">
    {functions?.length} Function{functions?.length === 1 ? '' : 's'}
  </p>

  <Search bind:searchTerm placeholder="Find a function..." />
</div>

<div
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
>
  {#each functions as func}
    <div
      class="flex flex-col border border-neutral-700 rounded-lg bg-white text-neutral-900 transition-colors hover:bg-odd-blue-100"
    >
      <a href={`/functions/${func?.id}`}>
        <div class="px-4 py-2">
          <h3>{func?.name}</h3>

          <div class="flex flex-col gap-1 ml-auto sm:self-end w-fit mt-auto">
            <div class="flex flex-row gap-4 items-center justify-center">
              <div class="flex flex-col">
                <p class="text-xs">Version</p>
                <p class="font-bold">{func?.version}</p>
              </div>
              <div class="flex flex-col">
                <p class="text-xs">Used by</p>
                <p class="font-bold">
                  {func?.numberOfProjectsUsing} workflows
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full px-4 py-2 border-t border-neutral-700 self-end text-right"
        >
          <p class="text-xs">Last published {func?.lastModifiedTime} ago</p>
        </div>
      </a>
    </div>
  {/each}
</div>
