<script lang="ts">
  type ShortcupMap = {
    [key: string]: string
  }

  const globalShortcutMap: ShortcupMap = {
    shift: 'View keyboard shortcuts menu',
    n: 'Show workflow builder',
    'esc (in workflow builder)': 'Hide workflow builder',
    'a (in workflow builder)': 'Add function to workflow',
    's (in workflow builder)': 'Save workflow',
    'alt/option + ->': 'Navigate to next page',
    'alt/option + <-': 'Navigate to previous page'
  }
</script>

<div
  class="hidden md:flex flex-col justify-center gap-4 absolute z-[60] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-sm bg-base-200/80"
>
  {#each Object.keys(globalShortcutMap) as key}
    <div class="flex gap-4 items-center justify-start">
      <kbd
        class="min-w-fit px-2 py-1.5 text-xs font-semibold text-base-content bg-base-100 border border-base-content rounded-sm"
      >
        {key}
      </kbd>
      <span
        class="flex flex-row items-center gap-4 min-w-fit text-base-content font-mono"
      >
        -
        <p class="justify-self-end">{globalShortcutMap[key]}</p>
      </span>
    </div>
  {/each}
</div>
