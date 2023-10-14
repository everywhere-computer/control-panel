<script lang="ts">
  import { page } from '$app/stores'
  import FooterBrand from '$components/icons/FooterBrand.svelte'
  import Nav from '$components/nav/Nav.svelte'

  export let screenSize: number
  $: isHome = $page.route.id === '/'
</script>

{#if isHome && screenSize < 768}
  <Nav inFooter {screenSize} />
{/if}

<div
  class="flex flex-row items-center justify-center gap-[5px] h-[50px] {isHome &&
  screenSize < 768
    ? ''
    : 'mt-auto'} bg-odd-gray-500"
>
  <FooterBrand />
</div>
