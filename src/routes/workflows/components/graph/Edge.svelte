<script lang="ts">
  import { Edge } from 'svelvet'

  export let direction: string = 'west'
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
