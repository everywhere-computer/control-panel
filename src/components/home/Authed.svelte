<script lang="ts">
  import { networkStore, themeStore } from '$lib/stores'
</script>

<div
  class="relative flex items-center justify-center min-h-[calc(100vh-248px)] md:min-h-[calc(100vh-120px)] w-full"
>
  <div class="logo relative z-10 max-w-[60vmin] max-h-[60vmin]">
    <img
      class="logo-bg w-full animate-rotateAnimation"
      src={`${window.location.origin}/logo-bg${
        $themeStore.selectedTheme === 'dark' ? '-dark' : ''
      }.svg`}
      alt="logo backgroud"
    />
    <img
      class="logo-mg absolute z-20 top-[12.8%] left-[12.4%] w-[75.4%]  object-cover"
      src={`${window.location.origin}/logo-mg.gif`}
      alt="logo spinning lines"
    />
    <img
      class="logo-fg absolute top-0 left-0 z-30 w-full"
      src={`${window.location.origin}/logo-fg.svg`}
      alt="logo foreground"
    />
  </div>

  {#if $networkStore?.allEvents?.length}
    <div
      class="absolute top-0 right-0 bottom-0 left-0 z-0 w-full overflow-x-scroll opacity-50"
    >
      {#each $networkStore.allEvents as event}
        <p
          class="flex w-full items-center gap-2 text-code-m font-mono whitespace-nowrap"
        >
          <span class="text-odd-gray-500 dark:text-odd-gray-300 uppercase">
            {new Date(event.timestamp).toLocaleString()}
          </span>
          <span class="text-odd-pink-400">[{event?.type?.split(':')[1]}]</span>

          {#if event.peerId}
            <span>peerId:{event.peerId}</span>
          {/if}

          {#if event.address}
            <span>address:{event.address}</span>
          {/if}

          {#if event.cid}
            <span>CID:{event.cid}</span>
          {/if}

          {#if event.ran}
            <span>ran:{event.ran}</span>
          {/if}
        </p>
      {/each}
    </div>
  {/if}
</div>
