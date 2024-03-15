<script lang="ts">
  import { fly } from 'svelte/transition'

  import type { Func } from '$lib/functions'
  import { themeStore, workflowsStore } from '$lib/stores'

  export let func: Func
  export let index: number

  const handleAddFunctionToWorkflow = () => {}

  //   $: workflowsUsedBy = $workflowsStore.workflows.filter(w =>
  //     w.payload.workflow.tasks.find(t =>
  //       // @ts-ignore-next-line
  //       t.run.input.func.includes(func.name.toLowerCase())
  //     )
  //   )?.length
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
  <!-- <a href={`/functions/${func?.id}`}> -->
  <div class="relative p-6">
    <!-- <div class="absolute top-2 right-4 dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-glass gap-1 h-8 px-2 !bg-transparent shadow-none"
      >
        <span class="w-1 h-1 bg-base-content rounded-full" />
        <span class="w-1 h-1 bg-base-content rounded-full" />
        <span class="w-1 h-1 bg-base-content rounded-full" />
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 max-w-[190px] shadow bg-base-100 rounded-box w-60"
      >
        <li>
          <button
            on:click={handleAddFunctionToWorkflow}
            class="w-full text-body-xs"
          >
            Add function to workflow
          </button>
        </li>
      </ul>
    </div> -->

    <h3 class="mb-4 text-heading-sm text-odd-purple-500 capitalize">
      {func?.name}
    </h3>

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
      <!-- <div class="flex flex-row items-center justify-between w-full">
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
        </div> -->
      <!-- <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-500 text-label-m">Last published</p>
          <p class="text-body-m">{func?.lastModifiedTime}</p>
        </div> -->
    </div>
  </div>
  <!-- </a> -->
</div>
