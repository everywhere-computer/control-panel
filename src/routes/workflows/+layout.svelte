<script lang="ts">
  import * as odd from '@oddjs/odd'
  // import type { PuttableUnixTree, File as WNFile } from '@oddjs/odd/fs/types'
  import { onMount } from 'svelte'
  import * as uint8arrays from 'uint8arrays'

  import { filesystemStore, themeStore, workflowsStore } from '$lib/stores'
  import { WORKFLOWS_DIR } from '$lib/workflows'

  // Load saved workflows from WNFS
  onMount(async () => {
    const workflowsFilePath = odd.path.combine(
      WORKFLOWS_DIR,
      odd.path.file('workflows.json')
    )
    const workflowsDirExists = await $filesystemStore.exists(workflowsFilePath)
    if (workflowsDirExists && $workflowsStore.workflows.length === 3) {
      const workflowsFromWNFS = await $filesystemStore.get(workflowsFilePath)
      const parsedWorkflows = JSON.parse(
        // @ts-ignore-next-line
        uint8arrays.toString(workflowsFromWNFS.content)
      )
      $workflowsStore.workflows = parsedWorkflows
    }
  })
</script>

<slot />
