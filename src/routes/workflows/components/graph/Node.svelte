<script lang="ts">
  import { Anchor, Node } from 'svelvet'

  import { unsavedRunStore } from '$lib/stores'
  import {
    BORDER_COLOURS,
    FUNCTION_PARAMS,
    STATUS_COLOURS
  } from '$routes/workflows/lib/graph'
  import Close from '$components/icons/Close.svelte'
  import Edge from '$routes/workflows/components/graph/Edge.svelte'
  import ImageModal from '$routes/workflows/components/graph/ImageModal.svelte'
  import type { Receipt } from '$lib/functions'
  import { themeStore } from '$lib/stores'
  import type { Run, Payload } from '$lib/workflows'
  import { addNotification } from '$lib/notifications'

  export let args = []
  export let connections: string[] = []
  export let editing: boolean = false
  export let id: string
  export let name: string
  export let imageBitmap: { width: number; height: number }
  export let position: { x: number; y: number } = {
    x: 50,
    y: 50
  }
  export let previousNode = { status: 'ready' }
  export let receipt: Receipt
  export let selectedRun: Run
  export let status: string

  let imageModalOpen = false
  let trimmedName = name.split('-')[0]

  $: receiptImage = null

  // Save the updated params to the unsavedRunStore to be referenced in Actions
  const errorClass = 'input-error'
  const handleParamChange = (event, param, index: number): void => {
    let updatedArg = Number(event?.target?.value)
    const invalid =
      updatedArg < 0 ||
      (param?.max && updatedArg > param.max) ||
      (trimmedName === 'blur' && updatedArg < param?.min)

    if (invalid) {
      // addNotification(`Param must be less than ${param.max}`)
      event.target.classList.add(errorClass)
      return
    }

    // Validate crop params relative to image size
    if (trimmedName === 'crop' && imageBitmap) {
      const invalidCropWidth =
        (param.name === 'x' || param.name === 'width') &&
        updatedArg > imageBitmap.width
      const invalidCropHeight =
        (param.name === 'y' || param.name === 'height') &&
        updatedArg > imageBitmap.height

      if (invalidCropWidth || invalidCropHeight) {
        event.target.classList.add(errorClass)
        const paramName = `${param.name
          .charAt(0)
          .toUpperCase()}${param.name.slice(1)}`
        if (invalidCropWidth) {
          addNotification(
            `${paramName} must be less than ${imageBitmap.width}`,
            'error'
          )
        }
        if (invalidCropHeight) {
          addNotification(
            `${paramName} must be less than ${imageBitmap.height}`,
            'error'
          )
        }

        return
      }
    }

    // Remove the errorClass if it's still on, because we're good at this point
    if (event.target.classList.contains(errorClass)) {
      event.target.classList.remove(errorClass)
    }

    unsavedRunStore.update(state => {
      return {
        ...state,
        ...selectedRun,
        payload: {
          ...selectedRun.payload,
          workflow: {
            ...selectedRun.payload.workflow,
            tasks: ((state?.payload
              ? state.payload
              : selectedRun?.payload) as Payload)?.workflow?.tasks?.map(
              (task, i) => {
                // This is the task we're currently editing
                if (i === Number(id) - 1) {
                  return {
                    ...task,
                    run: {
                      ...task.run,
                      input: {
                        ...task.run.input,
                        args: task.run.input.args.map((arg, k) => {
                          // This is the arg we're currently editing(+1 because the first arg is the CID)
                          if (k === index + 1) {
                            return updatedArg
                          }
                          return arg
                        })
                      }
                    }
                  }
                }
                return task
              }
            )
          }
        }
      }
    })
  }

  const handleImageModal = () => (imageModalOpen = true)

  $: {
    // Set the uploaded image to
    receiptImage = receipt?.out ? receipt.out[1] : null
  }
</script>

<Node {id} {position} connections={[...connections]}>
  <div
    class="relative w-[311px] min-h-[144px] px-2 {status === 'ready'
      ? 'border'
      : 'border-2'} {BORDER_COLOURS[status]} bg-base-100 rounded-sm"
  >
    <!-- Incoming Anchor -->
    <div
      class="absolute right-full top-2 {previousNode.status === 'running'
        ? 'running'
        : ''}"
    >
      <Anchor id={`${id}_1`} edge={Edge} input locked direction="west">
        <Edge slot="edge" {status} direction="west" />
      </Anchor>
    </div>

    <!-- Outgoing Anchor -->
    <div
      class="absolute left-full top-2 {status === 'running' ? 'running' : ''}"
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

    <!-- Status -->
    <p
      class="absolute bottom-full right-1 {status === 'ready'
        ? ''
        : '-translate-y-[2px]'} px-1 {STATUS_COLOURS[
        status || 'running'
      ]} text-code-sm font-mono border rounded-t-sm capitalize"
    >
      {#if status}
        {status}{status === 'running' ? '...' : ''}
      {:else}
        running...
      {/if}
    </p>

    <!-- Header -->
    <div
      class="flex flex-row items-center justify-between py-2 border-b {$themeStore.selectedTheme ===
      'light'
        ? 'border-base-200'
        : 'border-odd-gray-500'}"
    >
      <h4 class="text-label-m capitalize">
        {trimmedName}
        <!-- {#if name.includes('blur')}<span
            class="normal-case pl-1"
          >
            (may take a while)
          </span>{/if} -->
      </h4>
    </div>

    <!-- Params -->
    <div class="flex flex-row items-start justify-between gap-2 w-full py-2">
      <div class="flex flex-col gap-4 pt-2 {editing ? 'w-full' : ''}">
        {#each FUNCTION_PARAMS[name.toLowerCase()] as param, i}
          <div class="flex flex-col items-start gap-2">
            <label
              class="text-label-sm text-base-content capitalize font-normal"
              for={param.name}
            >
              {param.name}{#if param.note}<span class="normal-case">
                  ({param.note})
                </span>{/if}
            </label>
            <input
              class="input pl-3 py-0.5 h-8 border border-odd-gray-400 {editing
                ? 'bg-transparent w-full'
                : 'max-w-[191px] bg-base-200'} text-input-m text-base-content placeholder:text-base-content rounded-sm transition duration-200 ease-in-out"
              id={param.name}
              type={param.type}
              placeholder="Enter a number..."
              value={args[i + 1]}
              on:keyup={event => handleParamChange(event, param, i)}
              disabled={!editing}
              min="0"
              required
            />
          </div>
        {/each}
      </div>

      <!-- Don't show the image when editing -->
      {#if !editing}
        <div
          class="flex items-center justify-center w-24 h-24 {receiptImage
            ? ''
            : $themeStore.selectedTheme === 'light'
            ? 'bg-odd-gray-50'
            : 'bg-odd-gray-700'} rounded-sm"
        >
          {#if receiptImage}
            <img
              src={receiptImage}
              class="block w-full h-full object-cover border border-odd-gray-200 rounded-sm"
              alt="uploaded workflow asset"
              on:click={handleImageModal}
              on:keypress={handleImageModal}
            />
          {/if}
        </div>
      {/if}
    </div>
  </div>
</Node>

<input
  type="checkbox"
  id="result-modal"
  checked={imageModalOpen}
  class="modal-toggle"
/>

{#if imageModalOpen}
  <ImageModal
    bind:imageModalOpen
    imageSrc={receiptImage}
    receiptCID={receipt?.receiptCID}
  />
{/if}
