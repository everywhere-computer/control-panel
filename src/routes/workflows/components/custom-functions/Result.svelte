<script lang="ts">
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import { sampleImage } from '$routes/workflows/components/custom-functions/sampleData'

  export let output
  export let loading

  let outputType: 'text' | 'number' | 'image' = 'text'
</script>

<!-- <h2 class="mb-4">Result</h2> -->

{#if loading}
  <div class="flex flex-col items-center justify-center h-full min-h-40 p-4 bg-base-200 rounded-sm">
    <LoadingSpinner />
  </div>
{:else}
  <div class="flex flex-row gap-4 items-start justify-start h-full min-h-40 p-4 font-mono bg-base-200 rounded-sm">
    {#if outputType === 'image' && output}
      <img class="rounded-sm max-w-48 h-auto" src={sampleImage} alt="workflow output" />
    {:else if output}
      {#if output}
        {output}
      {/if}
    {/if}
  </div>
{/if}