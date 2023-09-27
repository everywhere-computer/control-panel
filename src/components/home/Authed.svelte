<script lang="ts">
  import { projectsStore } from '$src/stores'
</script>

<h1 class="text-2xl mb-4">Projects</h1>

<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
  {#each $projectsStore?.projects as project}
    <div
      class="flex flex-col border border-neutral-700 rounded-lg bg-white text-neutral-900 transition-colors hover:bg-orange-50"
    >
      <a href={`/projects/${project?.id}`}>
        <div class="px-4 py-2">
          <h3>{project?.name}</h3>
          <p>{project?.uri}</p>

          <!-- <div class="flex flex-col gap-1 ml-auto sm:self-end w-fit mt-auto">
            <div class="flex flex-row gap-4 items-center justify-center">
              <div class="flex flex-col">
                <p class="text-xs">Version</p>
                <p class="">{project?.description}</p>
              </div>
            </div>
          </div> -->
        </div>
        <div
          class="w-full px-4 py-2 border-t border-neutral-700 self-end text-right"
        >
          <p class="text-xs">Last updated {project?.lastModifiedTime} ago</p>
        </div>
      </a>
    </div>
  {/each}
</div>
