<script lang="ts">
  import { page } from '$app/stores'

  import { themeStore } from '$lib/stores'
  import FooterBrand from '$components/icons/FooterBrand.svelte'
  import FooterBrandDark from '$components/icons/FooterBrandDark.svelte'
  import Nav from '$components/nav/Nav.svelte'

  export let screenSize: number
  $: isHome = $page.route.id === '/'
</script>

{#if isHome && screenSize < 768}
  <Nav inFooter {screenSize} />
{/if}

<div
  class="flex flex-row items-center justify-center gap-[5px] h-10 {isHome &&
  screenSize < 768
    ? ''
    : 'mt-auto'} bg-base-200"
>
  {#if $themeStore.selectedTheme === 'light'}
    <FooterBrand />
  {:else}
    <FooterBrandDark />
  {/if}
</div>
