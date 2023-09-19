<script lang="ts">
  import { workflowsStore } from '$src/stores'
  import Shield from '$components/icons/Shield.svelte'
</script>

<h1 class="text-2xl mb-4">Workflows</h1>

<!-- Workflow list -->
<div class="flex flex-col gap-4">
  {#each $workflowsStore.workflows as workflow}
    <div
      class="flex flex-col border border-neutral-700 rounded-lg bg-white text-neutral-900 transition-colors hover:bg-orange-50"
    >
      <a href={`/workflows/${workflow.name}`}>
        <div class="flex flex-col gap-4 w-full px-4 py-2">
          <h3 class="text-lg flex flex-row gap-2 items-center">
            <span class="text-blue-500">
              <Shield />
            </span>
            <a href={`/workflows/${workflow.name}`} class="underline">
              {workflow.name}
            </a>
          </h3>

          <div class="flex flex-col gap-1 items-end sm:self-end w-fit mt-auto">
            <p class="self-start text-xxs">Last 24 hours</p>

            <div class="flex flex-row gap-4 items-center justify-center">
              <div class="flex flex-col">
                <p class="text-xs">Requests</p>
                <p class="font-bold">{workflow?.requests}</p>
              </div>
              <div class="flex flex-col">
                <p class="text-xs">Errors</p>
                <p class="font-bold">{workflow?.errors}</p>
              </div>
              <div class="flex flex-col">
                <p class="text-xs">Median CPU Time</p>
                <p class="font-bold">{workflow?.medianCPUTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="w-full px-4 py-2 border-t border-neutral-700 self-end text-right"
        >
          <p>Last modified {workflow?.lastModifiedTime} ago</p>
        </div>
      </a>
    </div>
  {/each}
</div>
