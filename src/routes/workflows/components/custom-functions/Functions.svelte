<script lang="ts">
  import '@jsfe/system'

  import { themeStore } from '$lib/stores'

  export let handleSubmitWorkflow = () => {}
  export let schemas
  export let formValidStates
</script>

<div class="h-full bg-base-100 rounded-sm p-6 pt-7">
  <div
    class="relative flex flex-col items-start justify-start gap-4 w-full h-full"
  >
    <div class="flex flex-row items-center justify-between w-full min-h-8 mb-2">
      <h2>Add params below</h2>
      <button
        disabled={!Object.values(formValidStates).every(Boolean)}
        class="btn btn-primary btn-odd-purple-500 min-w-[80px] max-h-8 ml-auto"
        on:click={handleSubmitWorkflow}
      >
        Run
      </button>
    </div>

    <div
      class="json-schema-form flex flex-col gap-6 w-full h-[calc(100%-56px)] overflow-auto rounded-sm"
    >
      {#each schemas as schema}
        <div
          data-schema={JSON.stringify(schema)}
          class="p-2 bg-base-100 rounded-sm border {$themeStore.selectedTheme ===
          'light'
            ? 'border-odd-gray-400'
            : 'border-odd-gray-500'}"
        >
          <jsf-system {schema} submitButtonLabel="Run" />
        </div>
      {/each}
    </div>
  </div>
</div>
