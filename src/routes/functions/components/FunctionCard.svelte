<script lang="ts">
  import { fly } from 'svelte/transition'

  import type { Func } from '$lib/functions'
  import { themeStore, workflowsStore } from '$lib/stores'

  export let func: Func
  export let index: number

  $: workflowsUsedBy = $workflowsStore.workflows.filter(w =>
    w.payload.workflow.tasks.find(t =>
      // @ts-ignore-next-line
      t.run.input.func.includes(func.name.toLowerCase())
    )
  )?.length
</script>

<div
  in:fly={{
    y: 20,
    duration: 200,
    delay: index === 0 ? 0 : 20 * index,
    opacity: 0
  }}
  class="flex flex-col bg-base-100 text-odd-gray-700 border border-transparent transition-colors hover:border-primary rounded-sm"
>
  <a href={`/functions/${func?.id}`}>
    <div class="p-6">
      <h3 class="mb-4 text-heading-sm text-odd-purple-500">{func?.name}</h3>

      <div class="flex flex-col items-center text-body-sm w-full mt-auto">
        <div class="flex flex-row items-center justify-between w-full">
          <p
            class="{$themeStore.selectedTheme === 'light'
              ? 'text-odd-gray-500'
              : 'text-odd-gray-300'} text-label-m"
          >
            Version
          </p>
          <p class="text-body-m text-base-content">{func?.version}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p
            class="{$themeStore.selectedTheme === 'light'
              ? 'text-odd-gray-500'
              : 'text-odd-gray-300'} text-label-m"
          >
            Used by
          </p>
          <p class="text-body-m text-base-content">
            {workflowsUsedBy} workflows
          </p>
        </div>
        <!-- <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-500 text-label-m">Last published</p>
          <p class="text-body-m">{func?.lastModifiedTime}</p>
        </div> -->
      </div>
    </div>
  </a>
</div>
