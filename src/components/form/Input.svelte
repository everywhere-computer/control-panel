<script lang="ts">
  export let textToAppend: string = null
  export let maxWidth: string = null
  export let name: string
  export let label: string = null
  export let type: string = 'text'
  export let validationMessage: string = null
  export let value: string = null

  const valueProp = value ? { 'bind:value': value } : {}
</script>

<label class="form-control w-full {maxWidth ? `w-[${maxWidth}]` : ''}">
  {#if label}
    <div class="label">
      <span class="label-text text-label-l">{label}</span>
    </div>
  {/if}

  <div class="relative w-full">
    <input
      class="input input-bordered relative z-0 w-full h-10 !border !border-odd-gray-400 !dark:border-neutral rounded-sm {textToAppend
        ? 'pr-24'
        : ''}"
      {name}
      {type}
      {...valueProp}
    />
    {#if textToAppend}
      <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
        {textToAppend}
      </span>
    {/if}
  </div>

  {#if validationMessage}
    <div class="label">
      <span class="label-text-alt !text-input-sm">
        {@html validationMessage}
      </span>
    </div>
  {/if}
</label>
