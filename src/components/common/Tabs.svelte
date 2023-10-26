<script lang="ts">
  export let activeTab: string
  export let tabs: string[]

  const handleTabClick = (tab: string) => {
    activeTab = tab
  }
</script>

<div
  class="min-w-[0px] relative top-[1px] z-10 h-8 px-8 whitespace-nowrap overflow-x-scroll"
>
  {#each tabs as tab}
    <button
      on:click={() => handleTabClick(tab)}
      class="tab {activeTab === tab
        ? 'tab-active top-[0px] bg-odd-gray-0 text-odd-gray-700 !border-odd-gray-500 !border-t !border-t !border-r !border-l'
        : 'bg-odd-gray-200 text-odd-gray-700 border-odd-gray-500 border-b'} relative mr-0.5 capitalize text-label-sm rounded-t-sm transition-colors duration-200 ease-in-out"
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
