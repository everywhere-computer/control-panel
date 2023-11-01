<script lang="ts">
  import type { Func } from '$lib/functions'

  export let func: Func
</script>

<div
  class="flex flex-col bg-base-100 text-odd-gray-700 border border-transparent transition-colors hover:border-primary rounded-sm"
>
  <a href={`/functions/${func?.id}`}>
    <div class="p-6">
      <h3 class="mb-4 text-heading-sm text-odd-purple-500">{func?.name}</h3>

      <div class="flex flex-col items-center text-body-sm w-full mt-auto">
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-500 text-label-m">Version</p>
          <p class="text-body-m">{func?.version}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-500 text-label-m">Used by</p>
          <p class="text-body-m">{func?.numberOfProjectsUsing} workflows</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-odd-gray-500 text-label-m">Last published</p>
          <p class="text-body-m">{func?.lastModifiedTime}</p>
        </div>
      </div>
    </div>
  </a>
</div>
