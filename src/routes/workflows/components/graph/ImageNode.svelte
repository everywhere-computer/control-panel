<script lang="ts">
  import { Anchor, Node } from 'svelvet'

  import { addNotification } from '$lib/notifications'
  import Edge from '$routes/workflows/components/graph/Edge.svelte'
  import UploadIcon from '$components/icons/Upload.svelte'

  export let id: string
  export let connections: string[] = []
  export let imageBitmap = null
  export let imageModalOpen = false
  export let position: { x: number; y: number } = {
    x: 50,
    y: 50
  }
  export let uploadedImage = null

  $: status = 'ready'

  // Toggle the image modal state
  const handleToggleModal = () => (imageModalOpen = !imageModalOpen)

  // Handle uploads made by interacting with the file input directly
  const handleFileInput: (files: FileList) => Promise<void> = async files => {
    status = 'running'

    if (files[0]?.type !== 'image/png') {
      addNotification('Image must be a PNG', 'error')
      status = 'ready'
      return
    }

    const fr = new FileReader()
    fr.onload = async () => {
      uploadedImage = fr.result
      imageBitmap = await createImageBitmap(files[0])
    }
    fr.readAsDataURL(files[0])

    status = 'ready'
  }

  // Handle files uploaded directly through the file input
  let files: FileList
  $: if (files) {
    handleFileInput(files)
  }
</script>

<Node {id} {position} connections={[...connections]} locked>
  <div
    class="relative w-28 h-36 px-2 border border-odd-gray-400 bg-base-100 rounded-sm"
  >
    <div
      class="absolute top-2 left-full {status === 'running' ? 'running' : ''}"
    >
      <Anchor
        id={`${id}_2`}
        edge={Edge}
        output
        locked
        direction="east"
        {connections}
      >
        <Edge slot="edge" {status} direction="east" />
      </Anchor>
    </div>

    <div
      class="flex flex-row items-center justify-between py-2 border-b border-base-200"
    >
      <h4 class="text-label-sm">Image</h4>
    </div>
    <div
      class="flex items-center justify-center w-24 h-24 mt-2 {uploadedImage
        ? ''
        : 'bg-odd-gray-50'} rounded-sm"
    >
      {#if uploadedImage}
        <img
          src={uploadedImage}
          class="block w-full h-full object-cover border border-odd-gray-200 rounded-sm transition-opacity duration-200 ease-in-out hover:opacity-90 cursor-pointer"
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
  </div>
</Node>
