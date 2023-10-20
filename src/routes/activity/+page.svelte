<script lang="ts">
  import Filter from '$components/icons/Filter.svelte'
  import Search from '$components/common/Search.svelte'
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

<div class="tabs gap-4 px-8 whitespace-nowrap overflow-x-scroll">
  {#each tabs as tab}
    <button
      on:click={() => handleTabClick(tab)}
      class="tab {activeTab === tab
        ? 'tab-active bg-odd-gray-500 text-odd-gray-0'
        : 'bg-odd-gray-150 text-odd-gray-500'} capitalize text-body-sm"
    >
      {tab}
    </button>
  {/each}
</div>

<div class="flex flex-col mb-4 px-4 py-4 bg-odd-gray-0">
  {#if activeTab === tabs[0]}
    <div class="">
      <div class="flex flex-row items-center justify-end gap-4 mb-4">
        <Search bind:searchTerm placeholder="Find in logs..." />
        <button
          class="flex flex-row items-center justify-center w-[84px] h-[30px] bg-odd-gray-500 text-odd-gray-100 text-body-sm"
        >
          <Filter /> Filter
        </button>
      </div>

      {#each activityLogs as log}
        <p class="text-body-xs font-mono whitespace-nowrap">{log}</p>
      {/each}
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
