<script lang="ts">
  import { onMount } from 'svelte'

  import Filter from '$components/icons/Filter.svelte'
  import Search from '$components/common/Search.svelte'
  import Tabs from '$components/common/Tabs.svelte'
  import VerticalDots from '$components/icons/VerticalDots.svelte'
  import logs from '$routes/activity/lib/log-mocks'
  import { requestMetrics } from '$lib/metrics'

  let searchTerm = ''

  const tabs = ['logs', 'metrics', 'workflow queue', 'peers', 'receipts']
  let activeTab = 'logs'

  $: activityLogs = searchTerm
    ? logs.filter(log => log.toLowerCase().includes(searchTerm?.toLowerCase()))
    : logs

  onMount(async () => {
    const metrics = await requestMetrics()
    console.log('metrics', metrics)
  })
</script>

<Tabs {tabs} bind:activeTab />

<div
  class="relative z-0 flex flex-col py-4 pb-10 bg-odd-gray-0 border-y-base-300 border-t"
>
  {#if activeTab === tabs[0]}
    <div class="">
      <div class="flex flex-row items-center justify-end gap-2 px-4 mb-4">
        <Search bind:searchTerm placeholder="Find in logs..." />

        <button
          class="btn-odd-gray-900 flex flex-row items-center justify-center gap-1 px-3.5 h-[30px] bg-odd-gray-700 text-odd-gray-100 text-body-sm"
        >
          <Filter /> Filter
        </button>

        <button
          class="btn-odd-gray-100 flex flex-row items-center justify-center px-2 h-[30px] bg-odd-gray-100 text-odd-gray-700"
        >
          <VerticalDots />
        </button>
      </div>

      <div class="px-4 pb-4 overflow-x-scroll">
        {#each activityLogs as log}
          <p class="text-code-m font-mono whitespace-nowrap">{@html log}</p>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeTab === tabs[1]}
    <div class="px-4">metrics</div>
  {/if}

  {#if activeTab === tabs[2]}
    <div class="px-4">workflow queue</div>
  {/if}

  {#if activeTab === tabs[3]}
    <div class="px-4">peers</div>
  {/if}

  {#if activeTab === tabs[4]}
    <div class="px-4">receipts</div>
  {/if}
</div>
