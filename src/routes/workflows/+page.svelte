<script lang="ts">
  import { workflowsStore } from '$src/stores'
  import Workflows from '$components/icons/Workflows.svelte'

  let searchTerm = ''
  $: workflows = searchTerm
    ? $workflowsStore?.workflows?.filter(workflow =>
        workflow?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $workflowsStore?.workflows

  const handleClearSearch = () => (searchTerm = '')
</script>

<div class="flex flex-row justify-end w-full mb-4 relative">
  <input
    type="text"
    placeholder="Search workflows"
    class="input border border-gray-500 rounded-full w-full sm:max-w-xs pr-8 relative z-0"
    bind:value={searchTerm}
    on:keydown={event => {
      if (event.key === 'Escape') {
        handleClearSearch()
      }
    }}
  />
  <button
    on:click={handleClearSearch}
    class="absolute z-10 top-1/2 right-4 -translate-y-1/2 font-fold"
  >
    x
  </button>
</div>

<!-- Workflow list -->
<div class="flex flex-col gap-4">
  {#each workflows as workflow}
    <div
      class="flex flex-col border border-neutral-700 rounded-lg bg-white text-neutral-900 transition-colors hover:bg-odd-blue-100"
    >
      <a href={`/workflows/${workflow?.id}`}>
        <div class="flex flex-col gap-4 w-full px-4 py-2">
          <h3
            class="text-heading-sm sm:text-heading-m flex flex-row gap-2 items-center"
          >
            <span class="text-odd-blue-500">
              <Workflows />
            </span>
            <a href={`/workflows/${workflow?.id}`} class="underline">
              {workflow?.name}
            </a>
          </h3>

          <div class="flex flex-col gap-1 items-end sm:self-end w-fit mt-auto">
            <p class="self-start text-xxs">Last 24 hours</p>

            <div class="flex flex-row gap-4 items-center justify-center">
              <div class="flex flex-col">
                <p class="text-body-xs sm:text-body-sm">Requests</p>
                <p class="font-bold">{workflow?.requests}</p>
              </div>
              <div class="flex flex-col">
                <p class="text-body-xs sm:text-body-sm">Errors</p>
                <p class="font-bold">{workflow?.errors}</p>
              </div>
              <div class="flex flex-col">
                <p class="text-body-xs sm:text-body-sm">Median CPU Time</p>
                <p class="font-bold">{workflow?.medianCPUTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-full px-4 py-2 border-t border-neutral-700 self-end text-right"
        >
          <p class="text-body-sm">
            Last modified {workflow?.lastModifiedTime} ago
          </p>
        </div>
      </a>
    </div>
  {/each}
</div>

<a href="/workflows/build" class="btn btn-primary fixed bottom-16 right-3">
  + Build Workflow
</a>
