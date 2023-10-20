<script lang="ts">
  import type { Func } from '$lib/functions'

  export let func: Func
</script>

<div
  class="flex flex-col border border-neutral-700 bg-odd-gray-0 text-odd-gray-500 transition-colors hover:bg-odd-blue-100"
>
  <a href={`/functions/${func?.id}`}>
    <div class="p-6">
      <h3 class="mb-4 font-semibold text-heading-m">{func?.name}</h3>

      <div class="flex flex-col items-center text-body-sm w-full mt-auto">
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-300 font-[550]">Version</p>
          <p>{func?.version}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-300 font-[550]">Used by</p>
          <p>{func?.numberOfProjectsUsing} workflows</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-300 font-[550]">Last published</p>
          <p>{func?.lastModifiedTime}</p>
        </div>
      </div>
    </div>
  </a>
</div>
