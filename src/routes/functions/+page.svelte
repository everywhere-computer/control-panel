<script lang="ts">
  import { onMount } from 'svelte'

  import { functionsStore, themeStore } from '$lib/stores'
  import Search from '$components/common/Search.svelte'
  import FunctionCard from '$routes/functions/components/FunctionCard.svelte'

  let uploadSchemas = []
  let searchTerm = ''

  // $: functions = searchTerm
  //   ? $functionsStore?.functions?.filter(func =>
  //       func?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  //     )
  //   : $functionsStore?.functions
  $: schemas = searchTerm
    ? uploadSchemas.filter(schema =>
        schema?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : uploadSchemas

  onMount(async () => {
    try {
      const res = await (
        await fetch(import.meta.env.VITE_GATEWAY_ENDPOINT)
      ).json()

      // Map schema for each task
      uploadSchemas = res.map((schema, i) => ({
        properties: {},
        ...schema[1],
        id: `${schema[0]}_${i}`,
        name: schema[0],
        version: '0.0.1'
      }))
    } catch (error) {
      console.error(error)
    }
  })
</script>

<div class="w-full max-w-[800px] m-auto">
  {#if schemas}
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
    >
      <p
        class="text-label-m {$themeStore.selectedTheme === 'light'
          ? 'text-odd-gray-700'
          : 'text-odd-gray-300'} w-auto"
      >
        {schemas?.length} Function{schemas?.length === 1 ? '' : 's'}
      </p>

      <Search bind:searchTerm placeholder="Find a function..." />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each schemas as schema, i}
        <FunctionCard func={schema} index={i} />
      {/each}
    </div>
  {/if}
</div>
