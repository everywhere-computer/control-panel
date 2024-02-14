<script lang="ts">
  export let activeTab: string
  export let tabs: string[]

  // Default tab click handler, but a custom handler can be passed in as a prop
  export let handleTabClick = (tab: string) => {
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
        ? 'tab-active top-[0px] bg-base-100 text-base-content !border-base-200 !border-t !border-r !border-l'
        : 'bg-base-200 text-base-content opacity-80 !border-base-200 border-b'} relative mr-1.5 capitalize text-label-sm rounded-t-sm transition-colors duration-200 ease-in-out"
    >
      {tab}
      {#if activeTab !== tab}
        <span class="absolute right-0 bottom-0 left-0 h-[1px] bg-base-300" />
      {/if}
    </button>
  {/each}
</div>
