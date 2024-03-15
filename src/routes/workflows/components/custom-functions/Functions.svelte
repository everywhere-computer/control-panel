<script lang="ts">
  import '@jsfe/system'
  import { createEventDispatcher, onMount } from 'svelte'

  import { themeStore, workflowsStore } from '$lib/stores'
  import ImageUpload from '$routes/workflows/components/custom-functions/ImageUpload.svelte'
  import Close from '$components/icons/Close.svelte'
  import PlusBoxed from '$components/icons/PlusBoxed.svelte'
  import Run from '$components/icons/Run.svelte'
  import Trash from '$components/icons/Trash.svelte'

  const dispatch = createEventDispatcher()

  export let handleSubmitWorkflow = () => {}
  export let allTimeTasksLength
  export let formValidStates
  export let loading
  export let originalSchemas
  export let schemas

  let showImageUpload = false

  // Add a new function to the list
  const handleAddFunction = (functionName: string): void => {
    // Close dropdown
    const elem = document.activeElement
    if (elem) {
      ;(elem as HTMLElement)?.blur()
    }

    const matchingSchema = originalSchemas.find(
      ({ title }) => title === functionName
    )

    dispatch('addFunction', {
      ...matchingSchema,
      id: `${matchingSchema.id.split('_')[0]}_${allTimeTasksLength + 1}`
    })
  }

  // Delete a function from the list
  const handleDeleteFunction = (functionName: string): void => {
    const matchingSchema = schemas.find(({ id }) => id === functionName)

    dispatch('deleteFunction', matchingSchema)
  }

  // Toggle visibility for the ImageUpload component
  const handleToggleImageUpload = (): boolean =>
    (showImageUpload = !showImageUpload)

  onMount(() => {
    let listContainer: HTMLElement | null

    let draggableItem: HTMLElement | null

    let pointerStartX: number
    let pointerStartY: number

    let itemsGap = 0

    let items: HTMLElement[] = []

    let prevRect: DOMRect = {} as DOMRect

    /**
     * Helpers
     */
    function getAllItems(): HTMLElement[] {
      return Array.from(listContainer.querySelectorAll('[data-schema]'))
    }

    function getIdleItems(): HTMLElement[] {
      return getAllItems().filter(
        item => !item.classList.contains('is-draggable')
      )
    }

    function isItemAbove(item: HTMLElement): boolean {
      return item.dataset.isAbove === 'true'
    }

    function isItemToggled(item: HTMLElement): boolean {
      return item.dataset.isToggled === 'true'
    }

    /**
     * Setup
     */
    function setup() {
      listContainer = document.querySelector('.json-schema-form')

      if (!listContainer) return

      listContainer.addEventListener('mousedown', dragStart)
      listContainer.addEventListener('touchstart', dragStart)

      document.addEventListener('mouseup', dragEnd)
      document.addEventListener('touchend', dragEnd)
    }

    /**
     * Drag start
     */
    function dragStart(e: MouseEvent | TouchEvent) {
      draggableItem = null

      if (
        (e.target as HTMLElement).tagName === 'JSF-SYSTEM' ||
        (e.target as HTMLElement).classList.contains('drag-item')
      ) {
        draggableItem = (e.target as HTMLElement).closest('.drag-item')
        listContainer.classList.add(
          'py-8',
          'px-6',
          'border-dashed',
          'border-primary',
          'bg-base-200',
          'cursor-move'
        )
        draggableItem.classList.add('opacity-70')
      }

      if (!draggableItem) return

      pointerStartX =
        (e as MouseEvent).clientX ||
        ((e as TouchEvent).touches?.[0]?.clientX as number)
      pointerStartY =
        (e as MouseEvent).clientY ||
        ((e as TouchEvent).touches?.[0]?.clientY as number)

      setItemsGap()
      disablePageScroll()
      initDraggableItem()
      initItemsState()
      prevRect = draggableItem.getBoundingClientRect()

      document.addEventListener('mousemove', drag)
      document.addEventListener('touchmove', drag, { passive: false })
    }

    function setItemsGap() {
      if (getIdleItems().length <= 1) {
        itemsGap = 0
        return
      }

      const item1 = getIdleItems()[0]
      const item2 = getIdleItems()[1]

      const item1Rect = item1.getBoundingClientRect()
      const item2Rect = item2.getBoundingClientRect()

      itemsGap = Math.abs(item1Rect.bottom - item2Rect.top)
    }

    function disablePageScroll() {
      listContainer.style.overflow = 'hidden'
      listContainer.style.touchAction = 'none'
    }

    function initItemsState() {
      getIdleItems().forEach((item, i) => {
        if (getAllItems().indexOf(draggableItem) > i) {
          item.dataset.isAbove = 'true'
        }
      })
    }

    function initDraggableItem() {
      draggableItem.classList.add('is-draggable')
    }

    /**
     * Drag
     */
    function drag(e: MouseEvent | TouchEvent) {
      if (!draggableItem) return

      e.preventDefault()

      const clientX =
        (e as MouseEvent).clientX ||
        ((e as TouchEvent).touches![0].clientX as number)
      const clientY =
        (e as MouseEvent).clientY ||
        ((e as TouchEvent).touches![0].clientY as number)

      const pointerOffsetX = clientX - pointerStartX
      const pointerOffsetY = clientY - pointerStartY

      draggableItem.style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`

      updateIdleItemsStateAndPosition()
    }

    function updateIdleItemsStateAndPosition() {
      const draggableItemRect = draggableItem.getBoundingClientRect()
      const draggableItemY =
        draggableItemRect.top + draggableItemRect.height / 2

      // Update state
      getIdleItems().forEach(item => {
        const itemRect = item.getBoundingClientRect()
        const itemY = itemRect.top + itemRect.height / 2
        if (isItemAbove(item)) {
          if (draggableItemY <= itemY) {
            item.dataset.isToggled = 'true'
          } else {
            delete item.dataset.isToggled
          }
        } else {
          if (draggableItemY >= itemY) {
            item.dataset.isToggled = 'true'
          } else {
            delete item.dataset.isToggled
          }
        }
      })

      // Update position
      getIdleItems().forEach(item => {
        if (isItemToggled(item)) {
          const direction = isItemAbove(item) ? 1 : -1
          item.style.transform = `translateY(${
            direction * (draggableItemRect.height + itemsGap)
          }px)`
        } else {
          item.style.transform = ''
        }
      })
    }

    /**
     * Drag end
     */
    function dragEnd(e: MouseEvent | TouchEvent) {
      if (!draggableItem) return

      listContainer.classList.remove(
        'py-8',
        'px-6',
        'border-dashed',
        'border-primary',
        'bg-base-200',
        'cursor-move'
      )
      draggableItem.classList.remove('opacity-70')

      applyNewItemsOrder(e)
      cleanup()
    }

    function applyNewItemsOrder(e: MouseEvent | TouchEvent) {
      const reorderedItems = []

      getAllItems().forEach((item, index) => {
        if (item === draggableItem) {
          return
        }
        if (!isItemToggled(item)) {
          reorderedItems[index] = item
          return
        }
        const newIndex = isItemAbove(item) ? index + 1 : index - 1
        reorderedItems[newIndex] = item
      })

      for (let index = 0; index < getAllItems().length; index++) {
        const item = reorderedItems[index]
        if (typeof item === 'undefined') {
          reorderedItems[index] = draggableItem
        }
      }

      const reorderedSchemas = []
      reorderedItems.forEach(item => {
        reorderedSchemas.push(JSON.parse(item.getAttribute('data-schema')))
        listContainer.appendChild(item)
      })

      dispatch('drop', reorderedSchemas)

      draggableItem.style.transform = ''

      requestAnimationFrame(() => {
        const rect = draggableItem.getBoundingClientRect()
        const yDiff = prevRect.y - rect.y
        const currentPositionX =
          (e as MouseEvent).clientX ||
          ((e as TouchEvent).changedTouches?.[0]?.clientX as number)
        const currentPositionY =
          (e as MouseEvent).clientY ||
          ((e as TouchEvent).changedTouches?.[0]?.clientY as number)

        const pointerOffsetX = currentPositionX - pointerStartX
        const pointerOffsetY = currentPositionY - pointerStartY

        draggableItem.style.transform = `translate(${pointerOffsetX}px, ${
          pointerOffsetY + yDiff
        }px)`
        requestAnimationFrame(() => {
          unsetDraggableItem()
        })
      })
    }

    function cleanup() {
      itemsGap = 0
      unsetItemState()
      enablePageScroll()

      document.removeEventListener('mousemove', drag)
      document.removeEventListener('touchmove', drag)
    }

    function unsetDraggableItem() {
      if (draggableItem) {
        // @ts-ignore-next-line
        draggableItem.style = null
        draggableItem.classList.remove('is-draggable')
        draggableItem = null
      }
    }

    function unsetItemState() {
      getIdleItems().forEach((item, i) => {
        delete item.dataset.isAbove
        delete item.dataset.isToggled
        item.style.transform = ''
      })
    }

    function enablePageScroll() {
      listContainer.style.overflow = ''
      listContainer.style.touchAction = ''
    }

    setup()
  })
</script>

<div class="h-full bg-base-100 rounded-sm pb-6 pt-7">
  <div
    class="relative flex flex-col items-start justify-start gap-6 w-full h-full px-6 pb-12"
  >
    <div class="flex flex-row items-center justify-between w-full min-h-8">
      <h2>Add Params Below</h2>

      <div class="flex items-center justify-center gap-2 ml-auto">
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-odd-gray-100 gap-1 h-8 px-2"
          >
            <span class="w-1 h-1 bg-base-content rounded-full" />
            <span class="w-1 h-1 bg-base-content rounded-full" />
            <span class="w-1 h-1 bg-base-content rounded-full" />
          </div>
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60"
          >
            <li>
              <button on:click={handleToggleImageUpload} class="w-full">
                Convert image to base64
              </button>
            </li>
          </ul>
        </div>

        <button
          disabled={!Object.values(formValidStates).every(Boolean) || loading}
          class="btn btn-primary btn-odd-purple-500 md:min-w-[80px] max-h-8 ml-auto"
          on:click={handleSubmitWorkflow}
        >
          <Run />
          <span class="hidden md:inline-block">Run</span>
        </button>
      </div>
    </div>

    <div
      class="json-schema-form relative flex flex-col gap-6 w-full h-[calc(100%-56px)] duration-[250] transition-all border border-base-100 overflow-auto rounded-sm -translate-y-[3px]"
    >
      {#each schemas as schema, index (schema.id)}
        <div
          data-schema={JSON.stringify(schema)}
          class="drag-item relative p-2 bg-base-100 rounded-sm cursor-move transition-colourOpacityShadow border {$themeStore.selectedTheme ===
          'light'
            ? 'border-odd-gray-400'
            : 'border-odd-gray-500'} shadow-sm {$workflowsStore.highlightedFunction ===
          schema.id
            ? 'shadow-md !border-primary'
            : ''}"
        >
          {#key schemas}
            {#if index > 0}
              <button
                on:click={() => handleDeleteFunction(schema.id)}
                class="absolute top-0 right-0.5 p-2 text-primary hover:text-base-content duration-200 ease-in-out"
              >
                <Trash />
              </button>
            {/if}
          {/key}
          <jsf-system {schema} submitButtonLabel="Run" />
        </div>
      {/each}
    </div>

    <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
      <div class="dropdown dropdown-top">
        <div tabindex="0" role="button" class="btn btn-odd-gray-100 h-8 px-2">
          <PlusBoxed />
          <span class="hidden md:inline-block">Add a function</span>
        </div>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {#each originalSchemas as schema}
            <li>
              <button
                on:click={() => handleAddFunction(schema.title)}
                class="capitalize"
              >
                {schema.title}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>

<input
  type="checkbox"
  id="image-upload-modal"
  checked={showImageUpload}
  class="modal-toggle"
/>

{#if showImageUpload}
  <div class="modal">
    <div
      class="relative flex flex-col items-center justify-center gap-4 pt-16 px-4 pb-4 bg-base-200/80 rounded-sm"
    >
      <button
        on:click={() => (showImageUpload = false)}
        class="absolute top-4 right-4 btn btn-odd-gray-900 flex items-center justify-center gap-1 px-0 w-8 h-8 bg-odd-gray-700 text-odd-gray-100 text-body-sm"
      >
        <Close />
      </button>
      <ImageUpload imageModalOpen={showImageUpload} />
    </div>
  </div>
{/if}
