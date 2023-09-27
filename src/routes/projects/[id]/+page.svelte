<script lang="ts">
  import { page } from '$app/stores'

  import { projectsStore } from '$src/stores'

  $: project = $projectsStore?.projects?.find(
    project => project?.id === $page.params.id
  )
</script>

<div class="py-8">
  {#if project}
    <h1 class="text-xl mb-4">{project?.name}</h1>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="">
        <div class="markdown-body">
          {project?.description}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="">
          <p>URI</p>
          <p class="font-bold underline text-blue-600">
            <a href={project?.uri} target="_blank" rel="noreferrer">
              {project?.uri}
            </a>
          </p>
        </div>
        <div class="">
          <p>Last modified</p>
          <p class="font-bold">
            {project?.lastModifiedTime} ago
          </p>
        </div>
        <div class="">
          <p>Teams</p>
          <p class="font-bold">
            {project?.teams}
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
