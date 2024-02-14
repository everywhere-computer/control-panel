<script lang="ts">
  import { themeStore, workflowsStore } from '$lib/stores'
  // import Search from '$components/common/Search.svelte'
  // import WorkflowCard from '$routes/workflows/components/WorkflowCard.svelte'
  import CustomFunction from '$routes/workflows/components/CustomFunction.svelte'

  let searchTerm = ''
  $: workflows = searchTerm
    ? $workflowsStore?.workflows?.filter(workflow =>
        workflow?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $workflowsStore?.workflows

  const handleShowBuilder = () => ($workflowsStore.showBuilder = true)
</script>

<CustomFunction />

<!-- <div class="w-full max-w-[800px] m-auto">
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
  >
    <p
      class="text-label-m {$themeStore.selectedTheme === 'light'
        ? 'text-odd-gray-700'
        : 'text-odd-gray-300'} w-auto"
    >
      {workflows?.length} Workflow Template{workflows?.length === 1 ? '' : 's'}
    </p>

    <div class="flex flex-col sm:flex-row items-center gap-4">
      <Search bind:searchTerm placeholder="Find a workflow..." />

      <button
        on:click={handleShowBuilder}
        class="btn btn-primary btn-odd-purple-500 h-8 text-label-m"
      >
        + New Workflow
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-4">
    {#each workflows as workflow, i}
      <WorkflowCard {workflow} index={i} />
    {/each}
  </div>
</div> -->
