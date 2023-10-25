<script lang="ts">
  import Filter from '$components/icons/Filter.svelte'
  import Search from '$components/common/Search.svelte'
  import VerticalDots from '$components/icons/VerticalDots.svelte'
  import logs from '$routes/activity/lib/log-mocks'

  let searchTerm = ''

  const tabs = ['logs', 'metrics', 'workflow queue', 'peers', 'receipts']
  let activeTab = 'logs'
  const handleTabClick = (tab: string) => {
    activeTab = tab
  }

  $: activityLogs = searchTerm
    ? logs.filter(log => log.toLowerCase().includes(searchTerm?.toLowerCase()))
    : logs
</script>

<div
  class="min-w-[0px] relative top-[1px] z-10 h-8 px-8 whitespace-nowrap overflow-x-scroll"
>
  {#each tabs as tab}
    <button
      on:click={() => handleTabClick(tab)}
      class="tab {activeTab === tab
        ? 'tab-active top-[0px] bg-odd-gray-0 text-odd-gray-700 !border-odd-gray-500 !border-t !border-t !border-r !border-l'
        : 'bg-odd-gray-200 text-odd-gray-700 border-odd-gray-500 border-b'} relative mr-0.5 capitalize text-label-sm rounded-t-sm"
    >
      {tab}
      {#if activeTab !== tab}
        <span
          class="absolute right-0 bottom-0 left-0 h-[1px] bg-odd-gray-500"
        />
      {/if}
    </button>
  {/each}
</div>

<div
  class="relative z-0 flex flex-col mb-4 pt-4 pb-10 bg-odd-gray-0 border-odd-gray-500 border-t"
>
  {#if activeTab === tabs[0]}
    <div class="">
      <div class="flex flex-row items-center justify-end gap-2 px-4 mb-4">
        <Search bind:searchTerm placeholder="Find in logs..." />

        <button
          class="btn-odd-gray-900 btn-filter flex flex-row items-center justify-center gap-1 px-3.5 h-[30px] bg-odd-gray-700 text-odd-gray-100 text-body-sm"
        >
          <Filter /> Filter
        </button>

        <button
          class="btn-odd-gray-700 btn-filter flex flex-row items-center justify-center px-3 h-[30px] bg-odd-gray-100 text-odd-gray-700"
        >
          <VerticalDots />
        </button>
      </div>

      <div class="px-4 overflow-x-scroll">
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
