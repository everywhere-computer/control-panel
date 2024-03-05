<script lang="ts">
  import '@jsfe/system'
  import { createEventDispatcher, onMount } from 'svelte'

  import { themeStore } from '$lib/stores'
  import DragHandle from '$components/icons/DragHandle.svelte'

  const dispatch = createEventDispatcher()

  export let handleSubmitWorkflow = () => {}
  export let schemas
  export let formValidStates

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

      if (e.target.classList.contains('drag-handle')) {
        e.target.classList.add('!cursor-grabbing')
        draggableItem = e.target.closest('.drag-item')
      }

      if (!draggableItem) return

      pointerStartX = e.clientX || (e.touches?.[0]?.clientX as number)
      pointerStartY = e.clientY || (e.touches?.[0]?.clientY as number)

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
          item.dataset.isAbove = true
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

      const clientX = e.clientX || (e.touches![0].clientX as number)
      const clientY = e.clientY || (e.touches![0].clientY as number)

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
            item.dataset.isToggled = true
          } else {
            delete item.dataset.isToggled
          }
        } else {
          if (draggableItemY >= itemY) {
            item.dataset.isToggled = true
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

      if (e.target.classList.contains('drag-handle')) {
        e.target.classList.remove('!cursor-grabbing')
      }

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
          e.clientX || (e.changedTouches?.[0]?.clientX as number)
        const currentPositionY =
          e.clientY || (e.changedTouches?.[0]?.clientY as number)

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
      draggableItem.style = null
      draggableItem.classList.remove('is-draggable')
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
  <div class="relative flex flex-col items-start justify-start w-full h-full">
    <div
      class="flex flex-row items-center justify-between w-full min-h-8 px-6 mb-2"
    >
      <h2>Add params below</h2>
      <button
        disabled={!Object.values(formValidStates).every(Boolean)}
        class="btn btn-primary btn-odd-purple-500 min-w-[80px] max-h-8 ml-auto"
        on:click={handleSubmitWorkflow}
      >
        Run
      </button>
    </div>

    <div
      class="json-schema-form flex flex-col gap-6 w-full h-[calc(100%-56px)] pt-4 px-6 overflow-auto rounded-sm"
    >
      {#each schemas as schema}
        <div
          data-schema={JSON.stringify(schema)}
          class="drag-item relative p-2 bg-base-100 rounded-sm border {$themeStore.selectedTheme ===
          'light'
            ? 'border-odd-gray-400'
            : 'border-odd-gray-500'}"
        >
          {#if schemas.length > 1}
            <DragHandle
              classes="drag-handle absolute top-2 right-1.5 text-primary hover:text-base-content duration-200 ease-in-out cursor-grab"
            />
          {/if}
          <jsf-system {schema} submitButtonLabel="Run" />
        </div>
      {/each}
    </div>
  </div>
</div>
