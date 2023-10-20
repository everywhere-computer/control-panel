<script lang="ts">
  import type { Workflow } from '$lib/workflows'
  import Workflows from '$components/icons/Workflows.svelte'

  export let workflow: Workflow
</script>

<div
  class="flex flex-col bg-odd-gray-0 text-odd-gray-500 transition-colors hover:bg-odd-blue-100"
>
  <a href={`/workflows/${workflow?.id}`}>
    <div class="flex flex-col gap-4 w-full p-4">
      <h3 class="font-semibold text-heading-m">
        {workflow?.name}
      </h3>

      <div class="flex flex-col items-center text-body-sm w-full mt-auto">
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-300 font-[550]">Requests</p>
          <p>{workflow?.requests}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-300 font-[550]">Errors</p>
          <p>{workflow?.errors}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-300 font-[550]">Median CPU Time</p>
          <p>{workflow?.medianCPUTime}</p>
        </div>
      </div>
    </div>

    <div
      class="flex flex-row items-center gap-2 w-full px-4 py-3 bg-odd-gray-150 border-t border-neutral-700"
    >
      <Workflows />
      <p class="text-body-sm">
        Last run {workflow?.lastModifiedTime} ago
      </p>
    </div>
  </a>
</div>
