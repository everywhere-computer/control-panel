<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import { workflowsStore } from '$lib/stores'
  import GlobalShortcutView from '$components/common/GlobalShortcutView.svelte'
  import WorkflowBuilder from '$routes/workflows/components/WorkflowBuilder.svelte'

  type KeyMap = {
    [key: string]: () => void
  }

  let showShortcuts = false
  let altKeyCurrentlyPressed = false

  // Order of pages to move through when pressing Alt + Left/Right
  const pages = ['', 'activity', 'workflows', 'functions', 'settings']

  // Map keys to actions
  const keyMap: KeyMap = {
    Escape: () => {
      if ($workflowsStore.showBuilder) {
        $workflowsStore.showBuilder = false
      }
    },
    n: () => {
      if (!$workflowsStore.showBuilder) {
        $workflowsStore.showBuilder = true
      }
    },
    '/': () => (showShortcuts = true)
  }

  // Only register key strokes from the keyMap
  const allowedKeys = Object.keys(keyMap)

  // Shortcuts are disabled if these elements are focused on
  const formElements = ['input', 'select', 'textarea']

  // Enable global keyboard shortcuts if the user has not focused on a form element
  const handleKeyDown = (event: KeyboardEvent): void => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (key === 'Alt') {
      altKeyCurrentlyPressed = true
    }

    // Navigate to the next top-level page
    if (altKeyCurrentlyPressed && key === 'ArrowRight') {
      const pageIndex = pages.indexOf($page.route.id.split('/')[1]) + 1
      goto(`/${pageIndex > pages.length - 1 ? pages[0] : pages[pageIndex]}`)
    }

    // Navigate to the previous top-level page
    if (altKeyCurrentlyPressed && key === 'ArrowLeft') {
      const pageIndex = pages.indexOf($page.route.id.split('/')[1]) - 1
      goto(`/${pageIndex < 0 ? pages[pages.length - 1] : pages[pageIndex]}`)
    }

    if (!formElements.includes(tagName) && allowedKeys.includes(key)) {
      keyMap[key]()
    }
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (key === 'Alt') {
      altKeyCurrentlyPressed = false
    }

    if (!formElements.includes(tagName) && key === '/') {
      showShortcuts = false
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

{#if showShortcuts}
  <GlobalShortcutView />
{/if}

{#if $workflowsStore.showBuilder}
  <WorkflowBuilder bind:showBuilder={$workflowsStore.showBuilder} />
{/if}
