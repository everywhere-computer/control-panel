<script lang="ts">
  import { tasksStore } from '$src/stores'

  let searchTerm = ''
  $: tasks = searchTerm
    ? $tasksStore?.tasks?.filter(task =>
        task?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    : $tasksStore?.tasks

  const handleClearSearch = () => (searchTerm = '')
</script>

<h1 class="text-2xl mb-4">Tasks</h1>

<div class="flex flex-row justify-end w-full mb-4 relative">
  <input
    type="text"
    placeholder="Search tasks"
    class="input border border-neutral-700 rounded-full w-full sm:max-w-xs pr-8 relative z-0"
    bind:value={searchTerm}
    on:keydown={event => {
      if (event.key === 'Escape') {
        handleClearSearch()
      }
    }}
  />
  <button
    on:click={handleClearSearch}
    class="absolute z-10 top-1/2 right-4 -translate-y-1/2 font-fold"
  >
    x
  </button>
</div>

<div
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
>
  {#each tasks as task}
    <div
      class="flex flex-col border border-neutral-700 rounded-lg bg-white text-neutral-900 transition-colors hover:bg-orange-50"
    >
      <a href={`/tasks/${task?.id}`}>
        <div class="px-4 py-2">
          <h3>{task?.name}</h3>

          <div class="flex flex-col gap-1 ml-auto sm:self-end w-fit mt-auto">
            <div class="flex flex-row gap-4 items-center justify-center">
              <div class="flex flex-col">
                <p class="text-xs">Version</p>
                <p class="font-bold">{task?.version}</p>
              </div>
              <div class="flex flex-col">
                <p class="text-xs">Used by</p>
                <p class="font-bold">
                  {task?.numberOfProjectsUsing} workflows
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full px-4 py-2 border-t border-neutral-700 self-end text-right"
        >
          <p class="text-xs">Last published {task?.lastModifiedTime} ago</p>
        </div>
      </a>
    </div>
  {/each}
</div>
