<script lang="ts">
  import { Edge } from 'svelvet'

  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'

  export let direction: string = 'north'
  export let previousNode = { status: 'ready' }
  export let status: string = 'ready'
</script>

<!-- <Edge let:path {...customProps} /> -->
<Edge let:path step cornerRadius={0}>
  <path
    d={path}
    class={direction === 'south' && status === 'running'
      ? 'running-edge'
      : 'ready-edge'}
    stroke-dasharray={direction === 'south' && status === 'running' ? '4' : ''}
  />
  <p
    slot="label"
    class={direction === 'south' && status === 'running'
      ? `${STATUS_COLOURS['running']} px-1 text-code-sm font-mono border rounded-sm capitalize`
      : ''}
  >
    {direction === 'south' && status === 'running' ? 'running' : ''}
  </p>
</Edge>
