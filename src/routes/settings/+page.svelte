<script lang="ts">
  import { goto } from '$app/navigation'
  import { fly } from 'svelte/transition'

  import { sessionStore } from '$lib/stores'
  import NodeInfo from '$components/settings/NodeInfo.svelte'
  import ThemePreferences from '$components/settings/ThemePreferences.svelte'
  import Username from '$components/settings/Username.svelte'
</script>

{#if $sessionStore.username}
  <div
    in:fly={{
      y: 20,
      duration: 200,
      opacity: 0
    }}
    class="flex flex-col items-start max-w-[800px] m-auto gap-10 pb-28 text-sm"
  >
    <div class="flex flex-col items-start justify-center gap-6">
      <NodeInfo />

      <Username />

      <ThemePreferences />
    </div>
  </div>
{:else}
  {goto('/')}
{/if}
