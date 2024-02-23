<script lang="ts">
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'

  export let loading: boolean
  export let output
  export let outputType = 'text'
</script>

{#if loading}
  <div
    class="flex flex-col items-center justify-center h-[calc(100%-32px)] min-h-40 p-4 bg-base-200 rounded-sm"
  >
    <LoadingSpinner />
  </div>
{:else}
  <div
    class="flex flex-row gap-4 items-start justify-start h-[calc(100%-32px)] min-h-40 p-4 font-mono bg-base-200 rounded-sm"
  >
    {#if output}
      {#if outputType === 'image'}
        <img
          class="rounded-sm max-w-48 h-auto"
          src={output}
          alt="workflow output"
        />
      {:else}
        {output}
      {/if}
    {/if}
  </div>
{/if}
