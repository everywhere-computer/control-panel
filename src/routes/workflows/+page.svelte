<script lang="ts">
  import { workflowsStore } from '$lib/stores'
  import Search from '$components/common/Search.svelte'
  import WorkflowBuilder from '$routes/workflows/components/WorkflowBuilder.svelte'
  import WorkflowCard from '$routes/workflows/components/WorkflowCard.svelte'

  let searchTerm = ''
  $: workflows = searchTerm
    ? $workflowsStore?.workflows?.filter(workflow =>
        workflow?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $workflowsStore?.workflows
  $: showBuilder = false

  const handleShowBuilder = () => (showBuilder = true)
</script>

<div class="w-full max-w-[800px] m-auto">
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
  >
    <p class="text-label-m text-odd-gray-700 w-auto">
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
  <!-- Workflow list -->
  <div class="flex flex-col gap-4">
    {#each workflows as workflow, i}
      <WorkflowCard {workflow} index={i} />
    {/each}
  </div>

  <!-- <a href="/workflows/build" class="btn btn-primary fixed bottom-16 right-3">
    + Build Workflow
  </a> -->
</div>

{#if showBuilder}
  <WorkflowBuilder bind:showBuilder />
{/if}
