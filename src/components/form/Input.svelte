<script lang="ts">
  export let desktopMaxWidth: boolean = false
  export let error: boolean = false
  export let label: string = null
  export let name: string
  export let onInput: () => void = () => {}
  export let required: boolean = false
  export let textToAppend: string = null
  export let type: string = 'text'
  export let validationMessage: string = null
  export let value: string = null

  const valueProp = value ? { 'bind:value': value } : {}
</script>

<label
  class="form-control w-full max-w-[311px] {desktopMaxWidth
    ? 'max-w-[576px]'
    : ''}"
>
  {#if label}
    <div class="label">
      <span class="label-text text-label-l">{label}</span>
    </div>
  {/if}

  <div class="relative w-full">
    <input
      class="input input-bordered {error
        ? 'input-error'
        : ''} relative z-0 w-full h-10 !border !border-odd-gray-400 !dark:border-neutral rounded-sm {textToAppend
        ? 'pr-24'
        : ''}"
      {name}
      {required}
      {type}
      {...valueProp}
      on:input={onInput}
    />
    {#if textToAppend}
      <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
        {textToAppend}
      </span>
    {/if}
  </div>

  {#if validationMessage}
    <div class="label">
      <span class="label-text-alt !text-input-sm {error ? 'text-error' : ''}">
        {@html validationMessage}
      </span>
    </div>
  {/if}
</label>
