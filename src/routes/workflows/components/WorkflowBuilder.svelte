<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { expoInOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { Svelvet } from 'svelvet'

  import '$routes/workflows/components/graph/graph.css'
  import { workflowsStore } from '$lib/stores'
  import { camelCase } from '$lib/utils'
  import generateBuilderTemplate from '$lib/workflows/builder/builder-template'
  import generateFunction, {
    DEFAULT_PARAMS
  } from '$lib/workflows/builder/function-template'
  import Close from '$components/icons/Close.svelte'
  import ImageNode from '$routes/workflows/components/graph/ImageNode.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import Node from '$routes/workflows/components/graph/NewFunctionNode.svelte'
  import PlusBoxed from '$components/icons/PlusBoxed.svelte'
  import { addNotification } from '$lib/notifications'

  export let showBuilder = false

  let saving = false
  let showGraph = false
  let windowHeight = window.innerHeight
  let windowWidth = window.innerWidth

  // Window resize handler(used to update svelvet graph size)
  const handleWindowResize = () => {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth
  }

  // Close the builder and navigate to the workflows page
  const handleCloseBuilder = () => (showBuilder = false)

  // Add a workflow to the workflowsStore
  const handleSaveWorkflow = () => {
    saving = true

    // Don't allow workflows with duplicate names to be saved
    if (
      $workflowsStore.workflows.find(
        w => w.name.toLowerCase() === $workflowsStore.builder.name.toLowerCase()
      )
    ) {
      addNotification('Workflow name must be unique', 'error')
      saving = false
      return
    }

    $workflowsStore.builder.payload = {
      name: camelCase($workflowsStore.builder.name),
      workflow: {
        tasks: $workflowsStore.builder.nodes.map(
          ({ functionName, params }, i) => {
            const argKeys = Object.keys(DEFAULT_PARAMS[functionName])
            const options = {
              functionName,
              label: `${functionName}${i}`,
              args: params.reduce(
                (acc, param, k) => ({
                  ...acc,
                  [argKeys[k]]: param
                }),
                {}
              ),
              ...(i === 0
                ? {
                    base64: true,
                    data:
                      $workflowsStore.builder.payload.workflow.tasks[0].run
                        .input.args[0]
                  }
                : {
                    data: `{{needs.${
                      $workflowsStore.builder.nodes[i - 1].functionName
                    }${i - 1}.output}}`
                  })
            }

            return generateFunction(options)
          }
        )
      }
    }

    $workflowsStore.workflows.push({
      name: $workflowsStore.builder.name,
      id: crypto.randomUUID(),
      status: 'ready',
      payload: $workflowsStore.builder.payload,
      runs: [],
      savedImage: $workflowsStore.builder.savedImage
    })

    console.log('$workflowsStore', $workflowsStore)

    saving = false
  }

  // Add a new Function node to the graph
  const handleAddFunction = () => {
    const currentNumberOfNodes = $workflowsStore.builder.nodes.length
    const mostRecentNodeID =
      $workflowsStore.builder.nodes[currentNumberOfNodes - 1].id

    $workflowsStore.builder.nodes[currentNumberOfNodes - 1].connections = [
      `${Number(mostRecentNodeID) + 1}`
    ]

    $workflowsStore.builder.nodes = [
      ...$workflowsStore.builder.nodes,
      {
        functionName: 'rotate90',
        params: Object.values(DEFAULT_PARAMS['rotate90']),
        id: `${Number(mostRecentNodeID) + 1}`,
        connections: [],
        position: { x: windowWidth - 272, y: 76 }
      }
    ]
  }

  // Listen for connections between nodes
  const handleConnection = async e => {
    const sourceNodeId = e.detail.sourceNode.id.split('-')[1]
    const targetNodeId = e.detail.targetNode.id.split('-')[1]
    const targetAnchorId = e.detail.targetAnchor.id
      .replace('A-', '')
      .split('/')[0]
    $workflowsStore.builder.connections = [
      ...$workflowsStore.builder.connections,
      { sourceNodeId, targetNodeId, targetAnchorId }
    ]
  }

  $: {
    // Attach savedImage to builder for easy access
    $workflowsStore.builder.savedImage =
      $workflowsStore.builder.payload.workflow.tasks[0].run.input.args[0]

    console.log('$workflowsStore.builder', $workflowsStore.builder)
  }

  onMount(() => {
    // We need to set a brief timeout during the animate in to allow the svelvet canvas to render properly
    const timeout = setTimeout(() => {
      showGraph = true
      clearTimeout(timeout)
    }, 350)
  })

  onDestroy(() => {
    // Clear the builder state when the builder screen closes
    workflowsStore.update(store => ({
      ...store,
      // @ts-ignore
      builder: generateBuilderTemplate()
    }))
  })
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

        <!-- Disable save button unless an image has been uploaded -->
        <button
          on:click={handleSaveWorkflow}
          disabled={saving}
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
    {#if showGraph}
      <Svelvet
        width={windowWidth}
        height={windowHeight - 120}
        zoom={1}
        disableSelection
      >
        <ImageNode
          id="0"
          connections={['1']}
          position={{ x: 37, y: 26 }}
          bind:uploadedImage={$workflowsStore.builder.payload.workflow.tasks[0]
            .run.input.args[0]}
        />
        {#each $workflowsStore.builder.nodes as { functionName, position, ...rest }, nodeIndex}
          <Node bind:functionName bind:position {nodeIndex} {...rest} />
        {/each}
      </Svelvet>
    {:else}
      <div
        class="flex items-center justify-center w-full bg-base-100"
        style="height: {windowHeight - 120}px"
      >
        <LoadingSpinner />
      </div>
    {/if}
    <!-- <Node id="2" connections={['3']} position={{ x: 189, y: 26 }} /> -->
    <!-- <Node id="3" position={{ x: 600, y: 26 }} /> -->
    <!-- <Node id="3" position={{ x: 485, y: 26 }} /> -->
  </div>
</div>
