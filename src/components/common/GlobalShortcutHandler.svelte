<script lang="ts">
  import { workflowsStore } from '$lib/stores'
  import GlobalShortcutView from '$components/common/GlobalShortcutView.svelte'
  import WorkflowBuilder from '$routes/workflows/components/WorkflowBuilder.svelte'

  type KeyMap = {
    [key: string]: () => void
  }

  let showShortcuts = false

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
    Shift: () => (showShortcuts = true)
  }

  // Only register key strokes from the keyMap
  const allowedKeys = Object.keys(keyMap)

  // Shortcuts are disabled if these elements are focused on
  const formElements = ['input', 'select', 'textarea']

  // Enable global keyboard shortcuts if the user has not focused on a form element
  const handleKeyDown = (event: KeyboardEvent): void => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (!formElements.includes(tagName) && allowedKeys.includes(key)) {
      keyMap[key]()
    }
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (!formElements.includes(tagName) && key === 'Shift') {
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
