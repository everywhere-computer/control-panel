<script lang="ts">
  import clipboardCopy from 'clipboard-copy'

  import { addNotification } from '$lib/notifications'
  import ClipboardIcon from '$components/icons/ClipboardIcon.svelte'
  import CloseIcon from '$components/icons/Close.svelte'
  import UploadIcon from '$components/icons/Upload.svelte'
  import { themeStore } from '$lib/stores'

  export let imageBitmap = null
  export let imageModalOpen = false
  export let uploadedImage = null

  // Handle uploads made by interacting with the file input directly
  const handleFileInput: (files: FileList) => Promise<void> = async files => {
    if (files[0]?.type !== 'image/png') {
      addNotification({ msg: 'Image must be a PNG', type: 'error' })
      return
    }

    const fr = new FileReader()
    fr.onload = async () => {
      uploadedImage = fr.result
      imageBitmap = await createImageBitmap(files[0])
    }
    fr.readAsDataURL(files[0])
  }

  const handleCopyBase64 = async () => {
    try {
      await clipboardCopy(uploadedImage)
      addNotification({ msg: 'Copied to clipboard!', type: 'success' })
    } catch (error) {
      console.error(error)
      addNotification({ msg: 'Failed to copy to clipboard', type: 'error' })
    }
  }

  const handleDeleteImage = () => {
    uploadedImage = null
    imageBitmap = null
  }

  // Handle files uploaded directly through the file input
  let files: FileList
  $: if (files) {
    handleFileInput(files)
  }
</script>

<div
  class="relative w-full h-36 px-2 border border-odd-gray-400 bg-base-100 rounded-sm"
>
  <div
    class="flex flex-row items-center justify-between py-2 border-b {$themeStore.selectedTheme ===
    'light'
      ? 'border-base-200'
      : 'border-odd-gray-500'}"
  >
    <h4 class="text-label-sm">Upload image</h4>
  </div>
  <div class="flex items-center gap-4">
    <div
      class="relative group flex items-center justify-center w-24 h-24 mt-2 {uploadedImage
        ? ''
        : $themeStore.selectedTheme === 'light'
        ? 'bg-odd-gray-50'
        : 'bg-odd-gray-900'} rounded-sm"
    >
      {#if uploadedImage}
        <img
          src={uploadedImage}
          class="relative z-10 block w-full h-full object-cover border {$themeStore.selectedTheme ===
          'light'
            ? 'border-base-200'
            : 'border-odd-gray-500'} rounded-sm cursor-pointer"
          alt="uploaded workflow asset"
        />
        <button
          class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 p-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
          on:click={handleDeleteImage}
        >
          <CloseIcon />
        </button>
      {:else}
        <label
          for="upload-file"
          class="btn btn-primary btn-odd-purple-500 inline-flex flex-row items-center justify-center gap-1 w-10 h-[30px] !px-0 bg-odd-purple-500 text-odd-purple-100 text-label-sm font-medium cursor-pointer"
        >
          <UploadIcon />
        </label>
        <input
          bind:files
          id="upload-file"
          type="file"
          accept="image/png"
          class="hidden"
        />
      {/if}
    </div>
    <button
      class="btn btn-odd-gray-100 h-8 px-2"
      disabled={!uploadedImage}
      on:click={handleCopyBase64}
    >
      <ClipboardIcon />Copy base64 image
    </button>
  </div>
</div>
