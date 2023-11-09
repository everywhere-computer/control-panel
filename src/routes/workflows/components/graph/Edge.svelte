<script lang="ts">
  import { Edge } from 'svelvet'

  // import { STATUS_COLOURS } from '$routes/workflows/lib/graph'

  export let direction: string = 'west'
  export let previousNode = { status: 'ready' }
  export let status: string = 'ready'
</script>

<Edge let:path step cornerRadius={0}>
  <path
    d={path}
    class={direction === 'east' && status === 'running'
      ? 'running-edge'
      : 'ready-edge'}
    stroke-dasharray={direction === 'east' && status === 'running' ? '4' : ''}
  />
</Edge>
