<script lang="ts">
  import { sessionStore } from '$src/stores'
  // import Authed from '$components/home/Authed.svelte'
  import Public from '$components/home/Public.svelte'
</script>

{#if $sessionStore?.session}
  <!-- <Authed /> -->
  <div
    class="flex items-center justify-center md:min-h-[calc(100vh-160px)] w-full py-[7vh]"
  >
    <img
      src={`${window.location.origin}/static-globe2x.png`}
      alt="Everywhere Computer Globe"
      class="max-w-[560px] h-auto"
    />
  </div>
{:else}
  <Public />
{/if}
