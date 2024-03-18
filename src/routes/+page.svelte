<script lang="ts">
  import posthog from 'posthog-js'
  import { onMount } from 'svelte'

  import { sessionStore } from '$lib/stores'
  import Authed from '$components/home/Authed.svelte'
  import Public from '$components/home/Public.svelte'
  // import Public from '$components/home/PublicBkp.svelte'

  onMount(() => {
    posthog.capture('Visit to the landing page')
  })
</script>

{#if $sessionStore?.username}
  <Authed />
{:else}
  <Public />
{/if}
