<script lang="ts">
  import { workflowsStore } from '$src/stores'
  import Search from '$components/common/Search.svelte'
  import WorkflowCard from '$routes/workflows/components/WorkflowCard.svelte'

  let searchTerm = ''
  $: workflows = searchTerm
    ? $workflowsStore?.workflows?.filter(workflow =>
        workflow?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $workflowsStore?.workflows
</script>

<div class="w-full max-w-[800px] m-auto">
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
  >
    <p class="text-label-m text-odd-gray-700 w-auto">
      {workflows?.length} Workflow Template{workflows?.length === 1 ? '' : 's'}
    </p>

    <Search bind:searchTerm placeholder="Find a workflow..." />
  </div>
  <!-- Workflow list -->
  <div class="flex flex-col gap-4">
    {#each workflows as workflow}
      <WorkflowCard {workflow} />
    {/each}
  </div>

  <!-- <a href="/workflows/build" class="btn btn-primary fixed bottom-16 right-3">
    + Build Workflow
  </a> -->
</div>
