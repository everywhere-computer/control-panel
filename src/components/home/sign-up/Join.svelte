<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const handleJoin = () => {
    dispatch('nextStep')
  }
</script>

<button
  class="btn btn-primary btn-odd-purple-500 w-[189px] h-10 mt-auto !text-label-l gap-2"
  on:click={handleJoin}
>
  Join the Beta
</button>
