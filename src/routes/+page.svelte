<script lang="ts">
  import posthog from 'posthog-js'
  import { onMount } from 'svelte'

  // import { sessionStore } from '$lib/stores'
  import Authed from '$components/home/Authed.svelte'
  // import Public from '$components/home/Public.svelte'

  onMount(() => {
    posthog.capture('Visit to the landing page')
  })
</script>

<!-- {#if $sessionStore?.session} -->
  <Authed />
<!-- {:else} -->
  <!-- <Public />
{/if} -->
