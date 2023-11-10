<script lang="ts">
  import type { Workflow } from '$lib/workflows'
  import Workflows from '$components/icons/Workflows.svelte'

  export let workflow: Workflow
</script>

<div
  class="flex flex-col bg-base-100 text-odd-gray-700 border border-odd-gray-50 transition-colors hover:border-primary rounded-sm"
>
  <a href={`/workflows/${workflow?.id}`}>
    <div class="flex flex-col gap-4 w-full p-4">
      <h3 class="text-heading-sm text-odd-purple-500">
        {workflow?.name}
      </h3>

      <div class="flex flex-col items-center text-body-sm w-full mt-auto">
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-label-m text-odd-gray-500">Runs</p>
          <p class="text-body-m">{workflow?.runs?.length}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-label-m text-odd-gray-500">Errors</p>
          <p class="text-body-m">
            {workflow?.runs?.length
              ? workflow?.runs.filter(w => w.status === 'failed')?.length
              : 0}
          </p>
        </div>
        <!-- <div class="flex flex-row items-center justify-between w-full">
          <p class="text-label-m text-odd-gray-500">Median CPU Time</p>
          <p class="text-body-m">{workflow?.medianCPUTime}</p>
        </div> -->
      </div>
    </div>

    <div
      class="flex flex-row items-center gap-2 w-full px-4 py-3 bg-odd-gray-150 rounded-b-sm"
    >
      <Workflows />
      <p class="text-label-m">
        Last run {workflow?.lastModifiedTime} ago
      </p>
    </div>
  </a>
</div>
