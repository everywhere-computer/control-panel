<script lang="ts">
  import { sessionStore } from '$src/stores'
  // import Authed from '$components/home/Authed.svelte'
  import Public from '$components/home/Public.svelte'
</script>

{#if $sessionStore?.session}
  <!-- <Authed /> -->
  <div
    class="flex items-center justify-center min-h-[calc(100vh-160px)] w-full"
  >
    <img
      src={`${window.location.origin}/static-globe.png`}
      alt="Everywhere Computer Globe"
    />
  </div>
{:else}
  <Public />
{/if}
