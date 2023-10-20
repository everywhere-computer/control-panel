<script lang="ts">
  import { workflowsStore } from '$src/stores'
  import Search from '$components/common/Search.svelte'
  import Workflows from '$components/icons/Workflows.svelte'

  let searchTerm = ''
  $: workflows = searchTerm
    ? $workflowsStore?.workflows?.filter(workflow =>
        workflow?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $workflowsStore?.workflows
</script>

<div
  class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full"
>
  <p class="text-body-sm text-odd-gray-500 w-auto">
    {workflows?.length} Workflow Template{workflows?.length === 1 ? '' : 's'}
  </p>

  <Search bind:searchTerm placeholder="Find a workflow..." />
</div>
<!-- Workflow list -->
<div class="flex flex-col gap-4">
  {#each workflows as workflow}
    <div
      class="flex flex-col bg-odd-gray-0 text-odd-gray-500 transition-colors hover:bg-odd-blue-100"
    >
      <a href={`/workflows/${workflow?.id}`}>
        <div class="flex flex-col gap-4 w-full px-4 py-2">
          <h3 class="text-heading-m flex flex-row gap-2 items-center">
            <a href={`/workflows/${workflow?.id}`} class="underline">
              {workflow?.name}
            </a>
          </h3>

          <div class="flex flex-col items-center text-body-sm w-full mt-auto">
            <div class="flex flex-row items-center justify-between w-full">
              <p class="text-odd-gray-300">Requests</p>
              <p class="">{workflow?.requests}</p>
            </div>
            <div class="flex flex-row items-center justify-between w-full">
              <p class="text-odd-gray-300">Errors</p>
              <p class="">{workflow?.errors}</p>
            </div>
            <div class="flex flex-row items-center justify-between w-full">
              <p class="text-odd-gray-300">Median CPU Time</p>
              <p class="">{workflow?.medianCPUTime}</p>
            </div>
          </div>
        </div>

        <div
          class="flex flex-row items-center gap-2 w-full px-4 py-2 bg-odd-gray-150 border-t border-neutral-700"
        >
          <Workflows />
          <p class="text-body-sm">
            Last run {workflow?.lastModifiedTime} ago
          </p>
        </div>
      </a>
    </div>
  {/each}
</div>

<a href="/workflows/build" class="btn btn-primary fixed bottom-16 right-3">
  + Build Workflow
</a>
