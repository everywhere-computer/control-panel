<script lang="ts">
  import { themeStore } from '$lib/stores'
  import ImageModal from '$routes/workflows/components/graph/ImageModal.svelte'
  import ResultCard from '$routes/workflows/components/custom-functions/ResultCard.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'

  export let loading: boolean
  export let results

  let imageModalOpen: boolean
  let imageModalSrc: string

  const handleImageModal = (src: string): void => {
    imageModalOpen = !imageModalOpen
    imageModalSrc = src ?? null
  }
</script>

{#if loading}
  <div
    class="flex flex-col items-center justify-center h-full min-h-40 p-4 bg-base-200 rounded-sm"
  >
    <LoadingSpinner />
  </div>
{:else}
  <div
    class="flex flex-col gap-7 items-start justify-start w-full h-full min-h-40 p-4 pt-8 font-mono bg-base-200 rounded-sm overflow-auto"
  >
    {#if Array.isArray(results)}
      {#each results as result, index}
        {#if result.headers['Content-Type'].includes('image/')}
          {@const src = URL.createObjectURL(
            new Blob([new Uint8Array(Object.values(result.out))], {
              type: result.headers['Content-Type']
            })
          )}
          <ResultCard
            key={result.key}
            title={result.title}
            replayed={result.replayed}
            final={index === results.length - 1}
          >
            <img
              class="block w-full h-full object-cover border {$themeStore.selectedTheme ===
              'light'
                ? 'border-odd-gray-400'
                : 'border-odd-gray-500'} rounded-sm transition-opacity duration-200 ease-in-out hover:opacity-90 cursor-pointer"
              {src}
              alt="workflow output"
              on:click={() => handleImageModal(src)}
              on:keypress={() => handleImageModal(src)}
            />
          </ResultCard>
        {:else}
          <ResultCard
            key={result.key}
            title={result.title}
            replayed={result.replayed}
            final={index === results.length - 1}
          >
            <div
              class="p-2 bg-base-200 border {$themeStore.selectedTheme ===
              'light'
                ? 'border-odd-gray-400'
                : 'border-odd-gray-500'} rounded-sm"
            >
              {result.out}
            </div>
          </ResultCard>
        {/if}
      {/each}
    {:else if results?.error}
      {results.error}
    {:else}
      No results yet
    {/if}
  </div>
{/if}

<input
  type="checkbox"
  id="result-modal"
  checked={imageModalOpen}
  class="modal-toggle"
/>

{#if imageModalOpen}
  <ImageModal bind:imageModalOpen imageSrc={imageModalSrc} />
{/if}
