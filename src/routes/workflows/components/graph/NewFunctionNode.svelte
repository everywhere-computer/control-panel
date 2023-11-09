<script lang="ts">
  import { Anchor, Node } from 'svelvet'

  import { workflowsStore } from '$lib/stores'
  import { clickOutside } from '$lib/utils'
  import { addNotification } from '$lib/notifications'
  import { BORDER_COLOURS, FUNCTION_PARAMS } from '$routes/workflows/lib/graph'
  import ArrowDown from '$components/icons/ArrowDown.svelte'
  import Edge from '$routes/workflows/components/graph/Edge.svelte'
  import Trash from '$components/icons/Trash.svelte'

  export let id: string
  export let connections: string[] = []
  export let position: { x: number; y: number } = {
    x: 50,
    y: 26
  }
  export let previousNode = { status: 'ready' }

  let dropdownOpen = false
  const handleToggleDropdown = () => (dropdownOpen = !dropdownOpen)

  const FUNCTION_NAMES = ['rotate90', 'crop', 'grayscale', 'blur']
  export let functionName = FUNCTION_NAMES[0]
  const handleFunctionClick = (param: string): void => {
    functionName = param
    dropdownOpen = false
  }
</script>

<Node {id} {position} connections={[...connections]} dynamic>
  <div
    class="relative w-[256px] min-h-[144px] border {BORDER_COLOURS[
      'ready'
    ]} bg-base-100 rounded-sm"
  >
    <!-- Incoming Anchor -->
    <div class="absolute right-full top-2">
      <Anchor id={`${id}_1`} edge={Edge} locked input direction="west" dynamic>
        <Edge slot="edge" {previousNode} {status} direction="west" />
      </Anchor>
    </div>

    <!-- Outgoing Anchor -->
    <div class="absolute left-full top-2">
      <Anchor
        id={`${id}_2`}
        edge={Edge}
        locked
        output
        direction="east"
        dynamic
        {connections}
      >
        <Edge slot="edge" {previousNode} {status} direction="east" />
      </Anchor>
    </div>

    <div class="px-2">
      <!-- Header -->
      <div class="flex flex-row items-center justify-between">
        <div class="relative flex items-center justify-between w-full">
          <div>
            <!-- use:clickOutside={{
              enabled: dropdownOpen,
              cb: () => {
                console.log('clicked')
                dropdownOpen = false
              }
            }} -->
            <button
              on:click={handleToggleDropdown}
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
          <button
            class="btn btn-ghost w-auto h-auto p-0 hover:bg-transparent hover:scale-105"
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
                class="pl-3 py-0.5 h-8 border border-odd-gray-400 bg-transparent w-full text-input-m text-base-content placeholder:text-base-content rounded-sm transition duration-200 ease-in-out"
                id={param.name}
                placeholder="Enter a number..."
                min="0"
                bind:value={$workflowsStore.builder.nodes[Number(id) - 1]
                  .params[i]}
                required
              />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</Node>
