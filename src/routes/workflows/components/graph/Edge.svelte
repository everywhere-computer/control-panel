<script lang="ts">
  import { writable } from 'svelte/store'
  import { Edge } from 'svelvet'

  import { STATUS_COLOURS } from '$routes/workflows/lib/graph'

  export let previousNode = { status: 'ready' }

  const customProps = {
    ...(previousNode?.status === 'running'
      ? { animate: true, color: '#6A50EB' }
      : { animate: false, color: '#40425E' })
  }
</script>

<!-- <Edge let:path {...customProps} /> -->
<Edge
  let:path
  animate={previousNode.status === 'ready'}
  color={previousNode.status === 'ready' ? '#6A50EB' : '#40425E'}
  label={previousNode.status === 'ready' ? 'Running' : ''}
  step
>
  <path d={path} class="running-edge" stroke-dasharray="4" />
  <p
    slot="label"
    class="{STATUS_COLOURS[
      'running'
    ]} px-1 text-code-sm font-mono border rounded-sm capitalize"
  >
    running
  </p>
</Edge>
