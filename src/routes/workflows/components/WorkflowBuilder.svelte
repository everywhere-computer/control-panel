<script lang="ts">
  // import { goto } from '$app/navigation'
  import { expoInOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { Svelvet } from 'svelvet'

  import '$routes/workflows/components/graph/graph.css'
  import { workflowsStore } from '$lib/stores'
  import Close from '$components/icons/Close.svelte'
  import ImageNode from '$routes/workflows/components/graph/ImageNode.svelte'
  import Node from '$routes/workflows/components/graph/NewFunctionNode.svelte'
  import PlusBoxed from '$components/icons/PlusBoxed.svelte'

  export let showBuilder = false

  let windowHeight = window.innerHeight
  let windowWidth = window.innerWidth

  const handleWindowResize = () => {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth
  }

  // Close the builder and navigate to the workflows page
  const handleCloseBuilder = () => {
    // goto('/workflows')
    showBuilder = false
  }

  const handleSaveWorkflow = () => {}

  const handleAddFunction = () => {}

  const handleConnection = async e => {
    let sourceNodeId = e.detail.sourceNode.id.split('-')[1]
    let targetNodeId = e.detail.targetNode.id.split('-')[1]
    let targetAnchorId = e.detail.targetAnchor.id
      .replace('A-', '')
      .split('/')[0]
    $workflowsStore.builder.connections = [
      ...$workflowsStore.builder.connections,
      { sourceNodeId, targetNodeId, targetAnchorId }
    ]

    console.log(
      'Triggered connection event, props stored to $connections: ',
      $workflowsStore.builder.connections
    )
  }

  $: {
    console.log('$workflowsStore.builder', $workflowsStore.builder)
  }
</script>

<svelte:window on:resize={handleWindowResize} />

<div
  in:fly={{ y: 500, duration: 300, opacity: 0, easing: expoInOut }}
  out:fly={{ y: 500, duration: 300, opacity: 0, easing: expoInOut }}
  class="fixed top-0 right-0 bottom-0 left-0 z-10 w-screen h-screen"
>
  <div
    class="flex flex-col gap-4 w-full p-4 bg-odd-gray-50 border-b border-base-200"
  >
    <div class="flex flex-row items-center justify-between w-full">
      <h1 class="text-heading-lg">Workflow Builder</h1>

      <button
        on:click={handleCloseBuilder}
        class="btn btn-odd-gray-900 flex items-center justify-center gap-1 px-0 w-8 h-8 bg-odd-gray-700 text-odd-gray-100 text-body-sm"
      >
        <Close />
      </button>
    </div>

    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"
    >
      <input
        class="w-full md:max-w-[325px] h-10 px-3 bg-base-100 border border-odd-gray-400 rounded-sm text-input-lg text-base-content placeholder:text-base-content"
        type="text"
        required
        placeholder="Workflow name..."
        bind:value={$workflowsStore.builder.name}
      />

      <div
        class="flex flex-row items-center justify-end md:justify-between gap-3"
      >
        <button
          on:click={handleCloseBuilder}
          class="btn btn-odd-gray-100 h-10 !text-label-l"
        >
          Cancel
        </button>

        <button
          on:click={handleSaveWorkflow}
          class="btn btn-primary btn-odd-purple-500 w-[85px] h-10 !text-label-l"
        >
          Save
        </button>
      </div>
    </div>
  </div>

  <div class="relative">
    <button
      on:click={handleAddFunction}
      class="absolute top-[25px] right-4 z-[60] btn btn-odd-gray-100 h-8 px-2 !text-label-m"
    >
      <PlusBoxed />Add a function
    </button>

    <Svelvet
      width={windowWidth}
      height={windowHeight - 120}
      zoom={1}
      disableSelection
      on:connection={handleConnection}
    >
      <ImageNode
        id="0"
        connections={['1']}
        position={{ x: 37, y: 26 }}
        bind:uploadedImage={$workflowsStore.builder.payload.workflow.tasks[0]
          .run.input.args[0]}
      />
      {#each $workflowsStore.builder.nodes as { functionName, position, ...rest }}
        <Node bind:functionName bind:position {...rest} />
      {/each}
      <!-- <Node id="2" connections={['3']} position={{ x: 189, y: 26 }} /> -->
      <!-- <Node id="3" position={{ x: 600, y: 26 }} /> -->
      <!-- <Node id="3" position={{ x: 485, y: 26 }} /> -->
    </Svelvet>
  </div>
</div>
