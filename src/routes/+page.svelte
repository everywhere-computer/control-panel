<script lang="ts">
  import { sessionStore } from '$src/stores'
  // import Authed from '$components/home/Authed.svelte'
  import Public from '$components/home/Public.svelte'
</script>

{#if $sessionStore?.session}
  <!-- <Authed /> -->
  <div
    class="flex items-center justify-center md:min-h-[calc(100vh-160px)] w-full py-[7vh]"
  >
    <div class="logo relative max-w-[60vmin] max-h-[60vmin]">
      <img
        class="logo-bg w-full animate-rotateAnimation"
        src={`${window.location.origin}/logo-bg.svg`}
        alt="logo backgroud"
      />
      <div
        class="logo-mg absolute top-[11.8%] left-[11.8%] w-[76.4%] h-[76.4%] bg-center bg-cover bg-[url('{window
          .location.origin}/logo-mg.gif')]"
      />
      <img
        class="logo-fg absolute top-0 left-0 w-full"
        src={`${window.location.origin}/logo-fg.svg`}
        alt="logo foreground"
      />
    </div>
  </div>
{:else}
  <Public />
{/if}
