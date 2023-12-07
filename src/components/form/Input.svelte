<script lang="ts">
  export let maxWidth: string = null
  export let name: string
  export let label: string = null
  export let type: string = 'text'
  export let validationMessage: string = null
</script>

<label class="form-control {maxWidth ? `w-[${maxWidth}]` : ''}">
  {#if label}
    <div class="label">
      <span class="label-text text-label-sm">{label}</span>
    </div>
  {/if}

  <input
    class="input input-bordered w-full h-10 !border !border-odd-gray-400 !dark:border-neutral rounded-sm"
    {name}
    {type}
  />

  {#if validationMessage}
    <div class="label">
      <span class="label-text-alt !text-input-sm">
        {@html validationMessage}
      </span>
    </div>
  {/if}
</label>
