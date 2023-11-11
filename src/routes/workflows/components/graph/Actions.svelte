<script lang="ts">
  import { unsavedRunStore, workflowsStore } from '$lib/stores'
  import { runWorkflow, type Workflow, type Run as RunType, type Payload } from '$lib/workflows/index'
  import { CROP_PARAMS } from '$routes/workflows/lib/graph'
  import Duplicate from '$components/icons/Duplicate.svelte'
  import Edit from '$components/icons/Edit.svelte'
  import Run from '$components/icons/Run.svelte'
  import Hamburger from '$components/icons/Hamburger.svelte'
  import { addNotification } from '$lib/notifications'

  export let selectedRun: RunType
  export let selectedRunIndex: number
  export let sidebarOpen: boolean
  export let editing: boolean
  export let uploadedImage: string
  export let workflow: Workflow

  $: runDisabled = workflow?.status === 'running' || !uploadedImage
  $: showDuplicateButton = workflow?.runs?.length > 0 && selectedRun?.status !== 'ready' && !editing
  $: showEditButton = (workflow?.runs?.length > 0 && selectedRun?.status === 'ready') && uploadedImage && !editing
  $: showRunButton = workflow?.runs?.length > 0 ? selectedRun?.status === 'ready' : !workflow?.runs?.length

  // Duplicate the selectedRun
  const handleDuplicateRun = async () => {
    workflowsStore.update(state => {
      const updatedWorkflows = state.workflows.map((w) => {
        if (w.id === workflow.id) {
          const runIndex = w.runs.length + 1
          const runName = `${w.payload.name}_${
            runIndex
          }`

          return {
            ...w,
            runs: [
              {
                ...selectedRun,
                name: runName,
                label: `run ${
                  runIndex
                }`,
                payload: {
                  ...selectedRun.payload,
                  name: runName,
                },
                receipts: [],
                status: 'ready',
              },
              ...w.runs,
            ],
            status: 'ready',
          }
        }

        return w
      })

      return {
        ...state,
        workflows: updatedWorkflows,
      }
    })
  }

  // Toggle editing state
  const handleEditRun = (cancel: boolean = false): void => {
    editing = !editing

    // Clear the unsavedRunStore
    if (cancel) {
      unsavedRunStore.update(() => ({}))
    } else {
      unsavedRunStore.update(() => selectedRun)
    }
  }

  // Invoke run
  const handleInvokeRun = async (): Promise<void> => {
    if (workflow?.runs?.length > 0) {
      await runWorkflow(workflow?.id, uploadedImage, selectedRun?.payload, selectedRun?.status)
    } else {
      await runWorkflow(workflow?.id, uploadedImage)
    }
  }

  // Save run
  const handleSaveRun = async (cancel: boolean = false): Promise<void> => {
    if (uploadedImage) {
      // @ts-ignore-next-line
      const cropTask = ($unsavedRunStore?.payload as Payload)?.workflow?.tasks?.find(t => t?.run?.input?.func?.includes('crop'))
      const blob = await (await fetch(uploadedImage)).blob()
      const imageBitmap = await createImageBitmap(blob)
      const errorId = document.querySelector('.input-error')?.id
      const errorMessage = 'Invalid params'
      const invalidCropError = cropTask && cropTask.run.input.args.filter((a, i) => {
        // Crop x or width ex
        if (((i === 1 || i === 3) && a > imageBitmap.width) || ((i === 2 || i === 4) && a > imageBitmap.height)) {
          return true
        }

        // Crop x + width or y + height exceed image width or height
        if (i === 3 && (cropTask.run.input.args[i - 2] + a ) > imageBitmap.width || i === 4 && (cropTask.run.input.args[i - 2] + a ) > imageBitmap.height) {
          return true
        }

        return false
      })?.length

      if ((errorId && CROP_PARAMS.find(p => p.name === errorId)) || invalidCropError) {
        addNotification(`Crop x + width must be less than ${imageBitmap.width} and crop y + height must be less than ${imageBitmap.height}`, 'error', 7000)
        throw new Error(errorMessage)
      }

      if (errorId) {
        addNotification(errorMessage, 'error')
        throw new Error(errorMessage)
      }
    }

    workflowsStore.update((state) => ({
      ...state,
      // @ts-ignore-next-line
      workflows: state.workflows.map((w) => {
        if (w.id === workflow.id) {
          return {
            ...w,
            runs: w.runs.map(r => {
              if (r.label === selectedRun.label) {
                return $unsavedRunStore
              }

              return r
            })
          }
        }

        return w
      })
    }))

    if (cancel) {
      editing = false
    }
  }

  // Save and invoke run
  // - if no runs have been created yet, pass in the default workflow payload
  // - if runs have been created, pass in the currently selected run payload
  const handleSaveAndInvokeRun = async (): Promise<void> => {
    try {
      await handleSaveRun()

      if ($unsavedRunStore?.payload) {
        await runWorkflow(workflow?.id, uploadedImage, $unsavedRunStore?.payload, $unsavedRunStore?.status)
      } else {
        await runWorkflow(workflow?.id, uploadedImage)
      }

      editing = false
    } catch (error) {
      console.error(error)
    }
  }

  // Toggle the sidebar on mobile
  const handleToggleSidebar = () => (sidebarOpen = !sidebarOpen)
</script>

<div
  class="absolute top-0 right-0 left-0 z-30 flex items-center justify-between w-full pl-[58px] pr-4 md:pl-4 py-2 bg-base-200"
>
  <div class="flex items-center pl-">
    <button
      on:click={handleToggleSidebar}
      class="absolute top-0 bottom-0 left-0 flex items-center justify-center border-r border-base-100 w-10 bg-base-200 md:hidden"
    >
      <Hamburger />
    </button>
    <p class="text-code-m font-mono">Run {selectedRunIndex}</p>
  </div>

  <div class="flex flex-row items-center gap-2">
    {#if showDuplicateButton}
      <button
        on:click={handleDuplicateRun}
        class="btn btn-odd-gray-100 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
      >
        <Duplicate /> Duplicate
      </button>
    {/if}

    {#if showEditButton}
      <button
        on:click={() => handleEditRun()}
        class="btn btn-odd-gray-100 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
      >
        <Edit /> Edit
      </button>
    {/if}

    {#if editing}
      <button
        on:click={() => handleEditRun(true)}
        class="btn btn-odd-gray-100 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
      >
        Cancel
      </button>

      <button
        on:click={() => handleSaveRun(true)}
        class="btn btn-primary btn-odd-purple-500 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
      >
        Save
      </button>

      <button
        on:click={handleSaveAndInvokeRun}
        disabled={runDisabled}
        class="btn btn-primary btn-odd-purple-500 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
      >
        Save & Run
      </button>
    {:else if showRunButton}
      <button
        on:click={handleInvokeRun}
        disabled={runDisabled}
        class="btn btn-primary btn-odd-purple-500 flex flex-row items-center justify-center gap-1 px-2 py-0 !h-[28px] !text-label-sm"
      >
        <Run /> Run
      </button>
    {/if}
  </div>
</div>
