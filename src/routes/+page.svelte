<script lang="ts">
  import { sessionStore } from '$lib/stores'
  import Authed from '$components/home/Authed.svelte'
  import Public from '$components/home/Public.svelte'
  // import Public from '$components/home/PublicBkp.svelte'
</script>

{#if $sessionStore?.session}
  <Authed />
{:else}
  <Public />
{/if}
