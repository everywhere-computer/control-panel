<script lang="ts">
  import { page } from '$app/stores'
  import { marked } from 'marked'
  import sanitizeHtml from 'sanitize-html'

  import '$routes/tasks/styles/markdown-styles-light.css'
  import { tasksStore } from '$src/stores'

  $: task = $tasksStore?.tasks?.find(task => task?.id === $page.params.id)
</script>

<div class="py-8">
  {#if task}
    <div class="flex flex-col gap-4 mb-4">
      <h1 class="text-xl">{task?.name}</h1>
      <!-- <button class="btn sm:hidden">Add to workflow</button> -->
    </div>

    <div class="flex flex-col md:flex-row gap-8">
      <div class="">
        <div class="markdown-body">
          {@html sanitizeHtml(marked(task?.description))}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <button class="btn">Add to workflow</button>
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
