<script lang="ts">
  import { onDestroy } from 'svelte'
  import { page } from '$app/stores'

  import { themeStore, workflowsStore } from '$lib/stores'
  import { timeSinceNow } from '$lib/utils'
  // import Logs from '$routes/workflows/components/Logs.svelte'
  // import Metrics from '$routes/workflows/components/Metrics.svelte'
  import RunsAndReceipts from '$routes/workflows/components/RunsAndReceipts.svelte'
  // import Tabs from '$components/common/Tabs.svelte'

  $: workflow = $workflowsStore?.workflows?.find(
    workflow => workflow?.id === $page.params.id
  )

  // const tabs = ['runs & receipts', 'metrics', 'triggers', 'logs']
  // let activeTab = 'runs & receipts'

  $: timeSinceLastRun = timeSinceNow(workflow.lastRunTime)

  $: stats = [
    {
      label: 'Completed Runs',
      value: workflow?.runs?.length
        ? workflow?.runs.filter(w => w.status === 'completed')?.length
        : 0
    },
    {
      label: 'Failed Runs',
      value: workflow?.runs?.length
        ? workflow?.runs.filter(w => w.status === 'failed')?.length
        : 0
    },
    {
      label: 'From Cache Runs',
      value: workflow?.runs?.length
        ? workflow?.runs.filter(w => w.status === 'from cache')?.length
        : 0
    },
    {
      label: 'Last Completed Run',
      value: timeSinceLastRun || 'None yet'
    }
    // { label: 'Custom Domains', value: workflow.customDomains },
    // { label: 'Routes', value: workflow.routes },
    // { label: 'Cron Triggers', value: workflow.cronTriggers },
    // { label: 'Connected Workflows', value: workflow.connectedWorkflows }
  ]

  // Check for the time since the last run
  const interval = setInterval(() => {
    timeSinceLastRun = timeSinceNow(workflow.lastRunTime)
  }, 3000)

  $: {
    timeSinceLastRun = timeSinceNow(workflow.lastRunTime)
  }

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<div class="pt-2">
  {#if workflow}
    <div
      class="w-full max-w-[800px] m-auto mb-8 px-4 rounded-sm overflow-hidden"
    >
      <div class="flex flex-row items-center justify-start mb-5">
        <h1 class="text-heading-2xl font-bold">{workflow.name}</h1>
      </div>

      <div
        class="flex flex-col md:flex-row w-full divide-x {$themeStore.selectedTheme ===
        'light'
          ? 'divide-odd-gray-50'
          : 'divide-odd-gray-900'} items-center w-full text-label-sm text-odd-gray-400"
      >
        {#each stats as stat}
          <div
            class="flex flex-col items-center justify-center md:basis-1/4 w-full md:w-auto text-odd-gray-700"
          >
            <p
              class="w-full py-2 {$themeStore.selectedTheme === 'light'
                ? 'bg-odd-gray-200 divide-odd-gray-300 border-odd-gray-300'
                : 'bg-base-200 text-base-content divide-odd-gray-900 border-odd-gray-900'} text-center border-b"
            >
              {stat.label}
            </p>
            <p
              class="w-full py-2 {$themeStore.selectedTheme === 'light'
                ? 'bg-base-200'
                : 'bg-base-100 text-base-content'} text-body-lg text-center"
            >
              {stat.value}
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- <Tabs {tabs} bind:activeTab /> -->

    <div
      class="relative z-0 flex flex-col md:border-t md:border-y-base-300 bg-odd-gray-0"
    >
      <!-- {#if activeTab === tabs[0]} -->
      <RunsAndReceipts bind:workflow />
      <!-- {/if}

      {#if activeTab === tabs[1]}
        <div class="px-4 py-8">
          <Metrics />
        </div>
      {/if}

      {#if activeTab === tabs[2]}
        <div class="p-4">triggers</div>
      {/if}

      {#if activeTab === tabs[3]}
        <div class="">
          <Logs />
        </div>
      {/if} -->
    </div>
  {/if}
</div>
