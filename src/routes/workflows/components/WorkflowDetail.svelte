<script lang="ts">
  import { JsonView } from '@zerodevx/svelte-json-view'
  import { slide } from 'svelte/transition'
  import { quartOut } from 'svelte/easing'

  import { prepareWorkflow } from '$lib/workflows'

  export let uploadedImage
  export let workflowRun

  let preparedWorkflow

  const processWorkflow = async () => {
    preparedWorkflow = await prepareWorkflow(workflowRun.payload, uploadedImage)
  }

  $: {
    if (workflowRun) {
      preparedWorkflow = processWorkflow()
    }
  }
</script>

<div
  transition:slide={{ delay: 50, duration: 500, easing: quartOut }}
  class="absolute w-screen h-[calc(100vh-48px)] top-12 z-50 bg-white"
>
  <div class="w-full h-full">
    <div class="p-4 overflow-y-auto scrollbar-hide">
      <div class="text-lg uppercase font-medium">Raw workflow for Homestar</div>
      {#if preparedWorkflow}
        <div class="jsonview">
          {#await preparedWorkflow then workflowOne}
            <JsonView json={workflowOne} />
          {/await}
        </div>
      {/if}
    </div>
  </div>
</div>
