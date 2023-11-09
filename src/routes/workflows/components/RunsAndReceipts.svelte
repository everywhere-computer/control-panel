<script lang="ts">
  import { onMount } from 'svelte'
  import { Svelvet } from 'svelvet'

  import '$routes/workflows/components/graph/graph.css'
  import { FUNCTION_NODE_SIZES } from '$routes/workflows/lib/graph'
  import Actions from '$routes/workflows/components/graph/Actions.svelte'
  import ImageNode from '$routes/workflows/components/graph/ImageNode.svelte'
  import Node from '$routes/workflows/components/graph/Node.svelte'
  import Runs from '$routes/workflows/components/Runs.svelte'

  export let workflow

  $: editing = false
  $: selectedRunIndex = 1
  $: selectedRun = workflow?.runs?.find(
    r => Number(r?.label?.split('run ')[1]) === selectedRunIndex
  )
  $: sidebarOpen = false
  $: uploadedImage = null

  let columnWidth = 272
  let windowHeight = window.innerHeight
  let windowWidth = window.innerWidth
  let graphWidth = windowWidth < 768 ? windowWidth : windowWidth - columnWidth

  const handleWindowResize = () => {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth

    graphWidth = windowWidth < 768 ? windowWidth : windowWidth - columnWidth

    if (windowWidth > 768) {
      sidebarOpen = false
    }
  }

  const getTasks = async () => {}

  let searchTerm = ''
  $: runs = searchTerm
    ? workflow?.runs?.filter(run =>
        run?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : workflow?.runs

  $: {
    // console.log('workflow', workflow)
    console.log('selectedRun', selectedRun)
    // console.log('graphWidth', graphWidth)
  }

  // onMount(async () => {
  //   await getTasks()
  // })
</script>

<svelte:window on:resize={handleWindowResize} />

<div class="flex flex-row w-full px-4 md:px-0 bg-base-200 md:bg-base-100">
  <div class="w-[{columnWidth}px] md:border-r border-odd-gray-200">
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
    class="w-full w-[calc(100vw-{columnWidth}px)] border-odd-gray-400 border md:border-0 rounded-sm md:rounded-none"
    bind:offsetWidth={graphWidth}
  >
    <Actions
      bind:selectedRun
      bind:selectedRunIndex
      bind:sidebarOpen
      bind:editing
      bind:uploadedImage
      bind:workflow
    />

    <Svelvet
      width={graphWidth}
      height={windowHeight - 230}
      zoom={1}
      disableSelection
    >
      <ImageNode
        id="0"
        connections={['1']}
        position={{ x: 34, y: 90 }}
        bind:uploadedImage
      />

      {@const tasks =
        selectedRun?.payload?.workflow.tasks || workflow.payload.workflow.tasks}
      {#each tasks as task, i}
        <Node
          id={`${i + 1}`}
          connections={[`${i + 2}`]}
          name={task.run.input.func}
          args={task.run.input.args}
          position={{ x: i === 0 ? 186 : (i + 1) * 361 - 170, y: 90 }}
          previousNode={{
            status: selectedRun?.status
              ? selectedRun?.status
              : workflow?.status === 'running'
              ? 'running'
              : selectedRun?.receipts?.length
              ? selectedRun.receipts[i - 1]?.status
              : 'ready'
          }}
          status={selectedRun && selectedRun?.receipts?.length
            ? selectedRun.receipts[i]?.status
            : workflow?.status === 'running'
            ? 'running'
            : 'ready'}
          receipt={selectedRun?.receipts[i]}
          {selectedRun}
          {editing}
        />
        <!-- status={selectedRun?.status
            ? selectedRun?.status
            : workflow?.status === 'running'
            ? 'running'
            : selectedRun?.receipts?.length
            ? selectedRun.receipts[i]?.status
            : 'ready'} -->
      {/each}
    </Svelvet>
  </div>
</div>
