<script lang="ts">
  import { Anchor, Node } from 'svelvet'

  import './graph.css'
  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'
  import Edge from '$routes/workflows/components/graph/Edge.svelte'

  export let id: string
  export let connections: string[] = []
  export let name: string
  export let position: { x: number; y: number } = {
    x: 50,
    y: 50
  }
  export let previousNode = { status: 'ready' }
  export let status: string
</script>

<!-- dimensions={{ width: 290, height: 101 }} -->
<Node {id} {position} connections={[...connections]}>
  <div
    class="position min-w-[290px] border {status === 'running'
      ? 'border-odd-purple-500'
      : 'border-odd-gray-200'} rounded-sm"
  >
    <div
      class="absolute bottom-full left-4 {previousNode.status === 'running'
        ? 'running'
        : ''}"
    >
      <Anchor id={`${id}_1`} edge={Edge} input direction="north">
        <Edge slot="edge" {previousNode} {status} direction="north" />
      </Anchor>
    </div>
    <div
      class="absolute top-full left-4 {status === 'running' ? 'running' : ''}"
    >
      <Anchor id={`${id}_2`} edge={Edge} output direction="south" {connections}>
        <Edge slot="edge" {previousNode} {status} direction="south" />
      </Anchor>
    </div>
    <div
      class="flex flex-row items-center justify-between px-4 py-2 bg-odd-gray-100"
    >
      <h4 class="text-label-m">{name}</h4>
      <p
        class="{STATUS_COLOURS[
          status
        ]} px-1 text-code-sm border rounded-sm capitalize"
      >
        {status}
      </p>
    </div>
    <div class="p-4 bg-odd-gray-0">
      <div class="flex flex-row items-center justify-between mb-1">
        <label class="text-label-sm text-odd-gray-500" for="cid1">CID</label>
        <input
          class="px-3 py-0.5 border border-odd-gray-500 text-input-sm font-light rounded-sm"
          id="cid1"
          type="text"
          placeholder="Enter a value..."
        />
      </div>
      <div class="flex flex-row items-center justify-between">
        <label class="text-label-sm text-odd-gray-500" for="cid2">CID</label>
        <input
          class="px-3 py-0.5 border border-odd-gray-500 text-input-sm font-light rounded-sm"
          id="cid2"
          type="text"
          placeholder="Enter a value..."
        />
      </div>
    </div>
  </div>
</Node>
