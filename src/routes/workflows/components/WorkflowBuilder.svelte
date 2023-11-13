<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { expoInOut } from 'svelte/easing'
  import { fly } from 'svelte/transition'
  import { Svelvet } from 'svelvet'

  import '$routes/workflows/components/graph/graph.css'
  import { themeStore, workflowsStore } from '$lib/stores'
  import { camelCase } from '$lib/utils'
  import { addNotification } from '$lib/notifications'
  import generateBuilderTemplate from '$lib/workflows/builder/builder-template'
  import generateFunction, {
    DEFAULT_PARAMS
  } from '$lib/workflows/builder/function-template'
  import { CROP_PARAMS } from '$routes/workflows/lib/graph'
  import Close from '$components/icons/Close.svelte'
  import ImageNode from '$routes/workflows/components/graph/ImageNode.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import Node from '$routes/workflows/components/graph/NewFunctionNode.svelte'
  import PlusBoxed from '$components/icons/PlusBoxed.svelte'

  export let showBuilder = false

  $: imageBitmap = null

  let imageModalOpen = false
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

    try {
      // Don't allow workflows with duplicate names to be saved
      if (
        $workflowsStore.workflows.find(
          w =>
            w.name.toLowerCase() === $workflowsStore.builder.name.toLowerCase()
        )
      ) {
        addNotification('Workflow name must be unique', 'error')
        saving = false
        return
      }

      // Check for any error classes on fields
      const errorId = document.querySelector('.input-error')?.id
      const errorMessage = 'Invalid params'
      if (errorId && !imageBitmap) {
        addNotification(errorMessage, 'error')
        throw new Error(errorMessage)
      }

      // Validate crop dimensions
      if (imageBitmap) {
        const cropTask = $workflowsStore.builder.nodes.find(
          n => n.functionName === 'crop'
        )
        const invalidCropError =
          cropTask &&
          cropTask.params.filter((a, i) => {
            // Crop x or width ex
            if (
              ((i === 0 || i === 2) && a > imageBitmap.width) ||
              ((i === 1 || i === 3) && a > imageBitmap.height)
            ) {
              return true
            }

            // Crop x + width or y + height exceed image width or height
            if (
              (i === 2 && cropTask.params[i - 2] + a > imageBitmap.width) ||
              (i === 3 && cropTask.params[i - 2] + a > imageBitmap.height)
            ) {
              return true
            }

            return false
          })?.length

        if (
          (errorId && CROP_PARAMS.find(p => p.name === errorId)) ||
          invalidCropError
        ) {
          addNotification(
            `Crop x + width must be less than ${imageBitmap.width} and crop y + height must be less than ${imageBitmap.height}`,
            'error',
            7000
          )
          throw new Error(errorMessage)
        }

        if (errorId) {
          addNotification(errorMessage, 'error')
          throw new Error(errorMessage)
        }
      }

      // Filter out the deleted nodes
      const activeNodes = $workflowsStore.builder.nodes.filter(n => !n.deleted)

      $workflowsStore.builder.payload = {
        name: camelCase($workflowsStore.builder.name),
        workflow: {
          tasks: activeNodes.map(({ functionName, params }, i) => {
            const argKeys = Object.keys(DEFAULT_PARAMS[functionName])
            const options = {
              functionName,
              label: `${functionName}${i}`,
              args: params.reduce(
                (acc, param, k) => ({
                  ...acc,
                  [argKeys[k]]: Number(param)
                }),
                {}
              ),
              ...(i === 0
                ? {
                    base64: true,
                    data: $workflowsStore.builder.savedImage
                  }
                : {
                    data: `{{needs.${activeNodes[i - 1].functionName}${
                      i - 1
                    }.output}}`,
                    needs: `${activeNodes[i - 1].functionName}${i - 1}`
                  })
            }

            return generateFunction(options)
          })
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

      saving = false

      handleCloseBuilder()

      addNotification('Workflow created', 'success')
    } catch (error) {
      saving = false
    }
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

  // Delete the image and close the modal
  const handleDeleteImage = () => {
    $workflowsStore.builder.payload.workflow.tasks[0].run.input.args[0] = null
    imageBitmap = null
    imageModalOpen = false
  }

  $: {
    console.log('$workflowsStore.builder', $workflowsStore.builder)
  }

  onMount(() => {
    $workflowsStore.builder.name = `New Workflow #${
      $workflowsStore.workflows.length + 1
    }`

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

<input
  type="checkbox"
  id="image-modal"
  checked={imageModalOpen}
  class="modal-toggle"
/>

{#if imageModalOpen}
  <div class="modal !z-max">
    <div
      class="relative flex flex-col items-center justify-center gap-4 w-full max-w-[500px] pt-16 px-4 pb-4 bg-base-200 rounded-sm"
    >
      <button
        on:click={() => (imageModalOpen = false)}
        class="absolute top-4 right-4 btn btn-odd-gray-900 flex items-center justify-center gap-1 px-0 w-8 h-8 bg-odd-gray-700 text-odd-gray-100 text-body-sm"
      >
        <Close />
      </button>

      <img
        src={$workflowsStore.builder.savedImage}
        class="block w-full h-auto px-4 rounded-sm"
        alt="uploaded workflow asset"
      />

      <button
        on:click={handleDeleteImage}
        class="self-end btn btn-error btn-odd-red-400 w-[85px] h-10 !text-label-l"
      >
        Delete
      </button>
    </div>
  </div>
{/if}

<div
  in:fly={{ y: 500, duration: 300, opacity: 0, easing: expoInOut }}
  out:fly={{ y: 500, duration: 300, opacity: 0, easing: expoInOut }}
  class="fixed top-0 right-0 bottom-0 left-0 z-10 w-screen h-screen"
>
  <div
    class="flex flex-col gap-4 w-full p-4 {$themeStore.selectedTheme === 'light'
      ? 'bg-odd-gray-50'
      : 'bg-odd-gray-900'} border-b border-base-200"
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
          bind:imageBitmap
          bind:imageModalOpen
          bind:uploadedImage={$workflowsStore.builder.savedImage}
        />
        {#each $workflowsStore.builder.nodes as { functionName, position, connections, ...rest }, nodeIndex}
          <Node
            bind:functionName
            bind:connections
            bind:position
            bind:imageBitmap
            {nodeIndex}
            {...rest}
          />
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
  </div>
</div>
