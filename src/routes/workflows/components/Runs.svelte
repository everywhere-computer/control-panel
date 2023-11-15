<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { expoInOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'

  import { themeStore, workflowsStore } from '$lib/stores'
  import type { Run, Workflow } from '$lib/workflows/index'
  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'
  import Close from '$components/icons/Close.svelte'
  import Search from '$components/common/Search.svelte'

  export let editing: boolean
  export let runs: Run[]
  export let searchTerm: string
  export let selectedRunIndex: number
  export let sidebarOpen: boolean
  export let workflow: Workflow

  // If a new run is added to the list, make it the selectedRunIndex
  const unsubscribe = workflowsStore.subscribe(state => {
    const matchingWorkflow = state.workflows.find(w => w.id === workflow.id)
    if (runs.length && runs.length !== matchingWorkflow.runs.length) {
      selectedRunIndex = matchingWorkflow.runs.length
    }
  })

  // Close the sidebar
  const handleCloseSidebar = () => (sidebarOpen = false)

  // Set a new selectedRunIndex
  const handleRunClick = (runIndex: number): void => {
    selectedRunIndex = runIndex
    editing = false
    handleCloseSidebar()
  }

  let windowWidth = window.innerWidth
  const handleWindowResize = () => {
    windowWidth = window.innerWidth
  }

  $: activeColour =
    $themeStore.selectedTheme === 'light'
      ? 'bg-odd-teal-100'
      : 'bg-odd-teal-700'
  $: conditionalProps =
    windowWidth < 768
      ? {
          'in:fly': { y: 500, duration: 300, opacity: 0, easing: expoInOut },
          'out:fly': { y: 500, duration: 300, opacity: 0, easing: expoInOut }
        }
      : {}

  onMount(() => {
    // Inject an initial run into the list if there aren't any yet
    if (!searchTerm && !runs.length) {
      workflow.runs = [
        {
          label: 'run 1',
          name: `${workflow.payload.name}_1`,
          payload: workflow.payload,
          receipts: [],
          status: 'ready'
        }
      ]
    }
  })

  onDestroy(unsubscribe)
</script>

<svelte:window on:resize={handleWindowResize} />

<div
  {...conditionalProps}
  class="md:w-[272px] pt-4 bg-base-100 border-r {$themeStore.selectedTheme ===
  'light'
    ? 'border-odd-gray-200'
    : 'border-base-200'} {sidebarOpen
    ? 'block fixed top-0 right-0 bottom-0 left-0 z-50 w-full'
    : 'hidden'} md:block"
>
  {#if sidebarOpen}
    <div class="flex items-center justify-between w-full pt-2 px-4 pb-4">
      <h4 class="text-odd-gray-900 text-heading-lg">Select a run</h4>

      <button
        on:click={handleCloseSidebar}
        class="btn btn-odd-gray-900 flex items-center justify-center gap-1 px-0 w-8 h-8 bg-odd-gray-700 text-odd-gray-100 text-body-sm"
      >
        <Close />
      </button>
    </div>
  {/if}

  <div class="flex flex-row gap-2 bg-base-200 p-2 mx-4 rounded-sm">
    <Search bind:searchTerm placeholder="Find..." />
  </div>

  <div
    class="w-full max-h-[calc(100vh-306px)] mt-3 overflow-y-auto divide-y {$themeStore.selectedTheme ===
    'light'
      ? 'divide-odd-gray-200'
      : 'divide-base-200'}"
  >
    {#each runs as run, i}
      {@const runIndex = runs.length - i}
      <button
        on:click={() => handleRunClick(runIndex)}
        class="flex flex-row items-center justify-between w-full p-4 text-code-m font-mono capitalize duration-200 transition-colors ease-in-out hover:bg-odd-teal-100 dark:hover:bg-odd-teal-700 {selectedRunIndex ===
        runIndex
          ? activeColour
          : 'bg-transparent'}"
      >
        {run?.label}
        <span
          class="px-1 text-code-sm font-mono border {STATUS_COLOURS[
            editing && selectedRunIndex === runIndex ? 'editing' : run.status
          ]} rounded-sm capitalize"
        >
          {#if editing && selectedRunIndex === runIndex}
            editing...
          {:else}
            {run.status}{run.status === 'running' ? '...' : ''}
          {/if}
        </span>
      </button>
    {/each}
  </div>
</div>
