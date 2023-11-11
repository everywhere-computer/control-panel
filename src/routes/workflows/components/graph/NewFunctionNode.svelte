<script lang="ts">
  import { getContext } from 'svelte'
  import { Anchor, Node } from 'svelvet'

  import { addNotification } from '$lib/notifications'
  import { workflowsStore } from '$lib/stores'
  import { clickOutside } from '$lib/utils'
  import { DEFAULT_PARAMS } from '$lib/workflows/builder/function-template'
  import { BORDER_COLOURS, FUNCTION_PARAMS } from '$routes/workflows/lib/graph'
  import ArrowDown from '$components/icons/ArrowDown.svelte'
  import Edge from '$routes/workflows/components/graph/Edge.svelte'
  import Trash from '$components/icons/Trash.svelte'

  export let id: string
  export let connections: string[] = []
  export let imageBitmap: { width: number; height: number }
  export let nodeIndex: number
  export let position: { x: number; y: number } = {
    x: 50,
    y: 26
  }

  let dropdownOpen = false
  const handleToggleDropdown = () => (dropdownOpen = !dropdownOpen)

  const FUNCTION_NAMES = ['rotate90', 'crop', 'grayscale', 'blur']
  export let functionName = FUNCTION_NAMES[0]

  // Switch functions via dropdown
  const handleFunctionClick = (param: string): void => {
    functionName = param
    $workflowsStore.builder.nodes[Number(id) - 1].params = Object.values(
      DEFAULT_PARAMS[functionName]
    )

    dropdownOpen = false
  }

  // Delete node and update connections
  const graph = getContext('graph')
  const handleDelete = node => {
    // @ts-ignore-next-line
    graph.nodes.delete(node.id)

    const updatedNodeConnections = $workflowsStore.builder.nodes.map(n => {
      // Update connection for preceding node
      if (Number(n.id) === Number(id) - 1) {
        return {
          ...n,
          // position,
          connections: [`${Number(id) + 1}`]
        }
      }

      // Set a flag on the current node so it's not included in the built workflow
      if (n.id === id) {
        return {
          ...n,
          connections: [],
          deleted: true
        }
      }

      return n
    })

    $workflowsStore.builder.nodes = updatedNodeConnections
  }

  // Save the updated params to the unsavedRunStore to be referenced in Actions
  const errorClass = 'input-error'
  const handleParamChange = (
    event,
    param,
    index: number,
    nodei: number
  ): void => {
    const updatedArg = Number(event?.target?.value)
    const invalid =
      updatedArg < 0 ||
      (param?.max && updatedArg > param.max) ||
      (functionName === 'blur' && updatedArg < param?.min)

    if (invalid) {
      // addNotification(`Param must be less than ${param.max}`)
      event.target.classList.add(errorClass)
      return
    }

    // Validate crop params relative to image size
    if (functionName === 'crop' && imageBitmap) {
      const invalidCropWidth =
        (param.name === 'x' || param.name === 'width') &&
        updatedArg > imageBitmap.width
      const invalidCropHeight =
        (param.name === 'y' || param.name === 'height') &&
        updatedArg > imageBitmap.height

      if (invalidCropWidth || invalidCropHeight) {
        event.target.classList.add(errorClass)
        const paramName = `${param.name
          .charAt(0)
          .toUpperCase()}${param.name.slice(1)}`
        if (invalidCropWidth) {
          addNotification(
            `${paramName} must be less than ${imageBitmap.width}`,
            'error'
          )
        }
        if (invalidCropHeight) {
          addNotification(
            `${paramName} must be less than ${imageBitmap.height}`,
            'error'
          )
        }

        return
      }
    }

    // Remove the errorClass if it's still on, because we're good at this point
    if (event.target.classList.contains(errorClass)) {
      event.target.classList.remove(errorClass)
    }

    $workflowsStore.builder.nodes[nodeIndex].params[index] = updatedArg
  }

  $: {
    // console.log('graph', graph.nodes.getAll())
  }
</script>

<Node {id} bind:position connections={[...connections]} let:node>
  <div
    class="relative w-[256px] min-h-[144px] border {BORDER_COLOURS[
      'ready'
    ]} bg-base-100 rounded-sm"
  >
    <!-- Incoming Anchor -->
    <div class="absolute right-full top-2">
      <Anchor id={`${id}_1`} edge={Edge} input locked direction="west">
        <Edge slot="edge" {status} direction="west" />
      </Anchor>
    </div>

    <!-- Outgoing Anchor -->
    <div class="absolute left-full top-2">
      <Anchor
        id={`${id}_2`}
        edge={Edge}
        output
        locked
        direction="east"
        {connections}
      >
        <Edge slot="edge" {status} direction="east" />
      </Anchor>
    </div>

    <div class="px-2">
      <!-- Header -->
      <div class="flex flex-row items-center justify-between">
        <div class="relative flex items-center justify-between w-full">
          <div>
            <button
              on:click={handleToggleDropdown}
              use:clickOutside={{
                enabled: dropdownOpen,
                cb: () => {
                  dropdownOpen = false
                }
              }}
              class="btn justify-between w-[208px] h-8 pl-2 pr-0 !border-x !border-b border-odd-gray-400 bg-base-200 !text-input-sm text-left capitalize !rounded-t-none !rounded-b-sm"
            >
              {functionName}
              <ArrowDown />
            </button>
            {#if dropdownOpen}
              <ul
                tabindex="-1"
                class="absolute top-full z-[60] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {#each FUNCTION_NAMES as name}
                  <li>
                    <button
                      on:click={() => handleFunctionClick(name)}
                      class="capitalize"
                    >
                      {name}
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>

          <!-- Only allow nodes other than the first to be deleted -->
          <button
            on:click={() => handleDelete(node)}
            class="btn btn-ghost w-auto h-auto p-1 hover:bg-transparent hover:scale-105"
            disabled={id === '1'}
          >
            <Trash />
          </button>
        </div>
      </div>

      <!-- Params -->
      <div class="flex flex-row items-start justify-between gap-2 w-full py-2">
        <div class="flex flex-col gap-4 pt-2 w-full">
          {#each FUNCTION_PARAMS[functionName] as param, i}
            <div class="flex flex-col items-start gap-2">
              <label
                class="text-label-sm text-base-content capitalize font-normal"
                for={param.name}
              >
                {param.name}
              </label>
              <input
                class="input pl-3 py-0.5 h-8 border border-odd-gray-400 bg-transparent w-full text-input-m text-base-content placeholder:text-base-content rounded-sm transition duration-200 ease-in-out"
                id={param.name}
                type={param.type}
                placeholder="Enter a number..."
                on:keyup={event =>
                  handleParamChange(event, param, i, nodeIndex)}
                value={$workflowsStore.builder.nodes[nodeIndex].params[i]}
                min="0"
                required
              />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</Node>
