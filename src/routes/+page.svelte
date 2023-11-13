<script lang="ts">
  import { sessionStore, themeStore } from '$lib/stores'
  // import Authed from '$components/home/Authed.svelte'
  import Public from '$components/home/Public.svelte'
</script>

{#if $sessionStore?.session}
  <!-- <Authed /> -->
  <div
    class="flex items-center justify-center min-h-[calc(100vh-248px)] md:min-h-[calc(100vh-160px)] w-full"
  >
    <div class="logo relative max-w-[60vmin] max-h-[60vmin]">
      <img
        class="logo-bg w-full animate-rotateAnimation"
        src={`${window.location.origin}/logo-bg${
          $themeStore.selectedTheme === 'dark' ? '-dark' : ''
        }.svg`}
        alt="logo backgroud"
      />
      <img
        class="logo-mg absolute z-20 top-[11.8%] left-[11.8%] w-[76.4%] h-[76.4%] object-cover"
        src={`${window.location.origin}/logo-mg.gif`}
        alt="logo spinning lines"
      />
      <img
        class="logo-fg absolute top-0 left-0 z-10 w-full"
        src={`${window.location.origin}/logo-fg.svg`}
        alt="logo foreground"
      />
    </div>
  </div>
{:else}
  <Public />
{/if}
