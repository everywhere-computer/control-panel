<script lang="ts">
  import { Svelvet } from 'svelvet'

  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'
  import { runs as runMocks } from '$routes/workflows/lib/run-mocks'
  import Filter from '$components/icons/Filter.svelte'
  import Node from '$routes/workflows/components/graph/Node.svelte'
  import Search from '$components/common/Search.svelte'

  let columnWidth
  let graphWidth
  let windowHeight = window.innerHeight
  let windowWidth = window.innerWidth

  const handleWindowResize = () => {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth
  }

  let searchTerm = ''
  $: runs = searchTerm
    ? runMocks.filter(run =>
        run.name.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    : runMocks
</script>

<svelte:window on:resize={handleWindowResize} />

<div class="w-full flex flex-row">
  <div class="grow w-full max-w-[382px] pt-4 textrder-r border-odd-gray-200">
    <div class="flex flex-row gap-2 bg-odd-gray-50 p-2 mx-4 rounded-sm">
      <Search bind:searchTerm placeholder="Find in runs..." />
      <button
        class="flex flex-row items-center justify-center gap-1 px-3.5 h-[30px] text-odd-gray-700 text-body-sm"
      >
        <Filter /> Filter
      </button>
    </div>

    <div
      class="max-h-[calc(100vh-330px)] overflow-y-auto divide-y divide-odd-gray-200"
    >
      {#each runs as run}
        <button
          class="flex flex-row items-center justify-between w-full p-4 text-label-m capitalize duration-200 transition-colors ease-in-out hover:bg-odd-gray-150"
        >
          {run.name}
          <span
            class="px-1 text-code-sm border {STATUS_COLOURS[
              run.status
            ]} rounded-sm capitalize"
          >
            {run.status}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <div
    class="w-full max-w-[calc(100vw-{columnWidth}px)]"
    bind:offsetWidth={graphWidth}
  >
    <Svelvet width={graphWidth} height={windowHeight - 263} zoom={1} locked>
      <Node id="one" name="Rotate90" status="running" connections={['two']} />
      <Node
        id="two"
        name="Rotate90"
        status="from cache"
        connections={['three', 'four']}
        position={{ x: 50, y: 260 }}
        previousNode={{ status: 'running' }}
      />
      <Node
        id="three"
        name="Rotate90"
        status="ready"
        position={{ x: 50, y: 500 }}
        previousNode={{ status: 'ready' }}
      />
      <Node
        id="four"
        name="Rotate90"
        status="ready"
        position={{ x: 440, y: 500 }}
        previousNode={{ status: 'ready' }}
      />
    </Svelvet>
  </div>
</div>
