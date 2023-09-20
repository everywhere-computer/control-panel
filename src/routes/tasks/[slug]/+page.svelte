<script lang="ts">
  import { page } from '$app/stores'
  import { marked } from 'marked'
  import sanitizeHtml from 'sanitize-html'

  import '$routes/tasks/styles/markdown-styles-light.css'
  import { tasksStore } from '$src/stores'

  $: task = $tasksStore?.tasks?.find(task => task?.id === $page.params.slug)
</script>

<div class="py-8">
  {#if task}
    <h1 class="text-xl mb-4">{task?.name}</h1>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="">
        <div class="markdown-body">
          {@html sanitizeHtml(marked(task?.description))}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="">
          <p>Repository</p>
          <p class="font-bold underline text-blue-600">
            <a href={task?.repository} target="_blank" rel="noreferrer">
              {task?.repository}
            </a>
          </p>
        </div>
        <div class="">
          <p>Version</p>
          <p class="font-bold">
            {task?.version}
          </p>
        </div>
        <div class="">
          <p>Used in</p>
          <p class="font-bold">
            {task?.numberOfProjectsUsing} workflows
          </p>
        </div>
        <div class="">
          <p>Last published</p>
          <p class="font-bold">
            {task?.lastModifiedTime} ago
          </p>
        </div>
        <div class="">
          <p>License</p>
          <p class="font-bold">
            {task?.license}
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
