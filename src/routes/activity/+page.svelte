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
  class="relative top-[1.5px] min-w-[485px] h-8 whitespace-nowrap overflo-x-scroll overflow-y-hidden"
>
  <div
    class="tabs divide-x divide-odd-gray-0 px-8 min-w-[0px] overflow-x-scroll whitespace-nowrap w-full relative"
  >
    {#each tabs as tab}
      <button
        on:click={() => handleTabClick(tab)}
        class="tab {activeTab === tab
          ? 'tab-active bg-odd-gray-0 text-odd-gray-500 !border-odd-gray-300 !border-t !border-r !border-l mx-[0.5px]'
          : 'bg-odd-gray-300 text-odd-gray-0'} capitalize text-body-sm"
      >
        {tab}
      </button>
    {/each}
  </div>
</div>

<div
  class="flex flex-col mb-4 p-4 pb-10 bg-odd-gray-0 border-odd-gray-300 border-t"
>
  {#if activeTab === tabs[0]}
    <div class="">
      <div class="flex flex-row items-center justify-end gap-2 mb-4">
        <Search bind:searchTerm placeholder="Find in logs..." />

        <button
          class="btn-filter flex flex-row items-center justify-center gap-1 px-3.5 w-[84px] h-[30px] border-2 border-odd-gray-500 bg-odd-gray-500 text-odd-gray-100 text-body-sm"
        >
          <Filter /> Filter
        </button>

        <button
          class="btn-filter flex flex-row items-center justify-center px-3 w-10 h-[30px] border-2 border-odd-gray-150 bg-odd-gray-100 text-odd-gray-500"
        >
          <VerticalDots />
        </button>
      </div>

      <div class="overflow-x-scroll">
        {#each activityLogs as log}
          <p class="text-body-xs font-mono whitespace-nowrap">{@html log}</p>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeTab === tabs[1]}
    <div class="">metrics</div>
  {/if}

  {#if activeTab === tabs[2]}
    <div class="">workflow queue</div>
  {/if}

  {#if activeTab === tabs[3]}
    <div class="">peers</div>
  {/if}

  {#if activeTab === tabs[4]}
    <div class="">receipts</div>
  {/if}
</div>
