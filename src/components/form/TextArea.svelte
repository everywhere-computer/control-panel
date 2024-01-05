<script lang="ts">
  export let desktopMaxWidth: boolean = false
  export let label: string = null
  export let name: string
  export let note: string = null
  export let validationMessage: string = null
</script>

<label
  class="form-control w-full max-w-[311px] {desktopMaxWidth
    ? 'max-w-[576px]'
    : ''}"
>
  {#if label}
    <div class="label">
      <span class="label-text text-label-sm">{label}</span>
    </div>
  {/if}

  <textarea
    class="textarea textarea-bordered w-full min-h-[364px] !border !border-odd-gray-400 !dark:border-neutral rounded-sm"
    {name}
  />

  {#if validationMessage}
    <div class="label">
      <span class="label-text-alt !text-input-sm">
        {@html validationMessage}
      </span>
    </div>
  {/if}

  {#if note}
    <div class="label mt-2">
      <span class="label-text-alt !text-input-sm">{@html note}</span>
    </div>
  {/if}
</label>
