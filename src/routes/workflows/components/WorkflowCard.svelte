<script lang="ts">
  import { fly } from 'svelte/transition'

  import { themeStore } from '$lib/stores'
  import { timeSinceNow } from '$lib/utils'
  import type { Workflow } from '$lib/workflows'
  import Workflows from '$components/icons/Workflows.svelte'

  export let index: number
  export let workflow: Workflow
</script>

<div
  in:fly={{
    y: 20,
    duration: 200,
    delay: index === 0 ? 0 : 20 * index,
    opacity: 0
  }}
  class="flex flex-col bg-base-100 text-odd-gray-700 border {$themeStore.selectedTheme ===
  'light'
    ? 'border-odd-gray-50'
    : 'border-odd-gray-500'} transition-colors hover:border-primary rounded-sm"
>
  <a href={`/workflows/${workflow?.id}`}>
    <div class="flex flex-col gap-4 w-full p-4">
      <h3 class="text-heading-sm text-odd-purple-500">
        {workflow?.name}
      </h3>

      <div class="flex flex-col items-center text-body-sm w-full mt-auto">
        <div
          class="flex flex-row items-center justify-between md:justify-start w-full"
        >
          <p
            class="md:w-full md:max-w-[156px] text-label-m {$themeStore.selectedTheme ===
            'light'
              ? 'text-odd-gray-500'
              : 'text-odd-gray-300'}"
          >
            Runs
          </p>
          <p class="min-w-[10px] text-center text-body-m text-base-content">
            {workflow?.runs?.length
              ? workflow?.runs.filter(
                  w => w.status === 'completed' || w.status === 'from cache'
                )?.length
              : 0}
          </p>
        </div>
        <div
          class="flex flex-row items-center justify-between md:justify-start w-full"
        >
          <p
            class="md:w-full md:max-w-[156px] text-label-m {$themeStore.selectedTheme ===
            'light'
              ? 'text-odd-gray-500'
              : 'text-odd-gray-300'}"
          >
            Errors
          </p>
          <p class="min-w-[10px] text-center text-body-m text-base-content">
            {workflow?.runs?.length
              ? workflow?.runs.filter(w => w.status === 'failed')?.length
              : 0}
          </p>
        </div>
        <!-- <div class="flex flex-row items-center justify-between md:justify-start w-full">
          <p class="md:w-full md:max-w-[156px] text-label-m text-odd-gray-500">Median CPU Time</p>
          <p class="text-body-m">{workflow?.medianCPUTime}</p>
        </div> -->
      </div>
    </div>

    <div
      class="flex flex-row items-center gap-2 w-full px-4 py-3 {$themeStore.selectedTheme ===
      'light'
        ? 'bg-base-300'
        : 'bg-base-200'} text-odd-gray-500 rounded-b-sm"
    >
      <Workflows />
      <p class="text-label-m">
        {#if timeSinceNow(workflow.lastRunTime)}
          Last run: {timeSinceNow(workflow.lastRunTime)}
        {:else}
          Last run: none yet
        {/if}
      </p>
    </div>
  </a>
</div>
