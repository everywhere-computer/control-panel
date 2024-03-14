<script lang="ts">
  import { addNotification } from '$lib/notifications'
  import ClipboardIcon from '$components/icons/ClipboardIcon.svelte'
  import UploadIcon from '$components/icons/Upload.svelte'
  import { themeStore } from '$lib/stores'

  export let imageBitmap = null
  export let imageModalOpen = false
  export let uploadedImage = null

  // Toggle the image modal state
  const handleToggleModal = () => (imageModalOpen = !imageModalOpen)

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
    <h4 class="text-label-sm">Image</h4>
  </div>
  <div class="flex items-center gap-4">
    <div
      class="flex items-center justify-center w-24 h-24 mt-2 {uploadedImage
        ? ''
        : $themeStore.selectedTheme === 'light'
        ? 'bg-odd-gray-50'
        : 'bg-odd-gray-900'} rounded-sm"
    >
      {#if uploadedImage}
        <img
          src={uploadedImage}
          class="block w-full h-full object-cover border {$themeStore.selectedTheme ===
          'light'
            ? 'border-base-200'
            : 'border-odd-gray-500'} rounded-sm transition-opacity duration-200 ease-in-out hover:opacity-90 cursor-pointer"
          alt="uploaded workflow asset"
          on:click={handleToggleModal}
          on:keyup={handleToggleModal}
        />
      {:else}
        <label
          for="upload-file"
          class="btn btn-primary btn-odd-purple-500 inline-flex flex-row items-center justify-center gap-1 w-[82px] h-[30px] !px-0 bg-odd-purple-500 text-odd-purple-100 text-label-sm font-medium cursor-pointer"
        >
          <UploadIcon /> Upload
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
    {#if uploadedImage}
      <button class="btn btn-odd-gray-100 h-8 px-2">
        <ClipboardIcon />Copy base64 image
      </button>
    {/if}
  </div>
</div>
