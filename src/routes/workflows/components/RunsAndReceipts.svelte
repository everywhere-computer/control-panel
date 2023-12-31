<script lang="ts">
  import { onMount } from 'svelte'
  import { Svelvet } from 'svelvet'

  import '$routes/workflows/components/graph/graph.css'
  import { themeStore } from '$lib/stores'
  import Actions from '$routes/workflows/components/graph/Actions.svelte'
  import ImageModal from '$routes/workflows/components/graph/ImageModal.svelte'
  import ImageNode from '$routes/workflows/components/graph/ImageNode.svelte'
  import Node from '$routes/workflows/components/graph/Node.svelte'
  import Runs from '$routes/workflows/components/Runs.svelte'
  import WorkflowDetail from '$routes/workflows/components/WorkflowDetail.svelte'

  export let workflow

  $: editing = false
  $: imageBitmap = null
  $: imageModalOpen = false
  $: selectedRunIndex = 1
  $: selectedRun = workflow?.runs?.find(
    r => Number(r?.label?.split('run ')[1]) === selectedRunIndex
  )
  $: sidebarOpen = false
  $: tasks =
    selectedRun?.payload?.workflow.tasks || workflow.payload.workflow.tasks

  let columnWidth = 272
  let windowHeight = window.innerHeight
  let windowWidth = window.innerWidth
  let graphWidth = windowWidth < 768 ? windowWidth : windowWidth - columnWidth

  // Listen for window resize and update graph dimensions
  const handleWindowResize = () => {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth

    graphWidth = windowWidth < 768 ? windowWidth : windowWidth - columnWidth

    if (windowWidth > 768) {
      sidebarOpen = false
    }
  }

  // Delete the image and close the modal
  const handleDeleteImage = () => {
    workflow.savedImage = null
    imageBitmap = null
    imageModalOpen = false
  }

  let searchTerm = ''
  $: runs = searchTerm
    ? workflow?.runs?.filter(run =>
        run?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : workflow?.runs

  onMount(() => {
    // Set the selected run to the most recent run on page load
    selectedRunIndex =
      workflow.runs.length > 0 ? workflow.runs.length : selectedRunIndex
  })
</script>

<svelte:window on:resize={handleWindowResize} />

<!-- <WorkflowDetail workflowRun={selectedRun} uploadedImage={workflow.savedImage} /> -->

<div class="flex flex-row w-full px-4 md:px-0 bg-base-200 md:bg-base-100">
  <div
    class="w-[{columnWidth}px] md:border-r {$themeStore.selectedTheme ===
    'light'
      ? 'border-odd-gray-200'
      : 'border-base-200'}"
  >
    <Runs
      bind:editing
      bind:runs
      bind:searchTerm
      bind:selectedRunIndex
      bind:sidebarOpen
      bind:workflow
    />
  </div>

  <div
    class="w-full w-[calc(100vw-{columnWidth}px)] {$themeStore.selectedTheme ===
    'light'
      ? 'border-odd-gray-400'
      : 'border-base-200'} border md:border-0 rounded-sm md:rounded-none"
    bind:offsetWidth={graphWidth}
  >
    <Actions
      bind:selectedRun
      bind:selectedRunIndex
      bind:sidebarOpen
      bind:editing
      bind:uploadedImage={workflow.savedImage}
      bind:workflow
    />

    <Svelvet
      width={graphWidth}
      height={windowHeight - 230}
      zoom={tasks?.length > 3 ? 0.95 : 1}
      disableSelection
    >
      <ImageNode
        id="0"
        connections={['1']}
        position={{ x: 34, y: 90 }}
        bind:imageBitmap
        bind:imageModalOpen
        bind:uploadedImage={workflow.savedImage}
      />

      {#each tasks as task, i}
        <Node
          id={`${i + 1}`}
          connections={[`${i + 2}`]}
          name={task.run.input.func}
          args={task.run.input.args}
          position={{ x: i === 0 ? 186 : (i + 1) * 361 - 170, y: 90 }}
          previousNode={{
            status:
              selectedRun && !!selectedRun?.receipts[i - 1]
                ? selectedRun?.receipts[i - 1]?.status
                : selectedRun?.status
                ? selectedRun?.status
                : workflow?.status === 'running'
                ? 'running'
                : selectedRun?.receipts?.length
                ? selectedRun.receipts[i - 1]?.status
                : 'ready'
          }}
          status={selectedRun &&
          selectedRun?.receipts?.length &&
          !!selectedRun.receipts[i]?.status
            ? selectedRun.receipts[i]?.status
            : workflow?.status === 'running'
            ? 'running'
            : 'ready'}
          bind:imageBitmap
          receipt={selectedRun?.receipts[i]}
          {selectedRun}
          {editing}
        />
      {/each}
    </Svelvet>
  </div>
</div>

<input
  type="checkbox"
  id="image-modal"
  checked={imageModalOpen}
  class="modal-toggle"
/>

{#if imageModalOpen}
  <ImageModal
    bind:imageModalOpen
    imageSrc={workflow.savedImage}
    {handleDeleteImage}
  />
{/if}
