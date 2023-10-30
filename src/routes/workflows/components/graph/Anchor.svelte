<script lang="ts">
  import { Anchor } from 'svelvet'
  import type { Direction } from 'svelvet'

  import './graph.css'

  export let id: string
  export let connections: string[] = []
  export let direction: Direction = 'south'
  export let input: boolean = false
  export let output: boolean = false
</script>

<Anchor {id} {input} {output} {direction} {connections} />
