<script lang="ts">
  import { page } from '$app/stores'
  import { marked } from 'marked'
  import sanitizeHtml from 'sanitize-html'

  import '$routes/functions/styles/markdown-styles-light.css'
  import { functionsStore } from '$src/stores'

  $: func = $functionsStore?.functions?.find(f => f?.id === $page.params.id)
</script>

<div class="py-8">
  {#if func}
    <div class="flex flex-col gap-4 mb-4">
      <h1 class="text-heading-lg">{func?.name}</h1>
      <!-- <button class="btn sm:hidden">Add to workflow</button> -->
    </div>

    <div class="flex flex-col md:flex-row gap-8">
      <div class="">
        <div class="markdown-body">
          {@html sanitizeHtml(marked(func?.description))}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <button class="btn">Add to workflow</button>
        <div class="">
          <p>Repository</p>
          <p class="font-bold text-body-sm underline text-blue-600">
            <a href={func?.repository} target="_blank" rel="noreferrer">
              {func?.repository}
            </a>
          </p>
        </div>
        <div class="">
          <p>Version</p>
          <p class="font-bold text-body-sm">
            {func?.version}
          </p>
        </div>
        <div class="">
          <p>Used in</p>
          <p class="font-bold text-body-sm">
            {func?.numberOfProjectsUsing} workflows
          </p>
        </div>
        <div class="">
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
        </div>
      </div>
    </div>
  {/if}
</div>
