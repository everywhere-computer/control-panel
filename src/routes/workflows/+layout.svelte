<script lang="ts">
  import localforage from 'localforage'
  import { onMount } from 'svelte'

  import { workflowsStore } from '$lib/stores'

  $workflowsStore.loading = true

  // Load saved workflows from localforage
  onMount(async () => {
    const savedWorkflows = await localforage.getItem('workflows')

    if (savedWorkflows) {
      $workflowsStore.workflows = [
        ...$workflowsStore.workflows,
        // @ts-ignore-next-line
        ...savedWorkflows
      ]
    }
    $workflowsStore.loading = false
  })
</script>

{#if !$workflowsStore.loading}
  <slot />
{/if}
