<script lang="ts">
  import { page } from '$app/stores'
  // import { marked } from 'marked'
  // import sanitizeHtml from 'sanitize-html'

  import '$routes/functions/styles/markdown-styles-light.css'
  import { functionsStore, workflowsStore } from '$lib/stores'
  import generateBuilderTemplate from '$lib/workflows/builder/builder-template'

  $: func = $functionsStore?.functions?.find(f => f?.id === $page.params.id)

  $: workflowsUsedBy = $workflowsStore.workflows.filter(w =>
    w.payload.workflow.tasks.find(t =>
      // @ts-ignore-next-line
      t.run.input.func.includes(func.name.toLowerCase())
    )
  )?.length

  const handleShowBuilder = () => {
    $workflowsStore.builder = generateBuilderTemplate(workflowsStore, func.slug)
    $workflowsStore.showBuilder = true
  }
</script>

<div class="max-w-[800px] m-auto py-8">
  {#if func}
    <div class="flex flex-col gap-4 mb-4">
      <h1 class="text-heading-lg">{func.name}</h1>
    </div>

    <div class="flex flex-col md:flex-row gap-8 justify-between w-full">
      <div class="grow">
        <div class="p-4 bg-base-100 rounded-sm text-code-m font-mono">
          <!-- {@html sanitizeHtml(marked(func?.description))} -->
          {func.description}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <button
          on:click={handleShowBuilder}
          class="btn btn-primary btn-odd-purple-500 btn-sm min-w-[150px]"
        >
          Add to workflow
        </button>
        <div class="">
          <p>Documentation</p>
          <p class="font-bold text-body-sm underline text-blue-600">
            <a
              class="text-primary"
              href={func.repository}
              target="_blank"
              rel="noreferrer"
            >
              Visit docs
            </a>
          </p>
        </div>
        <div class="">
          <p>Version</p>
          <p class="font-bold text-body-sm">
            {func.version}
          </p>
        </div>
        <div class="">
          <p>Used in</p>
          <p class="font-bold text-body-sm">
            {workflowsUsedBy} workflows
          </p>
        </div>
        <!-- <div class="">
          <p>Last published</p>
          <p class="font-bold text-body-sm">
            {func?.lastModifiedTime} ago
          </p>
        </div>
        <div class="">
          <p>License</p>
          <p class="font-bold text-body-sm">
            {func?.license}
          </p>
        </div> -->
      </div>
    </div>
  {/if}
</div>
