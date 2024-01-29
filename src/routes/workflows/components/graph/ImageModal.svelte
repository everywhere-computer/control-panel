<script lang="ts">
  import type { CID } from 'multiformats'
  import Close from '$components/icons/Close.svelte'

  export let imageModalOpen: boolean = false
  export let imageSrc: string = null
  export let receiptCID: CID = null
  export let handleDeleteImage: () => void = null
</script>

<div class="modal !z-max">
  <div
    class="relative flex flex-col items-center justify-center gap-4 w-full max-w-[800px] w-auto pt-16 px-4 pb-4 bg-base-200/80 rounded-sm"
  >
    <button
      on:click={() => (imageModalOpen = false)}
      class="absolute top-4 right-4 btn btn-odd-gray-900 flex items-center justify-center gap-1 px-0 w-8 h-8 bg-odd-gray-700 text-odd-gray-100 text-body-sm"
    >
      <Close />
    </button>

    <img
      src={imageSrc}
      class="block w-full h-auto px-4 rounded-sm"
      alt="uploaded workflow asset"
    />

    {#if receiptCID}
      <p
        class="text-input-sm font-sans text-base-content self-start whitespace-nowrap"
      >
        Receipt CID: {receiptCID.toString()}
      </p>
    {/if}

    {#if handleDeleteImage}
      <button
        on:click={handleDeleteImage}
        class="self-end btn btn-error btn-odd-red-400 w-[85px] h-10 !text-label-l"
      >
        Delete
      </button>
    {/if}
  </div>
</div>
